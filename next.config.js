/** @type {import('next').NextConfig} */
const { version } = require("./package.json");
const nextConfig = {
  reactStrictMode: true,
  env: {
    version,
  },
};

module.exports = nextConfig;
