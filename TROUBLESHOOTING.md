# Troubleshooting Guide

## ❌ Error: Backend won't start / Port 5000 error

**Error Message:**
```
Error: listen EADDRINUSE :::5000
```

**Cause:** Port 5000 is already in use

**Solution:**
1. Find what's using port 5000:
   ```powershell
   Get-NetTCPConnection -LocalPort 5000 | Select-Object -Property State,OwningProcess
   ```
2. Kill the process:
   ```powershell
   Stop-Process -Id <PID> -Force
   ```
3. Restart backend: `npm run dev`

---

## ❌ Error: "JWT_SECRET is not set" or 500 error on signup

**Error Message:**
```
POST /api/auth/signup 500
"JWT_SECRET is not set in .env file"
```

**Cause:** Missing or empty `.env` file in `backend/` folder

**Solution:**

**Windows:**
```powershell
cd backend
Copy-Item .env.example .env
# Open backend\.env in your editor and set values
```

**Mac/Linux:**
```bash
cd backend
cp .env.example .env
# Open backend/.env in your editor and set values
```

**Minimum required in `.env`:**
```env
JWT_SECRET=your-super-secret-key-at-least-20-chars
```

Then restart backend: `npm run dev`

---

## ❌ Error: "Invalid token" or 401 Unauthorized

**Error Message:**
```
AxiosError: Request failed with status code 401
"Invalid token"
```

**Cause 1:** Backend was restarted after login (token no longer valid)

**Solution:**
1. Open DevTools (F12)
2. Go to Application → LocalStorage
3. Delete the `token` entry
4. Refresh page
5. Login again

**Cause 2:** JWT_SECRET changed between login and API call

**Solution:**
1. Don't change JWT_SECRET while testing
2. If you must change it:
   - Clear all tokens from localStorage
   - Login again with the new secret

**Cause 3:** Token malformed or corrupted

**Solution:**
1. Clear localStorage completely
2. Login fresh

---

## ❌ Error: Cannot reach backend from frontend

**Error Message:**
```
POST http://localhost:5173/api/forms ERR_CONNECTION_REFUSED
```

**Cause:** Backend is not running or proxy not configured

**Solution:**

1. **Check backend is running:**
   - Open `http://localhost:5000/api/health` in browser
   - Should see: `{"status":"ok"}`

2. **If backend not running:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Check proxy in `frontend/vite.config.js`:**
   ```javascript
   proxy: {
     '/api': {
       target: 'http://localhost:5000',  // ← Should be 5000
       changeOrigin: true,
     }
   }
   ```

4. **Restart frontend dev server**

---

## ❌ Error: MongoDB connection error

**Error Message:**
```
MongooseError: Cannot connect to mongodb://localhost:27017/airtable-form-builder
```

**Cause:** MongoDB is not running

**Solution:**

**Windows:**
```powershell
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

**Check if running:**
```bash
mongo --version  # Just check if installed
```

---

## ❌ Error: "Cannot find module"

**Error Message:**
```
Cannot find module 'express'
Cannot find module 'mongodb'
```

**Cause:** Dependencies not installed

**Solution:**
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

---

## ❌ Error: Port 5173 not accessible

**Error Message:**
```
http://localhost:5173 - refused connection
```

**Cause:** Frontend not running

**Solution:**
```bash
cd frontend
npm run dev

# Should show:
#   VITE v5.x.x  ready in XXX ms
#   ➜  Local:   http://localhost:5173/
```

---

## ❌ Error: Airtable OAuth not working

**Error Message:**
```
Failed to start Airtable login
```

**Causes & Solutions:**

1. **Check Airtable credentials in `.env`:**
   ```env
   AIRTABLE_CLIENT_ID=your_client_id
   AIRTABLE_CLIENT_SECRET=your_client_secret
   AIRTABLE_REDIRECT_URI=http://localhost:5173/auth/airtable/callback
   ```

2. **Verify redirect URI matches Airtable settings:**
   - Go to Airtable OAuth integration settings
   - Redirect URL should be exactly: `http://localhost:5173/auth/airtable/callback`

3. **Restart backend after changing .env:**
   ```bash
   npm run dev
   ```

---

## ✅ How to verify everything is working

### 1. Backend Health Check
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"ok"}
```

### 2. Frontend Loading
- Open http://localhost:5173 in browser
- Should see login page (not blank or error)

### 3. Signup Works
- Fill signup form
- Click Sign Up
- Should redirect to dashboard

### 4. Dashboard Shows
- "My Forms" heading
- Airtable status (Connected/Disconnected)
- Create New Form button

---

## 🔧 How to debug issues

### Enable verbose logging

**Backend - Add to `server.js`:**
```javascript
// After app.use(cors())
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

**Frontend - Check DevTools Console (F12)**
- Look for red errors
- Check Network tab for failed requests
- Check Application → LocalStorage for `token`

### Check environment variables

**Backend:**
```javascript
console.log('JWT_SECRET:', !!process.env.JWT_SECRET);
console.log('MONGO_URI:', process.env.MONGODB_URI);
```

---

## 📋 Complete startup checklist

- [ ] MongoDB running: `mongod`
- [ ] `.env` file created in `backend/` folder
- [ ] `JWT_SECRET` set in `.env`
- [ ] Backend started: `cd backend && npm run dev`
- [ ] Backend health check works: `http://localhost:5000/api/health`
- [ ] Frontend started: `cd frontend && npm run dev`
- [ ] Frontend loads: `http://localhost:5173`
- [ ] Can signup/login successfully
- [ ] Dashboard shows forms

---

## 🆘 Still stuck?

1. **Check all .env variables are set:**
   ```bash
   cat backend/.env
   ```

2. **Check ports are available:**
   ```powershell
   # Windows
   netstat -ano | findstr :5000
   netstat -ano | findstr :5173
   ```

3. **Clear all caches and restart:**
   - Stop backend (Ctrl+C)
   - Stop frontend (Ctrl+C)
   - Clear browser cache (Ctrl+Shift+Delete)
   - Restart: `npm run dev`

4. **Check logs for actual error:**
   - Look at backend console output
   - Look at frontend console (F12)
   - Look for specific error messages

---

**Last Updated:** November 29, 2025
