<template>
  <div class="order">
    <van-tabs
      @change="selectOrderStatus"
      v-model="activeName"
      color="#e0602d"
      line-height="2"
      title-active-color="#e0602d"
      :sticky="true"
    >
      <van-tab
        :title="item.title"
        :name="item.name"
        v-for="(item,index) in tabContent"
        :key="index"
      >
        <div class="allorder">
          <!-- 每一个订单 -->
          <div class="allorder-content" v-for="(item,index) in orderIds" :key="index">
            <div class="content-top clearfix">
              <div class="number fl">{{item}}</div>
              <div class="trash fr clearfix" v-if="orderData[item].status == 2">
                <span class="confirm fl">已收货</span>
                <!-- <span class="delete fl"></span> -->
                <van-icon name="delete" class="delete fl" @click="deleteOrder(item)" />
              </div>
              <div class="trash fr clearfix" v-else>
                <span class="confirm fl" @click="confirmReceive(item)">确认收货</span>
              </div>
            </div>
            <div class="content-bottom">
              <div class="order-list">
                <!-- 一个商品信息 -->
                <div class="order-info clearfix" v-for="(v,i) in orderData[item].data" :key="i">
                  <div class="info-img fl">
                    <img class="auto-img" :src="v.smallImg" alt />
                  </div>
                  <div class="info-text fl clearfix">
                    <div class="product-info fl">
                      <div class="product-name">
                        <div class="name">{{v.name}}</div>
                        <div class="enname">{{v.enname}}</div>
                      </div>
                      <div class="product-rule">{{v.rule}}</div>
                    </div>
                    <div class="product-count fr">
                      <div class="product-price">￥{{v.price}}</div>
                      <div class="product-num">×{{v.count}}</div>
                    </div>
                  </div>
                </div>
                <!-- 一个商品信息 -->
              </div>
              <div class="order-else clearfix">
                <div
                  class="order-time fl"
                >{{orderData[item].date | formatDate('yyyy-MM-dd hh:mm:ss')}}</div>
                <div class="order-total fr clearfix">
                  <span class="total-text fl">共计 {{orderData[item].count}} 件商品 合计：</span>
                  <span class="total fl">￥{{orderData[item].total}}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 每一个订单 -->
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  name: "Order",
  data() {
    return {
      activeName: "0",
      isReceive: true,
      // 订单id
      orderIds: [],
      // 订单数据
      orderData: {},
      tabContent: [
        {
          title: "全部",
          name: "0"
        },
        {
          title: "待收货",
          name: "1"
        },
        {
          title: "已收货",
          name: "2"
        }
      ]
    };
  },
  created() {
    this.getOrderData();
  },
  methods: {
    // 切换订单状态
    selectOrderStatus(a) {
      
      this.getOrderData();
    },

    // 获取订单信息
    getOrderData() {
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
        url: "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString,
          status: this.activeName
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 70000) {
            // 降序排序
            result.data.result.sort((a, b) => {
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            });

            // 获取所有订单号
            let orderids = [];
            result.data.result.forEach(v => {
              if (orderids.indexOf(v.oid) === -1) {
                orderids.push(v.oid);
              }
            });

            this.orderIds = orderids;

            // 按照订单号筛选商品
            let orderData = {};
            result.data.result.forEach(v => {
              if (!orderData[v.oid]) {
                // 如果当前订单数据不存在，则添加一个新的订单
                orderData[v.oid] = {
                  data: [v],
                  status: v.status,
                  date: v.createdAt,
                  count: v.count,
                  total: v.count * v.price
                };
              } else {
                orderData[v.oid].count += v.count;
                orderData[v.oid].total += v.count * v.price;
                orderData[v.oid].data.push(v);
              }
            });
            
            

            this.orderData = orderData;
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 确认收货
    confirmReceive(oid) {
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
        url: "/receive",
        data: {
          appkey: this.appkey,
          tokenString,
          oid
        }
      })
        .then(result => {
          this.$toast.clear();
          if (result.data.code == 80000) {
            this.orderData[oid].status = 2;
            // 如果是待收货，则删除页面上的订单数据
            if (this.activeName == 1) {
              let i = this.orderIds.indexOf(oid);
              this.orderIds.splice(i, 1);
            }
          }
          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 删除订单
    deleteOrder(oid) {
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
        url: "/removeOrder",
        data: {
          appkey: this.appkey,
          tokenString,
          oid
        }
      })
        .then(result => {
          this.$toast.clear();
          if (result.data.code == 90000) {
            // 删除页面订单
            let i = this.orderIds.indexOf(oid);
            this.orderIds.splice(i, 1);
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
.order {
  padding-bottom: 50px;
  .allorder {
    padding: 10px;

    .allorder-content {
      background-color: #fff;
      padding: 10px;
      border-radius: 10px;
      margin-bottom: 10px;
      .content-top {
        height: 20px;
        padding-bottom: 10px;
        margin-bottom: 10px;
        border-bottom: 1px solid #e8e8e8;
        line-height: 20px;
        .number {
          color: #999;
          font-size: 12px;
        }
        .trash {
          .confirm {
            color: #666;
            font-size: 14px;
          }
          .delete {
            margin-top: 1px;
            font-size: 20px;
            color: #666;
            margin-left: 10px;
          }
        }
      }
      .content-bottom {
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
        .order-else {
          border-bottom: 1px solid #e8e8e8;
          .order-time {
            font-size: 12px;
            line-height: 44px;
            color: #999;
          }
          .order-total {
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
    }
  }
}
</style>