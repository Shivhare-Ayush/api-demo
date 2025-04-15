/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      // This forces webpack to treat .js files as ESM.
      config.module.rules.push({
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        resolve: { fullySpecified: false },
      });
      return config;
    },
  };
  
export default nextConfig;
  