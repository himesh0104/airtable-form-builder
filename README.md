# Airtable Form Builder

A MERN stack application for building and managing dynamic forms.

## Project Structure

```
airtable-form-builder/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Setup

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file using `.env.example` as a template.

3. Start the server:
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```

2. Start the dev server:
   ```bash
   npm run dev
   ```

3. Access the app at `http://localhost:3000`

## Features

- User authentication (login/signup)
- Create, read, update, delete forms
- Dynamic form fields
- Protected routes

## TODO

- Add bcrypt for password hashing
- Add form submission/responses
- Add Airtable integration
- Add form styling/templates
