/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**', // allows all paths
      },
    ],
  },
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
