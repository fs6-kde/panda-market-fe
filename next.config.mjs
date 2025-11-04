/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "panda-market-img-bucket.s3.ap-southeast-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
