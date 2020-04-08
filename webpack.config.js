const path = require('path')
const pkg = require('./package.json');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

// Get environment
const DEV_MODE = process.env.NODE_ENV.trim().toLowerCase() === 'development';

module.exports = {
    mode: DEV_MODE ? 'development' : 'production',
    devtool: DEV_MODE ? 'cheap-module-eval-source-map' : false,
    entry: {
        'script': path.resolve(__dirname, 'src/config/register-spa.js'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: DEV_MODE ? '[name].js' : '[name].[hash].min.js',
        libraryTarget: 'umd',
        library: pkg.name
    },
    module: {
        rules: [{
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/',
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            ///
            // .css, .scss, .sass files
            // ========================
            ///
            {
                test: /\.(c|sc|sa)ss$/,
                use: [{
                        loader: DEV_MODE ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: DEV_MODE ? true : false,
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: DEV_MODE ? true : false,
                        }
                    }
                ]
            },
            {
                test: /\.svg$/,
                use: 'svg-inline-loader?removeSVGTagAttrs=false',
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: ['url-loader?limit=10000', 'img-loader'],

            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader'
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.resolve(__dirname, 'src'),
            '@src': path.resolve(__dirname, 'src'),
            '@modules': path.resolve(__dirname, 'src', 'app', 'modules'),
            '@common': path.resolve(__dirname, 'src', 'app', 'common'),
            '@assets': path.resolve(__dirname, 'src', 'assets'),
            '@components': path.resolve(__dirname, 'src', 'app', 'components'),
            'hks-common': path.resolve(__dirname, 'hks-common')
        }
    },
    plugins: [
        ///
        // Delete build folder
        // ===================
        ///
        new CleanWebpackPlugin(),

        ///
        // Define global variables
        // =======================
        ///
        new webpack.DefinePlugin({
            PRODUCTION: DEV_MODE ? false : true,
        }),

        ///
        // Extract imported CSS to .css files
        // =======================
        ///
        new MiniCssExtractPlugin({
            filename: DEV_MODE ? '[name].[hash].css' : '[name].[hash].min.css',
        }),

        ///
        // Inject assets into HTML
        // =======================
        ///
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            filename: path.resolve(__dirname, 'dist/index.html'),
            inject: 'head',
            minify: DEV_MODE ? false : true,
        }),

        ///
        // Copy assets to build folder
        // ===========================
        ///
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'static'),
            to: path.resolve(__dirname, 'dist'),
        }]),


        ///
        // Forces webpack-dev-server program to write bundle files to the file system
        // ===================
        ///
        new WriteFilePlugin(),


        new VueLoaderPlugin(),
    ],
    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    },

    optimization: {
        minimize: DEV_MODE ? false : true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    output: {
                        comments: false,
                    },
                },
            }),
            new OptimizeCSSAssetsPlugin({}),
        ],
    },
}
