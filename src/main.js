import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import VuetifyConfirm from 'vuetify-confirm'
import ItemCard from "./components/ItemCard";
import UploadButton from 'vuetify-upload-button';

Vue.component('ItemCard', ItemCard)
Vue.component('upload-btn', UploadButton)

Vue.use(VuetifyConfirm, {
  buttonTrueText: 'Accept',
  buttonFalseText: 'Discard',
  color: 'warning',
  icon: 'warning',
  title: 'Warning',
  width: 350,
  property: '$confirm'
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
