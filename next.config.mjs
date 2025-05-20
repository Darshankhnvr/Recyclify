/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // remotePatterns: [ ... ] // Keep if you have other external images
    formats: ['image/avif', 'image/webp'], // Add AVIF as a preferred format
  },
  // ... any other existing Next.js configurations
};

export default nextConfig;
