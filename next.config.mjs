/** @type {import('next').NextConfig} */
import webpack from 'webpack';

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        '__REACT_DEVTOOLS_GLOBAL_HOOK__': '({ isDisabled: true })'
      })
    );
    return config;
  },
  devIndicators: {
    autoPrerender: false,
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: '/api/auth/[...nextauth]',
      },
      {
        source: '/sitemap.xml',
        destination: '/sitemap.xml.js',
      },
    ];
  },
};

export default nextConfig;