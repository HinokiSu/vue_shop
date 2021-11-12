module.exports = {
  chainWebpack: (config) => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', (config) => {
      // 项目入口文件
      config.entry('app').clear().add('./src/main-prod.js')
      // 配置加载外部CDN 资源
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        // 'vue-quill-editor': 'VueQuillEditor',
      })
      // 配置主页 标题
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })

    })

    // 开发模式
    config.when(process.env.NODE_ENV === 'development', (config) => {
      // 配置入口文件
      config.entry('app').clear().add('./src/main-dev.js')
      // 配置主页 标题
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })

  },
}
