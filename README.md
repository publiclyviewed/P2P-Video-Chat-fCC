# 📹 P2P Video Chat App (FreeCodeCamp Coding Challenge)

This is a peer-to-peer video chat application built as part of a coding challenge. It allows two users to join a unique video chat room by name and connect via WebRTC, with signaling handled using Socket.IO.

👉 **Live Demo:** [https://p2p-video-chat-fcc.onrender.com](https://p2p-video-chat-fcc.onrender.com)

---

## ✨ Features

- 🔐 Accesses your camera and microphone with permission
- 🔤 Prompts for a room name and creates it if it doesn’t exist
- 🤝 Allows a second person to join the same room and start a video chat
- 🚪 Prevents more than two people from joining a single room
- 🔁 Supports reconnecting to the same room if a user disconnects
- ❌ Displays an error if access to webcam/mic is denied
- 📛 Validates room name input (no blank/empty names allowed)

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Real-Time:** Socket.IO
- **Peer Connection:** WebRTC
- **Deployment:** Render

---

## 🚀 Getting Started (Local Setup)

1. Clone the repo:
   ```bash
   git clone https://github.com/publiclyviewed/P2P-Video-Chat-fCC.git
   cd P2P-Video-Chat-fCC
