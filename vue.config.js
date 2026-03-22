const path = require("path");
const { InjectManifest } = require("workbox-webpack-plugin");

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
  configureWebpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };

    config.plugins.push(
      new InjectManifest({
        swSrc: path.resolve(__dirname, "src/service-worker/service-worker.js"),
        swDest: "service-worker.js",
        exclude: [/data\/.*\.json$/],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      }),
    );

    // Strip the InjectManifest "called multiple times" warning in watch/serve
    // mode. The warning is pushed to compilation.warnings (not console.warn),
    // so the only reliable way to suppress it is via a compiler hook.
    if (process.env.NODE_ENV !== "production") {
      config.plugins.push({
        apply(compiler) {
          compiler.hooks.afterEmit.tap(
            "SuppressInjectManifestWarning",
            (compilation) => {
              compilation.warnings = compilation.warnings.filter(
                (w) =>
                  !/InjectManifest has been called multiple times/.test(
                    w.message,
                  ),
              );
            },
          );
        },
      });
    }
  },
};
