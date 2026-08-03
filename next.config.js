/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // base64 rasmlar katta bo'lishi mumkin
    },
  },
};

module.exports = nextConfig;
