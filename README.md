# 🎵 Audio Finder

Extract and stream audio from YouTube videos — right in your browser. **No FFmpeg required!**

---

## 📁 Folder Structure

```
audio-finder/
├── public/
│   └── index.html        ← Frontend (HTML + CSS + JS)
├── server.js             ← Express backend
├── package.json          ← Dependencies
└── README.md
```

> No `downloads/` folder needed anymore — audio streams directly, nothing saved to disk!

---

## ⚙️ Prerequisites

- **Node.js** v16 or higher → https://nodejs.org
- That's it! No FFmpeg, no other installs.

---

## 🚀 Installation & Running

```bash
# 1. Go into the project folder
cd audio-finder

# 2. Install Node.js dependencies
npm install

# 3. Start the server
npm start

# 4. Open your browser at:
# http://localhost:3000
```

For development with auto-reload:
```bash
npm run dev
```

---

## 🧪 How to Use

1. Open `http://localhost:3000`
2. Paste a YouTube URL into the input field
3. Click **Extract** (or press Enter)
4. Audio starts playing almost instantly — no waiting for full download!
5. Click **Download** to save the audio file

---

## 🔒 Features

- ✅ No FFmpeg required — pure Node.js
- ✅ True audio streaming — plays while it loads
- ✅ YouTube URL validation before hitting the server
- ✅ Rate limiting: max 10 requests per IP per 15 minutes
- ✅ No temp files — nothing written to disk
- ✅ User-friendly error messages

---

## ⚠️ Notes

- Only **YouTube links** are supported currently
- Audio is served in **WebM/Opus** format (natively supported by Chrome, Firefox, Edge)
- For personal/educational use only — respect copyright laws
/