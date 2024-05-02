/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["*", "localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: '"lh3.googleusercontent.com"',
      },
    ],
  },
};

module.exports = nextConfig;
