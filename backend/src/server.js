const app = require('./app');
const { connectDB } = require('./db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      if (!process.env.JWT_SECRET) {
        console.warn('⚠ Warning: JWT_SECRET not set in .env');
      }
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

startServer();