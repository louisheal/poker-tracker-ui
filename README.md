# Poker Tracker UI

The user interface for Poker Tracker.

## Glossary

- **Target range:** The actions and frequencies you intend to use for a spot.
- **Actual range:** The actions and frequencies recorded in your imported hands for that spot.

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
