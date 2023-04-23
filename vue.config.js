const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    historyApiFallback: true,
    allowedHosts: 'all',
    port: 8081,
    proxy: {
      '/kol': {
        // 由于我们上面在请求头里有添加 gatwat 所以能拦截
        target: 'http://hbg-kol-crm-gateway.global-base.tc-jp1.huobiapps.com', // 接口域名
        // secure: false,   // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/kol': '',
        },
      },
    },
    // https: true,
  },
  lintOnSave: false,
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
