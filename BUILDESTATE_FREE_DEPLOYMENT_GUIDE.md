# Aavasa free deployment guide

This guide deploys the existing monorepo without a custom domain:

- Customer frontend: Vercel, root directory `frontend`
- Admin dashboard: Vercel, root directory `admin`
- Backend API: Render Web Service, root directory `backend`
- Database: MongoDB Atlas Free tier
- Image storage: existing Cloudinary configuration
- Email: existing Resend configuration

The provider-generated URLs are intentionally not hardcoded here. Copy the real
URLs from your Vercel and Render dashboards after each service is created.

## 1. Create the MongoDB Atlas Free database

1. Create a MongoDB Atlas account and a Free tier cluster.
2. Create a database user with a strong password.
3. In **Network Access**, add the Render outbound access range. For a first
   free-tier deployment, `0.0.0.0/0` is the practical option, but it should be
   restricted later if your Atlas plan and hosting setup provide stable
   outbound IPs.
4. Copy the driver connection string and replace its placeholders:

```text
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

Do not commit this value or paste it into chat.

## 2. Deploy the backend to Render

Create a **Web Service** from the repository:

- Root directory: `backend`
- Runtime: Node
- Build command: `npm run render-build`
- Start command: `npm start`
- Health check path: `/status`
- Auto-deploy: enabled only if desired

The service uses Render's `PORT` value through `process.env.PORT`. The checked-in
`backend/render.yaml` contains the same build, start, and health settings.

Configure these Render environment variables:

### Required backend variables

```text
NODE_ENV=production
MONGO_URI=<MongoDB Atlas connection string>
JWT_SECRET=<long random secret>
ADMIN_EMAIL=<admin login email>
ADMIN_PASSWORD=<strong admin password>
WEBSITE_URL=<customer Vercel URL>
FRONTEND_URL=<customer Vercel URL>
ADMIN_URL=<admin Vercel URL>
RESEND_API_KEY=<Resend API key>
RESEND_FROM_EMAIL=<verified Resend sender>
CLOUDINARY_CLOUD_NAME=<Cloudinary cloud name>
CLOUDINARY_API_KEY=<Cloudinary API key>
CLOUDINARY_API_SECRET=<Cloudinary API secret>
```

### Optional backend variables

```text
EXTRA_ALLOWED_ORIGINS=<comma-separated additional origins>
FIRECRAWL_API_KEY=<server-side Firecrawl key if used>
GITHUB_MODELS_API_KEY=<GitHub Models key if used>
NVIDIA_API_KEY=<NVIDIA key if used>
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=1000
SESSION_TIMEOUT_MINUTES=60
MAX_FILE_SIZE_MB=10
MAX_FILES_PER_PROPERTY=10
```

Do not set `LOCAL_URLS` in the production service unless a specific local
origin is intentionally required. The backend production CORS allowlist accepts
only configured frontend/admin origins.

After deployment, record the generated Render URL, for example:

```text
https://<your-render-service>.onrender.com
```

Verify:

```text
GET https://<your-render-service>.onrender.com/health
GET https://<your-render-service>.onrender.com/status
```

The `/health` response is a liveness check. `/health/ready` also checks
MongoDB and may return `503` until Atlas connectivity is configured.

## 3. Deploy the customer frontend to Vercel

Create a new Vercel project from the same repository:

- Root directory: `frontend`
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

The checked-in `frontend/vercel.json` provides SPA rewrites, security headers,
redirects, and the dynamic sitemap rewrite.

Configure these Vercel environment variables for **Production**, and also for
Preview if preview deployments should call the same backend:

```text
VITE_API_BASE_URL=https://<your-render-service>.onrender.com
VITE_SITE_URL=https://<your-customer-project>.vercel.app
VITE_ENABLE_AI_HUB=true
BACKEND_URL=https://<your-render-service>.onrender.com
SITE_URL=https://<your-customer-project>.vercel.app
```

`VITE_API_BASE_URL` must not include `/api`; the frontend adds that path.
`BACKEND_URL` and `SITE_URL` are server-side variables used by the Vercel
sitemap function and must not use the `VITE_` prefix.

After the first deployment, copy the exact customer Vercel URL into the
backend's `WEBSITE_URL` and `FRONTEND_URL` variables, then redeploy the backend.

## 4. Deploy the admin dashboard to Vercel

Create a second Vercel project from the same repository:

- Root directory: `admin`
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

The checked-in `admin/vercel.json` provides SPA fallback routing and baseline
security headers.

Configure this Vercel environment variable:

```text
VITE_BACKEND_URL=https://<your-render-service>.onrender.com
```

Copy the exact admin Vercel URL into the backend's `ADMIN_URL` variable, then
redeploy the backend. Do not expose backend secrets in either Vercel project.

## 5. CORS and authentication checklist

The backend allowlist is built from:

- `FRONTEND_URL`
- `ADMIN_URL`
- `WEBSITE_URL`
- `EXTRA_ALLOWED_ORIGINS`

Use full origins with `https://` and no trailing slash. Do not use `*` with
credentialed requests. The backend sends cookies and authorization tokens, so
the exact Vercel origins must be configured.

Verify after both frontends are deployed:

1. Customer sign-in and sign-out.
2. Admin sign-in.
3. Public property listing.
4. Property details.
5. Authenticated saved properties.
6. Viewing request submission.
7. Admin property management.
8. Image upload using valid Cloudinary credentials.

## 6. Free-tier limitations

- Render free services can sleep after inactivity, so the first request may be
  slow.
- MongoDB Atlas Free has limited storage and shared resources.
- Vercel preview and production URLs are provider-generated without a custom
  domain.
- Resend and Cloudinary still require valid provider accounts and verified
  configuration. They are not replaced by the hosting providers.

## 7. Local verification before deployment

From the repository root:

```powershell
cd frontend
npm install
npm run build

cd ..\admin
npm install
npm run build

cd ..\backend
npm ci
npm run render-build
node --check server.js
node --check routes/healthRoutes.js
```

For local development, keep the ignored files:

- `frontend/.env` or `frontend/.env.local`
- `admin/.env.local`
- `backend/.env.local`

Use the checked-in `.env.example` files as templates. Never commit real `.env`
files, API keys, passwords, JWT secrets, or database connection strings.

## 8. Troubleshooting

### Frontend reports `VITE_API_BASE_URL is required`

Add `VITE_API_BASE_URL` to the Vercel project's Production environment and
redeploy. The production build intentionally fails clearly instead of silently
calling localhost.

### Admin reports `VITE_BACKEND_URL is required`

Add `VITE_BACKEND_URL` to the admin Vercel project and redeploy.

### Browser shows a CORS error

Compare the browser's exact origin with `FRONTEND_URL` or `ADMIN_URL` in Render.
Update the values without a trailing slash and redeploy the backend.

### `/health/ready` returns `503`

Check `MONGO_URI`, the Atlas database user, the Atlas network access list, and
the database name. Do not log or share the connection string.

### Image uploads fail

Check the three Cloudinary variables in Render. A missing or invalid Cloudinary
credential is different from a Vercel or Render routing problem.

### Emails fail

Check `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and Resend domain/sender
verification. Do not put the Resend key in either frontend project.

## 9. Deployment status boundary

Repository-side configuration can be validated locally. Creating Vercel,
Render, MongoDB Atlas, Cloudinary, or Resend resources requires your account
access and manual dashboard actions. No deployment, DNS change, account change,
or secret configuration is claimed until you complete and verify those steps.
