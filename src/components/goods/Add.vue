<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- Tabs 标签页 区域 -->
      <el-form
        :model="addGoodsFormInfo"
        :rules="addGoodsFormRules"
        ref="addGoodsFormRef"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsFormInfo.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addGoodsFormInfo.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addGoodsFormInfo.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addGoodsFormInfo.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="类别" prop="goods_cat">
              <!-- 级联选择器 -->
              <el-cascader
                v-model="addGoodsFormInfo.goods_cat"
                :options="cateList"
                :props="cascaderProps"
                @change="handleCateChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTabData"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="val"
                  v-for="(val, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox
              ></el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="onlyItem.attr_name"
              v-for="onlyItem in onlyTabData"
              :key="onlyItem.attr_id"
            >
              <el-input v-model="onlyItem.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 表示图片上传到后台的API地址 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              :headers="headerObj"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor
              v-model="addGoodsFormInfo.goods_introduce"
            ></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 预览图片 对话框 -->
    <el-dialog
      title="预览图片"
      :visible.sync="previewDialogVisible"
      width="50%"
    >
      <img :src="previewPath" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
// 导入lodash
import _ from 'lodash'
export default {
  name: 'Add',
  data() {
    return {
      // 步骤条 当前索引
      activeIndex: '0',
      // 添加商品的表单数据对象
      addGoodsFormInfo: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: '',
        // 图片的数组
        pics: [],
        // 商品的详细描述
        goods_introduce: '',
        // 动态参数/静态属性
        attrs: [],
      },
      // 表单验证规则
      addGoodsFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },
      // 商品分类列表
      cateList: [],
      // 级联选择器，选中的分类
      selectedKeys: [],
      // 级联选择器，配置属性
      cascaderProps: {
        // 次级菜单的展开方式
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 商品参数tab 参数列表
      manyTabData: [],
      // 商品属性tab 属性列表
      onlyTabData: [],
      // 上传图片的URL
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的headers请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      // 预览图片暂存路径
      previewPath: '',
      // 控制 预览图片 对话框 显示/隐藏
      previewDialogVisible: false,
    }
  },
  created() {
    // 获取商品分类列表
    this.getCateList()
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
      this.cateList = res.data
    },
    // 级联选择器 选中项变化,会触发这个函数
    handleCateChange() {
      // 限定只能选择三级分类
      if (this.addGoodsFormInfo.goods_cat.length !== 3) {
        this.addGoodsFormInfo.goods_cat = []
      }
    },
    // 标签页 切换
    beforeTabLeave(activeName, oldActiveName) {
      if (
        oldActiveName === '0' &&
        this.addGoodsFormInfo.goods_cat.length !== 3
      ) {
        this.$message.error('请先选择商品分类!')
        return false
      }
    },
    // 获取商品参数
    async getGoodsParams(paramsType) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: paramsType,
          },
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败!')
      }
      return res.data
    },
    // 标签页点击
    async tabClicked() {
      // 访问动态参数tab
      if (this.activeIndex === '1') {
        // 获取动态参数
        const manyRes = await this.getGoodsParams('many')
        // 将参数 转换位为 数组
        manyRes.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTabData = manyRes
      } else if (this.activeIndex === '2') {
        // 获取静态属性
        const onlyRes = await this.getGoodsParams('only')
        this.onlyTabData = onlyRes
        console.log(onlyRes)
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      // 获取预览图片路径
      this.previewPath = file.response.data.url
      this.previewDialogVisible = true
    },
    // 处理移除图片的操作
    handleRemove(file) {
      // 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 从pics数组中，找到这个图片对应的索引值
      const i = this.addGoodsFormInfo.pics.findIndex((x) => x.pic === filePath)
      // 移除pics数组中的 该图片元素
      this.addGoodsFormInfo.pics.splice(i, 1)
      this.$message.success('移除图片成功!')
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      // 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 将图片信息对象，push到pics数组中
      this.addGoodsFormInfo.pics.push(picInfo)
      this.$message.success('添加图片成功!')
    },
    // 添加商品 按钮
    addGoods() {
      this.$refs.addGoodsFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请填写必要的表单项!')

        // 处理动态参数
        this.manyTabData.forEach((item) => {
          // 注意： attr_vals是数组，server只接收 字符串
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          }
          this.addGoodsFormInfo.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTabData.forEach((item) => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addGoodsFormInfo.attrs.push(newInfo)
        })
        /* 处理goods_cat ，将其转化为字符串， 
        因为级联选择器使用该参数，且为列表形式，就会throw error, 所以使用deepClone 
      */
        // 深拷贝(cloneDeep)
        const form = _.cloneDeep(this.addGoodsFormInfo)
        form.goods_cat = form.goods_cat.join(',')

        // 发起请求添加商品
        // 商品的名称，必须是唯一的
        console.log(form);
        const { data: res } = await this.$http.post('goods', form)
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败!')
        }
        this.$message.success('添加商品成功!')
        // 跳转至商品列表
        this.$router.push('/goods')
      })
    },
  },
  computed: {
    cateId() {
      if (this.addGoodsFormInfo.goods_cat.length === 3) {
        return this.addGoodsFormInfo.goods_cat[2]
      } else return null
    },
  },
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>
