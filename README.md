# vue_shop
## 发布时使用的插件:
`@babel/plugin-syntax-dynamic-import`
`babel-plugin-transform-remove-console`

---
Errors:\n
1. 使用CDN引入 vue-quill-editor,prod版本上线后，
  控制台出现 一下错误
  `vue.min.js:6                   TypeError: s is not a constructor
    at a.initialize (vue-quill-editor.min.js:formatted:216)
    at a.mounted (vue-quill-editor.min.js:formatted:206)
    at He (vue.min.js:6)
    at Yt (vue.min.js:6)
    at Object.insert (vue.min.js:6)
    at k (vue.min.js:6)
    at a.__patch__ (vue.min.js:6)
    at a.e._update (vue.min.js:6)
    at a.r (vue.min.js:6)
    at fn.get (vue.min.js:6)`
🚧**分析:**
- 可能是引入的CDN有问题
⚓**解决方法:**
- 不使用CDN引入，直接引入该插件。
- 这个方法会增大依赖项size, chunkSize-> + 192.2, appSize-> +47.15‬