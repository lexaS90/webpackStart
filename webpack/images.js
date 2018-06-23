//import ImageminPlugin from 'imagemin-webpack-plugin'
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default



module.exports = function(env, argv) {

    return {
        module: {
            rules: [
                {
                    test: /\.(png|jpe?g|gif|svg)$/,
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                        context: $.PATH.source,
                        publicPath: '../'
                    }
                }
            ]
        },

        plugins: [
          // Copy the images folder and optimize all the images
        new CopyWebpackPlugin([{
        from: $.PATH.source + '/images/',
        to: $.PATH.build + '/images/',
        }]),
        new ImageminPlugin({
            test: /\.(jpe?g|png|gif|svg)$/i,
            disable: argv.mode == 'development',
        })
        ]
      }

}


// module.exports = function(env, argv) {
//     return {
//         module: {
//             rules: [
//                 {
//                     test: /\.(png|jpe?g|gif|svg)$/,
//                     loader: 'file-loader',
//                     options: {
//                         name: '[path][name].[ext]',
//                         context: $.PATH.source,
//                         publicPath: '/'
//                     }
//                 }
//             ]
//         },
//         plugins: [
//             new ImageminPlugin({
//                 disable: false, // Disable during development
//                 pngquant: {
//                   quality: '95-100'
//                 }
//             })
//         ]
//     };
// };