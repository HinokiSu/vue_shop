<template>
  <div>
    <!-- 面包屑导航区域 -->
    <GenCrumbs toPath="/home" firLev="首页" secoLev="商品管理" thirLev="商品参数"/>


    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意: 只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col :span="3">
          <span>选择商品分类: </span>
          <!-- 选择商品分类的级联选择框 -->
        </el-col>
        <el-col :span="4">
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleCateChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="showAddParamDialog"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleTagClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInputRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                  <!-- 添加tag 按钮 -->
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditParamDialog(scope.row.attr_id)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParam(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="showAddParamDialog"
            >添加参数</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" stripe border>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleTagClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInputRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                  <!-- 添加tag 按钮 -->
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditParamDialog(scope.row.attr_id)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParam(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + currentTabTitel"
      :visible.sync="addParamDialogVisible"
      width="40%"
      @close="addParamDialogClose"
    >
      <!-- 添加参数表单 -->
      <el-form
        :model="addParamFormInfo"
        :rules="addParamFormRules"
        ref="addParamFormRef"
        label-width="100px"
      >
        <el-form-item :label="currentTabTitel" prop="attr_name">
          <el-input v-model="addParamFormInfo.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParam">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数对话框 -->
    <el-dialog
      title="编辑参数"
      :visible.sync="editParamDialogVisible"
      width="40%"
      @close="editParamDialogClose"
    >
      <!-- 编辑参数表单 -->
      <el-form
        :model="editParamFormInfo"
        :rules="editParamFormRules"
        ref="editParamFormRef"
        label-width="100px"
      >
        <el-form-item :label="currentTabTitel" prop="attr_name">
          <el-input v-model="editParamFormInfo.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParam">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import GenCrumbs from '../general/GenCrumbs.vue'
export default {
  name: 'ParamsCompt',
  components: {
    GenCrumbs
  },
  created() {
    // 获取所有商品分类列表数据
    this.getCateList()
  },
  data() {
    return {
      // 所有商品分类列表
      cateList: [],
      // 级联选择框的配置对象
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 选择商品分类的级联选择框
      selectedCateKeys: [],
      /* 页签 */
      // 被激活的页签的名称
      activeName: 'many',
      // 动态参数列表
      manyTableData: [],
      // 静态属性列表
      onlyTableData: [],

      /* 添加参数对话框 */
      // 控制显示对话框 显示/隐藏
      addParamDialogVisible: false,
      // 添加参数表单中数据
      addParamFormInfo: {
        attr_name: '',
        attr_sel: '',
      },
      // 添加参数表单 验证规则
      addParamFormRules: {
        attr_name: [
          {
            required: true,
            message: `请输入参数/属性名称!`,
            trigger: 'blur',
          },
        ],
      },

      /* 编辑参数对话框 */
      // 控制 编辑参数对话框 显示/隐藏
      editParamDialogVisible: false,
      // 编辑参数表单数据对象
      editParamFormInfo: {
        attr_name: '',
        attr_sel: '',
      },
      // 暂存 选中编辑参数对象attr_id
      attrId: 0,
      // 编辑参数表单 验证规则
      editParamFormRules: {
        attr_name: [
          { required: true, message: '请输入属性的名字', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    // 获取所有的商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { type: 3 })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败!')
      }
      this.cateList = res.data
    },
    // 处理级联选择框 选中项改变，触发该函数
    handleCateChange() {
      this.getParamsData()
    },
    // tab页签点击事件的处理函数
    handleTabClick() {
      // 切换tab 获取动态/静态参数列表数据
      this.getParamsData()
    },
    // 获取参数列表数据
    async getParamsData() {
      // 选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      } else {
        // 选中的是三级分类
        // 请求分类参数列表
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: this.activeName,
            },
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品参数列表失败!')
        }
        // 遍历每一个参数的 attr_vals，将参数中的attr_vals从字符串转换为数组
        res.data.forEach((item) => {
          // 解决添加参数后带有空tag，空字符串 .split(' ')之后 返回 [""]
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          /* 解决点击添加tag按钮，其他参数与其同步显示 */
          // 控制文本框的显示/隐藏
          item.inputVisible = false
          // 文本框中输入的值
          item.inputValue = ''
        })

        // 判断是动态参数/静态属性
        if (this.activeName === 'many') {
          this.manyTableData = res.data
        } else {
          // 静态属性
          this.onlyTableData = res.data
        }
      }
    },
    // 展示 添加参数对话框
    showAddParamDialog() {
      this.addParamFormInfo.attr_sel = this.activeName

      this.addParamDialogVisible = true
    },
    // 触发提交添加参数
    addParam() {
      this.$refs.addParamFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          this.addParamFormInfo
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败!')
        }
        this.getParamsData()
        this.$message.success('添加参数成功!')
        this.addParamDialogVisible = false
      })
    },
    // 添加参数对话框 关闭事件
    addParamDialogClose() {
      this.$refs.addParamFormRef.resetFields()
      this.addParamFormInfo.attr_name = ''
      this.addParamFormInfo.attr_sel = ''
      this.addParamDialogVisible = false
    },
    // 展示 编辑参数对话框
    showEditParamDialog(attrId) {
      this.attrId = attrId
      this.editParamFormInfo.attr_sel = this.activeName
      this.editParamDialogVisible = true
    },
    // 编辑参数参数 确认触发
    editParam() {
      console.log(this.editParamFormInfo)
      this.$refs.editParamFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.attrId}`,
          this.editParamFormInfo
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败!')
        }
        this.getParamsData()
        this.$message.success('修改参数成功!')
        this.editParamDialogVisible = false
      })
    },
    // 编辑参数对话框 关闭触发
    editParamDialogClose() {
      this.$refs.editParamFormRef.resetFields()
      this.attrId = 0
      this.editParamFormInfo.attr_name = ''
      this.editParamFormInfo.attr_sel = ''
      this.editParamDialogVisible = false
    },
    // 删除参数
    async removeParam(attrId) {
      this.$confirm('此操作将永久删除该参数,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `categories/${this.cateId}/attributes/${attrId}`
          )
          if (res.meta.status !== 200) {
            return this.$message.error('删除该参数失败!')
          }
          this.$message.success('删除该参数成功!')
          this.getParamsData()
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消删除' })
        })
    },

    // 文本框失去焦点，或按下Enter 会触发
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 若没有return ,则说明输入的内容，需要做后续处理
      // 在参数中的值列表 追加一个新的值
      row.attr_vals.push(row.inputValue.trim())
      // 清空
      row.inputValue = ''
      // 切换为 tag
      row.inputVisible = false
      // 提交追加的参数的新可选项
      this.saveAttrVals(row)
    },
    // 将对 attr_vals 的操作，保存到数据库中
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' '),
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数可选项失败!')
      }
      this.$message.success('修改参数可选项成功!')
    },
    // 点击按钮，展示文本输入框
    showInput(row) {
      row.inputVisible = true
      // 让文本框自动获取焦点
      /* $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码 */
      // eslint-disable-next-line no-unused-vars
      this.$nextTick( _ => {
        this.$refs.saveTagInputRef.$refs.input.focus()
      })
    },
    // 关闭tag 触发删除tag，删除指定的已有的参数可选项
    handleTagClose(i, row) {
      // .splice 会修改原数组
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    },
  },
  computed: {
    // 如果按钮需要被禁用，则return true, 否则return false
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的ID
    cateId() {
      // 选中三级分类
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 添加参数对话框标题
    currentTabTitel() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    },
  },
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}

.input-new-tag {
  width: 150px;
}
</style>
