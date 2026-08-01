/** @type {import('next').NextConfig} */
// Static export for GitHub Pages — see DEPLOYMENT.md for what this trades
// away (auth, mutations, per-request rendering; all UI still renders, see
// src/lib/demo-actions.ts) and how to go back to a real server-backed deploy
// later (git history has the Postgres-backed version this was converted from).
//
// GitHub Pages serves this repo at https://<user>.github.io/frilans/ — a
// subpath, not the domain root — so basePath/assetPrefix are required or
// every internal link and asset resolves one level too high and 404s. If you
// ever move this to a custom domain or a <user>.github.io repo, set both to "".
const REPO_BASE_PATH = "/frilans";

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "export",
  basePath: REPO_BASE_PATH,
  assetPrefix: REPO_BASE_PATH,
  images: { unoptimized: true },
};

export default nextConfig;
