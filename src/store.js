import Vue from 'vue'
import Vuex from 'vuex'
import { firestore } from './firebase'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Stock: {},
    isLoading: false,
    dialogLogin: false,
    dialogRegister: false
  },
  mutations: {
    Register(state,input){
      console.log(input)
    },
    Login(state,input){
      console.log(input)
    },
    openLogin(state){
      state.dialogLogin=true;
      state.dialogRegister=false;
    },
    openRegister(state){
      state.dialogLogin=false;
      state.dialogRegister=true;
    },
    closeRegister(state){
      state.dialogRegister=false;
    },
    closeLogin(state){
      state.dialogLogin=false;
    },
    setLoading(state, load) {
      state.isLoading = load
    },
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
