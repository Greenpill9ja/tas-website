import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "greengoods.mypinata.cloud", pathname: "/ipfs/**" }],
  },
  reactCompiler: true,
};

export default nextConfig;
