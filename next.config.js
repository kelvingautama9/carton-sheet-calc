/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/carton-sheet-calc',
  assetPrefix: '/carton-sheet-calc/',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
