<template>
  <div class="login-container">
    <!--
      el-form 表单组件
      每个表单项都必须使用 el-form-item 组件包裹
     -->

    <div class="login-form-wrap">
      <div class="login-head">
        <div class="logo"></div>
      </div>
      <!--
        配置 Form表单验证
        1. 给 el-from 组件绑定 model 为表单数据对象
        2. 给需要验证的表单项 el-form-item 绑定 prop 属性
           注意：prop 属性需要指定表单对象中的数据名称
        3. 通过 el-from 组件的 rules 属性配置验证规则
        4. ref 的作用主要用来获取表单组件手动触发验证
      -->
      <el-form class="login-form"
               ref="login-form"
               :model="user"
               :rules="formRules">
        <el-form-item prop="mobile">
          <el-input v-model="user.mobile"
                    placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item prop="agree">
          <el-checkbox v-model="user.agree"
          >我已阅读并同意用户协议和隐私条款</el-checkbox
          >
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn"
                     type="primary"
                     @click="onLogin"
                     :loading="loginLoading"
          >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { login } from '@/api/user'
export default {
  name: 'LoginIndex',
  props: {},
  components: {
  },
  data () {
    return {
      user: {
        mobile: '13911111111', // 手机号
        code: '246810', // 验证码
        agree : true //是否同意协议
      },
      loginLoading : false,
      // 表单验证规则配置
      formRules: {
        mobile:[
          { required: true, message: '手机号不可以为空', trigger: 'blur' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'change' }
        ],
        code : [
          { required: true, message: '验证码不可以为空', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码格式' }
        ],
        agree: [
          {
            // 自定义校验规则：https://element.eleme.cn/#/zh-CN/component/form#zi-ding-yi-xiao-yan-gui-ze
            // 验证通过：callback()
            // 验证失败：callback(new Error('错误消息'))
            validator: (rule, value, callback) => {
              if (value){
                callback()
              }else {
                callback(new Error('请用户同意协议'))
              }
            },
            // message: '请勾选同意用户协议',
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
  },
  watch: {
    data (newValue, oldValue) {

    }
  },
  methods: {
    onLogin () {
      //表单验证
      // validate 方法是异步的
      this.$refs['login-form'].validate(valid => {
        // 如果表单验证失败，停止请求提交
        if (!valid) {
          return
        }

        // 验证通过，请求登录
        this.login()
      })
    },
    login(){
      // 获取表单数据（根据接口要求绑定数据）
      // 账号 13911111111
      // 密码 246810
      const user = this.user
      //验证通过 提交登陆
      // 开启登陆中 loading...
      this.loginLoading = true
      login(user).then(res => {
        console.log(res)
        this.$message({
          message : '登陆成功',
          type: 'success'
        })
        // 将接口返回的用户相关数据存储到本地， 方便数据共享
        // 本地存储只能存储 字符串
        // 如果需要存储对象、数组相关的类型，则把他们转化为JSON格式的字符串进行存储
        window.localStorage.setItem('user', JSON.stringify(res.data.data))
        //跳转到首页
        this.$router.push({
          name : 'home'
        })
      }).catch(err => {
        this.$message.error('登录失败，手机号或验证码错误')
      }).finally(res => {
        // 关闭 loading
        this.loginLoading = false
      })
    }
  },
  filters: {
    fnName : function (value) {
      return value
    }
  }
}
</script>

<style scoped lang="less">
  .login-container {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: url('./login_bg.jpg') no-repeat;
    background-size: cover;
    .login-form-wrap {
      min-width: 300px;
      padding: 30px 50px 10px;
      background-color: #fff;
      .login-head {
        display: flex;
        justify-content: center;
        .logo {
          width: 200px;
          height: 57px;
          background: url('./logo_index.png') no-repeat;
          background-size: contain;
        }
      }
      .login-form {
        .login-btn {
          width: 100%;
        }
      }
    }
  }
</style>
