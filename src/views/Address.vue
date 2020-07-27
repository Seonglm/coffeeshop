<template>
  <div class="address">
    <van-nav-bar @click-left="back" :title="aid ? '编辑地址' : '新增地址'" left-text="返回" left-arrow />

    <van-address-edit
      :area-list="areaList"
      :address-info="addressInfo"
      :show-delete="!!aid"
      show-postal
      show-set-default
      show-search-result
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="save"
      @delete="deleteaddress"
    />
  </div>
</template>

<script>
import areaList from "../assets/js/area";

export default {
  name: "Address",
  data() {
    return {
      areaList,
      addressInfo: {
        name: "",
        tel: "",
        province: "",
        city: "",
        county: "",
        addressDetail: "",
        areaCode: "",
        postalCode: "",
        isDefault: false
      },
      // 地址id
      aid: ""
    };
  },
  created() {
    this.aid = this.$route.params.aid;
    
    this.getAddressData(this.aid);
  },
  methods: {
    save(content) {
      
      let isSame = true;

      if (this.aid) {
        
        for (let key in this.addressInfo) {
          // 存在不同数据，表明用户已经修改过地址
          if (this.addressInfo[key] != content[key]) {
            isSame = false;
          }
        }
      }

      // 获取token
      let tokenString = localStorage.getItem("TK");

      // 加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      // 存在aid则编辑地址，不存在则新增地址
      if (this.aid) {
        if (!isSame) {
          
          let modifiedAddress = Object.assign({}, this.addressInfo);
          for (let key in modifiedAddress) {
            modifiedAddress[key] = content[key];
          }
          modifiedAddress.isDefault = Number(modifiedAddress.isDefault);
          modifiedAddress.aid = this.aid;
          modifiedAddress.appkey = this.appkey;
          modifiedAddress.tokenString = tokenString;
          

          // 发起编辑地址请求
          this.axios({
            method: "POST",
            url: "/editAddress",
            data: modifiedAddress
          })
            .then(result => {
              this.$toast.clear();
              if (result.data.code == 30000) {
                this.$router.push({ name: "AddressList" });
              } else {
                this.$toast(result.data.msg);
              }
              
            })
            .catch(err => {
              this.$toast.clear();
              
            });
        } else {
          this.$toast.clear();
        }
      } else {
        let data = {
          name: "",
          tel: "",
          province: "",
          city: "",
          county: "",
          addressDetail: "",
          areaCode: "",
          postalCode: "",
          isDefault: false
        };
        // 拷贝对象
        for (let key in data) {
          data[key] = content[key];
        }
        data.appkey = this.appkey;
        data.tokenString = tokenString;
        data.isDefault = Number(data.isDefault);

        // 获取数据
        this.axios({
          method: "POST",
          url: "/addAddress",
          data
        })
          .then(result => {
            this.$toast.clear();
            if (result.data.code == 9000) {
              this.$router.push({ name: "AddressList" });
            } else {
              this.$toast(result.data.msg);
            }
            
          })
          .catch(err => {
            this.$toast.clear();
            
          });
      }
    },
    // 获取地址关联数据
    getAddressData(aid) {
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
        url: "/findAddressByAid",
        params: {
          appkey: this.appkey,
          tokenString,
          aid
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 40000) {
            result.data.result[0].isDefault = Boolean(
              result.data.result[0].isDefault
            );
            for (let key in this.addressInfo) {
              this.addressInfo[key] = result.data.result[0][key];
            }
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 删除地址
    deleteaddress() {
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
        url: "/deleteAddress",
        data: {
          appkey: this.appkey,
          tokenString,
          aid:this.aid
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if(result.data.code == 10000){
            this.$router.push({name:'AddressList'});
            this.$toast.success('删除成功');
          }else{
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .van-icon-arrow-left {
  color: #e0602d;
}
/deep/ .van-nav-bar__text {
  color: #e0602d;
}
/deep/ .van-button--danger {
  background-color: #e0602d;
  border-color: #e0602d;
}
/deep/ .van-switch--on {
  background-color: #e0602d;
}
</style>