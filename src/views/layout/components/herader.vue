<template>
  <div class="header-container">
    <div>
      <i class="el-icon-s-fold"></i>
      <span>七里台男子职业技术学院</span>
    </div>
    <el-dropdown>
      <div class="avatar-wrap">
        <img class="avatar" :src="user.photo" alt="">
        <span>{{user.name}}</span>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>设置</el-dropdown-item>
        <el-dropdown-item>退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import {getUserProfile} from "@/api/user";
  export default {
    name: 'AppHeader',
    components: {},
    props: {},
    data () {
      return {
        user : {} //当前登录用户信息
      }
    },
    computed: {},
    watch: {},
    created () {
      this.loadUserProfile()
    },
    mounted () {},
    methods: {
      // 除了登陆接口 其他所有接口 都需要授权才可以使用
      loadUserProfile(){
        getUserProfile().then(res => {
          this.user = res.data.data
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .header-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
    .avatar-wrap {
      display: flex;
      align-items: center;
      .avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }
</style>
