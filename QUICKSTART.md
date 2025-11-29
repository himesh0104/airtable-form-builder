# Quick Reference

## 🚀 Start the App (3 terminals)

**Terminal 1 - MongoDB:**
```bash
mongod
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

Then open: **http://localhost:5173**

---

## 📋 First-Time Setup

1. **Copy .env.example to .env:**
   ```bash
   cd backend
   cp .env.example .env  # Mac/Linux
   # OR
   copy .env.example .env  # Windows
   ```

2. **Edit `backend/.env` and set:**
   - `JWT_SECRET=your-secret-key`
   - `AIRTABLE_CLIENT_ID=your_id`
   - `AIRTABLE_CLIENT_SECRET=your_secret`

3. **Run setup script (Windows):**
   ```bash
   .\setup.bat
   ```

4. **Or manual install (Mac/Linux):**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

---

## 🔌 Ports & URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | Web app |
| Backend | http://localhost:5000 | API |
| Health | http://localhost:5000/api/health | Check if backend works |
| MongoDB | mongodb://localhost:27017 | Database |

---

## 🐛 Common Fixes

| Problem | Solution |
|---------|----------|
| 401 "Invalid token" | Clear localStorage, re-login |
| 500 error on signup | Set JWT_SECRET in .env |
| Can't reach backend | Start backend: `npm run dev` |
| Can't connect to DB | Start MongoDB: `mongod` |
| Port already in use | Kill process on that port |

---

## 📁 Project Structure

```
airtable-form-builder/
├── backend/
│   ├── .env                    ← EDIT THIS (copy from .env.example)
│   ├── .env.example
│   ├── src/
│   │   ├── server.js           ← Start here
│   │   ├── controllers/        ← API logic
│   │   ├── models/             ← Database schemas
│   │   ├── routes/             ← API endpoints
│   │   └── utils/              ← Helpers
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── main.jsx            ← Entry point
│   │   ├── App.jsx             ← Routes
│   │   ├── pages/              ← Page components
│   │   ├── components/         ← Reusable components
│   │   ├── utils/              ← Helpers
│   │   └── index.css           ← Global styles
│   ├── vite.config.js          ← Dev server (port 5173)
│   └── package.json
├── SETUP.md                    ← Setup guide
├── TROUBLESHOOTING.md          ← Error solutions
├── FEATURES_COMPLETE.md        ← What's implemented
├── README.md                   ← Project overview
└── setup.bat                   ← Auto-setup (Windows)
```

---

## 📚 Key Files to Know

| File | Purpose |
|------|---------|
| `backend/.env` | Configuration (JWT_SECRET, etc) |
| `backend/src/server.js` | Express app setup |
| `backend/src/controllers/authController.js` | Login/signup logic |
| `frontend/src/App.jsx` | Route definitions |
| `frontend/vite.config.js` | Frontend settings (port 5173) |
| `frontend/src/index.css` | Global styling |

---

## 🔑 Required Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/airtable-form-builder
JWT_SECRET=your-super-secret-key-here
AIRTABLE_CLIENT_ID=from-airtable-oauth
AIRTABLE_CLIENT_SECRET=from-airtable-oauth
AIRTABLE_REDIRECT_URI=http://localhost:5173/auth/airtable/callback
WEBHOOK_SECRET=from-airtable-webhooks
NODE_ENV=development
```

---

## 🎯 API Endpoints

**Auth:**
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user

**Forms:**
- `GET /api/forms` - List forms
- `POST /api/forms` - Create form
- `GET /api/forms/:id` - Get form
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form

**Responses:**
- `GET /api/forms/:id/responses` - List responses
- `POST /api/forms/:id/submit` - Submit response

**Airtable:**
- `GET /api/airtable/bases` - List bases
- `GET /api/airtable/tables?baseId=...` - List tables
- `GET /api/airtable/fields?baseId=...&tableId=...` - List fields

---

## 💡 Development Tips

**Frontend debugging:**
- Open DevTools: F12
- Check Console for errors
- Check Network tab for API calls
- Check Application → LocalStorage for token

**Backend debugging:**
- Watch console output when running `npm run dev`
- Errors show immediately with traceback
- Check .env variables are set

**Database debugging:**
- Use MongoDB Compass to view data
- Connect to: `mongodb://localhost:27017`

---

## 🎓 Learn More

- **SETUP.md** - Complete setup instructions
- **TROUBLESHOOTING.md** - Common problems & fixes
- **FEATURES_COMPLETE.md** - What's implemented
- **README.md** - Project overview
- **DEPLOYMENT.md** - How to deploy

---

**Last Updated:** November 29, 2025
