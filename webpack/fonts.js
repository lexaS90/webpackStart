module.exports = function(env, argv) {
    return {
        module: {
            rules: [
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[path][name].[ext]',
                                context: $.PATH.source,
                                publicPath: '../'
                            },
                        }
                    ],
                }
            ]
        }
    }
}