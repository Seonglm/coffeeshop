<template>
  <div class="mycollection">
    <van-nav-bar 
    title="我的收藏" 
    left-text="返回" 
    left-arrow 
    @click-left="back"
    />
    <div class="menu-container" v-if="collectData.length > 0">
      <div class="menu-content fl">
        <div class="content-item clearfix" v-for="(item,index) in this.collectData" :key="index">
          <!-- @click="goDetail(item.pid)" -->
          <div class="item-img fl" @click="goDetail(item.pid)">
            <img class="auto-img" v-lazy="item.smallImg" alt />
          </div>
          <div class="item-text fl">
            <div class="product-name one-text">{{item.name}}</div>
            <div class="product-enname one-text">{{item.enname}}</div>
            <div class="product-box clearfix">
              <div class="product-price fl">￥{{item.price}}</div>
              <div class="product-delete fr">
                <van-icon name="delete" @click="removeCollection(item.pid,index)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else><van-empty description="还没有收藏商品" /></div>
  </div>
</template>

<script>
export default {
  name: "MyCollection",
  data() {
    return {
      collectData: []
    };
  },
  created() {
    this.getCollections();
  },
  methods: {
    //   获取用户所有收藏商品信息
    getCollections() {
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
        url: "/findAllLike",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          if (result.data.code == 2000) {
            this.collectData = result.data.result;
          }
          
          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },
    // 跳转至用户收藏商品的详情页面
    goDetail(pid) {
      this.$router.push({ name: "Detail", query: { pid } });
    },

    // 删除单个用户收藏商品
    removeCollection(pid,index) {
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
        url: "/notlike",
        data: {
          appkey: this.appkey,
          tokenString,
          pid
        }
      })
        .then(result => {
          this.$toast.clear();
          if(result.data.code == 900){
              this.collectData.splice(index,1);
          }
          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    back(){
        this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .van-nav-bar .van-icon{
    color: #e0602d;
}
/deep/ .van-nav-bar__text{
    color: #e0602d;
}
.mycollection {
  width: 100%;
  .menu-container {
    width: 100%;
    height: calc(~"100% - 163.03px");
    .menu-content {
      padding: 10px 10px 0 10px;
      width: calc(~"100% - 20px");
      height: calc(~"100% - 10px");
      overflow-y: auto;
      .content-item {
        width: calc(~"100% - 20px");
        padding: 10px;
        background-color: #fff;
        margin-bottom: 10px;
        .item-img {
          width: 100px;
          height: 100px;
        }
        .item-text {
          width: calc(~"100% - 120px");
          padding: 0 10px;
          .product-name {
            width: 110px;
            font-size: 16px;
            padding-bottom: 2px;
          }
          .product-enname {
            width: 110px;
            font-size: 14px;
            color: silver;
          }
          .product-box {
            width: 100%;
            .product-price {
              font-size: 16px;
              color: #e0602d;
              margin-top: 40px;
            }
            .product-delete {
              width: 20px;
              height: 20px;
              font-size: 20px;
              margin-top: 42px;
              color: #acacac;
            }
          }
        }
      }
    }
  }
}
</style>