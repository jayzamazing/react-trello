const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const packageData = require('./package.json');
const minify = process.argv.indexOf('--minify') != -1;
var filename = [packageData.name, packageData.version, 'js'];
var cssname = ['styles', packageData.version, '.css'];
var plugins = [];
if (minify) {
    filename.splice(filename.length - 1, 0, 'min');
    cssname.splice(filename.length - 1, 0, 'min');
    plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }));
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      mangle: true,
      sourcemap: false,
      beautify: false,
    }));
    plugins.push(new webpack.optimize.DedupePlugin());
    plugins.push(new webpack.optimize.OccurenceOrderPlugin());
}
plugins.push(new ExtractTextPlugin(cssname.join('.')));
module.exports = {
    entry: path.join(__dirname, 'src', packageData.main),
    output: {
        path: path.join(__dirname, 'src', 'static', 'js'),
        filename: filename.join('.'),
    },
    devtool: 'source-map',
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          loader: 'babel-loader',
          query: {
            cacheDirectory: 'babel_cache',
            presets: ['react', 'es2015']
          }
        },
        {
          test: /.less$/,
          loader: ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: "css-loader!less-loader"
          })
        }
      ]
    },
    plugins: plugins
};
