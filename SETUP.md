# Setup & Troubleshooting Guide

## Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Environment Setup (CRITICAL)

Create `.env` file in the `backend/` folder by copying `.env.example`:

**Windows (PowerShell):**
```powershell
cd backend
Copy-Item .env.example .env
# Then edit .env with your values
```

**Mac/Linux:**
```bash
cd backend
cp .env.example .env
# Then edit .env with your values
```

**Your `.env` must have at minimum:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/airtable-form-builder
JWT_SECRET=your-super-secret-key-change-in-production
AIRTABLE_CLIENT_ID=your_airtable_client_id
AIRTABLE_CLIENT_SECRET=your_airtable_client_secret
AIRTABLE_REDIRECT_URI=http://localhost:5173/auth/airtable/callback
WEBHOOK_SECRET=your_webhook_secret_from_airtable
NODE_ENV=development
```

### 3. Start MongoDB

Make sure MongoDB is running:

**Windows:**
```
mongod
```

**Mac (with Homebrew):**
```bash
brew services start mongodb-community
```

**Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

### 4. Start Backend

```bash
cd backend
npm run dev
```

✅ You should see:
```
MongoDB connected
Server running on port 5000
```

### 5. Start Frontend (new terminal)

```bash
cd frontend
npm run dev
```

✅ You should see:
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

### 6. Visit the App

Open **http://localhost:5173** in your browser

---

## Troubleshooting

### ❌ Backend won't start / 500 errors

**Issue:** `TypeError: Cannot read property 'verify' of undefined`

**Solution:**
1. Check `.env` file exists in `backend/` folder
2. Make sure `JWT_SECRET` is set (not empty)
3. Restart backend: `npm run dev`

### ❌ MongoDB connection error

**Error:** `MongooseError: Cannot connect to mongodb://localhost:27017/`

**Solution:**
1. Start MongoDB: `mongod` or `brew services start mongodb-community`
2. Verify connection string in `.env`: `MONGODB_URI=mongodb://localhost:27017/airtable-form-builder`
3. Restart backend

### ❌ 401 Unauthorized error when logging in

**Error:** `POST /api/auth/signup 401 Unauthorized`

**Solution:**
1. Backend must be running: Check `npm run dev` is active
2. Check `.env` has `JWT_SECRET` set
3. Verify `Content-Type: application/json` is being sent (should be automatic)
4. Try clearing localStorage: Open DevTools → Application → LocalStorage → Delete token

### ❌ Frontend shows "Invalid token" after login

**Cause:** Backend restarted after login (token expired or secret changed)

**Solution:**
1. Clear localStorage in DevTools
2. Sign up again or login
3. Keep backend running

### ❌ Can't reach backend from frontend

**Error:** `POST http://localhost:5173/api/... ERR_CONNECTION_REFUSED`

**Solution:**
1. Make sure backend is running: `http://localhost:5000/api/health`
2. Check `frontend/vite.config.js` proxy points to `http://localhost:5000`
3. Restart frontend dev server

---

## URL Mapping

| Purpose | URL |
|---------|-----|
| Frontend App | `http://localhost:5173` |
| Backend API | `http://localhost:5000` |
| Health Check | `http://localhost:5000/api/health` |
| MongoDB | `mongodb://localhost:27017` |
| Login Page | `http://localhost:5173/login` |
| Signup Page | `http://localhost:5173/signup` |
| Dashboard | `http://localhost:5173/dashboard` |

---

## Scripts

**Backend:**
```bash
npm run dev      # Start dev server with nodemon
npm start        # Start production server
npm test         # Run tests
```

**Frontend:**
```bash
npm run dev      # Start Vite dev server (port 5173)
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## UI/UX Improvements Made

✅ **Modern Design:**
- Gradient background (purple to violet)
- Clean card-based layouts
- Smooth transitions and hover effects

✅ **Auth Pages:**
- Centered forms with professional styling
- Better error messages (red background, clear text)
- Loading states on buttons
- Clear form labels and placeholders

✅ **Dashboard:**
- Header with status badge (Connected/Disconnected)
- Empty state with helpful message
- Better table styling with hover effects
- Edit and Delete buttons with color coding

✅ **Form Builder:**
- Clear section headers
- Checkbox groups with proper styling
- Field type badges
- Better visual hierarchy

✅ **Form Viewer:**
- Large gradient background for focus
- Clean question rendering
- Success message after submission
- Proper validation error messages

✅ **Responsive Design:**
- Mobile-friendly CSS media queries
- Flexible button layouts
- Readable typography on all screen sizes

---

## Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Next Steps

1. ✅ Port changed to 5173
2. ✅ UI/UX improved with modern styling
3. Next: Test signup/login with proper `.env` setup
4. Then: Connect Airtable OAuth and test form builder
5. Finally: Create and submit forms

---

**Last Updated:** November 29, 2025
