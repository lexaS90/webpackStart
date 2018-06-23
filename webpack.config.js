const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackSweetEntry = require('webpack-sweet-entry');

const script = require('./webpack/script');
const pug = require('./webpack/pug');
const style = require('./webpack/style');
const minimizer = require('./webpack/minimizer');
const images = require('./webpack/images');
const devserver = require('./webpack/devserver');
const fonts = require('./webpack/fonts');

global.$ = {
    PATH: {
        source: path.join(__dirname, 'src'),
        build: path.join(__dirname, 'dist'),
    }
}

module.exports = function(env, argv){
    
    const common = merge(
        [
            {
                optimization: {
                    minimizer: minimizer(env, argv)
                },
                
                entry: {
                    'js/app.js': $.PATH.source + '/scripts/app.js',
                },
                devtool: 'inline-source-map',
                output: {
                    path: $.PATH.build,
                    filename: '[name]',
                }
            }            
    
        ]
    );

    return merge([
        common,        
        images(env, argv),
        pug(env, argv),
        style(env, argv),
        devserver(),
        fonts()
    ]);
}