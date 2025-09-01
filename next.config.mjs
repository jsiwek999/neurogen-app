// next.config.mjs
export default {
  async redirects() {
    return [
      { source: '/start-here',  destination: '/start',   permanent: false },
      { source: '/faq/rituals', destination: '/rituals', permanent: false },
    ];
  },
  experimental: { typedRoutes: true },
}
