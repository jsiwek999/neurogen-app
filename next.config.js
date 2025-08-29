/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // DO NOT set trailingSlash: true (it breaks API routes with / → //)
  // DO NOT add redirects() rules based on host
};
module.exports = nextConfig;
