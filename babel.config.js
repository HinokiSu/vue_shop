// 这个项目发布阶段需要用到的 babel 插件
const prodPlugins = []
if (process.env.NODE === 'production') {
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk',
      },
    ],
    // 发布产品的使用的插件数组
    ...prodPlugins,
    // 安装 路由懒加载 插件
    '@babel/plugin-syntax-dynamic-import'
  ],
}
