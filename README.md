# CodeChef ABESEC — Club Event Management

> Official event portal for the **CodeChef ABESEC Student Chapter** at ABES Engineering College.  
> Built as a recruitment task for the CodeChef ABESEC chapter.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Data Storage](#data-storage)
- [Local Setup](#local-setup)
- [Admin Access](#admin-access)
- [Deployment (Vercel)](#deployment-vercel)
- [Project Structure](#project-structure)

---

## Features

### User Side
- 🏠 **Home** — hero with club intro, featured event spotlight, and upcoming events grid (next 3 by date)
- 📅 **Events page** — all events with category badges, formatted date/time, venue, and search + filter by category
- 📝 **Registration modal** — accessible focus-trapped modal (Esc to close) with field validation
- ✅ **Duplicate prevention** — blocks registration if the same email registers for the same event twice with a clear message
- 🚫 **Past event guard** — registration is blocked using timezone-aware calculation (Asia/Kolkata) for events that have already passed
- 🔔 **Toast notifications** — instant feedback via `react-hot-toast`

### Admin Side
- 🔐 **Auth** — password-protected login; JWT issued in an httpOnly, sameSite=lax cookie
- 📋 **Events management** — create, edit, delete (with confirmation dialog and cascading registration removal)
- 👥 **Registrations table** — search by participant name/email, filter by event, total count display, fallback label for deleted events
- 📥 **CSV export** — download registrations as a sanitized CSV file with formula-injection prevention
- 🔄 **Reset demo data** — quick button in admin dashboard to restore sample events and registrations
- 🔒 **Route protection** — `proxy.js` guards all `/admin/*` pages and admin API endpoints

### General
- 📱 Responsive at 360 px, 768 px, and 1280 px
- 🌙 Dark theme with consistent indigo/violet accent palette
- 💀 Custom 404 page, loading skeletons, and error boundaries
- ⚡ Instant client-side state reactivity across tabs and views

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, JavaScript) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Client Storage | Browser `localStorage` with in-memory fallback |
| Auth | [jose](https://github.com/panva/jose) — signed HS256 JWT |
| Notifications | [react-hot-toast](https://react-hot-toast.com) |
| Hosting | [Vercel](https://vercel.com) |

---

## Data Storage

Data lives directly in the browser via `localStorage` behind a single unified storage module:

- **Storage Keys**: Events are persisted under `cc_events_v1` and registrations under `cc_regs_v1`.
- **Default Seed**: When storage is empty, `lib/store.js` automatically initializes 6 sample events (4 upcoming, 2 past, 1 featured) and default sample registrations from `lib/seedData.js`.
- **Resilience**: Every `localStorage` read and write is wrapped in try/catch blocks with automatic fallback to in-memory state if `localStorage` is disabled or blocked.
- **Single Point of Replacement**: `lib/store.js` is the single file to replace when connecting a backend server or a persistent database. The rest of the UI interacts solely through the `useStore()` React context hook (`context/StoreProvider.js`).

---

## Local Setup

### Prerequisites
- **Node.js** ≥ 18.17
- **npm** ≥ 9

### 1. Clone & Install

```bash
git clone https://github.com/<your-org>/club-event.git
cd club-event
npm install
```

### 2. Configure Environment Variables

Create `.env.local` based on `.env.example`:

```bash
cp .env.example .env.local
```

Open `.env.local` and set your credentials:

```env
# Admin login password (you choose)
ADMIN_PASSWORD=your_strong_password_here

# JWT signing secret — generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
```

> ⚠️ **Never commit `.env.local`** — it is already listed in `.gitignore`.

### 3. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Admin Access

1. Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Enter the password configured in `ADMIN_PASSWORD`
3. You are issued a 24-hour JWT in an httpOnly cookie

**Admin capabilities:**
- Add / Edit / Delete events (deleting an event automatically cascades and deletes its registrations)
- View all registrations, search by name or email, filter by event
- Export registrations to CSV
- Reset demo data to default sample events and registrations
- Logout via the button in the dashboard header

---

## Deployment (Vercel)

### Manual Deploy Steps

1. **Push repository to GitHub**
2. **Import into Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your repository
   - Framework preset: **Next.js** (auto-detected)
3. **Set Environment Variables** in Vercel dashboard:
   - `ADMIN_PASSWORD`: Your chosen admin password
   - `JWT_SECRET`: 64-character hex secret
4. **Deploy**: Build and deployment will run automatically.

---

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
club-event/
├── app/
│   ├── admin/          # Admin dashboard + login
│   ├── api/admin/      # Admin auth API routes (login, logout)
│   ├── events/         # Public events catalog page
│   ├── layout.js       # Root layout + store providers + metadata
│   ├── page.js         # Home page (Hero, Featured, Upcoming)
│   ├── not-found.js    # Custom 404
│   └── global-error.js # Global error boundary
├── components/
│   ├── admin/          # AdminDashboardClient, EventFormModal, DeleteConfirmModal
│   ├── EventCard.js
│   ├── EventsClient.js
│   ├── FeaturedEventSection.js
│   ├── Navbar.js
│   ├── Footer.js
│   └── RegistrationModal.js
├── context/
│   ├── StoreProvider.js       # useStore hook and reactive state provider
│   └── RegistrationContext.js # Modal state context
├── lib/
│   ├── auth.js         # JWT signing & verification (jose)
│   ├── eventTime.js    # Asia/Kolkata timezone event time helpers
│   ├── seedData.js     # Default 6 sample events and registrations
│   └── store.js        # Single browser localStorage data store
├── proxy.js            # Route protection for admin pages and endpoints
├── .env.example
└── README.md
```

---

## License

MIT — free to use and modify.
