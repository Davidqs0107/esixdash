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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const devConfig = {
  mode: "development",
  devtool: "inline-source-map",
  // devtool: "eval-source-map",
  devServer: {
    hot: true,
    port: 9000,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: [
              "react-refresh/babel",
              "@babel/plugin-syntax-dynamic-import",
              "@babel/plugin-transform-runtime",
            ],
          },
        },
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            getCustomTransformers: ["ReactRefreshTypescript"],
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      "react-dom": "@hot-loader/react-dom",
    },
  },
  plugins: [new ReactRefreshPlugin()],
};

export default devConfig;
