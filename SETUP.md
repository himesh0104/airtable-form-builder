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

### 2. Environment Setup

Create `.env` file in the `backend/` folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/airtable-form-builder
JWT_SECRET=your_jwt_secret_key_here
AIRTABLE_CLIENT_ID=your_airtable_client_id
AIRTABLE_CLIENT_SECRET=your_airtable_client_secret
AIRTABLE_REDIRECT_URI=http://localhost:5173/auth/airtable/callback
WEBHOOK_SECRET=your_webhook_secret_from_airtable
NODE_ENV=development
```

**Important:** Make sure `JWT_SECRET` is set. Without it, signup/login will fail with 500 error.

### 3. Start Services

**Terminal 1 - MongoDB** (if running locally):
```bash
mongod
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

---

## Port Configuration

### Frontend Port: 5173 (Updated)
- **Dev Server:** `http://localhost:5173`
- **Vite Config:** `frontend/vite.config.js` (port set to 5173)
- **API Proxy:** All `/api/*` requests proxy to `http://localhost:5000`

### Backend Port: 5000
- **Server:** `http://localhost:5000`
- **Health Check:** `http://localhost:5000/api/health`
- **CORS:** Enabled for all origins in development

---

## Common Issues & Solutions

### Issue: Signup returns 500 error (JWT_SECRET not set)

**Error:**
```
POST http://localhost:5000/api/auth/signup 500 (Internal Server Error)
```

**Solution:**
1. Check your `.env` file has `JWT_SECRET` set
2. Restart backend: `npm run dev`
3. Try signup again

**Example .env:**
```env
JWT_SECRET=my-super-secret-key-change-this-in-production
```

### Issue: Cannot connect to MongoDB

**Error:**
```
MongoDB connection error: connect ECONNREFUSED
```

**Solution:**
1. Start MongoDB: `mongod` (or `brew services start mongodb-community` on Mac)
2. Verify connection string in `.env`: `MONGODB_URI=mongodb://localhost:27017/airtable-form-builder`
3. Restart backend

### Issue: API requests fail or CORS errors

**Solution:**
1. Verify backend is running: `http://localhost:5000/api/health` should return `{"status":"ok"}`
2. Check frontend proxy in `vite.config.js` (should point to `http://localhost:5000`)
3. Restart both frontend and backend

### Issue: Airtable OAuth not working

**Error:**
```
Failed to start Airtable login
```

**Solution:**
1. Verify Airtable OAuth credentials in `.env`:
   - `AIRTABLE_CLIENT_ID`
   - `AIRTABLE_CLIENT_SECRET`
   - `AIRTABLE_REDIRECT_URI=http://localhost:5173/auth/airtable/callback`
2. Make sure redirect URI in Airtable OAuth settings matches exactly
3. Restart backend

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
