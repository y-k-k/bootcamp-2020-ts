module.exports = {
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    path: __dirname + "/dist",
    filename: "main.js",
  },
  entry: {
    main: __dirname + "/js/index.ts",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "ts-loader",
      },
    ],
  },
  devtool: "sourcemap",
};
