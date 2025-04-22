import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'https://easy-script.koston.duckdns.org/api/:path*'
  //     }
  //   ]
  // },

  sassOptions: {
    includePaths: ['./src'],
    additionalData: `@import './src/styles/variables'; @import './src/styles/mixins';`
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find(
      (rule: { test: { test: (arg0: string) => unknown } }) =>
        rule.test?.test?.('.svg')
    )

    if (fileLoaderRule) {
      config.module.rules.push(
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/
        },
        {
          test: /\.svg$/i,
          issuer: fileLoaderRule.issuer,
          resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                svgo: false,
                svgoConfig: {
                  plugins: [
                    {
                      name: 'preset-default',
                      params: {
                        overrides: {
                          removeViewBox: false
                        }
                      }
                    },
                    {
                      name: 'removeAttrs',
                      params: {
                        attrs: '(id|class)'
                      }
                    }
                  ]
                }
              }
            }
          ]
        }
      )

      fileLoaderRule.exclude = /\.svg$/i
    }

    return config
  }
}

export default nextConfig
