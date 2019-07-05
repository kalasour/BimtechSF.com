import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import VuetifyConfirm from 'vuetify-confirm'
import ItemCard from "./components/ItemCard";
import UploadButton from 'vuetify-upload-button';
import draggable from 'vuedraggable'
import { auth, firestore } from './firebase'
import { Store } from 'vuex';
Vue.component('draggable', draggable)
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
store.commit('initialize')
const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
  if (firebaseUser) {
    var userProfile={}
    await firestore.collection('Users').doc(firebaseUser.uid).get().then(docSnapshot => {
      userProfile = docSnapshot.data()
    });
    await store.commit('initUser', { user: firebaseUser, userProfile: userProfile })

  }
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
  unsubscribe()
})


