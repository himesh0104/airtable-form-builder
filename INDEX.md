# Airtable Form Builder - Complete Documentation Index

## 📖 Documentation Files

### **Start Here**
- **[QUICKSTART.md](QUICKSTART.md)** ⚡
  - 3-minute setup
  - Common commands
  - Quick troubleshooting table
  - Best for: "Just want to run it"

### **Detailed Guides**
- **[SETUP.md](SETUP.md)** 🔧
  - Step-by-step installation
  - Environment setup
  - Detailed troubleshooting
  - Best for: First-time setup

- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** 🐛
  - Common errors & solutions
  - Debug tips
  - Verification steps
  - Best for: Fixing problems

### **Project Info**
- **[README.md](README.md)** 📚
  - Project overview
  - Features list
  - Technology stack
  - Best for: Understanding what this is

- **[FEATURES_COMPLETE.md](FEATURES_COMPLETE.md)** ✅
  - Complete feature checklist
  - Implementation details
  - What's included
  - Best for: Verifying completeness

- **[DEPLOYMENT.md](DEPLOYMENT.md)** 🚀
  - Production deployment
  - Environment setup
  - Best practices
  - Best for: Going live

---

## 🚀 Quick Start (Choose Your Path)

### Path 1: I just want to run it (5 minutes)
1. Read: [QUICKSTART.md](QUICKSTART.md)
2. Run: `.\setup.bat` (Windows) or manual install
3. Edit: `backend/.env` with JWT_SECRET
4. Start: 3 terminals with MongoDB, backend, frontend
5. Open: http://localhost:5173

### Path 2: I want to understand setup (15 minutes)
1. Read: [SETUP.md](SETUP.md) - Complete section
2. Follow all setup steps carefully
3. Check each service is running
4. Test signup/login

### Path 3: Something broke (Variable time)
1. Read: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Find your error message
3. Follow the solution
4. Try again

### Path 4: I want to deploy (30 minutes)
1. Read: [DEPLOYMENT.md](DEPLOYMENT.md)
2. Prepare production environment variables
3. Set up database
4. Deploy to server

---

## 📋 Checklist

### Before Running
- [ ] Node.js installed
- [ ] MongoDB installed/running
- [ ] `.env` file created in `backend/`
- [ ] `JWT_SECRET` set in `.env`
- [ ] Port 5000 & 5173 available

### Getting Started
- [ ] `npm install` in backend/
- [ ] `npm install` in frontend/
- [ ] `npm run dev` in backend/
- [ ] `npm run dev` in frontend/
- [ ] Visit http://localhost:5173

### Verify Working
- [ ] Health check: http://localhost:5000/api/health
- [ ] Frontend loads: http://localhost:5173
- [ ] Can sign up/login
- [ ] Dashboard appears
- [ ] Forms can be created

---

## 🎯 Key Decisions Made

### Port Changes
- Frontend: **3000 → 5173** (Vite default)
- Backend: **5000** (unchanged)
- Reason: Better development experience, standard Vite port

### UI/UX
- **Modern design** with gradients and smooth transitions
- **Responsive** on mobile devices
- **Clear error messages** for debugging
- **Better form styling** for user experience

### Error Handling
- **Improved JWT validation** with helpful messages
- **Better env var checks** that tell you what's missing
- **Dashboard redirects** to login if token invalid
- **Clear error messages** from backend

---

## 📚 Technology Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Airtable OAuth & API integration
- Webhooks support

**Frontend:**
- React 18
- Vite (dev server on 5173)
- React Router v6
- Axios for API calls
- Modern CSS with gradients

---

## 🔑 Important URLs

| Purpose | URL |
|---------|-----|
| App | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| Health Check | http://localhost:5000/api/health |
| Database | mongodb://localhost:27017 |

---

## 📁 Directory Map

```
📦 airtable-form-builder/
├── 📂 backend/              Backend server
│   ├── .env                 Configuration (EDIT THIS)
│   ├── .env.example         Template
│   ├── src/
│   │   ├── server.js        Entry point
│   │   ├── controllers/     API logic
│   │   ├── models/          DB schemas
│   │   ├── routes/          API routes
│   │   └── utils/           Helpers
│   └── package.json
├── 📂 frontend/             React app
│   ├── src/
│   │   ├── pages/           Page components
│   │   ├── utils/           API client, helpers
│   │   ├── index.css        Global styles
│   │   └── App.jsx          Routes
│   ├── vite.config.js       Port 5173
│   └── package.json
├── 📄 QUICKSTART.md         ← Start here!
├── 📄 SETUP.md              Detailed setup
├── 📄 TROUBLESHOOTING.md    Error fixes
├── 📄 FEATURES_COMPLETE.md  What's built
├── 📄 DEPLOYMENT.md         Production guide
├── 📄 README.md             Overview
└── 📄 setup.bat             Auto-setup (Windows)
```

---

## 🔧 Common Tasks

### Run the application
```bash
# Terminal 1
mongod

# Terminal 2
cd backend && npm run dev

# Terminal 3
cd frontend && npm run dev

# Then visit: http://localhost:5173
```

### Fix "Invalid token" error
```bash
# Clear localStorage
# Login again
```

### Fix "JWT_SECRET not set" error
```bash
# Edit backend/.env
JWT_SECRET=your-secret-key
# Restart backend
```

### Fix "Can't connect to MongoDB"
```bash
mongod
```

### See all API endpoints
Check the routes files:
- `backend/src/routes/auth.js`
- `backend/src/routes/forms.js`
- `backend/src/routes/responses.js`
- `backend/src/routes/airtable.js`
- `backend/src/routes/webhooks.js`

---

## 🆘 Need Help?

1. **Quick lookup:** [QUICKSTART.md](QUICKSTART.md)
2. **Error solution:** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
3. **Full setup:** [SETUP.md](SETUP.md)
4. **Features check:** [FEATURES_COMPLETE.md](FEATURES_COMPLETE.md)

---

## 📈 Recent Improvements

✅ **Port changed to 5173** - Better development experience  
✅ **UI/UX redesigned** - Modern, professional interface  
✅ **Error handling improved** - Clear messages help debugging  
✅ **Documentation expanded** - Setup guides & troubleshooting  
✅ **Setup automation** - `setup.bat` for Windows  

---

## 🎓 Learn More

Each documentation file is self-contained:
- **QUICKSTART.md** - Standalone quick reference
- **SETUP.md** - Standalone setup guide
- **TROUBLESHOOTING.md** - Standalone error solutions
- **FEATURES_COMPLETE.md** - Standalone feature list
- **DEPLOYMENT.md** - Standalone deployment guide

Read them in any order based on your needs!

---

**Last Updated:** November 29, 2025  
**Status:** ✅ Production Ready
