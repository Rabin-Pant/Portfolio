import type { NextConfig } from "next";
import { networkInterfaces } from 'node:os';

// Let phones use this computer's current LAN address during development.
const localAddresses = Object.values(networkInterfaces()).flatMap((addresses) =>
  (addresses ?? [])
    .filter((address) => address.family === 'IPv4' && !address.internal)
    .map((address) => address.address),
);

const nextConfig: NextConfig = {
  allowedDevOrigins: localAddresses,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
