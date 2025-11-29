@echo off
REM Airtable Form Builder - Quick Setup Script

echo.
echo ============================================
echo Airtable Form Builder - Setup
echo ============================================
echo.

REM Create .env file in backend if it doesn't exist
if not exist "backend\.env" (
  echo Creating .env file from .env.example...
  copy backend\.env.example backend\.env
  echo.
  echo ⚠️  IMPORTANT: Edit backend\.env and set:
  echo    - JWT_SECRET=your-secret-key
  echo    - AIRTABLE_CLIENT_ID
  echo    - AIRTABLE_CLIENT_SECRET
  echo.
  pause
)

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
cd ..

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo ============================================
echo ✓ Setup complete!
echo ============================================
echo.
echo Next steps:
echo.
echo 1. Edit backend\.env file with your settings
echo    (especially JWT_SECRET, Airtable credentials)
echo.
echo 2. Start MongoDB (if not already running):
echo    mongod
echo.
echo 3. Start the backend (in Terminal 1):
echo    cd backend
echo    npm run dev
echo.
echo 4. Start the frontend (in Terminal 2):
echo    cd frontend
echo    npm run dev
echo.
echo 5. Open http://localhost:5173 in your browser
echo.
pause
