<template>
  <div class="main">

    <div>
        <router-view></router-view>
    </div>

    <van-tabbar v-model="active" @change="toggletabBar" active-color="#e0602d">
      <van-tabbar-item v-for="(item,index) in tabBarData" 
      :key="index" :icon="item.icon">{{item.title}}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "Main",
  data() {
      return {
          active:0,
          tabBarData:[
              {
                  icon:'coupon-o',
                  title:'菜单',
                  routerName:'Menu',
                  url:'main/menu'
              },
              {
                  icon:'orders-o',
                  title:'订单',
                  routerName:'Order',
                  url:'main/order'
              },
              {
                  icon:'shopping-cart-o',
                  title:'购物车',
                  routerName:'Shopcart',
                  url:'main/shopcart'
              },
              {
                  icon:'contact',
                  title:'我的',
                  routerName:'Mine',
                  url:'main/mine'
              },
          ]
      }
  },
  created() {
    //   let url = location.hash.slice(2).split('/').splice(0,2).join('/');
    // 获取当前路由url
    let url = location.hash.slice(2).split('/').splice(0,2).join('/');
    // 
    for(let i=0;i<this.tabBarData.length;i++){
        if(this.tabBarData[i].url.indexOf(url) > -1){
            this.active = i;
            break;
        }
    }
  },
  methods:{
      toggletabBar(index){
          this.$router.push({name:this.tabBarData[index].routerName});
      }
  }
};
</script>

<style lang="less" scoped>
</style>