# STERNA SELYEK — MERN login

Responsive screenshot-matched login with React, Vite, Tailwind CSS, Express,
MongoDB, bcrypt, and cookie-based JWT authentication. Scaffolded with the standard
Vite and Express generators. No public signup or built-in accounts.

## First run

Requires Node.js 22.12+, npm, and a running MongoDB instance (local or Atlas).

```sh
npm install
test -f server/.env || cp server/.env.example server/.env
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

A local `.env` with a generated secret may already exist. Preserve that secret, or
use a newly generated random value as `JWT_SECRET`. Set
`MONGODB_URI`, and supply your own `SEED_EMAIL` and `SEED_PASSWORD`.
Password length must be at least eight characters and at most 72 UTF-8 bytes.
Quote passwords containing `#` or spaces according to dotenv syntax. Then run:

```sh
npm run seed
npm run dev
```

Open http://localhost:5173 and log in with your seeded credentials. The seed
command normalizes the email, hashes the password, and refuses to overwrite an
existing account. Remove `SEED_PASSWORD` from your environment after seeding.
Never commit `.env` files. `JWT_SECRET` must contain at least 32 random characters;
the backend refuses to start without it.

## Behavior

- Email/password errors appear after blur or submit. Password visibility is optional.
- Password login authenticates against MongoDB and opens `/dashboard`.
- Session restore protects the dashboard on refresh; logout clears the cookie.
- Sessions are checked on window focus and every minute; expired sessions return to login.
- OTP and Forgot Password display informational dialogs; email delivery is not implemented.
- Backend validates input independently and returns generic invalid-credentials errors.
- JWTs expire after eight hours and use an HttpOnly, SameSite=Lax cookie with Secure in production.
- Logout removes the browser cookie. Already-copied JWTs expire naturally; this version has no token revocation store.

## Configuration and deployment

`APP_ORIGIN` is the exact frontend origin (default `http://localhost:5173`).
Authentication mutations require JSON and reject mismatched Origin/cross-site requests.
If Vite uses another port, update `APP_ORIGIN` and restart Express.
`PORT` defaults to 3000; the Vite proxy defaults to that backend port and can be
changed with `API_TARGET` when launching Vite.

For production set `NODE_ENV=production`, a strong `JWT_SECRET`, `MONGODB_URI`,
and the HTTPS frontend `APP_ORIGIN`. Serve `client/dist` with SPA fallback, and
reverse-proxy `/api` to Express under the same origin. `npm start` runs only the API.

## Commands

- `npm run dev`: both development servers.
- `npm run build`: frontend production build.
- `npm run lint`: frontend checks.
- `npm run seed`: create the initial account from local environment values.

## UI components

Login fields use shadcn Input, installed with the official CLI. The project keeps
Poppins as its font and customizes input dimensions and validation colors to
match the reference. Add future components with
`npx shadcn@latest add <component> -c client`.
