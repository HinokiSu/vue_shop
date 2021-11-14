<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: toPath }">{{firLev}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{secoLev}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{thirLev}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'GenCrumbsCompt',
  props: {
    // 第一级to路由地址
    toPath: {
      type: String,
      requried: true,
      default: '/home'
    },
    // 第一级导航
    firLev: {
      type: String,
      required: true,
      default: '首页'
    },
    // 第二级
    secoLev: {
      type: String, 
     required: true,
    },
    // 第三级
    thirLev: {
      type: String,
      required: true
    }
  },
}
</script>
