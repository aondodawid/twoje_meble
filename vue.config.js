const path = require("path");
const { InjectManifest } = require("workbox-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  css: {
    extract: false,
  },
  productionSourceMap: true,
  devServer: {
    client: false,
    hot: false,
    liveReload: false,
    webSocketServer: false,
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    plugins: [
      new InjectManifest({
        swSrc: path.resolve(__dirname, "src/service-worker/service-worker.js"),
        swDest: "service-worker.js",
        exclude: [/data\/.*\.json$/],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      }),
    ],
  },
};
