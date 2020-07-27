<template>
  <div class="menu">
    <van-swipe :autoplay="3000" indicator-color="#e0602d" style="height:163.03px">
      <van-swipe-item v-for="(item,index) in this.bannerData" :key="index">
        <img class="auto-img" v-lazy="item.bannerImg" alt />
      </van-swipe-item>
    </van-swipe>

    <div class="menu-container">
      <div class="menu-aside fl">
        <div
          class="menu-item"
          :ref="'item' + index1"
          v-for="(item1,index1) in this.typeData"
          :key="index1"
          :class="{active:item1.isActive}"
          @click="toggleAsideMenu(item1,index1)"
        >{{item1.typeDesc}}</div>
        <div class="line" :style="{top:top + 'px'}"></div>
      </div>
      <div class="menu-content fl">
        <div
          class="content-item clearfix"
          v-for="(item,index) in this.productData"
          :key="index"
          @click="goDetail(item.pid)"
        >
          <div class="item-img fl">
            <img class="auto-img" v-lazy="item.smallImg" alt />
          </div>
          <div class="item-text fl">
            <div class="product-name one-text">{{item.name}}</div>
            <div class="product-enname one-text">{{item.enname}}</div>
            <div class="product-price">￥{{item.price}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const { mapState, mapMutations } = createNamespacedHelpers("menuModule");

export default {
  name: "Menu",
  data() {
    return {
      //   banner数据
      bannerData: [],

      // 商品类型数据
      typeData: [],

      //   移动线条位置
      top: 0,
      //   侧边栏菜单标签高度
      //   height: 0,

      //   商品数据
      productData: []
    };
  },
  created() {
    //   banner数据
    this.getBannerData();
    // type数据
    this.getTypeData();

    // 根据类型获取商品数据
    // 这里需要修改
    this.getProductData(this.productType);

    this.moveLine();
  },
  computed: {
    ...mapState([
      "bannerDataCache",
      "typeDataCache",
      "productDataCache",
      "height",
      "productType"
    ])
  },

  methods: {
    ...mapMutations(["changeData", "changeProducts", "changeProductType"]),

    // 初始化时移动线条
    moveLine() {
      
      

      for (let i = 0; i < this.typeData.length; i++) {
        if (this.typeData[i].isActive) {
          this.top = i * this.height;
          return;
        }
      }
    },

    //   获取banner数据
    getBannerData() {
      //    获取vuex的banner缓存数据,如果存在，则不发起请求
      if (this.bannerDataCache.length > 0) {
        this.bannerData = this.bannerDataCache;
        
        return;
      }

      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,

        // 延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      });
      this.axios({
        method: "GET",
        url: "/banner",
        params: {
          appkey: this.appkey
        }
      })
        .then(result => {
          // 关闭加载提示
          this.$toast.clear();
          
          if (result.data.code == 300) {
            this.bannerData = result.data.result;
            // 缓存banner数据
            

            // this.$store.commit('menuModule/changeData',{
            //     key:'bannerDataCache',
            //     value:result.data.result
            // })

            this.changeData({
              key: "bannerDataCache",
              value: result.data.result
            });
          }
        })
        .catch(err => {
          
        });
    },

    // 获取商品类型数据
    getTypeData() {
      //  获取vuex的侧边栏菜单缓存数据,如果存在，则不发起请求
      if (this.typeDataCache.length > 0) {
        this.typeData = this.typeDataCache;
        
        return;
      }

      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,

        // 延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      });
      this.axios({
        method: "GET",
        url: "/type",
        params: {
          appkey: this.appkey
        }
      })
        .then(result => {
          // 关闭加载提示
          this.$toast.clear();
          
          if (result.data.code == 400) {
            result.data.result.forEach(v => {
              v.isActive = false;
            });
            result.data.result.unshift({
              type: "isHot",
              typeDesc: "最新推荐",
              isActive: true
            });
            this.typeData = result.data.result;
            this.$nextTick(() => {
              //   获取侧边栏菜单标签高度
              let firstItemHeight = this.$refs.item0[0].clientHeight;
              //   
              this.changeData({
                key: "height",
                value: firstItemHeight
              });
            });

            // 缓存侧边栏菜单数据在vuex
            this.changeData({
              key: "typeDataCache",
              value: result.data.result
            });
            
          }
        })
        .catch(err => {
          
        });
    },

    // 切换侧边栏
    toggleAsideMenu(item, index) {
      
      if (item.isActive) {
        return;
      }
      for (let i = 0; i < this.typeData.length; i++) {
        if (this.typeData[i].isActive) {
          this.typeData[i].isActive = false;
          break;
        }
      }
      item.isActive = true;

      //   移动线条
      this.top = this.height * index;

      // 根据类型获取商品数据

      this.getProductData(item);

      // 这里需要修改
      this.changeProductType(item);

      this.moveLine();
    },

    // 根据商品类型获取商品数据
    getProductData(item) {
      //   在缓存获取商品数据
      if (this.productDataCache[item.type]) {
        this.productData = this.productDataCache[item.type];
        
        return;
      }

      this.productData = [];

      let params = {
        appkey: this.appkey,
        key: "type",
        value: item.type
      };

      // 最新推荐
      if (item.type == "isHot") {
        params.key = "isHot";
        params.value = 1;
      }
      //   

      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,

        // 延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/typeProducts",
        params
      })
        .then(result => {
          // 关闭加载提示
          this.$toast.clear();
          
          if (result.data.code == 500) {
            this.productData = result.data.result;

            // 缓存商品数据
            this.changeProducts({
              type: item.type,
              value: result.data.result
            });
            
            
          }
        })
        .catch(err => {
          // 关闭加载提示
          this.$toast.clear();
          
        });
    },

    // 进入商品详情页
    goDetail(pid) {
      this.$router.push({ name: "Detail", query: { pid } });
    }
  }
};
</script>

<style lang="less" scoped>
.menu {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 50px;
  width: 100%;
  .menu-container {
    width: 100%;
    height: calc(~"100% - 163.03px");
    .menu-aside {
      width: 100px;
      height: 100%;
      position: relative;
      background-color: #f5f5f5;
      overflow-y: auto;
      .menu-item {
        width: 100%;
        height: 44px;
        text-align: center;
        line-height: 44px;
        font-size: 15px;
        &.active {
          background-color: #fff;
          color: #e0602d;
        }
      }
      .line {
        width: 2px;
        height: 44px;
        background-color: #e0602d;
        position: absolute;
        top: 0;
        left: 0;
        transition: top 0.15s linear;
      }
    }
    .menu-content {
      padding: 10px 10px 0 10px;
      width: calc(~"100% - 120px");
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
          .product-price {
            font-size: 16px;
            color: #e0602d;
            margin-top: 40px;
          }
        }
      }
    }
  }
}
/deep/ .van-swipe {
  transform: translateZ(0);
}
</style>