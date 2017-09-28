var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

module.exports = {

    entry: ['./client/index.js'],

    output: {
        publicPath: '/public/',
        path: path.join(__dirname, 'public'),
        filename:'bundle.js'
    },

    devServer: {
        contentBase: [path.join(__dirname), path.join(__dirname, 'publics')]
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: { presets: ['react', 'es2015'] }
                }
            },
            {
                test: /\.scss$/,
                exclude: /(node_modules)/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                    "postcss-loader"
                ]
            },

            {
                test: /\.(png|jpg|svg)$/,
                exclude: /(node_modules)/,
                use: [{
                    loader: 'url-loader',
                    options: { limit: 10000 }
                }]
            },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?(\?.*$|$)/,
              loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
     { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?(\?.*$|$)/, loader: 'file-loader' },
     {
         test: /\.css$/,

         use: [
             "style-loader",
             "css-loader"
         ]
     },
        ]
    },


    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    autoprefixer(),
                ]
            }
        })
    ]
};
