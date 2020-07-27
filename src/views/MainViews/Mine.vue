<template>
  <div class="mine">
    <div class="mine-container">
      <!-- 用户信息 -->
      <div class="mine-box" :style="{backgroundImage:'url('+ userInfo.userBg +')'}">
        <div class="changeBgImg clearfix">
          <div class="fr change-box" v-if="!isCancel">
            <div>更换背景</div>
            <van-uploader class="upload-box" :max-size="maxSize" :after-read="uploadFile" />
          </div>
        </div>
        <div class="mine-info" v-if="!isCancel">
          <div class="mine-avatar clearfix">
            <div class="head fl">
              <img class="auto-img" :src="userInfo.userImg" alt />
            </div>
            <div class="nicknanme fl">{{userInfo.nickName}}</div>
          </div>
          <div class="mine-desc" >简介：{{userInfo.desc == '' ? '这个人很懒，什么都没有留下！' : userInfo.desc}}</div>
        </div>
        <div class="login-box" v-else>
          <van-button type="warning" @click="goManage('Login')">登录</van-button>
        </div>
      </div>

      <!-- 管理列表 -->
      <van-cell-group>
        <van-cell
          :title="item.title"
          is-link
          v-for="(item,index) in listData"
          :key="index"
          @click="goManage(item.routeName)"
        />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
export default {
  name: "Mine",
  data() {
    return {
      // 1MB文件
      maxSize: 1 * 1024 * 1024,
      listData: [
        {
          title: "账号管理",
          routeName: "Account"
        },
        {
          title: "地址管理",
          routeName: "AddressList"
        },
        {
          title: "我的收藏",
          routeName: "MyCollection"
        },
        {
          title: "安全中心",
          routeName: "Security"
        }
      ],
      userInfo: {},
      isCancel:true
    };
  },
  created() {
    this.getUserInfo();
    if(localStorage.getItem('TK')){
      this.isCancel = false;
    }
  },
  methods: {
    //   获取用户信息
    getUserInfo() {
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
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          if (result.data.code == "A001") {
            this.userInfo = result.data.result[0];
          }
          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 上传文件
    uploadFile(file) {
      

      // 获取图片base64
      let serverBase64Img = file.content.replace(/^data:image\/[A-Za-z]+;base64,/,'');
      // 获取图片类型
      let imgType = file.file.type.split('/')[1];

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
        url: "/updateUserBg",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType,
          serverBase64Img
        }
      })
        .then(result => {
          this.$toast.clear();
          if(result.data.code == 'I001'){
            this.userInfo.userBg = result.data.userBg;
          }else{
            this.$toast(result.data.msg);
          }
          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 跳转管理页面
    goManage(name) {
      if(name === 'Login'){
        this.$router.push({name});
      }else{
        if(this.isCancel){
          this.$toast('请先登录');
        }else{
          this.$router.push({name});
        }
      }
    },
    
  }
};
</script>

<style lang="less" scoped>
.mine {
  .mine-container {
    .login-box{
      text-align: center;
      line-height: 70px;
    }
    .mine-box {
      background-color: #eee;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center center;
      height: 130px;
      padding: 20px;
      .changeBgImg {
        font-size: 14px;
        color: #fff;
        height: 30px;
        line-height: 30px;
        .change-box {
          position: relative;
          .upload-box {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 30px;
            overflow: hidden;
            opacity: 0;
          }
        }
      }
      .mine-info {
        margin-top: 10px;
        .mine-avatar {
          .head {
            background-color: #fff;
            width: 70px;
            height: 70px;
            border-radius: 50%;
            box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.5);
            overflow: hidden;
          }
          .nicknanme {
            margin-left: 20px;
            line-height: 70px;
            color: #fff;
            font-size: 14px;
          }
        }
        .mine-desc {
          font-size: 14px;
          color: #fff;
          height: 30px;
          line-height: 30px;
          margin-left: 90px;
        }
      }
    }
  }
}
</style>