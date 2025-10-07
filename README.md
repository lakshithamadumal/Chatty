# Chatty 💬

Chatty is a simple and elegant mobile chat application built with **React Native** and styled using **Tailwind CSS**.  
It uses **MySQL** to store user accounts and message data, and **WebSocket** for real-time messaging. ⚡️📱

---

## ✨ Features
- 🔐 User authentication (login & register)  
- 💬 One-to-one messaging in real-time via WebSocket  
- 📸 Media sharing (images, files)  
- ✅ Message status (sent / delivered / read)  
- 👀 Typing & online indicators  
- 🎨 Modern, responsive UI with Tailwind CSS  

---

## 🛠️ Tech Stack
- **Frontend:** React Native, Tailwind CSS  
- **Backend:** Node.js / Express (with WebSocket)  
- **Database:** MySQL  
- **Real-time:** WebSocket for live chat updates  

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed  
- MySQL server running  
- React Native CLI or Expo  

### Installation
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

---

## 🧩 Recent Updates

- Message list now renders in correct chronological order (oldest → newest).
- Added console logs to assist debugging during development:
  - Sending a message prints `{ toFriendId, content }`.
  - Long-press → Delete for Me logs request and completion with `{ messageId }`.
  - Long-press → Delete for Everyone logs request and completion with `{ messageId }`.

These logs appear in the Metro/Device console when interacting with the chat screen.

---

## 🧪 Dev Tips

- If messages appear out of order, ensure device/emulator time is correct since ordering relies on `createdAt` timestamps.
- To quickly verify UI state changes, use the Delete actions from the long-press menu and watch the console output.