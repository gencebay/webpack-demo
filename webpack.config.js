const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");

const isDevServer = process.argv[1].indexOf("webpack-dev-server") !== -1;

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
  plugins: getPlugins(isDevServer),
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

function getPlugins(isDevServer) {
  const htmlTitle = "Development";
  var plugins = [];

  plugins.push(new CleanWebpackPlugin(["wwwroot/bundle.js"]));

  if (isDevServer) {
    console.log("===Build: webpack-dev-server");
    plugins.push(
      new HtmlWebpackPlugin({
        title: htmlTitle,
        filename: "./wwwroot/index.html"
      })
    );
  }

  plugins.push(new webpack.NamedModulesPlugin());
  plugins.push(new webpack.HotModuleReplacementPlugin());

  return plugins;
}
