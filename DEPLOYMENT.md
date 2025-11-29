# Deployment Guide

## Frontend (Vercel)

1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Set environment variables in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend-url/api
   ```
4. Vercel auto-deploys on push

## Backend (Railway)

1. Create account at railway.app
2. Connect GitHub repo
3. Select Node.js starter
4. Set environment variables in Railway dashboard:
   ```
   PORT=3000
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your_secret
   AIRTABLE_CLIENT_ID=...
   AIRTABLE_CLIENT_SECRET=...
   AIRTABLE_REDIRECT_URI=https://yourfrontend.vercel.app/auth/airtable/callback
   WEBHOOK_SECRET=...
   NODE_ENV=production
   ```
5. Railway deploys automatically

## Airtable Webhook Setup

1. In your Airtable workspace, go to **Automations**
2. Create a new webhook automation
3. Set webhook URL to: `https://your-backend-url/api/webhooks/airtable`
4. Select events: record created, updated, deleted
5. Save and test

## Post-Deployment

- Test OAuth flow from your frontend URL
- Verify form creation and submission
- Monitor webhook deliveries in Airtable logs
