# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## Poker Tracker UI

The React client for Poker Tracker.

## Development

```sh
npm install
npm run dev
```

By default, API requests use relative `/api` URLs. Vite proxies them to `http://localhost:5076` during local development, and the production ingress routes them to the API service.

To point the local UI at another API, copy `.env.example` to `.env.local` and set `VITE_API_BASE_URL` to the API origin. For example:

```env
VITE_API_BASE_URL=https://poker-tracker.louisheal.com
```

## Checks

```sh
npm run lint
npm run build
```
