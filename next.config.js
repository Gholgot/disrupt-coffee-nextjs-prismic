const withSass = require('@zeit/next-sass');
module.exports = withSass({
    sassLoaderOptions: {
        includePaths: ["absolute/path/a", "absolute/path/b"]
      },
      devIndicators: {
        autoPrerender: false,
      },
    webpack(config, options) {
        config.module.rules.push({
            test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 100000
                }
            }
        });
 
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });

        return config;
    }
})