<template>
  <div class="login">
    <!-- 导航栏 -->
    <van-nav-bar 
    title="登录" 
    left-text="注册" 
    right-text="关闭" 
    @click-left="goPage('Register')"
    @click-right="goPage('Menu')"
    />
    <!-- 导航栏 -->

    <!-- logo图片 -->
    <div class="logo">
      <img class="auto-img" src="../assets/images/logo.png" alt />
    </div>
    <!-- logo图片 -->

    <!-- 注册输入框 -->
    <van-form @submit="login">
      <van-field
        type="text"
        label="手机号"
        placeholder="输入11位手机号"
        left-icon="phone-o"
        v-model="userInfo.phone"
        maxlength="11"
      >
        <!-- 自定义右边图标 -->
        <!-- <template v-slot:right-icon>
          <div>
            <i class="fa fa-camera-retro fa-lg"></i>
          </div>
        </template>-->
      </van-field>

      <van-field
        :type="isEye ? 'text' : 'password'"
        label="密码"
        placeholder="字母数字_组合(6-16位)"
        left-icon="lock"
        :right-icon="isEye ? 'eye-o' : 'closed-eye'"
        v-model="userInfo.password"
        @click-right-icon="validPassword"
        maxlength="16"
      />

      <div class="login-btn">
        <van-button color="#e0620d" round block type="info" native-type="submit">立即登录</van-button>
        <div class="forget">
          <span class="fr" @click="FindBackPassword">忘记密码？</span>
        </div>
      </div>
    </van-form>
    <!-- 注册输入框 -->
  </div>
</template>

<script>
// 导入验证表单模块
import validForm from "../assets/js/valid";

export default {
  name: "Login",
  data() {
    return {
      userInfo: {
        phone: "",
        password: ""
      },
      isEye: false
    };
  },

  methods: {
    //   切换密码格式
    validPassword() {
      this.isEye = !this.isEye;
    },

    // 登录
    login() {
      if (validForm.validUserForm(this.userInfo, this)) {
        // 复制对象
        let data = Object.assign({}, this.userInfo);

        // 请求密钥
        data.appkey = this.appkey;

        // 开启加载提示
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          // 延迟自动关闭加载提示，如果该值为0，则不会自动关闭
          duration: 0
        });

        //发起登录请求
        this.axios({
          method: "POST",
          url: "/login",

          //  post传递参数需要写在data
          data
        })
          .then(result => {
            // 关闭加载提示
            this.$toast.clear();
            
            if(result.data.code == 200){
                // 跳转菜单页面
                this.$router.push({name:'Menu'})
                
                // 存储token，用于后面登录验证
                localStorage.setItem('TK',result.data.token);

            }else{
                this.$toast(result.data.msg);
            }
          })
          .catch(err => {
            // 关闭加载提示
            this.$toast.clear();
            
          });
      }
    },

    // 跳转注册页面
    goPage(name){
        this.$router.push(name);
    },

    // 找回密码
    FindBackPassword(){
      this.$router.push({name:'FindBack'});
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .van-nav-bar__text {
  color: #e0602d;
}
/deep/ .van-nav-bar__title {
  color: #cdcdcd;
}
.login-btn {
  margin-top: 40px;
  padding: 0 20px;
}
.logo {
  width: 200px;
  height: 200px;
  margin: 40px auto;
}
.forget{
    margin-top: 20px;
}
</style>