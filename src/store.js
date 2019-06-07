import Vue from 'vue'
import Vuex from 'vuex'
import { firestore } from './firebase'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Stock: {}
  },
  mutations: {
    async initialize(state) {
      firestore.collection('Restaurant supply').doc('Stock').onSnapshot(docSnapshot => {
        state.Stock = docSnapshot.data()
        // console.log(`Received doc snapshot: ${docSnapshot}`);
        // ...
      }, err => {
        // console.log(`Encountered error: ${err}`);
      });
    }
  },
  actions: {

  }
})
