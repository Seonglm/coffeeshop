<template>
  <div id="app">

    <!-- 一级路由 -->
    <router-view></router-view>

  </div>
</template>

<style lang="less">
// 全局样式
body{
  background-color: #f5f5f5;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.fl{
  float: left;
}
.fr{
  float: right;
}
.clearfix::after{
  content:'';
  display: block;
  clear: both;
}
.auto-img{
  width: 100%;
  display: block;
}
.one-text{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
