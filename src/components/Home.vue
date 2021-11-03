<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
  export default {
    name: 'Home',
    methods: {
      /* 退出功能实现原理
        1. 基于token的方式实现退出比较简单，只需要销毁本地的token即可，
        2. 这样，后续的请求就不会携带token，必须重新登录生成一个新的token之后 才可以访问页面
      */
      logout() {
        // 清除sessionStorage中的数据(token)
        window.sessionStorage.clear();
        // 重定向页面
        this.$router.push('/login')
      }
    }
  }
</script>

<style lang="less" scoped>
  
</style>