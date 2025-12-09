# Star Fashion E-Commerce

Monorepo containing backend (`Backend_boutique_website`) and frontend (`Customer_website`).

## Prerequisites
- Node.js 18+
- npm

## Backend (API)
1) `cd Backend_boutique_website`
2) Copy `env.example` to `.env` and fill values:
   - `PORT`
   - `CORS_ORIGINS` (comma-separated frontend origins, e.g. `http://localhost:5173,https://yourdomain.com`)
   - `MONGO_URL`
   - `JWT_SECRET`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_NAME`
   - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
   - `TWO_FACTOR_API_KEY`, `FAST2SMS_API_KEY`, `TWILIO_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
3) Install deps: `npm install`
4) Run dev: `npm run dev`
5) Prod start: `npm start`

## Frontend (Vite React)
1) `cd Customer_website`
2) Create `.env` with:
   - `VITE_BACKEND_URL=https://your-backend-host/api` (or `http://localhost:5000/api` for local)
3) Install deps: `npm install`
4) Run dev: `npm run dev` (defaults to port 5173)
5) Build: `npm run build` (output in `dist/`)

## Deployment notes
- Vercel SPA routing: `Customer_website/vercel.json` rewrites all paths to `index.html`.
- Ensure backend `CORS_ORIGINS` matches the deployed frontend origin(s).

