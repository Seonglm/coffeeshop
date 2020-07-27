import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueRouter from "vue-router";

import "font-awesome/css/font-awesome.min.css";
import "./assets/font/iconfont.css";

import axios from "axios";
import VueAxios from "vue-axios";

// 导入用于设置 rem 基准值模块 lib-flexible
import "lib-flexible";

// 导入vant框架
import {
  NavBar,
  Form,
  Field,
  Button,
  Toast,
  Tabbar,
  TabbarItem,
  Swipe,
  SwipeItem,
  Lazyload,
  Stepper,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Empty,
  SwipeCell,
  Checkbox,
  SubmitBar,
  List,
  AddressEdit,
  AddressList,
  Popup,
  Tab,
  Tabs,
  Icon,
  Cell,
  CellGroup,
  Uploader,
  Dialog,
} from "vant";
// 注册vant框架的组件
Vue.use(NavBar)
  .use(Form)
  .use(Field)
  .use(Button)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Swipe)
  .use(SwipeItem)
  .use(Lazyload)
  .use(Stepper)
  .use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(Empty)
  .use(SwipeCell)
  .use(Checkbox)
  .use(SubmitBar)
  .use(List)
  .use(AddressEdit)
  .use(AddressList)
  .use(Popup)
  .use(Tab)
  .use(Tabs)
  .use(Icon)
  .use(Cell)
  .use(CellGroup)
  .use(Uploader)
  .use(Dialog);

// 注册axios
Vue.use(VueAxios, axios);

// 防止点击同一路由，出现错误
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

// 配置请求基础路径
axios.defaults.baseURL = "";

// 配置post请求头
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=utf-8";

// 发起请求之前处理
axios.interceptors.request.use((config) => {
  //

  if (config.method == "post") {
    // post请求参数序列化，转成一个字符串
    let paramsString = "";
    for (let key in config.data) {
      paramsString += key + "=" + config.data[key] + "&";
    }

    //

    config.data = paramsString.slice(0, -1);

    //
  }

  return config;
});

Vue.config.productionTip = false;

// 添加appkey属性保存appkey
Vue.prototype.appkey = "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=";

// 全局过滤器
Vue.filter("formatDate", (value, format) => {
  //2020-07-09T10:57:16.000Z
  // format:yyyy-MM-dd hh:mm:ss
  let date = new Date(value);

  // 获取年份
  let year = date.getFullYear();
  if (/(y+)/.test(format)) {
    // 获取匹配的内容
    let currentYear = RegExp.$1;
    format = format.replace(currentYear, year);
  }

  // 月日时分秒
  let dataObject = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    hh: date.getHours(),
    mm: date.getMinutes(),
    ss: date.getSeconds(),
  };
  //
  for (let key in dataObject) {
    // 创建动态正则表达式
    let reg = new RegExp(`(${key}+)`);
    if (reg.test(format)) {
      // 获取匹配组的内容
      let content = RegExp.$1;
      // 控制补零
      let value =
        dataObject[key] >= 10
          ? dataObject[key]
          : content.length == 2
          ? "0" + dataObject[key]
          : dataObject[key];
      format = format.replace(content, value);
    }
  }

  //
  return format;
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
