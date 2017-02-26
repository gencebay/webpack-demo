var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src/build/main.js',
    output: {
        path: path.resolve(__dirname, 'wwwroot/js'),
        publicPath: "/wwwroot/",
        filename: "bundle.js"    
    }
};