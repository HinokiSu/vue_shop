<template>
  <div>
    <!-- 面包屑 -->
    <GenCrumbs toPath="/home" firLev="首页" secoLev="权限管理" thirLev="权限列表" />

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 表格区域 -->
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <!-- 使用作用域插槽来自定义 -->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'"
              >二级</el-tag
            >
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import GenCrumbs from '../general/GenCrumbs'
export default {
  name: 'RigthsCompt',
  components: {
    GenCrumbs,
  },
  created() {
    // 获取所有权限列表
    this.getRightsList()
  },
  data() {
    return {
      // 权限列表
      rightsList: [],
    }
  },
  methods: {
    // 获取所有权限列表
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败!')
      }
      this.rightsList = res.data
    },
  },
}
</script>

<style lang="less" scoped></style>
