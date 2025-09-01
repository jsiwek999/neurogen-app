/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: false, // ← temporarily disable the PageProps contract check
  },
};
module.exports = nextConfig;
