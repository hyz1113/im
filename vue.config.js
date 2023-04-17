const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,//是否使用eslint 默认true
  css: {
    loaderOptions: {
      sass: {
        prependData: [
          '@import "@/assets/styles/mixins.scss";',
          '@import "@/assets/styles/common.scss";',
        ].join(''),
      },
    },
  },
})
