<template>
  <div class="security">
    <van-nav-bar title="安全中心" left-text="返回" left-arrow @click-left="back" />

    <div class="box">
      <van-cell-group>
        <van-cell title="修改密码" @click="showPopUp" is-link />
        <van-cell title="注销账号" @click="cancel" is-link />
      </van-cell-group>
    </div>

    <div class="logout">
      <van-button type="danger" @click="exit" round block>退出登录</van-button>
    </div>

    <van-popup v-model="isShow" position="bottom">
      <div class="v-popup">
        <van-form @submit="commit">
          <van-field v-model="passwordsList.oldPassword" label="旧密码" placeholder="旧密码" />
          <van-field v-model="passwordsList.password" type="text" label="新密码" placeholder="新密码" />
          <div class="submit-btn">
            <van-button round block type="info" native-type="submit">提交</van-button>
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script>
import validForm from "../assets/js/valid";

export default {
  name: "Security",
  data() {
    return {
      isShow: false,
      passwordsList: {
        oldPassword: "",
        password: ""
      }
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    // 显示修改密码框
    showPopUp() {
      this.isShow = true;
    },

    // 修改密码
    commit() {
      // 验证表单
      if (!validForm.validUserForm(this.passwordsList)) {
        return;
      }
      // 获取token
      let tokenString = localStorage.getItem("TK");
      // 加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      // 获取数据
      this.axios({
        method: "POST",
        url: "/updatePassword",
        data: {
          appkey: this.appkey,
          tokenString,
          // 新密码
          password: this.passwordsList.password,
          // 旧密码
          oldPassword: this.passwordsList.oldPassword
        }
      })
        .then(result => {
          this.$toast.clear();
          // 关闭修改密码框
          this.isShow = false;
          if (result.data.code == "E001") {
            //清除token
            localStorage.removeItem("TK");
            this.$router.push({ name: "Login" });
          } else {
            this.$toast(result.data.msg);
          }

          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 退出登录
    exit() {
      localStorage.removeItem("TK");
      this.$router.push({ name: "Login" });
    },

    // 注销账号
    cancel() {
      this.$dialog
        .confirm({
          title: "注销账号",
          message: "一旦注销，数据无法恢复"
        })
        .then(() => {
          // 发起注销请求
          
          // 获取token
          let tokenString = localStorage.getItem("TK");
          // 加载提示
          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0
          });
          // 获取数据
          this.axios({
            method: "POST",
            url: "/destroyAccount",
            data: {
              appkey: this.appkey,
              tokenString
            }
          })
            .then(result => {
              this.$toast.clear();
              if(result.data.code == 'G001'){
                // 清除token
                localStorage.removeItem('TK');
                this.$router.push({name:'Register'})
              }else{
                this.$toast(result.data.msg);
              }
              
            })
            .catch(err => {
              this.$toast.clear();
              
            });
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .van-nav-bar .van-icon {
  color: #e0602d;
}
/deep/ .van-nav-bar__text {
  color: #e0602d;
}
/deep/ .van-button--danger {
  background-color: #e0602d;
  border-color: #e0602d;
}
/deep/ .van-button--info {
  background-color: #e0602d;
  border-color: #e0602d;
}
.security {
  .box {
    margin-top: 10px;
  }
  .logout {
    margin-top: 60px;
    padding: 0 20px;
  }
  .v-popup {
    padding: 20px;
    .submit-btn {
      margin-top: 20px;
    }
  }
}
</style>