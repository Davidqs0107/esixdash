import { mergeWithRules } from "webpack-merge";
import commonConfig = require("./webpack.common");
import developmentConfig = require("./webpack.dev");
import productionConfig = require("./webpack.prod");

module.exports = () => {
  let config;
  if (process.env.NODE_ENV === "production") config = productionConfig;
  if (process.env.NODE_ENV === "development") config = developmentConfig;
  if (config === undefined)
    throw new Error("No matching configuration was found!");

  const mergedConfig = mergeWithRules({
    module: {
      rules: {
        test: "match",
        use: {
          loader: "match",
          options: "replace",
        },
      },
    },
  })(commonConfig, config);
  // Because we use export default to include these files we need to dereference the top level default import
  // @ts-ignore
  return mergedConfig.default;
};
