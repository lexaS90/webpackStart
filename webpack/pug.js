const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackSweetEntry = require('webpack-sweet-entry');

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

    return {        
        plugins: pugPlugin,
        module: {
            rules: [
                {
                    test: /\.pug$/,
                    loader: 'pug-loader',
                    options: {
                        pretty: true
                    }
                }
            ]
        }
    }
}