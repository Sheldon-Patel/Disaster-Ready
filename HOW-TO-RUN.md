# 🚀 How to Run Disaster Ready

A beginner-friendly guide to get the app running on your Mac.

---

## 📋 Step 1: Install Required Software (One-time Setup)

Before you can run this project, install the following. Click each link, download, and install:

| Software | What it's for | Download Link |
|----------|--------------|---------------|
| **Node.js** (v16 or higher) | Runs the app | [nodejs.org](https://nodejs.org/) — choose the "LTS" version |
| **VS Code** (recommended) | Code editor | [code.visualstudio.com](https://code.visualstudio.com/) |

> **After installing Node.js**, open the **Terminal** app and type this to verify:
> ```bash
> node --version
> ```
> You should see a version number like `v18.x.x` ✅

---

## 📋 Step 2: Open the Project Folder

1. Open **Terminal** (search for it in Spotlight with `Cmd + Space`, type "Terminal")
2. Navigate to the project folder by typing:
   ```bash
   cd /Users/ronnierodricks/Desktop/sih-disaster-app-clean
   ```

---

## 📋 Step 3: Install Dependencies (One-time, only needed once)

```bash
npm run install-all
```

This will install all the required packages. It may take 2–5 minutes. ☕

---

## 🎯 Step 4: Start the App

```bash
npm run dev
```

This starts **both** the backend and frontend at the same time!

---

## 🌐 Step 5: Open in Browser

After running `npm run dev`, open your browser and go to:

| URL | What it opens |
|-----|--------------|
| **http://localhost:3000** | 🌍 The main app (frontend) |
| **http://localhost:5000** | ⚙️ Backend API |
| **http://localhost:5000/api/health** | ✅ Check if backend is running |

---

## 👤 Demo Login Accounts

You can log in with these pre-made accounts to test the app:

| Role | Email | Password |
|------|-------|----------|
| 🔴 Admin | admin@demo.com | admin123 |
| 🔵 Teacher | teacher@demo.com | teacher123 |
| 🟢 Student | student@demo.com | student123 |

---

## 🛑 How to Stop the App

Press `Ctrl + C` in the Terminal window where the app is running.

---

## 🛠️ Troubleshooting

### "Port already in use" error
```bash
# Kill any existing Node.js processes
pkill -f node
```
Then try `npm run dev` again.

### "Module not found" or missing packages error
```bash
npm run install-all
```

### The app isn't loading in the browser
- Make sure you ran `npm run dev` first
- Wait 10–15 seconds after starting — React takes time to compile
- Check that you're visiting **http://localhost:3000** (not https)

### Clear cache and fresh install
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
cd ..

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
cd ..
```

---

## 📁 Project Structure

```
sih-disaster-app-clean/
├── backend/          # Node.js + Express + MongoDB (server)
├── frontend/         # React + TypeScript (the website)
├── package.json      # Root scripts for running both
└── HOW-TO-RUN.md     # This guide
```

---

## ✅ Features in Disaster Ready

- 🔐 Multi-role login (Student, Teacher, Admin)
- 📚 Interactive disaster learning modules
- 🚨 Virtual evacuation drills with timing
- 🏆 Gamification (points, badges, leaderboards)
- 📊 Admin dashboard with analytics
- 🤖 AI-powered safety insights
- 📱 Works on mobile too (PWA)

---

## 🎉 That's it!

Just run `npm run dev` and open http://localhost:3000 — you're good to go! 🚀
