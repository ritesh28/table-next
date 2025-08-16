/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, _options) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    });
    config.module.rules.push({
      test: /\.csv$/,
      loader: 'csv-loader',
      options: {
        dynamicTyping: true, // Automatically convert data types
        header: true, // Parse the first row as headers
        skipEmptyLines: true, // Skip any blank lines
      },
    });

    return config;
  },
};

module.exports = nextConfig;
