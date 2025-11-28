@echo off
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
echo Setup complete!
echo.
echo To start the backend: cd backend && npm run dev
echo To start the frontend: cd frontend && npm run dev
