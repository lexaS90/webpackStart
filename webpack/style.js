const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer');
const cssMqpacker = require('css-mqpacker');

module.exports = function(env, argv){

    let postCssplugins = [];

    if (argv.mode == 'production'){
        postCssplugins.push(
            autoprefixer({
                browsers:['ie >= 8', 'last 4 version']
            })            
        );

        postCssplugins.push(
            cssMqpacker()
        );
    }
    
    return {
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: [

                        {
                            loader: MiniCssExtractPlugin.loader,
                        },

                        {
                            loader: 'css-loader',
                        },

                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: postCssplugins,
                                sourceMap: true
                            }
                        },

                        {
                            loader: 'sass-loader',
                        }
                    ]
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: $.CONFIG.dist.style,
            })
        ],
    }
}