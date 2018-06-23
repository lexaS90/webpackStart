module.exports = function(env, argv){
    
    let rules = [];

    // Babel in production mode
    if (argv.mode == 'production'){
        rules.push(
        {
            test: /\.js$/,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        "presets": ["env"]
                    }
                }
            ]
        });
    }
    
    return {
        
        module: {
            rules: rules
        }
    }
}