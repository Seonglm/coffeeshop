<template>
  <div class="payfor">
    <van-nav-bar title="提交订单" left-text="返回" left-arrow @click-left="back" />

    <!-- 选择收货地址按钮 -->
    <div class="payfor-container">
      <div class="address-box" @click="showPopup">{{userAddress.address}}</div>
      <div class="order-content">
        <div class="order-top">
          <div class="order-list">
            <!-- 一个商品信息 -->
            <div class="order-info clearfix" v-for="(item,index) in orderData" :key="index">
              <div class="info-img fl">
                <img class="auto-img" :src="item.small_img" alt />
              </div>
              <div class="info-text fl clearfix">
                <div class="product-info fl">
                  <div class="product-name">
                    <div class="name">{{item.name}}</div>
                    <div class="enname">{{item.enname}}</div>
                  </div>
                  <div class="product-rule">{{item.rule}}</div>
                </div>
                <div class="product-count fr">
                  <div class="product-price">￥{{item.price}}</div>
                  <div class="product-num">×{{item.count}}</div>
                </div>
              </div>
            </div>
            <!-- 一个商品信息 -->
          </div>
        </div>
        <div class="order-bottom clearfix">
          <div class="order-total fr clearfix">
            <span class="total-text fl">共计 {{allCount}} 件商品 合计：</span>
            <span class="total fl">￥{{total}}</span>
          </div>
        </div>
      </div>
    </div>

    <van-submit-bar :price="total * 100" button-text="立即结算" @submit="commitOrder" />

    <van-popup class="popupbox" v-model="isShow" position="bottom">
      <van-address-list
        v-model="addressId"
        :list="addressListData"
        default-tag-text="默认"
        @click-item="chooseAddress"
        @add="goAddress"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "Payfor",
  data() {
    return {
      isShow: false,
      addressId: "",
      addressListData: [],
      userAddress: {
        address: "请选择收货地址",
        phone: "",
        receiver: ""
      },
      orderData: [],
      // 商品总数量
      allCount: 0,
      // 总价格
      total: 0,
      sids: []
    };
  },
  created() {
    // 截取查询参数
    this.sids = this.$route.query.sids.split("-");
    // 
    this.getAddressData();
    this.getcommitOrderData();
  },
  methods: {
    showPopup() {
      this.isShow = true;
    },
    // 获取收货地址
    getAddressData() {
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
        url: "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 20000) {
            result.data.result.forEach(v => {
              let ad = {
                id: v.aid,
                name: v.name,
                tel: v.tel,
                address: v.province + v.city + v.county + v.addressDetail,
                isDefault: Boolean(v.isDefault)
              };
              // 默认选择默认地址
              if (v.isDefault) {
                this.addressId = v.aid;
                this.userAddress.address = ad.address;
              }
              this.addressListData.push(ad);
            });
            
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 选择地址
    chooseAddress(item) {
      
      this.isShow = false;
      this.userAddress = {
        address: item.address,
        phone: item.tel,
        receiver: item.name
      };
    },

    // 获取提交订单的数据
    getcommitOrderData() {
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
        url: "/commitShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(this.sids)
        }
      })
        .then(result => {
          this.$toast.clear();
          if (result.data.code == 50000) {
            result.data.result.forEach(v => {
              this.allCount += v.count;
              this.total += v.count * v.price;
            });
            this.orderData = result.data.result;
            
          }
          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 提交订单
    commitOrder() {
      if (this.userAddress.address == "请选择收货地址") {
        this.$toast("请选择收货地址");
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
        url: "/pay",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(this.sids),
          phone: this.userAddress.phone,
          address: this.userAddress.address,
          receiver: this.userAddress.receiver
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 60000) {
            this.$router.push({ name: "Order" });
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 新增地址
    goAddress() {
      this.$router.push({ name: "Address" });
      this.$store.commit("changeRouteName", "Payfor");
    },

    // 返回
    back() {
      this.$dialog
        .confirm({
          title: "",
          message: "是否取消结算订单"
        })
        .then(() => {
          // on confirm
          this.$router.go(-1);
        })
        .catch(() => {
          // on cancel
          
        });
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .van-submit-bar__price {
  color: #e0602d;
}
/deep/ .van-icon-edit {
  display: none;
}
/deep/ .van-tag--danger {
  background-color: #e0602d;
}
/deep/ .van-address-item .van-radio__icon--checked .van-icon {
  background-color: #e0602d;
  border-color: #e0602d;
}
/deep/ .van-button--danger {
  background-color: #e0602d;
  border-color: #e0602d;
}
/deep/ .van-address-item__edit {
  color: #e0602d;
}
/deep/ .van-nav-bar .van-icon {
  color: #e0602d;
}
/deep/ .van-nav-bar__text {
  color: #e0602d;
}
.payfor {
  .payfor-container {
    padding: 10px;
    .address-box {
      height: 50px;
      line-height: 50px;
      background-color: #fff;
      padding: 0 10px;
      border-radius: 20px;
      font-size: 16px;
    }
    .order-content {
      margin-top: 20px;
      .order-top {
        // margin-top: 10px;
        padding: 0px 10px 0px 10px;
        background-color: #fff;
        border-radius: 10px;
        .order-list {
          .order-info {
            margin-bottom: 15px;
            &:last-child {
              margin-bottom: none;
            }
            .info-img {
              width: 70px;
              height: 70px;
            }
            .info-text {
              width: calc(~"100% - 80px");
              margin-left: 10px;
              .product-info {
                .product-name {
                  height: 50px;
                  .name {
                    font-size: 16px;
                  }
                  .enname {
                    font-size: 14px;
                    color: #999999;
                  }
                }
                .product-rule {
                  height: 20px;
                  font-size: 14px;
                  color: #999999;
                  line-height: 20px;
                }
              }
              .product-count {
                .product-price {
                  height: 50px;
                  color: #999;
                  font-size: 14px;
                  text-align: right;
                }
                .product-num {
                  height: 20px;
                  font-size: 14px;
                  line-height: 20px;
                  color: #cccccc;
                  text-align: right;
                }
              }
            }
          }
        }
      }
      .order-bottom {
        padding-right: 10px;
        border-bottom: 1px solid #eeeeee;
        .total-text {
          font-size: 14px;
          color: #999;
          height: 40px;
          line-height: 40px;
        }
        .total {
          font-size: 18px;
          font-weight: bold;
          height: 40px;
          line-height: 40px;
        }
      }
    }
  }
  .popupbox {
    min-height: 300px;
    max-height: 580px;
    overflow-y: auto;
  }
}
</style>