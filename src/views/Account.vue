<template>
  <div class="account">
    <van-nav-bar title="账号管理" left-text="返回" left-arrow @click-left="back" />

    <!-- 用户个人信息表 -->
    <van-cell-group>
      <!-- 头像 -->
      <van-cell title="头像" class="v-cell">
        <div class="clearfix">
          <div class="chathead fr">
            <img class="auto-img" :src="userInfo.userImg" alt />
            <van-uploader class="upload-box" :max-size="maxSize" :after-read="uploadFile" />
          </div>
        </div>
      </van-cell>
      <!-- 用户id -->
      <van-cell title="用户id" :value="userInfo.userId"></van-cell>
      <!-- 邮箱 -->
      <van-cell title="手机号" :value="userInfo.phone"></van-cell>
      <!-- 昵称 -->
      <van-cell title="昵称" class="v-cell">
        <div class="clearfix">
          <div class="fr">
            <van-field @blur="update({key:'nickName',url:'/updateNickName',value:userInfo.nickName})" v-model="userInfo.nickName" class="v-field" input-align="right" />
          </div>
        </div>
      </van-cell>
      <!-- 简介 -->
      <van-cell>
        <div class="clearfix">
          <div class="fl v-cell-text">简介</div>
          <div class="fl v-cell-textarea">
            <textarea @change="update({key:'desc',url:'/updateDesc',value:userInfo.desc})" class="textarea" v-model="userInfo.desc"></textarea>
          </div>
        </div>
      </van-cell>
    </van-cell-group>
    <!-- 用户个人信息表 -->
  </div>
</template>

<script>
export default {
  name: "Account",
  data() {
    return {
      userInfo: {},
      maxSize: 1 * 1024 * 1024
    };
  },
  created() {
    this.getUserData();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    // 上传文件
    uploadFile(file) {
      

      // 获取图片base64
      let serverBase64Img = file.content.replace(
        /^data:image\/[A-Za-z]+;base64,/,
        ""
      );
      // 获取图片类型
      let imgType = file.file.type.split("/")[1];

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
        url: "/updateAvatar",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType,
          serverBase64Img
        }
      })
        .then(result => {
          this.$toast.clear();
          if (result.data.code == "H001") {
            this.userInfo.userImg = result.data.userImg;
          } else {
            this.$toast(result.data.msg);
          }
          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },
    // 获取用户信息
    getUserData() {
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
        method: "GET",
        url: "/findAccountInfo",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          if (result.data.code == "B001") {
            this.userInfo = result.data.result[0];
          }
          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 修改昵称和简介
    update(obj) {
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
        url: obj.url,
        data: {
          appkey: this.appkey,
          tokenString,
          [obj.key]:obj.value
        }
      })
        .then(result => {
          this.$toast.clear();
          
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
.account {
  .v-cell {
    line-height: 40px;
    .chathead {
      width: 40px;
      height: 40px;
      background-color: #fff;
      border-radius: 50%;
      box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.5);
      overflow: hidden;
      position: relative;
      .upload-box {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        opacity: 0;
      }
    }
    .v-field {
      padding: 0;
      height: 40px;
      line-height: 40px;
    }
  }
  .v-cell-text {
    width: 40px;
  }
  .v-cell-textarea {
    width: calc(~"100% - 40px");
    height: 60px;
    .textarea {
      display: block;
      width: 100%;
      height: 60px;
      padding: 0;
      margin: 0;
      border: none;
      resize: none;
      text-align: right;
    }
  }
}
</style>