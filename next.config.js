/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true, // ← temporarily disable the PageProps contract check
  },
};
module.exports = nextConfig;

