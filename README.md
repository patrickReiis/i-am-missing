# MKStack

A template for building Nostr client applications with React 18.x, TailwindCSS 3.x, Vite, shadcn/ui, and Nostrify.

## Features

- ⚛️ Modern React 18 app with hooks and fast refresh
- 🎨 Styling with TailwindCSS 3 and Headless UI components from shadcn/ui
- ⚡️ Ultra-fast dev server and builds with Vite
- 🌐 Integrated with the Nostr protocol via Nostrify
- 🪶 Accessible, composable UI primitives
- 🧲 Decentralized social login and publishing through Nostr
- 🔌 TypeScript, TanStack Query, and more

## Getting Started

### Development

Start the development server with hot reload:

```bash
npm run dev
```

This will install dependencies (if needed) and launch the local Vite dev server.<br>
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

To build a minified production version:

```bash
npm run build
```

Preview the build locally with:

```bash
npm run preview
```

### Continuous Integration & Linting

For CI, type checks, and code linting:

```bash
npm run ci
```

To run just the linter:

```bash
npm run lint
```

### Deployment

Deploy the app to [Surge.sh](https://surge.sh/) with:

```bash
npm run deploy
```

## How It Works

- **Nostr-Integrated Login:** Seamlessly authenticate using your Nostr identity.
- **Publish & Query Events:** Use custom hooks to interact with the decentralized Nostr event network.
- **Modern Component Library:** Build interfaces using accessible, headless components by shadcn/ui.
- **Scalable Project Architecture:** Organized with React Router, custom hooks, and strong TypeScript support.

## Tech Stack

- React 18.x, Vite, TypeScript
- TailwindCSS 3.x, shadcn/ui, Radix UI
- Nostrify (Nostr protocol client)
- TanStack React Query

## Contributing

- Open to PRs, issues, and feedback!
- Follow code conventions and run `npm run ci` to check your work.
- Help improve decentralized, open-source social tech.

## License

MIT
