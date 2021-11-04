<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/img/cat.png" alt="" />
        <span>System</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '80px' : '200px'">
        <!-- 侧边栏菜单区域 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="rgb(134, 194, 186)"
          text-color="#fff"
          active-text-color="#fff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <!-- + '' 将index转成一个字符串 -->
          <el-submenu
            :index="item.order + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id" 
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右侧内容区 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      // 菜单图标
      iconsObj: {
        125: 'iconfont icon-yonghuguanli',
        103: 'iconfont icon-quanxianpeizhi',
        101: 'iconfont icon-dingdanguanli',
        102: 'iconfont icon-shangpinguanli',
        145: 'iconfont icon-shujutongji',
      },
      // 是否折叠菜单
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  // 生命周期函数钩子
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    /* 退出功能实现原理
        1. 基于token的方式实现退出比较简单，只需要销毁本地的token即可，
        2. 这样，后续的请求就不会携带token，必须重新登录生成一个新的token之后 才可以访问页面
      */
    logout() {
      // 清除sessionStorage中的数据(token)
      window.sessionStorage.clear()
      // 重定向页面
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 点击按钮 切换 菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接激活的状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  },
}
</script>

<style lang="less" scoped>
.home-container {
  // 将页面铺满
  height: 100%;
}

/* 头部 */
.el-header {
  background-color: cornsilk;
  display: flex;
  // 左右贴边对齐
  justify-content: space-between;
  padding-left: 0;
  // 将退出按钮 在flex容器中纵轴方向的对齐方式
  align-items: center;
  color: burlywood;
  font-size: 30px;
  // 嵌套
  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }

    img {
      margin-left: 10px;
      width: 60px;
      height: 60px;
    }
  }
}

/* 侧边 */
.el-aside {
  background-color: rgb(134, 194, 186);
  .el-menu {
    // 解决展开出现不对齐现象
    border-right: none;
  }
}

.iconfont {
  margin-right: 10px;
}
// 展开按钮
.toggle-button {
  background-color: burlywood;
  font-size: 16px;
  // 行高
  line-height: 24px;
  color: #fff;
  text-align: center;
  // 设置字符之间的空白
  letter-spacing: 0.3em;
  // 设置鼠标放入该元素边界内所用的光标显示， pointer为 (一只手)
  cursor: pointer;
}

/* 右侧内容区 */
.el-main {
  background-color: whitesmoke;
}
</style>
