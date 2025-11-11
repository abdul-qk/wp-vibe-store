# Vibe WooCommerce Starter

A Vite-powered React storefront that showcases a curated marketplace experience for WooCommerce stores. The starter ships with polished home, shop, product detail, and contact pages, and it talks directly to the WooCommerce REST API so you can surface live catalog data from your WordPress backend.

## Highlights

- React 19 with React Router for a full SPA customer journey
- Modern UI primitives powered by Tailwind CSS, Radix, and lucide-react icons
- Featured, filtered, and detail product views backed by WooCommerce API helpers in `src/services/woocommerce.ts`
- Sensible loading, error, and empty states so the template feels production ready out of the box

## Requirements

- Node.js 18 or newer
- npm 9+ (ships with Node 18) or a compatible package manager
- A WooCommerce store with REST API credentials (read-only is sufficient)

## Quick Start

1. Install dependencies:
   ```
   npm install
   ```
2. Create an environment file (for local development we recommend `.env.local`) and set your WooCommerce connection details:
   ```
   VITE_WOOCOMMERCE_BASE_URL=https://yourstore.com
   VITE_WOOCOMMERCE_CONSUMER_KEY=ck_xxxxx
   VITE_WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxx
   ```
   If you skip this step the starter falls back to the demo store defined in `src/services/woocommerce.ts`, but you will need valid credentials to query a protected catalog.
3. Launch the dev server:
   ```
   npm run dev
   ```
4. Open the printed URL (default `http://localhost:5173`) to explore the storefront.

## Available Scripts

- `npm run dev` – start the Vite dev server with HMR
- `npm run build` – generate a production build in `dist`
- `npm run preview` – serve the production build locally
- `npm run lint` – run ESLint across the project

## Project Structure

- `src/pages` contains the main customer-facing screens (`Home`, `Shop`, `Product`, `Contact`)
- `src/services/woocommerce.ts` centralizes all WooCommerce API helpers and handles auth params
- `src/components/ui` holds reusable UI primitives such as the shared `Button`
- `src/main.tsx` wires up routing and renders the root `App`

## Customizing the Template

- Update hero copy, statistics, and calls-to-action directly inside the page components (for example `src/pages/Home.tsx`)
- Tailwind design tokens live alongside the Vite setup (`index.css`, `App.css`) so you can quickly adjust typography or color
- Swap the default demo imagery in `public/` and tweak component props to align with your brand

When you are ready to deploy, build with `npm run build` and host the generated `dist` folder on your preferred static hosting platform.

## WooCommerce Notes

- Generate REST API keys in your WordPress admin at `WooCommerce → Settings → Advanced → REST API`
- Grant read access for public catalog browsing; upgrade to read/write if you later add cart or order flows
- Make sure your store supports HTTPS and that permalinks are enabled, otherwise the WooCommerce API will reject requests

Enjoy launching your next WooCommerce storefront with Vibe!
