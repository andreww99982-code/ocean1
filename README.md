# Atlantic Aquarium Ticket Booth

A single-page application (SPA) for buying aquarium tickets, built with a fully client-side
data layer for local development and testing: all data (cart, orders) is stored in the browser's
`localStorage`, and network calls are simulated with a small bounded delay (see
`src/api/localApi.ts`), so loading never "hangs". No backend deployment is required to run or
test the site — this is intentional so the full experience (including checkout and payment
screens) can be exercised end-to-end by testers without any external services.

## Features

- Select visit date and time (3-week calendar, real-time slot availability)
- Ticket catalog (adult, child, senior, family) with adjustable quantities
- Shopping cart
- Order checkout (guest contact form, no password/account needed)
- Payment step with card details form
- Order confirmation page with ticket codes
- Search past orders by email (stored in this browser)

## Running

```bash
npm install
npm run dev       # local development server
npm run build      # production build to dist/
npm run preview   # preview of production build
```

## Stack

Vite + React + TypeScript, react-router-dom for routing. No external UI libraries — 
custom styles in `src/styles/global.css`.
