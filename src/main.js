import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {
  Button,
  Icon,
  Empty,
  Upload,
  Tag,
  message,
  notification,
} from "ant-design-vue";
import store from './store'

Vue.config.productionTip = false
Vue.component(Button.name, Button);
Vue.component(Upload.name, Upload);
Vue.component(Icon.name, Icon);
Vue.component(Empty.name, Empty);
Vue.component(Tag.name, Tag);

Vue.prototype.$message = message;
Vue.prototype.$notification = notification;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
