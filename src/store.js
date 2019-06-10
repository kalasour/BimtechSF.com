import Vue from 'vue'
import Vuex from 'vuex'
import { firestore, auth } from './firebase'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Stock: {},
    isLoading: false,
    dialogLogin: false,
    dialogRegister: false,
    isLogin: false,
    user: {}
  },
  mutations: {
    Register(state, user) {
      state.isLoading = true
      auth.createUserWithEmailAndPassword(user.email, user.password).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        user.res(errorMessage)
      }).then(() => {
        if (auth.currentUser != null) {
          auth.currentUser.updateProfile({ displayName: user.name })

          firestore.collection('Users').doc(auth.currentUser.uid).set({
            lastname: user.lastname,
          })
          state.dialogRegister = false;
        }
        state.isLoading = false
      });
    },
    Login(state, user) {
      state.isLoading = true
      auth.signInWithEmailAndPassword(user.email, user.password).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        user.res(errorMessage)
      }).then(() => {
        state.isLoading = false
        if (auth.currentUser != null) state.dialogLogin = false;
      });
    },
    Logout(state) {
      auth.signOut()
    },
    openLogin(state) {
      state.dialogLogin = true;
      state.dialogRegister = false;
    },
    openRegister(state) {
      state.dialogLogin = false;
      state.dialogRegister = true;
    },
    closeRegister(state) {
      state.dialogRegister = false;
    },
    closeLogin(state) {
      state.dialogLogin = false;
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


      auth.onAuthStateChanged(user => {
        if (user) {
          // User is signed in.
          state.user = user
          state.isLogin = true;
          // ...
        } else {
          state.isLogin = false;
          state.user = {}
          // User is signed out.
          // ...
        }
      });
    }
  },
  actions: {

  }
})
