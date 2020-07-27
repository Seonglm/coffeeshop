<template>
  <div class="detail">
    <!-- 导航栏 -->
    <van-nav-bar title="商品详情" @click-left="back" :fixed="true" left-text="返回" left-arrow />
    <!-- 导航栏 -->

    <!-- 商品图片 -->
    <div class="detail-img">
      <img class="auto-img" :src="productData.large_img" alt />
    </div>
    <!-- 商品图片 -->

    <!-- 商品内容 -->
    <div class="detail-container">
      <!-- 商品名称及收藏 -->
      <div class="detail-info clearfix">
        <span class="detail-name fl">{{productData.name}}</span>
        <div class="detail-collect fr" @click="likeAndNotLike">
          <span class="iconfont icon-shoucang1" :class="{active:isLike}"></span>
        </div>
      </div>
      <!-- 商品规格 -->
      <div class="detail-specific">
        <div
          class="specific-item clearfix"
          v-for="(item1,index1) in productData.rules"
          :key="index1"
        >
          <div class="rule-tem fl">{{item1.title}}</div>
          <div class="rule-tags fl clearfix">
            <div
              class="fl tag-item"
              v-for="(item2,index2) in item1.tag"
              :key="index2"
              :class="{active:item2.isActive}"
              @click="toggleTagItem(item2,item1.tag)"
            >{{item2.name}}</div>
          </div>
        </div>
      </div>

      <!-- 商品描述 -->
      <div class="detail-des">
        <div class="des-title">商品描述</div>
        <div class="des-info">
          <div class="des-item" v-for="(item,index) in productData.desc" :key="index">{{item}}</div>
        </div>
      </div>

      <!-- 商品金额数量 -->
      <div class="detail-math clearfix">
        <div class="detail-price fl">￥{{productData.price}}</div>
        <div class="detail-num fr">
          <van-stepper
            v-model="count"
            :integer="true"
            theme="round"
            button-size="22"
            disable-input
          />
        </div>
      </div>

      <van-goods-action>
        <van-goods-action-icon
        @click="goShopcart"
          icon="cart-o"
          text="购物车"
          :badge="shopcartRows == 0 ? '' : shopcartRows"
        />
        <van-goods-action-button color="#f9b34b" type="warning" text="加入购物车" @click="addShopcart" />
        <van-goods-action-button color="#e0602d" type="danger" text="立即购买" @click="addShopcart(true)" />
      </van-goods-action>
    </div>
    <!-- 商品内容 -->
  </div>
</template>

<script>
export default {
  name: "Detail",
  data() {
    return {
      // 商品数量
      count: 1,

      pid: "",
      productData: {},
      isLike: false,

      // 购物车商品条数，并非每个商品数量
      shopcartRows: 0
    };
  },
  created() {
    this.pid = this.$route.query.pid;
    this.getProductDetail(this.pid);
    this.findLike(this.pid);
    this.findShopcart();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },

    // 获取商品详情数据
    getProductDetail(pid) {
      
      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        // 延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/productDetail",
        params: {
          appkey: this.appkey,
          pid
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 600) {
            let data = result.data.result[0];
            data.desc = data.desc.split(/\n/);

            // 商品规格
            // {title:'温度',tag:['冷','热']}
            let productRule = ["tem", "sugar", "milk", "cream"];
            let rules = [];
            productRule.forEach(v => {
              if (data[v] != "") {
                let rule = {
                  title: data[v + "_desc"],
                  tag: []
                };
                let tag = data[v].split("/");
                tag.forEach((item, index) => {
                  let t = {
                    name: item,
                    isActive: index == 0
                  };
                  rule.tag.push(t);
                });
                rules.push(rule);
              }
            });
            

            // 赋值
            data.rules = rules;

            //传递数据
            this.productData = data;
            
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 切换规格
    toggleTagItem(item, data) {
      if (item.isActive) {
        return;
      }

      // 排他，查找已经激活的标签，将它改为false
      for (let i = 0; i < data.length; i++) {
        if (data[i].isActive) {
          data[i].isActive = false;
          break;
        }
      }
      item.isActive = true;
    },

    // 收藏-取消收藏商品
    likeAndNotLike() {
      // 获取token
      let tokenString = localStorage.getItem("TK");

      // 请求路径,收藏like,取消收藏notlike
      let url = this.isLike ? "/notlike" : "like";

      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        // 延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      });

      this.axios({
        method: "POST",
        url,
        data: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          if (result.data.code == 800 || result.data.code == 900) {
            // 收藏成功
            this.$toast(result.data.msg);
            this.isLike = result.data.code == 800;
          } else {
            this.$toast("用户未登录，请先登录");
            this.$router.push({ name: "Login" });
          }
          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 查询当前商品是否被收藏
    findLike(pid) {
      // 获取token
      let tokenString = localStorage.getItem("TK");

      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        // 延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findlike",
        params: {
          appkey: this.appkey,
          pid,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          if (result.data.code == 1000) {
            this.isLike = result.data.result.length > 0;
          } else {
            this.$toast("用户未登录，请先登录");
            this.$router.push({ name: "Login" });
          }
          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 查询购物车商品条数
    findShopcart() {
      // 获取token
      let tokenString = localStorage.getItem("TK");

      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        // 延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      });

      // 获取购物车条数
      this.axios({
        method: "GET",
        url: "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
        }
      })
        .then(result => {
          this.$toast.clear();
          if(result.data.code == 5000){
            this.shopcartRows = result.data.result.length;
          }
          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 加入购物车
    addShopcart(isPurchase) {
      // 获取token
      let tokenString = localStorage.getItem("TK");

      // 获取商品规格
      let rules = this.productData.rules;
      let rule = [];
      rules.forEach(v => {
        for (let i = 0; i < v.tag.length; i++) {
          if (v.tag[i].isActive) {
            rule.push(v.tag[i].name);
            break;
          }
        }
      });
      

      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        // 延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/addShopcart",
        data: {
          pid: this.pid,
          count: this.count,
          appkey: this.appkey,
          tokenString,
          rule: rule.join("/")
        }
      })
        .then(result => {
          this.$toast.clear();
          if(result.data.code == 3000){
            if(result.data.status == 1){
              this.shopcartRows++;
            }
            this.$toast(result.data.msg);
            // 如果点击立即购买按钮，现将商品加入购物车，再跳转到提交订单页面
            if(isPurchase === true){
              setTimeout(() => {
                this.$router.push({name:'Payfor',query:{sids:result.data.sid}});
              },400)
            }
          }
          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 跳转购物车页面
    goShopcart(){
      this.$router.push({name:'Shopcart'});
    },

  }
};
</script>

<style lang="less" scoped>
/deep/ .van-nav-bar__text {
  color: #e0602d;
}
/deep/ .van-icon-arrow-left {
  color: #e0602d;
}
/deep/ .van-stepper__plus {
  color: #fff;
  background-color: #e0602d;
}
/deep/ .van-stepper__minus {
  color: #e0602d;
  border-color: #e0602d;
}
.detail {
  .detail-img {
    padding-top: 46px;
  }
  .detail-container {
    padding: 10px;
    background-color: #fff;
    margin-bottom: 70px;
    .detail-info {
      margin-top: 10px;
      .detail-name {
        font-size: 16px;
        color: #e0602d;
        line-height: 24px;
      }
      .detail-collect {
        width: 24px;
        height: 24px;
        .icon-shoucang1 {
          font-size: 24px;
          color: #cdcdcd;
          line-height: 24px;
          &.active {
            color: #e0602d;
          }
        }
      }
    }

    .detail-specific {
      margin-top: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e8e8e8;
      .specific-item {
        .rule-tem {
          height: 26px;
          line-height: 26px;
          width: 60px;
          font-size: 16px;
          color: #444;
        }
        .rule-tags {
          font-size: 14px;
          .tag-item {
            width: 60px;
            height: 26px;
            line-height: 26px;
            text-align: center;
            background-color: #f2f2f2;
            border-radius: 13px;
            margin-right: 20px;
            color: #666;
            margin-bottom: 10px;
            &:last-child {
              margin-right: 0;
            }
            &.active {
              color: #fff;
              background-color: #e0602d;
            }
          }
        }
      }
    }

    .detail-des {
      margin-top: 10px;
      border-bottom: 1px solid #e8e8e8;
      padding-bottom: 20px;
      .des-title {
        font-size: 16px;
        color: #444;
        margin-bottom: 10px;
      }
      .des-info {
        color: #666;
        font-size: 14px;
        .des-item {
          padding-top: 10px;
        }
      }
    }

    .detail-math {
      padding: 20px 0 10px;
      .detail-price {
        color: #e0602d;
        font-size: 16px;
        line-height: 22px;
      }
    }
  }
}
</style>