<template>
  <div class="addresslist">
    <van-nav-bar
      title="收货地址"
      left-text="返回"
      left-arrow
      @click-left="back"
    />

    <van-address-list
      v-model="addressId"
      :list="addressListData"
      default-tag-text="默认"
      @edit="addAddress"
      @add="addAddress"
    />
  </div>
</template>

<script>
export default {
  name: "AddressList",
  data() {
    return {
      addressId: "1",
      addressListData: []
    };
  },
  created() {
    this.getAddressData();
  },
  methods: {
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
              if (v.isDefault) {
                this.addressId = v.aid;
              }
              this.addressListData.push(ad);
            });
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },
    addAddress(item){
        let rout = {
            name:'Address'
        };
        
        if(item){
            rout.params = {
                aid:item.id
            }
        };
        this.$router.push(rout);
    },
    back(){
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .van-radio__icon{
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
/deep/ .van-nav-bar .van-icon{
    color: #e0602d;
}
/deep/ .van-nav-bar__text{
    color: #e0602d;
}
</style>