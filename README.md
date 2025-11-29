# Airtable Form Builder

A MERN stack application for building dynamic forms backed by Airtable, with conditional logic, response tracking, and real-time sync via webhooks.

## Features

- **Airtable OAuth Login** — users authenticate with their Airtable account
- **Form Builder** — select Airtable base, table, and fields to create dynamic form schemas
- **Conditional Logic** — show/hide form fields based on user answers
- **Form Viewer** — public-facing form with real-time validation
- **Response Tracking** — save responses to both Airtable and MongoDB
- **Webhook Sync** — keep your database in sync when Airtable records change
- **Response Listing** — view all submitted responses in a simple dashboard

## Tech Stack

- **Frontend**: React 18 + Vite + React Router
- **Backend**: Express.js + Node.js
- **Database**: MongoDB
- **APIs**: Airtable REST API + OAuth 2.0

## Setup

### Prerequisites

- Node.js 16+
- MongoDB (local or Atlas)
- Airtable account with OAuth application configured

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Fill in your values:

```dotenv
PORT=5000
MONGODB_URI=mongodb://localhost:27017/airtable-forms
JWT_SECRET=your_secret_key_here
AIRTABLE_CLIENT_ID=your_client_id
AIRTABLE_CLIENT_SECRET=your_client_secret
AIRTABLE_REDIRECT_URI=http://localhost:3000/auth/airtable/callback
```

Start dev server:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Access the app at `http://localhost:3000`

## Project Structure

```
airtable-form-builder/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Auth, etc
│   │   ├── utils/           # Helpers (conditional logic)
│   │   └── server.js        # Express app
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/           # React routes
    │   ├── components/      # Reusable components
    │   ├── utils/           # API client, conditional logic
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## API Endpoints

### Auth

- `POST /api/auth/login` — email/password login
- `POST /api/auth/signup` — create account
- `GET /api/auth/airtable/login` — redirect to Airtable OAuth
- `GET /api/auth/airtable/callback` — OAuth callback handler
- `GET /api/auth/me` — current user info

### Forms

- `GET /api/forms` — list user's forms
- `POST /api/forms` — create form
- `GET /api/forms/:formId` — get form schema
- `PUT /api/forms/:formId` — update form
- `DELETE /api/forms/:formId` — delete form

### Responses

- `POST /api/forms/:formId/submit` — submit form response
- `GET /api/forms/:formId/responses` — list responses

### Airtable Meta

- `GET /api/airtable/bases` — list user's bases
- `GET /api/airtable/tables?baseId=xxx` — list tables
- `GET /api/airtable/fields?baseId=xxx&tableId=yyy` — list fields

### Webhooks

- `POST /api/webhooks/airtable` — Airtable webhook endpoint

## Conditional Logic

Form fields can have visibility rules. Example rule structure:

```json
{
  "logic": "AND",
  "conditions": [
    { "questionKey": "role", "operator": "equals", "value": "Engineer" },
    { "questionKey": "skills", "operator": "contains", "value": "node" }
  ]
}
```

Supported operators: `equals`, `notEquals`, `contains`

Logic: `AND` (all must be true) or `OR` (any can be true)

The function `shouldShowQuestion(rules, answers)` is implemented on both frontend and backend for consistency.

## Data Models

### Form

```javascript
{
  title: String,
  description: String,
  owner: ObjectId (User),
  airtableBaseId: String,
  airtableTableId: String,
  questions: [
    {
      questionKey: String,
      airtableFieldId: String,
      label: String,
      type: String,
      required: Boolean,
      conditionalRules: { logic, conditions }
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Response

```javascript
{
  formId: ObjectId (Form),
  airtableRecordId: String,
  answers: { key: value },
  status: String,
  deletedInAirtable: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Webhook Setup

To receive Airtable webhooks:

1. In Airtable: Create a webhook pointing to `https://yourdomain.com/api/webhooks/airtable`
2. Airtable will send notifications when records are created, updated, or deleted
3. Your backend will automatically update the `Response` records in MongoDB

## Testing

Run conditional logic tests:

```bash
cd backend
npm run test-conditional
```

## Deployment

### Frontend (Vercel)

```bash
cd frontend
vercel deploy
```

### Backend (Railway/Render)

```bash
git push
# Follow platform's deployment guide
# Set environment variables in dashboard
```

## Notes

- Responses are saved to both Airtable and MongoDB for redundancy
- The `deletedInAirtable` flag marks records removed from Airtable without hard-deleting them locally
- Conditional logic is evaluated client-side for UX and server-side for validation
- All protected routes require a valid JWT token in the `Authorization` header
