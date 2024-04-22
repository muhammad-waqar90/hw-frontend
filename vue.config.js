const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
});

module.exports = {
  chainWebpack: (config) => {
    const svgRule = config.module.rule("svg");

    svgRule.uses.clear();

    svgRule.delete("type");
    svgRule.delete("generator");

    svgRule
      .use("babel-loader")
      .loader("babel-loader")
      .end()
      .use("vue-svg-loader")
      .loader("vue-svg-loader");
  },
  devServer: {
    client: {
      webSocketURL: "auto://0.0.0.0:0/ws",
    },
  },
};
