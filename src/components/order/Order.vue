<template>
  <div>
    <!-- 面包屑导航区域 -->
    <GenCrumbs toPath="/home" firLev="首页" secoLev="订单管理" thirLev="订单列表"/>


    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input
            placeholder="请输入内容"
            class="search-input"
            size="medium"
            v-model="queryInfo.query"
            clearable
            @clear="getOrdersList"
          >
            <el-button
              icon="el-icon-search"
              slot="append"
              @click="getOrdersList"
            ></el-button> </el-input
        ></el-col>
      </el-row>
      <!-- 订单 表格区域 -->
      <el-table :data="ordersList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-tooltip
              class="item"
              effect="dark"
              content="修改订单地址"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditAddrDlg"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="查看物流信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="success"
                icon="el-icon-truck"
                size="mini"
                @click="showProgressDlg"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改订单地址 对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editAddrDlgVisible"
      width="40%"
      @close="editAddrDlgClose"
    >
      <el-form
        :model="editAddrFormInfo"
        :rules="editAddrFormRule"
        ref="editAddrFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县:" prop="addrBasic">
          <!-- 级联选择器 -->
          <el-cascader
            :options="cityData"
            v-model="editAddrFormInfo.addrBasic"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="详细地址:" prop="addrDesc">
          <el-input v-model="editAddrFormInfo.addrDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddrDlgVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddrDlgVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 物流进度 对话框 -->

    <el-dialog
      title="物流进度"
      :visible.sync="progressDlgVisible"
      width="40%"
    >

    <!-- 时间线 -->
     <el-timeline>
       <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>

      <span slot="footer" class="dialog-footer">
        <el-button @click="progressDlgVisible = false">取 消</el-button>
        <el-button type="primary" @click="progressDlgVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import GenCrumbs from '../general/GenCrumbs.vue'
import cityData from './citydata.js'
export default {
  name: 'OrderCompt',
  components: {
    GenCrumbs
  },
  data() {
    return {
      queryInfo: {
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 3,
        // 订单个数总计
      },

      total: 0,
      // 订单列表
      ordersList: [],
      // 控制修改地址对话框 显示/隐藏
      editAddrDlgVisible: false,
      // 修改地址 表单数据
      editAddrFormInfo: {
        addrBasic: [],
        addrDesc: '',
      },
      // 修改地址 表单验证规则
      editAddrFormRule: {
        addrBasic: [
          { required: true, message: '请选择 省市区/县', trigger: 'blur' },
        ],
        addrDesc: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
      // 导入的城市数据
      cityData,
      // 控制 物流进度对话框 显示/隐藏
      progressDlgVisible: false,
      // 物流信息
      progressInfo: [],

    }
  },
  created() {
    // 获取订单列表
    this.getOrdersList()
  },
  methods: {
    // 获取订单列表
    async getOrdersList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表数据失败!')
      }
      this.total = res.data.total
      this.ordersList = res.data.goods
    },
    // 每页大小改变 事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    // 处理当前页数改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      // 重新获取 订单列表
      this.getOrdersList()
    },
    // 点击 显示 修改地址对话框
    showEditAddrDlg() {
      this.editAddrDlgVisible = true
    },
    // 监听  关闭 修改地址对话框
    editAddrDlgClose() {
      this.$refs.editAddrFormRef.resetFields()
      this.editAddrDlgVisible = false
      this.progressInfo = []
    },
    // 点击显示 物流进度对话框
    async showProgressDlg() {
      // 获取物流信息
      // 1106975712662是测试的物流单号
      const { data: res} = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败!')
      }
      this.progressInfo = res.data
      this.progressDlgVisible = true
    },
  },
}
</script>

<style lang="less" scoped>

.el-cascader {
  width: 100%;
}
</style>
