# alex-1883-test-41

A static Vite, React, and TypeScript scientific calculator.

## Requirements

- Node.js 20 or newer
- npm

## Local Development

```bash
npm install
npm run dev
```

The development server listens on `0.0.0.0:8080`.

## Validation

```bash
npm run format:check
npm run lint
npm test
npm run build
npm run test:e2e
```

The end-to-end suite uses Playwright. On a fresh machine, install the browser
runtime once before running E2E tests:

```bash
npx playwright install chromium
```

## Production Build

```bash
npm ci
npm run build
```

The production artifact is the `dist/` directory. It contains only static files
and can be served by any static file server.

To smoke-test the production artifact locally:

```bash
npm run preview
```

The preview server listens on `0.0.0.0:8080`.

## Self-Hosting From `dist/`

After `npm run build`, copy the contents of `dist/` to your static web root.
The app has no backend routes, database migrations, or runtime secrets.

Example with Python for a bare directory:

```bash
cd dist
python3 -m http.server 8080 --bind 0.0.0.0
```

Example Nginx location:

```nginx
server {
  listen 8080;
  server_name _;
  root /srv/alex-1883-test-41/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## Environment

Copy `.env.example` to `.env` only if you need to override build-time Vite
values. The calculator does not read runtime server environment variables.
