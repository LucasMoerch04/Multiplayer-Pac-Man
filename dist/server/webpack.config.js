"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
/** @type {import('webpack').Configuration} */
const config = {
    entry: './src/client/main.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(process.cwd(), 'public'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/client/index.html',
        }),
    ],
    mode: 'development',
};
module.exports = config;
