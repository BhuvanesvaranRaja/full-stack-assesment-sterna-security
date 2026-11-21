# Selyek — MERN Interview Assignment

A React and Express app with login, a dashboard, location management, and lock mapping management. Data is stored in MongoDB. Search and pagination are handled by the backend.

## Requirements

- Node.js 22.12+ and npm
- MongoDB running locally, or a MongoDB Atlas connection string

## Quick setup

Run all commands from the project root.

1. Install dependencies for both the client and server:

   ```sh
   npm install
   ```

2. Copy the sample environment file:

   ```sh
   cp server/.env.example server/.env
   ```

   On Windows PowerShell, use `Copy-Item server/.env.example server/.env`.
   Skip this step if you already have `server/.env`.

   The sample is ready for local review with MongoDB at
   `mongodb://127.0.0.1:27017/mern_app`. If using Atlas, replace `MONGODB_URI`
   in `server/.env` with your connection string.

3. Start MongoDB, then create the demo login account:

   ```sh
   npm run seed
   ```

   Run this once. If it reports that the account already exists, continue to the next step.

4. Start the frontend and backend together:

   ```sh
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) and sign in:

   - **Email:** `admin@admin.com`
   - **Password:** `12345678`

   These match `SEED_EMAIL` and `SEED_PASSWORD` in the sample environment file.
   If you change those values before seeding, use your chosen credentials instead.

## What to review

- Sign in, refresh the page to restore the session, and log out.
- Open Locations and add a location.
- Add, edit, and delete a lock mapping.
- Search locations and lock mappings; use pagination and the table's rows-per-page control.
- Check form validation, API error toasts, and the mobile layout.

The dashboard counts are currently sample values. OTP, Forgot Password, and unfinished navigation sections show informational dialogs. Lock group, geofence, and gateway mapping tabs are placeholders. Last communication stays empty until a device integration supplies a timestamp.

## Useful commands

- `npm run dev` — start both development servers.
- `npm run seed` — create the account configured in `server/.env`.
- `npm run lint` — check the frontend code.
- `npm run build` — build the frontend into `client/dist`.
- `npm start` — start the backend only; it does not serve the frontend build.

## Project structure

- `client/src` — React pages, shared components, and API calls.
- `server/routes` — API endpoints.
- `server/controllers` — request and response handling.
- `server/services` — database queries and business logic.
- `server/models` — MongoDB models.
- `server/validators` — request validation.

## Common setup issues

- **Database connection fails:** ensure MongoDB is running and `MONGODB_URI` is correct. For Atlas, check database credentials and network access.
- **Login fails:** run `npm run seed` and use the credentials configured when the account was created. Changing the environment values does not update an existing user.
- **Port already in use:** free ports `3000` and `5173`. If the frontend runs on a different port, update `APP_ORIGIN` in `server/.env` and restart the backend.
- **Backend port changed:** update `PORT` in `server/.env` and set `API_TARGET` when launching Vite to point to the new backend address.

The sample secret and login are for local assignment review. For deployment, use a new random `JWT_SECRET` and your own credentials. Keep `server/.env` out of version control.
