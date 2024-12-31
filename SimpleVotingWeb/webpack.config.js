const path = require("path");

module.exports = {
  entry: "./src/setting.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    alias: {
      web3: require.resolve("web3"),
    },
  },
  mode: "development",
};
