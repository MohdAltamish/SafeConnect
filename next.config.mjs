/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude firebase-admin from client bundles
  // (it's server-only, used in API routes)
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
  },
};

export default nextConfig;
