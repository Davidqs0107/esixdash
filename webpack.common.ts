/*
 * Copyright (c) 2015-2021, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * THIS IS CONFIDENTIAL AND PROPRIETARY TO EPISODE SIX, and any
 * copying, reproduction, redistribution, dissemination, modification, or
 * other use, in whole or in part, is strictly prohibited without the prior
 * written consent of (or as may be specifically permitted in a fully signed
 * agreement with) Episode Six.   Violations may result in severe civil and/or
 * criminal penalties, and Episode Six will enforce its rights to the maximum
 * extent permitted by law.
 *
 */

import HtmlWebPackPlugin = require("html-webpack-plugin");
import webpack from "webpack";
import Dotenv from "dotenv-webpack";
import path = require("path");
import { WebpackManifestPlugin } from "webpack-manifest-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

const brandPath = `src/whitelabel/${process.env.APP_BRAND}`;

const commonConfig = {
  entry: `${__dirname}/src/index.tsx`,
  output: {
    filename: "[name].[contenthash].js",
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(woff|woff2)$/i,
        // More information here https://webpack.js.org/guides/asset-modules/
        type: "asset",
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        exclude: /node_modules/,
        use: ["file-loader?name=[name].[ext]"], // ?name=[name].[ext] is only necessary to preserve the original file name
      },
    ],
  },
  target: "web",
  resolve: {
    modules: [brandPath, "src/whitelabel/default", "node_modules"],
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    symlinks: false,
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "public/index.html",
      filename: "index.html",
      favicon: "public/favicon.svg",
    }),
    new WebpackManifestPlugin({
      fileName: "public/manifest.json",
    }),
    new webpack.EnvironmentPlugin(["NODE_ENV"]),
    new Dotenv({
      systemvars: true,
    }),
    new CleanWebpackPlugin(),
  ],
  optimization: {
    moduleIds: "deterministic",
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
};

export default commonConfig;
