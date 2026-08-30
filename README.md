# Atlantic Aquarium Ticket Booth (Local Demo Version)

A completely local single-page application (SPA) for buying aquarium tickets.
No real backend, authentication, or payment gateway — all data (cart, orders) is stored in the browser's `localStorage`, 
and the "network" is emulated with a limited time delay (see `src/api/localApi.ts`), so loading never "hangs".

## Features

- Select visit date and time (3-week calendar, real-time slot availability)
- Ticket catalog (adult, child, senior, family) with adjustable quantities
- Shopping cart
- Order checkout (guest contact form, no password/account needed)
- Emulated payment (no real payment gateway)
- Order confirmation page with ticket codes
- Search past orders by email (local, within this browser only)

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
