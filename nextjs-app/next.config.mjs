/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverComponentsExternalPackages: [ '@langchain/core', '@langchain/groq' ]
    },
    images: {
        remotePatterns: [
          {
            hostname: "lh3.googleusercontent.com",
            protocol: "https",
            port: "",
          },
          {
            hostname: "images.unsplash.com",
            protocol: "https",
            port: "",
          },
          {
            hostname: "plus.unsplash.com",
            protocol: "https",
            port: "",
          },
          {
            hostname: "assets.aceternity.com",
            protocol: "https",
            port: "",
          },
          {
            hostname: "s3.us-west-2.amazonaws.com",
            protocol: "https",
            port: "",
          },
          {
            hostname: "www.youtube.com",
            protocol: "https",
            port: "",
          },
          {
            hostname: "res.cloudinary.com",
            protocol: "https",
            port: "",
          },
        ],
      },

    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    output: 'standalone',
};

export default nextConfig;
