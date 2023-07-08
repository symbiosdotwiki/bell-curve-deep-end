module.exports = {
  configureWebpack: {
    module: {
      rules: [{ test: /\.hdr$/, use: "url-loader" }]
    }
  }
};