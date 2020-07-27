<template>
  <div class="shopcart">
    <!-- 如果购物车没有数据，则显示空页面 -->
    <div v-if="shopcartData == 0">
      <van-empty description="购物车空空如也" />
    </div>

    <div v-else>
      <!-- 管理 -->
      <van-nav-bar :right-text="isManage ? '完成' : '管理'" @click-right="manage" />

      <!-- 滑动删除单元格 -->

      <!-- 商品列表 -->
      <van-list
        class="shopcart-list"
        v-model="loadOptions.isLoading"
        :finished="loadOptions.isFinished"
        :finished-text="loadOptions.finishedText"
        :offset="50"
        @load="loadData"
      >
        <van-swipe-cell class="lists" v-for="(item,index) in shopcartData" :key="index">
          <div class="list-item clearfix">
            <!-- 单选框 -->
            <div class="item-radio fl">
              <van-checkbox v-model="item.isCheck" shape="round" @change="simpleSelect" />
            </div>
            <!-- 商品信息 -->
            <div class="item-info fl clearfix">
              <!-- 图片 -->
              <div class="item-img fl">
                <img class="auto-img" :src="item.small_img" alt />
              </div>

              <!-- 商品数据 -->
              <div class="item-content fl">
                <div class="item-container">
                  <div class="item-text clearfix">
                    <span class="fl item-name">{{item.name}}</span>
                    <span class="fl item-rule">{{item.rule}}</span>
                  </div>
                  <div class="item-enname fl">{{item.enname}}</div>
                </div>

                <div class="item-data">
                  <div class="item-price fl">￥{{item.price}}</div>
                  <div class="item-stepper fr">
                    <van-stepper
                      v-model="item.count"
                      :integer="true"
                      theme="round"
                      button-size="22"
                      disable-input
                      @change="modifyCount(item)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <template #right>
            <van-button square type="danger" text="删除" @click="removeShopcart([item.sid],index)" />
          </template>
        </van-swipe-cell>
      </van-list>

      <!-- 全选框及结算 -->
      <div v-if="!isManage">
        <van-submit-bar 
        class="submit-bar" 
        :disabled="isNotHasCheck" 
        :price="total"
        button-text="提交订单"
        @submit="submitOrder"
        >
          <van-checkbox v-model="allCheck" @click="allSelect">全选</van-checkbox>
        </van-submit-bar>
      </div>

      <div v-else>
        <van-submit-bar
          class="submit-bar submit-bar-delete"
          :disabled="isNotHasCheck"
          button-text="删除选择"
          @submit="removeMoreShopcart"
        >
          <van-checkbox v-model="allCheck" @click="allSelect">全选</van-checkbox>
        </van-submit-bar>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Shopcart",
  data() {
    return {
      isEmpty: false,
      //   全选
      allCheck: false,
      // 管理
      isManage: false,
      //   是否有勾选
      isNotHasCheck: true,
      // 部分购物车数据
      shopcartData: [],
      // 购物车所有数据
      allshopcartData: [],

      loadOptions: {
        //   是否处于加载状态，加载过程中不触发load事件
        isLoading: true,

        // 是否完成加载数据
        isFinished: false,
        finishedText: "没有数据可加载了"
      },

      //   每次加载8条数据
      loadCount: 8,

      // 总金额
      total:0,
      isLoin:false
    };
  },
  created() {

    if(localStorage.getItem('TK')){
      this.isLogin = true;
      this.getShopcartData();
    }
    

  },
  methods: {
    //   获取购物车数据
    getShopcartData() {
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
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          if (result.data.code == 5000) {
            result.data.result.forEach(v => {
              v.isCheck = false;
            });
            // slice是从已有数组中返回选中的数组
            // splice是删除从指定位置开始的指定数量的数组中元素
            this.allshopcartData = result.data.result;
            this.shopcartData = this.allshopcartData.splice(0, this.loadCount);
          }
          
          

          // 根据截取购物车商品数量和总购物车商品数量来判断是否加载完毕
          if (this.allshopcartData.length > 0) {
            this.loadOptions.isLoading = false;
          } else {
            this.loadOptions.isLoading = true;
            this.loadOptions.isFinished = true;
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 懒加载购物车数据
    loadData() {
      
      this.shopcartData.push(...this.allshopcartData.splice(0, this.loadCount));
      if (this.allshopcartData.length == 0) {
        //   没有数据可加载
        this.loadOptions.isLoading = true;
        this.loadOptions.isFinished = true;
      }
    },

    // 全选
    allSelect() {
      this.allshopcartData.forEach(v => {
        v.isCheck = this.allCheck;
      });

      this.shopcartData.forEach(v => {
        v.isCheck = this.allCheck;
      });
      this.isNotHasCheck = !this.allCheck;

      this.sum();
    },

    // 单选
    simpleSelect() {
      this.isNotHasCheck = true;
      this.sum();
      for (let a = 0; a < this.shopcartData.length; a++) {
        if (this.shopcartData[a].isCheck) {
          this.isNotHasCheck = false;
          break;
        }
      }

      for (let i = 0; i < this.shopcartData.length; i++) {
        if (!this.shopcartData[i].isCheck) {
          this.allCheck = false;
          return;
        }
      }
      this.allCheck = true;
    },

    // 管理
    manage() {
      this.isManage = !this.isManage;
    },

    // 修改购物车数量
    modifyCount(item) {
      // 获取token
      let tokenString = localStorage.getItem("TK");

      // 加载提示
      this.$toast.loading({
        message: "加载中",
        forbidClick: true,
        duration: 0
      });

      // 数据请求
      this.axios({
        method: "POST",
        url: "/modifyShopcartCount",
        data: {
          appkey: this.appkey,
          tokenString,
          sid: item.sid,
          count: item.count
        }
      })
        .then(result => {
          // 关闭加载提示
          this.$toast.clear();
          
          if(result.data.code == 6000){
            this.sum();
          }
        })
        .catch(err => {
          // 关闭加载提示
          this.$toast.clear();
          
        });
    },

    // 单个删除购物车
    removeShopcart(sid, index) {
      // 获取token
      let tokenString = localStorage.getItem("TK");

      // 加载提示
      this.$toast.loading({
        message: "加载中",
        forbidClick: true,
        duration: 0
      });

      // 数据请求
      this.axios({
        method: "POST",
        url: "/removeShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(sid)
        }
      })
        .then(result => {
          // 关闭加载提示
          this.$toast.clear();
          
          if (result.data.code == 7000) {
            this.shopcartData.splice(index, 1);
            this.sum();
            if(this.shopcartData.length == 0){
              this.loadOptions.finishedText = '';
            }
            this.$toast.success("删除成功");
          } else {
            this.$toast.fail("删除失败");
          }
        })
        .catch(err => {
          // 关闭加载提示
          this.$toast.clear();
          
        });
    },

    // 删除多个购物车商品
    removeMoreShopcart() {
      // 获取删除购物车sid
      let sids = [];
      this.shopcartData.forEach(v => {
        if (v.isCheck) {
          sids.push(v.sid);
        }
      });
      

      // 获取token
      let tokenString = localStorage.getItem("TK");

      // 加载提示
      this.$toast.loading({
        message: "加载中",
        forbidClick: true,
        duration: 0
      });

      // 数据请求
      this.axios({
        method: "POST",
        url: "/removeShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(sids)
        }
      })
        .then(result => {
          // 关闭加载提示
          this.$toast.clear();
          
          if (result.data.code == 7000) {
            // 删除页面的购物车商品
            for(let i=this.shopcartData.length-1;i>=0;i--){
              if(this.shopcartData[i].isCheck){
                this.shopcartData.splice(i,1);
              }
            }
            this.sum();
            if(this.shopcartData.length == 0){
              this.allCheck = false;
              this.isManage = false;
            }
            this.$toast.success("删除成功");
          } else {
            this.$toast.fail("删除失败");
          }
        })
        .catch(err => {
          // 关闭加载提示
          this.$toast.clear();
          
        });
    },

    // 计算总金额
    sum(){
      this.total = 0;
      this.shopcartData.forEach(v => {
        if(v.isCheck){
          this.total += v.count * v.price * 100;
        }
      })
    },

    // 提交订单
    submitOrder(){
      // 获取选择的商品的sid
      let sids = [];
      this.shopcartData.forEach(v => {
        if(v.isCheck){
          sids.push(v.sid);
        }
      })
      this.$router.push({name:'Payfor',query:{
        sids:sids.join('-')
      }})
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .shopcart-list .van-button {
  height: 100%;
}
/deep/ .van-stepper__plus {
  color: #fff;
  background-color: #e0602d;
}
/deep/ .van-stepper__minus {
  color: #e0602d;
  border-color: #e0602d;
}

/deep/ .van-submit-bar__price {
  color: #e0602d;
}

/deep/ .van-submit-bar__button--danger {
  background-color: #e0602d;
}

/deep/ .submit-bar {
  bottom: 50px;
}

/deep/ .submit-bar-delete .van-button {
  margin-left: auto;
}

.shopcart {
  padding-bottom: 100px;
  .shopcart-list {
    background-color: #fff;
    height: calc(~"100% - 100px");
    .lists {
      border-bottom: 1px solid #e8e8e8;
      &:last-child {
        border-bottom: none;
      }
    }
    .list-item {
      padding: 10px;
      .item-radio {
        width: 20px;
        height: 20px;
        margin-top: 30px;
      }
      .item-info {
        width: calc(~"100% - 30px");
        margin-left: 10px;
        .item-img {
          width: 80px;
          height: 80px;
        }
        .item-content {
          width: calc(~"100% - 90px");
          margin-left: 10px;
          height: 80px;
          .item-container {
            height: 50px;
            .item-text {
              height: 30px;
              .item-name {
                height: 30px;
                margin-right: 10px;
                font-size: 16px;
                color: #444;
                line-height: 30px;
              }
              .item-rule {
                font-size: 12px;
                color: #999;
                line-height: 30px;
              }
              .item-enname {
                color: #666;
                height: 20px;
              }
            }
          }
          .item-data {
            height: 30px;
            .item-price {
              color: #e0602d;
              font-size: 16px;
              line-height: 30px;
            }
            .item-stepper {
              margin-top: 4px;
            }
          }
        }
      }
    }
  }
}
</style>