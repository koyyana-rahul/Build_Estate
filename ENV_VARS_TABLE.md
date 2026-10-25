# Environment Variables — BuildEstate Real Estate Platform

## Overview

This project requires the following environment variables. Variables are categorized by whether they are required for local development, required only for production, optional integrations, or can use local defaults.

---

## Environment Variables Table

| Variable | Required? | Purpose | Where to Obtain It | Default / Local Option |
|---|---|---|---|---|
| **PORT** | Required | Server port | Default: 4000 (code) | Use code default if unset |
| **NODE_ENV** | Required | Environment mode (development/production) | Set to `development` locally | `development` |
| **MONGO_URI** | Required | MongoDB connection string | MongoDB Atlas (cloud) or local MongoDB | Local: `mongodb://localhost:27017/buildestate` |
| **JWT_SECRET** | Required | Secret key for JWT token signing | Generate with `openssl rand -base64 32` | Must be set — no default |
| **WEBSITE_URL** | Required | Base URL for email verification/reset links | Your domain (e.g. `https://buildestate.vercel.app`) | Set to `http://localhost:5173` for local dev |
| **FRONTEND_URL** | Required | Primary frontend URL for CORS | Set to `http://localhost:5173` locally | `http://localhost:5173` (code default) |
| **ADMIN_URL** | Required | Admin URL for CORS | Set to `http://localhost:5174` locally | `http://localhost:5174` (code default) |
| **ADMIN_EMAIL** | Required | Admin email for admin authorization | Set in backend `.env`; matches admin login | `admin@buildestate.com` (code default) |
| **ADMIN_PASSWORD** | Required | Admin password hash (bcrypted) | Set in backend `.env`; matches seeded admin account | Must be set — no default |
| **IMAGEKIT_PUBLIC_KEY** | Required | ImageKit public key for image uploads | ImageKit.io dashboard | Must be set — imagekit.js throws if missing |
| **IMAGEKIT_PRIVATE_KEY** | Required | ImageKit private key for image uploads | ImageKit.io dashboard | Must be set — imagekit.js throws if missing |
| **IMAGEKIT_URL_ENDPOINT** | Required | ImageKit URL endpoint | ImageKit.io dashboard | Must be set — imagekit.js throws if missing |
| **FIRECRAWL_API_KEY** | Required | Firecrawl API key for property search | Firecrawl.io dashboard (free tier: 500 pages/mo) | Must be set — search fails without it |
| **GITHUB_MODELS_API_KEY** | Required | GitHub Models API key for AI analysis | GitHub Personal Access Token (Models) | Must be set — AI search fails without it |
| **NVIDIA_API_KEY** | Required | NVIDIA API key for AI analysis | NVIDIA/NGIM API key | Must be set — AI search fails without it |
| **BREVO_API_KEY** | Required | Brevo (SendGrid) API key for email sending | Brevo dashboard (free tier available) | Must be set — emails fail without it |
| **SMTP_USER** | Optional | Gmail SMTP username (alternative) | Google account | Can be left empty if using BREVO_API_KEY |
| **SMTP_PASS** | Optional | Gmail app password (alternative) | Google App Passwords | Can be left empty if using BREVO_API_KEY |
| **EMAIL_USER** | Optional | Sender email address | Set in code defaults | `noreply@buildestate.com` (code default) |
| **LOCAL_URLS** | Optional | Comma-separated local origins for CORS | Code default: `http://localhost:5173,http://localhost:5174,http://localhost:4000` | Code default included |
| **EXTRA_ALLOWED_ORIGINS** | Optional | Extra CORS origins (comma-separated) | Empty by default | Empty string (code default) |
| **RATE_LIMIT_WINDOW_MS** | Optional | Rate limit window in ms | Code default: 3600000 (1 hour) | Code default included |
| **RATE_LIMIT_MAX_REQUESTS** | Optional | Max requests per rate limit window | Code default: 1000 (dev), 500 (prod) | Code default included |
| **SESSION_TIMEOUT_MINUTES** | Optional | Session timeout in minutes | Code default: 60 | Code default included |
| **MAX_FILE_SIZE_MB** | Optional | Max upload file size in MB | Code default: 5 (multer) | Code default included (5MB) |
| **MAX_FILES_PER_PROPERTY** | Optional | Max images per property | Code default: 10 (multer) | Code default included (10 files) |

---

## Categorization

### Required for Local Development
These variables must be set to run the application locally:

1. **PORT** — Server port (default 4000 in code, but should be explicit)
2. **NODE_ENV** — Should be `development` locally
3. **MONGO_URI** — MongoDB connection (Atlas or local)
4. **JWT_SECRET** — Random secure string for signing tokens
5. **WEBSITE_URL** — Used in email verification and password reset links
6. **FRONTEND_URL** — CORS configuration
7. **ADMIN_URL** — Admin CORS configuration
8. **ADMIN_EMAIL** — Admin authorization email
9. **ADMIN_PASSWORD** — Admin password (must match seeded account)
10. **IMAGEKIT_PUBLIC_KEY** — ImageKit public key (no uploads without it)
11. **IMAGEKIT_PRIVATE_KEY** — ImageKit private key (no uploads without it)
12. **IMAGEKIT_URL_ENDPOINT** — ImageKit URL endpoint (no uploads without it)
13. **FIRECRAWL_API_KEY** — Firecrawl key (property search fails without it)
14. **GITHUB_MODELS_API_KEY** — GitHub Models key (AI analysis fails without it)
15. **NVIDIA_API_KEY** — NVIDIA key (AI analysis fails without it)
16. **BREVO_API_KEY** — Brevo API key (emails fail without it)

### Required Only for Production
Same set as above, but some have local development defaults. In production, these must point to production services (e.g., production MongoDB Atlas cluster, production domain for WEBSITE_URL, production Firecrawl key, etc.).

### Optional Integrations
These variables enhance functionality but the app can function without them:

| Variable | Purpose |
|---|---|
| **SMTP_USER** | Gmail SMTP username (alternative to Brevo) |
| **SMTP_PASS** | Gmail app password (alternative to Brevo) |
| **EMAIL_USER** | Sender email address (code defaults to `noreply@buildestate.com`) |
| **LOCAL_URLS** | Local CORS origins (has code default) |
| **EXTRA_ALLOWED_ORIGINS** | Extra CORS origins (empty by default) |
| **RATE_LIMIT_WINDOW_MS** | Rate limit window (has code default: 1 hour) |
| **RATE_LIMIT_MAX_REQUESTS** | Rate limit max requests (has code default: 1000 dev / 500 prod) |
| **SESSION_TIMEOUT_MINUTES** | Session timeout (has code default: 60 min) |
| **MAX_FILE_SIZE_MB** | Max upload size (has code default: 5MB) |
| **MAX_FILES_PER_PROPERTY** | Max images per property (has code default: 10) |

### Variables That Can Use Local Defaults
These have sensible defaults in the code and don't strictly need to be set for local development:

| Variable | Code Default | Notes |
|---|---|---|
| **FRONTEND_URL** | `http://localhost:5173` | Used in CORS allowlist |
| **ADMIN_URL** | `http://localhost:5174` | Used in CORS allowlist |
| **LOCAL_URLS** | `http://localhost:5173,http://localhost:5174,http://localhost:4000` | Used in CORS allowlist |
| **EXTRA_ALLOWED_ORIGINS** | `""` (empty) | Used in CORS allowlist |
| **RATE_LIMIT_WINDOW_MS** | `3600000` (1 hour) | Used in express-rate-limit |
| **RATE_LIMIT_MAX_REQUESTS** | `1000` (dev), `500` (prod) | Used in express-rate-limit |
| **SESSION_TIMEOUT_MINUTES** | `60` | Used in auth flow |
| **MAX_FILE_SIZE_MB** | `5` | Used in multer upload limits |
| **MAX_FILES_PER_PROPERTY** | `10` | Used in multer upload limits |

---

## Missing / Unset Variables — What Happens

| Variable | If Missing / Unset |
|---|---|
| **MONGO_URI** | Server crashes on startup: `MONGO_URI environment variable is not defined` |
| **JWT_SECRET** | Tokens cannot be signed/auth fails |
| **IMAGEKIT_PUBLIC_KEY / PRIVATE_KEY / URL_ENDPOINT** | Image upload throws error: `Missing IMAGEKIT_PUBLIC_KEY` |
| **FIRECRAWL_API_KEY** | Property search returns `Firecrawl API key is required` error |
| **GITHUB_MODELS_API_KEY / NVIDIA_API_KEY** | AI property analysis fails: `AI service temporarily unavailable` |
| **BREVO_API_KEY** | Email sending throws: `Missing BREVO_API_KEY. Cannot send email.` |
| **WEBSITE_URL** | Email verification and password reset links will use incorrect URLs — users won't be able to verify/reset passwords |
| **ADMIN_EMAIL / ADMIN_PASSWORD** | Admin login fails — admin authorization broken |
| **PORT** | Uses code default of 4000 |
| **NODE_ENV** | Uses code default; affects many behaviors (helmet CSP, rate limits, etc.) |

---