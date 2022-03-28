const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { LoaderOptionsPlugin } = require('webpack');

module.exports = {
    mode: 'development',
    entry: {
        main: path.resolve(__dirname, 'src/js/app.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        assetModuleFilename: '[name][ext]',
        clean: true
    },

    //devserver
    devtool: 'inline-source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist')
        },
        compress: true,
        port: 9000,
        open: true,
        hot: true,
        liveReload: true
    },

    //loaders
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(svg|ico|png|webp|jpg|gif|jpeg)$/, 
                type:'asset/resource',
               
            },
            {
                test: /\.scss$/, 
                use: ['style-loader','css-loader', 'sass-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                // HTML LOADER
                test: /\.html$/,
                loader: 'html-loader',
            }
        ]
    },


    //plugins
    plugins: [
    new HtmlWebpackPlugin(
    {
      title: '',
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/index.html')
    }),
     new HtmlWebpackPlugin(
    {
      title: '',
      filename: 'form.html',
    //   inject: true,
    //   chunks: ['app'],
      template: path.resolve(__dirname, 'src/form.html')
    }),
  ],

}