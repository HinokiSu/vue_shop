<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="图标">
      </div>
      <!-- 登录表单区 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-yonghu-yuan"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-mima"></el-input>
        </el-form-item>
        <!-- 按钮区 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
      
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LoginCompt',
    data () {
      return {
        // 登录表单的数据绑定对象
        loginForm: {
          username: '',
          password: ''
        },
        // 表单的验证规则对象
        loginFormRules: {
          // 验证用户名是否合法
          username: [
            // 每一个对象就是一个验证规则
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          // 验证密码是否合法
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      // 点击重置按钮,重置登录表单
      resetLoginForm() {
        this.$refs.loginFormRef.resetFields();
      },
      login() {
        this.$refs.loginFormRef.validate(async (valid) => {
          if(!valid) return;
          // 发起登录请求,
          // post返回值是一个promise类型，为了简化这次promise操作使用async 和 await 结合，来进行优化
          // 注意: await （右侧必须是promise类型的）只能定义在 被async 修饰的方法中
          const { data: res } = await this.$http.post('login', this.loginForm)
          if(res.meta.status !== 200)
            return this.$message.error('登录失败!')
          this.$message.success('登录成功!')
          /* 
            1. 将登录成功之后的 token，保存到客户端的sessionStorage中
              1.1、项目中除了登录之外的其他API接口，必须在登录之后才能访问
              1.2、token只应在当前网站打开期间生效， 所以将token保存在sessionStorage中, (localStorage是持久保存)
          */ 
          window.sessionStorage.setItem('token', res.data.token)
          // 2. 通过编程式导航跳转到后台主页， 路由地址为/home
          this.$router.push('/home')
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #2b4b6b;
    height: inherit;
  }
  // 表单盒子
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    // 绝对定位，可以在页面上位移 
    position: absolute;
    left: 50%;
    top: 50%;
    // 移动，横轴移动-50% 纵轴移动-50%
    transform: translate(-50%, -50%);

    // 头像盒子上方 图标 
    .avatar_box {
      height: 130px;
      width: 130px;
      // 添加边框线
      border: 1px solid rgb(224, 224, 224);
      border-radius: 50%;
      box-shadow: 0 0 10px;
      // 添加 内间距
      padding: 10px;
      // 移动
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img{
        // 撑满整个盒子
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: rgb(241, 240, 240);
      }
    }
  }

  // 表单的box-sizing默认是content-box()
  .login_form {
    position: absolute;
    // 触底
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    // 将子元素无法 撑开 父元素
    box-sizing: border-box;
  }

  .btns {
    // 变成一个 弹性盒模型
    display: flex;
    // 设置 主轴(横轴)方向上 : 从行尾开始排列(尾部对齐)
    justify-content: flex-end;
  }

 
  
</style>
