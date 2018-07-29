const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackSweetEntry = require('webpack-sweet-entry');
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin');

module.exports = function(env, argv){

    let pugFiles = WebpackSweetEntry(path.resolve($.PATH.source, 'pages/*.pug'), 'pug', 'pages');
    
    let pugPlugin = [];

    for (item in pugFiles){
        pugPlugin.push(new HtmlWebpackPlugin({
            filename: `${item}.html`,
            chunks: `${item}`,
            template: $.PATH.source + `/pages/${item}.pug`
        }));
    }

    // HtmlBeautify
    if (argv.mode == 'production'){
        pugPlugin.push(new HtmlBeautifyPlugin({
            config: {
                html: {
                    end_with_newline: true,
                    indent_size: 2,
                    indent_with_tabs: true,
                    indent_inner_html: true,
                    preserve_newlines: true,
                    unformatted: ['p', 'i', 'b', 'span']
                }
            }
        }));
    }
    

    return {        
        plugins: pugPlugin,
        module: {
            rules: [
                {
                    test: /\.pug$/,
                    loader: 'pug-loader',
                    options: {
                        pretty: true,
                        self: true,
                        globals : {
                            "siteName2": "Стартовый шаблон"
                        }
                    }
                }
            ]
        }
    }
}