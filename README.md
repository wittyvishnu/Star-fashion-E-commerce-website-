# Star Fashion E-Commerce

Monorepo containing backend (`Backend_boutique_website`) and frontend (`Customer_website`).

## Prerequisites
- Node.js 18+
- npm

## Backend (API)
1) `cd Backend_boutique_website`
2) Copy `env.example` to `.env` and fill values. Set `CORS_ORIGINS` (comma-separated) to your frontend origin(s).
3) Install deps: `npm install`
4) Run dev: `npm run dev`
5) Prod start: `npm start`

## Frontend (Vite React)
1) `cd Customer_website`
2) Create `.env` with `VITE_BACKEND_URL=https://your-backend-host/api` (or `http://localhost:5000/api` for local).
3) Install deps: `npm install`
4) Run dev: `npm run dev` (defaults to port 5173)
5) Build: `npm run build` (output in `dist/`)

## Deployment notes
- Vercel SPA routing: `Customer_website/vercel.json` rewrites all paths to `index.html`.
- Ensure backend `CORS_ORIGINS` matches the deployed frontend origin(s).

