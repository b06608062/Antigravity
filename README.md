# HR Magic Suite

A React application built with TypeScript and Vite.

## Prerequisites

- Node.js (v20 or newer recommended)
- npm

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Building for Production

Build the assets for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Deployment

This project relies on GitHub Actions for CI/CD. The workflow is defined in `.github/workflows/deploy.yml`.

Currently, the workflow verifies the build on every push to `main`. To enable deployment (e.g., to GitHub Pages), configure the environment in the repository settings and uncomment the deploy job in the workflow file.
