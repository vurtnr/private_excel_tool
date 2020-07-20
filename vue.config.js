const devServerPort = 8007

module.exports = {
  publicPath: "/",
  lintOnSave: process.env.NODE_ENV === "development",
  productionSourceMap: false,
  devServer: {
    port: devServerPort,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    progress: false,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: "http://localhost:3008",
        changeOrigin: true, 
        ws: true, 
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_API]: "",
        },
      },
    },
  },
};