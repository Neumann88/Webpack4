const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const {
    CleanWebpackPlugin
} = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const opt = () => {
    const config = {
        splitChunks: {
            chunks: "all"
        }
    }
    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }
    return config
}

module.exports = {
    entry: ["@babel/polyfill", "./src/index.js"],
    output: {
        filename: "[name].[hash].js",
        path: path.resolve(__dirname, "dist")
    },
    optimization: opt(),
    devServer: {
        port: 4200,
        hot: isDev
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html",
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new HtmlWebpackPugPlugin(),
        /*new HTMLWebpackPlugin({
            template: "./src/index.pug",
            minify: {
                collapseWhitespace: isProd
            }
        }),*/
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [{
                from: path.resolve(__dirname, "./src/img/favicon.ico"),
                to: path.resolve(__dirname, "dist")
            }]
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[hash].css"
        })
    ],
    module: {
        rules: [{
                test: /\.css$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: isDev,
                        reloadAll: true
                    },
                }, "css-loader"]
            }, {
                test: /\.(png|jpeg|gif)$/,
                use: ["file-loader"]
            }, {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ["file-loader"]
            },
            {
                test: /\.pug$/,
                loader: 'pug-loader',
                options: {
                    pretty: true
                }
            }, {
                test: /\.xml$/,
                use: ["xml-loader"]
            }, {
                test: /\.csv$/,
                use: ["csv-loader"]
            }, {
                test: /\.less$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: isDev,
                        reloadAll: true
                    },
                }, "css-loader", "less-loader"]
            }, {
                test: /\.s[ac]ss$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: isDev,
                        reloadAll: true
                    },
                }, "css-loader", "sass-loader"]
            }, {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-typescript"]
                    }
                }
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"]
                    }
                }
            }
        ]
    }
}