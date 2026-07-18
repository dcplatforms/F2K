<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/97e48dc3-a102-4619-adbc-053d78ea68b3

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


---

## GitHub Pages deployment

This repository is configured to build the Vite app and publish the static `dist/` output to the `gh-pages` branch using a GitHub Actions workflow (`.github/workflows/pages.yml`).

- To trigger a deploy, push to `main`.
- GitHub Pages site (once deployed): `https://dcplatforms.github.io/F2K`

Note: `server.ts` is included for backend use and is *not* executed by GitHub Pages. If you want me to separate server bundling from the Pages build, I can update package.json accordingly.
