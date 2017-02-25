var path = require('path');

module.exports = {
    entry: './build/main.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'wwwroot/js')
    }
};