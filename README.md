# Chatty 💬

> A sleek, minimal, and powerful mobile chat app built with React Native, styled using Tailwind CSS, and powered by MySQL + WebSocket. ⚡️📱

---

## ✨ Features

- 🔐 **User Authentication** — Secure login & registration flow  
- 💬 **1-to-1 Real-Time Messaging** — Instant communication powered by WebSocket  
- 📸 **Media Sharing** — Send images and files seamlessly  
- ✅ **Message Status** — Sent, Delivered, and Read indicators  
- 👀 **Typing & Online Indicators** — Know when your friends are active  
- 🎨 **Modern UI** — Responsive and clean interface with Tailwind CSS  

---

## 🛠️ Tech Stack

| Layer        | Technology                |
|:------------ |:-------------------------|
| **Frontend** | React Native, Tailwind CSS |
| **Backend**  | Node.js + Express          |
| **Database** | MySQL                      |
| **Real-Time**| WebSocket                  |
| **Platform** | Android & iOS              |

---

## 🚀 Getting Started

### 🧩 Prerequisites

Make sure you have:
- Node.js installed  
- MySQL Server running  
- React Native CLI or Expo  

---

### ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/lakshithamadumal/chatty.git

# Navigate into the project
cd chatty

# Install dependencies
npm install

# Start the app
npx react-native run-android   # For Android
npx react-native run-ios       # For iOS
```

---

## 🔄 Recent Updates

- 🕒 Message list now displays in chronological order (oldest → newest).
- 🧠 Added debugging logs for developers:
  - Sending a message → `{ toFriendId, content }`
  - On “Delete for Me” → logs request & completion `{ messageId }`
  - On “Delete for Everyone” → logs request & completion `{ messageId }`
- 💡 These logs appear in the Metro or Device console when interacting with the chat screen.

---

## 🧪 Developer Tips

- ⚠️ Messages out of order? → Check your device/emulator clock. Ordering depends on `createdAt`.
- 🧰 Use long-press delete actions to test UI reactivity and confirm console logs.

---

## 💡 About

Chatty is designed for simplicity and speed — built with love by Lakshitha Madumal (Laky).  
It blends clean UI with real-time power, offering a modern chat experience for mobile users. 💬📱

---

## 📊 Project Stats

| Category   | Value                |
|:---------- |:--------------------|
| ⭐ Stars    | 0                   |
| 👀 Watchers| 0                   |
| 🍴 Forks   | 0                   |
| 📦 Packages| None yet            |
| 🧑‍💻 Languages | TypeScript (98.8%), JavaScript (1.1%), CSS (0.1%) |

---

## 🧠 Suggested Workflows

- 🧩 Webpack — Build and bundle your Node.js project.
- ⚡ Deno — Test your code efficiently.
- 🧱 SLSA Generator — Generate SLSA3 provenance for release workflows.

---

## 📜 License

This project is currently open for learning and collaboration.  
If you’d like to contribute or fork, feel free to submit a PR or open an issue. 🙌

---

## 🌐 Connect

- 📸 Instagram — [itz_laky_](https://instagram.com/itz_laky_)
- 💼 LinkedIn — Coming Soon
- 🐙 GitHub — [lakshithamadumal](https://github.com/lakshithamadumal)

---

#ReactNative #TailwindCSS #ChatApp #WebSocket #MySQL #FullStack #MobileDev