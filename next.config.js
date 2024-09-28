module.exports = {
  images: {
    domains: ["122.160.116.97"],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      encoding: false,
      fs: false, // Add this line
    };
    return config;
  },
};
