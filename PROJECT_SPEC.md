# PROJECT SPECIFICATION

PROJECT: College Club Event Management Website (CodeChef ABESEC recruitment task)

STACK: Next.js (App Router, JavaScript), Tailwind CSS, Browser localStorage (lib/store.js), deployed on Vercel. Single repo, single deployment.

DATA MODELS
- Event: title, description, category, date (Date), time (string), venue, featured (boolean), imageUrl (optional)
- Registration: eventId (ref Event), name, email, collegeYear, phone, createdAt. Unique compound index on (eventId, email).

USER SIDE
- Home: club intro, upcoming events, featured event
- Events page: all events as cards (name, date and time, venue, description, Register button), search by name, filter by category
- Registration form: name, email, college/year, phone (10 digits), validation, duplicate prevention, success and error states
- Past events show "Registration closed"

ADMIN SIDE (protected)
- Login with ADMIN_PASSWORD env var, JWT in httpOnly cookie, middleware protects /admin/* and /api/admin/*
- Dashboard: add, edit, delete events
- Registrations table: view all, search by name/email, filter by event, CSV export

NON-FUNCTIONAL
- Fully responsive (mobile-first), loading skeletons, empty states, toast feedback
- Server-side validation on every API route
- ENV: ADMIN_PASSWORD, JWT_SECRET (provide .env.example, never commit .env.local)
- Clean folder structure, no dead code, meaningful commit-ready code
