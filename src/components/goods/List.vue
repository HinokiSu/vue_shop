<template>
  <div>
    <!-- 面包屑导航区域 -->
    <GenCrumbs toPath="/home" firLev="首页" secoLev="商品管理" thirLev="商品列表"/>

    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input
            placeholder="请输入内容"
            class="search-input"
            size="medium"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              icon="el-icon-search"
              slot="append"
              @click="getGoodsList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <!-- 添加商品按钮 -->
          <el-button type="primary" size="medium" @click="goAddPage"
            >添加商品</el-button
          ></el-col
        >
      </el-row>

      <!-- 商品列表表格 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="110px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_number"
          width="80px"
        ></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="160px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditGoodsDialog(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeGoodsById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="goodsTotal"
        background
      >
      </el-pagination>

      <!-- 编辑商品对话框 -->
      <el-dialog
        title="编辑商品"
        :visible.sync="editGoodsDialogVisible"
        width="50%"
        @close="editDialogClose"
      >
        <!-- 编辑商品 标签页 -->
        <el-form
          :model="editFormInfo"
          :rules="editFormRules"
          ref="editFormRef"
          label-position="left"
          label-width="80px"
        >
          <!-- 标签页 -->
          <el-tabs v-model="activeIndex" @tab-click="handleTablick">
            <el-tab-pane label="商品基本信息" name="0">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="editFormInfo.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input
                  type="number"
                  v-model="editFormInfo.goods_price"
                ></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input
                  type="number"
                  v-model="editFormInfo.goods_number"
                ></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input
                  type="number"
                  v-model="editFormInfo.goods_weight"
                ></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="1">
              <el-form-item
                :label="item.attr_name"
                v-for="item in goodsManyData"
                :key="item.attr_id"
              >
                <!-- 多选框组 -->
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox
                    :label="val"
                    v-for="(val, i) in item.attr_vals"
                    :key="i"
                  ></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2"></el-tab-pane>
            <el-tab-pane label="商品图片" name="3"></el-tab-pane>
            <el-tab-pane label="商品内容" name="4"></el-tab-pane>
          </el-tabs>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editGoodsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editGoodsDialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import GenCrumbs from '../general/GenCrumbs.vue'
export default {
  name: 'ListCompt',
  components: {
    GenCrumbs
  },
  created() {
    this.getGoodsList()
  },
  data() {
    return {
      // 请求信息
      queryInfo: {
        // 查询参数
        query: '',
        // 当前页数
        pagenum: 1,
        // 每页显示的条数
        pagesize: 5,
      },
      // 商品列表
      goodsList: [],
      // 商品总条数
      goodsTotal: 0,
      // 控制 编辑商品对话框的 显示/隐藏
      editGoodsDialogVisible: false,
      // 编辑表单 表单中的数据
      editFormInfo: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: [],
        attrs: [],
      },
      // 商品的 动态参数
      goodsManyData: [],
      goodsOnlyData: [],

      // 编辑表单的 校验规则
      editFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
      },
      // 商品分类ID
      cateId: 0,
      /* 标签页 tabs */
      // 标签页当前索引
      activeIndex: 0,
    }
  },
  methods: {
    // 获取商品列表数据
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败!')
      }
      this.goodsList = res.data.goods
      this.goodsTotal = res.data.total
    },
    /* 分页 */
    // 处理切换分页大小, 只要触发该函数就会获得新的页大小参数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 处理当前页码值改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 删除选中的商品
    async removeGoodsById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品,是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete('goods/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败!')
      }
      this.$message.success('删除商品成功!')
      this.getGoodsList()
    },
    // 跳转到添加商品页面
    goAddPage() {
      this.$router.push('/goods/add')
    },
    // 点击 显示 编辑商品对话框
    async showEditGoodsDialog(id) {
      // 获取商品的信息
      const { data: res } = await this.$http.get('goods/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品信息失败!')
      }
      const {
        cat_id,
        goods_name,
        goods_price,
        goods_number,
        goods_weight,
        goods_introduce,
        pics,
        attrs,
      } = res.data

      this.cateId = cat_id
      this.editFormInfo = {
        goods_name,
        goods_price,
        goods_number,
        goods_weight,
        goods_introduce,
        pics,
        attrs,
      }
      this.editFormInfo.attrs.forEach((item) => {
        // 将商品自身的动态参数/静态属性 分别存放
        if (item.attr_sel === 'many') {
          this.goodsManyData.push(item)
        } else {
          this.goodsOnlyData.push(item)
        }
      })
      console.log('many', this.goodsManyData)
      console.log('only', this.goodsOnlyData)
      // 显示 编辑对话框
      this.editGoodsDialogVisible = true
    },
    // 监听对话框关闭
    editDialogClose() {
      this.activeIndex = '0'
      this.$refs.editFormRef.resetFields()
      this.goodsManyData = []
      this.editFormInfo = {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: [],
        attrs: [],
      }
      this.editGoodsDialogVisible = false
    },

    /* 标签页 相关函数 */

    // 处理点击标签页
    async handleTablick() {
      // 访问动态参数tab
      if (this.activeIndex === '1') {
        // 该商品分类中的所有动态参数
        this.goodsManyData.forEach((item) => {
          // 将 该商品所在的分类参数 按空格切割 转换为 数组
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          // 商品自身 已有的 动态参数
          item.attr_value =
            item.attr_value.length === 0 ? [] : item.attr_value.split(' ')
        })
      } else if (this.activeIndex === '2') {
        console.log(this.goodsOnlyData);
      } 
    },
  },
}
</script>

<style lang="less" scoped></style>
