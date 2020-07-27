<template>
  <div class="findback">
    <van-nav-bar title="找回密码" left-text="返回" left-arrow @click-left="back" />

    <div class="container">
      <!-- 第一步 -->
      <div class="one-step" v-if="!isNextStep">
        <van-form>
          <van-field type="text" label="邮箱" placeholder="请输入邮箱地址" v-model="firstStep.email"></van-field>
          <van-field
            type="text"
            center
            clearable
            label="邮箱验证码"
            placeholder="请输入邮箱验证码"
            v-model="firstStep.securityCode"
            key="code"
          >
            <template #button>
              <van-button
                size="small"
                type="primary"
                @click="sendSecurityCode"
                :disabled="isSend"
              >{{securityText}}</van-button>
            </template>
          </van-field>

          <div class="register-btn">
            <van-button
              color="#e0620d"
              round
              block
              type="info"
              native-type="submit"
              @click="nextStep"
            >下一步</van-button>
          </div>
        </van-form>
      </div>

      <!-- 第二步 -->
      <div class="second-step" v-else>
        <van-form>
          <van-field
            type="text"
            label="手机号"
            placeholder="输入注册手机号"
            left-icon="phone-o"
            v-model="userInfo.phone"
            maxlength="11"
          ></van-field>
          <van-field
            :type="isEye ? 'text' : 'password'"
            label="新密码"
            placeholder="字母数字_组合(6-16位)"
            left-icon="lock"
            :right-icon="isEye ? 'eye-o' : 'closed-eye'"
            v-model="userInfo.password"
            @click-right-icon="validPassword"
            maxlength="16"
          ></van-field>

          <div class="register-btn">
            <van-button @click="findPassword" color="#e0620d" round block type="info" native-type="submit">提交</van-button>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script>
import validForm from "../assets/js/valid";
export default {
  name: "FindBack",
  data() {
    return {
      firstStep: {
        email: "",
        securityCode: ""
      },
      isNextStep: false,
      userInfo: {
        phone: "",
        password: ""
      },
      isEye: false,
      securityText: "发送验证码",
      isSend: false
    };
  },
  methods: {
    //   返回
    back() {
      if (this.isNextStep) {
        this.isNextStep = false;
      } else {
        this.$router.go(-1);
      }
    },
    // 显示隐藏密码
    validPassword() {
      this.isEye = !this.isEye;
    },

    // 下一步验证验证码
    nextStep() {
      if (!validForm.validUserForm(this.firstStep)) {
        return;
      }

      // 加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      // 获取数据
      this.axios({
        method: "POST",
        url: "/checkValidCode",
        data: {
          appkey: this.appkey,
          validCode: this.firstStep.securityCode
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == "K001") {
            this.isNextStep = true;
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 发送邮箱验证码
    sendSecurityCode() {
      if (!validForm.validUserForm({ email: this.firstStep.email })) {
        return;
      }

      //   获取邮箱验证码
      let time = 60;
      this.securityText = time + "秒后重新发送";
      this.isSend = true;
      let timer = setInterval(() => {
        if (time == 0) {
          clearInterval(timer);
          timer = null;
          this.securityText = "发送验证码";
          this.isSend = false;
        } else {
          time--;
          this.securityText = time + "秒后重新发送";
        }
      }, 1000);

      //   请求验证码
      // 加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      // 获取数据
      this.axios({
        method: "POST",
        url: "/emailValidCode",
        data: {
          appkey: this.appkey,
          email: this.firstStep.email
        }
      })
        .then(result => {
          this.$toast.clear();
          this.$toast(result.data.msg);
          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 找回密码
    findPassword() {
      if (!validForm.validUserForm(this.userInfo)) {
        return;
      }

      //   请求修改密码
      // 加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      // 获取数据
      this.axios({
        method: "POST",
        url: "/retrievePassword",
        data: {
          appkey: this.appkey,
          phone:this.userInfo.phone,
          password:this.userInfo.password
        }
      })
        .then(result => {
          this.$toast.clear();
          if(result.data.code == "L001"){
              this.$router.push({name:'Login'});
          }else{
              this.$toast(result.data.msg);
          }
          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
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
/deep/ .van-button--primary {
  background-color: #e0602d;
  border-color: #e0602d;
}
.findback {
  .container {
    margin-top: 30px;
    .one-step {
      .register-btn {
        padding: 0 20px;
        margin-top: 40px;
      }
    }
    .second-step {
      .register-btn {
        padding: 0 20px;
        margin-top: 40px;
      }
    }
  }
}
</style>