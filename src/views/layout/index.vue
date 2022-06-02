<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧的 logo -->
      <img alt="" src="../../assets/images/logo.png"/>
      <!-- 右侧的菜单 -->
      <el-menu
        active-text-color="#409EFF"
        background-color="#23262E"
        class="el-menu-top"
        mode="horizontal"
        text-color="#fff"
      >
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <img alt="" class="avatar" src="../../assets/images/logo.png"/>
            <span>个人中心</span>
          </template>
          <el-menu-item index="1-1"><i class="el-icon-s-operation"></i>基本资料</el-menu-item>
          <el-menu-item index="1-2"><i class="el-icon-camera"></i>更换头像</el-menu-item>
          <el-menu-item index="1-3"><i class="el-icon-key"></i>重置密码</el-menu-item>
        </el-submenu>
        <el-menu-item index="2" @click="quitFn"><i class="el-icon-switch-button"></i>退出</el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside width="200px">
        <div class="user-box">
          <img v-if="user_pic" :src="user_pic" alt=""/>
          <img v-else alt="" src="../../assets/images/logo.png"/>
          <span>欢迎 {{ nickname || username }}</span>
        </div>
        <el-menu
          active-text-color="#409EFF"
          background-color="#24262d"
          class="el-menu-vertical-demo"
          default-active="/home"
          text-color="#fff"
          @close="handleClose"
          @open="handleOpen"
          unique-opened
        >
          <el-menu-item index="/home">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu index="/article">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span>文章管理</span>
            </template>
            <el-menu-item index="/article1">
              <i class="el-icon-s-data"></i>
              <span slot="title">文章分类</span>
            </el-menu-item>
            <el-menu-item index="/article2">
              <i class="el-icon-document-copy"></i>
              <span slot="title">文章列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="/user">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>个人中心</span>
            </template>
            <el-menu-item index="/user1">
              <i class="el-icon-s-tools"></i>
              <span slot="title">用户设置</span>
            </el-menu-item>
            <el-menu-item index="/user2">
              <i class="el-icon-message-solid"></i>
              <span slot="title">用户通知</span>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-container>
        <!-- 页面主体区域 -->
        <el-main>
          Main.vue后台主页
        </el-main>
        <!-- 底部 footer 区域 -->
        <el-footer>
          欢迎访问
          <el-link href="https://juejin.cn/user/3667626523110360" target="_blank">©我的博客</el-link>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'my-layout',
  // 映射用户信息到页面
  computed: {
    ...mapGetters(['nickname', 'username', 'user_pic'])
  },
  data () {
    return {}
  },
  methods: {
    quitFn () {
      this.$confirm('确认要退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 退出成功，清除token，跳转到登录页面
        this.$store.commit('updateToken', '')
        this.$store.commit('updateUserInfo', {})
        this.$router.push('/login')
      }).catch(() => {

      })
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }

}
</script>

<style lang="less" scoped>
// 左侧边栏用户信息区域
.user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;

  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }

  span {
    color: white;
    font-size: 12px;
  }
}

.main-container {
  height: 100%;

  .el-header,
  .el-aside {
    background-color: #23262e;
  }

  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }

  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #F2F2F2;
  }

  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}

// 侧边栏菜单的样式
.el-aside {
  .el-submenu,
  .el-menu-item {
    width: 200px;
    user-select: none;
  }
}
</style>
