
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'http',
        hostname: 'localhost',
        port: process.env.PORT || '3000',
        pathname: '/**',
      },
    ],
  },
   webpack: (config, { isServer }) => {
    // This is to allow Next.js to handle file uploads correctly.
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
     config.externals = [...config.externals, 'mock-aws-s3', 'aws-sdk', 'nock'];
    return config;
  },
};

export default nextConfig;
