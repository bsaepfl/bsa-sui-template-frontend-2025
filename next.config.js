/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure Next.js to handle WASM files for Walrus SDK
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  // Skip bundling walrus packages for API routes (if needed)
  serverExternalPackages: ["@mysten/walrus", "@mysten/walrus-wasm"],
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
