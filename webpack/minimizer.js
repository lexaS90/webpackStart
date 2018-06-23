const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = function(env, argv){
    let minimizer = [];

    if (argv.mode == 'production'){
        minimizer.push(new OptimizeCSSAssetsPlugin({}));
        minimizer.push(new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: false
          })
        );
    }

    return minimizer;
}

