const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");

const htmlTitle = "Development";

let htmlWebpackPlugin = new HtmlWebpackPlugin({
  title: htmlTitle
});

const isDevServer = process.argv[1].indexOf("webpack-dev-server") !== -1;
if (isDevServer) {
  htmlWebpackPlugin = new HtmlWebpackPlugin({
    title: htmlTitle,
    filename: "./wwwroot/index.html"
  });
}

module.exports = {
  entry: "./src/Main.ts",
  resolve: {
    // prettier-ignore
    extensions: ['.scss', '.ts', '.js']
  },
  devtool: "inline-source-map",
  devServer: {
    hot: true,
    // prettier-ignore
    contentBase: path.resolve(__dirname, 'wwwroot')
  },
  plugins: [
    new CleanWebpackPlugin(["wwwroot/bundle.js"]),
    htmlWebpackPlugin,
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "wwwroot")
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: "awesome-typescript-loader"
      },
      {
        test: /\.scss$/,
        loader: "sass-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};
