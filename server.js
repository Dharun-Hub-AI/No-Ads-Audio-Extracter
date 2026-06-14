const express = require("express");
const { execFile } = require("child_process");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const path = require("path");
const fs = require("fs");
const { randomUUID } = require("crypto");

ffmpeg.setFfmpegPath(ffmpegPath);

const YTDLP_PATH = require("./node_modules/yt-dlp-exec/src/constants").YOUTUBE_DL_PATH;
console.log("[yt-dlp] Binary:", YTDLP_PATH, "Exists:", fs.existsSync(YTDLP_PATH));

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

function runYtDlp(args) {
  return new Promise((resolve, reject) => {
    execFile(YTDLP_PATH, args, { timeout: 300000 }, (err, stdout, stderr) => {
      if (err) {
        console.error("[yt-dlp] Error:", stderr || err.message);
        return reject(err);
      }
      resolve(stdout);
    });
  });
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const TMP_DIR = path.join(__dirname, "tmp");
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR);
fs.readdirSync(TMP_DIR).forEach((f) => { try { fs.unlinkSync(path.join(TMP_DIR, f)); } catch {} });

const AUDIO_FORMATS = {
  mp3:  { ext: "mp3",  codec: "libmp3lame", mime: "audio/mpeg",  bitrate: true  },
  m4a:  { ext: "m4a",  codec: "aac",        mime: "audio/mp4",   bitrate: true  },
  opus: { ext: "opus", codec: "libopus",    mime: "audio/ogg",   bitrate: false },
  wav:  { ext: "wav",  codec: "pcm_s16le",  mime: "audio/wav",   bitrate: false },
  flac: { ext: "flac", codec: "flac",       mime: "audio/flac",  bitrate: false },
};

function isValidUrl(str) {
  try { const u = new URL(str); return u.protocol === "http:" || u.protocol === "https:"; }
  catch { return false; }
}

const BASE_ARGS = [
  "--no-warnings",
  "--no-check-certificates",
  "--user-agent", UA,
  "--extractor-args", "youtube:player_client=ios,web",
];

app.get("/info", async (req, res) => {
  const { url } = req.query;
  if (!url || !isValidUrl(url))
    return res.status(400).json({ error: "Please provide a valid URL." });
  try {
    const info = await runYtDlp([...BASE_ARGS, "--dump-single-json", url]);
    const parsed = JSON.parse(info);
    const thumb = parsed.thumbnail || `https://img.youtube.com/vi/${parsed.id || ""}/maxresdefault.jpg`;
    res.json({ title: parsed.title || "Media", thumbnail: thumb, duration: parsed.duration || 0 });
  } catch (err) {
    const msg = (err.stderr || err.message || "").toLowerCase();
    if (msg.includes("private"))   return res.status(400).json({ error: "This video is private." });
    if (msg.includes("age"))       return res.status(400).json({ error: "This video has age restrictions." });
    if (msg.includes("available")) return res.status(400).json({ error: "This video is unavailable." });
    res.status(500).json({ error: "Could not fetch video info." });
  }
});

app.get("/extract", async (req, res) => {
  const { url, bitrate, format: fmt } = req.query;
  const br = parseInt(bitrate) || 128;
  const fmtConfig = AUDIO_FORMATS[fmt] || AUDIO_FORMATS.mp3;

  if (!url || !isValidUrl(url))
    return res.status(400).json({ error: "Please provide a valid URL." });

  const id = randomUUID();
  const rawPath = path.join(TMP_DIR, `${id}.raw`);
  const outPath = path.join(TMP_DIR, `${id}.${fmtConfig.ext}`);

  try {
    await runYtDlp([
      ...BASE_ARGS,
      "-o", rawPath,
      "-f", "bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio/best",
      url,
    ]);
    let command = ffmpeg(rawPath).audioCodec(fmtConfig.codec);
    if (fmtConfig.bitrate) command = command.audioBitrate(br);
    await new Promise((resolve, reject) => {
      command.save(outPath).on("end", resolve).on("error", reject);
    });
    fs.unlink(rawPath, () => {});

    if (!fs.existsSync(outPath) || fs.statSync(outPath).size === 0)
      throw new Error("Output file is empty");

    const stat = fs.statSync(outPath);
    res.setHeader("Content-Type", fmtConfig.mime);
    res.setHeader("Content-Disposition", `attachment; filename="audio.${fmtConfig.ext}"`);
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Content-Length", stat.size);
    const fileStream = fs.createReadStream(outPath);
    fileStream.pipe(res);
    fileStream.on("close", () => setTimeout(() => fs.unlink(outPath, () => {}), 120000));

  } catch (err) {
    fs.unlink(rawPath, () => {}); fs.unlink(outPath, () => {});
    if (!res.headersSent) {
      console.error("Extraction error:", err.stderr || err.message);
      const msg = (err.stderr || err.message || "").toLowerCase();
      if (msg.includes("private"))   return res.status(400).json({ error: "This video is private." });
      if (msg.includes("age"))       return res.status(400).json({ error: "Age-restricted video." });
      if (msg.includes("available")) return res.status(400).json({ error: "Video unavailable or removed." });
      return res.status(500).json({ error: "Could not extract. Please try again." });
    }
  }
});

app.listen(PORT, () => console.log(`\nAudio Finder running at http://localhost:${PORT}\n`));
