<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-button type="primary" @click="showAddCateDialog"
          >添加分类</el-button
        >
      </el-row>

      <!-- 表格 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :select-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag type="primary" size="mini" v-if="scope.row.cat_level === 0"
            >一级</el-tag
          >
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="showEditCateDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 表单 -->
      <el-form
        :model="addCateFormInfo"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
        size="medium"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateFormInfo.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- 级联选择器   options用来指定数据源 props用来指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->

    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="40%"
      @close="editCateDialogClosed"
    >
      <el-form
        :model="editCateFormInfo"
        :rules="editCateFormRules"
        ref="editCateFormRef"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateFormInfo.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  created() {
    this.getCateList()
  },
  data() {
    return {
      // 商品分类 分页
      queryInfo: {
        // 下列属性必须与接口请求参数名一致
        type: 3, // 3:表示 查看所有层(1,2,3), 2:表示查看(1,2)层 , 1:表示查看1层
        pagenum: 1,
        pagesize: 5,
      },
      // 商品分类的数据列表，默认为空
      cateList: [],
      // 总数据条数
      total: 0,
      // 为Table指定列的定义
      columns: [
        { lable: '分类名称', prop: 'cat_name' },
        // 将当前列定义为模板列， 当前这一列使用模板的名称
        { label: '是否有效', type: 'template', template: 'isok' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'opt' },
      ],

      // 控制 添加分类 对话框的 显示/隐藏
      addCateDialogVisible: false,
      // 添加分类 表单数据对象
      addCateFormInfo: {
        cat_pid: 0,
        cat_name: '',
        // 分类的等级， 默认添加一级分类
        cat_level: 0,
      },
      // 添加分类 验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      // 父级列表的数据列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        // 次级菜单的展开方式
        expandTrigger: 'hover',
        // 选中的值
        value: 'cat_id',
        // 看到的值
        label: 'cat_name',
        // 指定父子嵌套的属性
        children: 'children',
      },
      // 选中的父级分类的 ID　数组
      selectedKeys: [],

      // 控制编辑分类对话框的 显示/隐藏
      editCateDialogVisible: false,
      // 编辑分类表单的数据对象
      editCateFormInfo: {
        cat_id: 0,
        cat_name: '',
      },
      // 编辑分类 表单验证规则
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败!')
      }
      // 把数据列表，赋值给cateList
      this.cateList = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum 改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击打开 添加分类对话框
    showAddCateDialog() {
      // 获取父级分类的数据列表
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取 父级分类 的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: {
          // 显示的分类级别， 二级
          type: 2,
        },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父分类失败!')
      }
      this.parentCateList = res.data
    },

    // 选择项发生变化，触发该函数
    parentCateChanged() {
      // 若 selectedKeys 数组中的length > 0 ，则说明选中了父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的ID
        this.addCateFormInfo.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级 赋值
        this.addCateFormInfo.cat_level = this.selectedKeys.length
        return
      } else {
        // 父级分类的ID
        this.addCateFormInfo.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateFormInfo.cat_level = 0
      }
    },
    // 点击按钮 添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateFormInfo
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败!')
        }
        this.$message.success('添加分类成功!')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听关闭 添加分类对话框
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateFormInfo.cat_level = 0
      this.addCateFormInfo.cat_pid = 0
      this.addCateDialogVisible = false
    },
    // 点击展示 编辑分类 对话框
    async showEditCateDialog(id) {
      // 根据id查询该分类
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询该分类失败!')
      }

      this.editCateFormInfo.cat_id = res.data.cat_id
      this.editCateFormInfo.cat_name = res.data.cat_name
      this.editCateDialogVisible = true
    },
    // 编辑分类表单处理
    editCate() {
      this.$refs.editCateFormRef.validate(async (valid) => {
        if (!valid) return

        const { data: res } = await this.$http.put(
          'categories/' + this.editCateFormInfo.cat_id,
          this.editCateFormInfo
        )
        if (res.meta.status !== 200) {
          return this.$message.error('编辑该分类失败!')
        }
        this.$message.success('编辑该分类成功!')
        this.getCateList()
        this.editCateDialogVisible = false
      })
    },
    // 监听 关闭编辑分类对话框
    editCateDialogClosed() {
      this.$refs.editCateFormRef.resetFields()
      this.editCateFormInfo.cat_name = ''
      this.editCateFormInfo.cat_id = 0
    },

    // 删除分类表单处理
    async removeCate(id) {
      this.$confirm('此操作将永久删除该分类,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('categories/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error('删除该分类失败!')
          }
          this.$message.success('删除该分类成功!')
          this.getCateList()
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消删除' })
        })
    },
  },
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
</style>
