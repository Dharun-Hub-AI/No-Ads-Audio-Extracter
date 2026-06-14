# No Ads Audio Extractor

Extract audio from any YouTube video in seconds. Choose your format (MP3, M4A, Opus, WAV, FLAC), pick your bitrate, and download — ad-free, no sign-up required.

**Live:** [no-ads-audio-extracter.onrender.com](https://no-ads-audio-extracter.onrender.com)

---

## Features

- Extract audio from any public YouTube video
- Multiple formats: MP3, M4A, Opus, WAV, FLAC
- Bitrate control: 96k, 128k, 192k, 320k
- Batch queue — add multiple URLs, extract all at once
- Download All as ZIP
- Thumbnail preview + estimated file size
- No ads, no sign-up, no tracking

---

## Tech Stack

- **Frontend:** HTML, CSS, Vanilla JS
- **Backend:** Node.js, Express
- **Audio:** yt-dlp + ffmpeg (via fluent-ffmpeg)
- **UI:** Syne + DM Mono fonts, dark theme with neon accent

---

## Prerequisites

- [Node.js](https://nodejs.org) v16 or higher
- yt-dlp and ffmpeg are auto-installed via npm dependencies

---

## Setup

```bash
# Clone the repo
git clone https://github.com/Dharun-Hub-AI/No-Ads-Audio-Extracter.git
cd No-Ads-Audio-Extracter

# Install dependencies
npm install

# Start the server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How It Works

1. Paste a YouTube URL
2. Select format and bitrate
3. Click **+ Add** to queue (or press Enter)
4. Click **Extract All**
5. Play or download your audio

---

## Project Structure

```
No-Ads-Audio-Extracter/
├── public/
│   └── index.html          # Frontend
├── server.js               # Express backend
├── package.json
├── render.yaml             # Deployment config
└── README.md
```

---

## Author

**Dharun-Hub-AI**
- [GitHub](https://github.com/Dharun-Hub-AI)
- [LinkedIn](https://www.linkedin.com/in/dharun-4263a8330)

---

## License

For personal and educational use only. Respect copyright laws.
