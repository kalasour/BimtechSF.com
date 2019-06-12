import Vue from 'vue'
import Vuex from 'vuex'
import { firestore, auth } from './firebase'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Stock: [],
    isLoading: false,
    dialogLogin: false,
    dialogRegister: false,
    isLogin: null,
    user: {},
    userProfile: {},
    Categories: []
  },
  mutations: {
    AddToCart(state, data) {

    },
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

    initialize(state) {
      state.isLoading = true
      auth.onAuthStateChanged(async user => {
        state.isLoading = true
        if (user) {
          // User is signed in.

          state.user = user
          state.isLogin = true;
          firestore.collection('Users').doc(state.user.uid).onSnapshot(docSnapshot => {
            state.userProfile = docSnapshot.data()
            state.isLoading = false
          }, err => {
          });
        } else {
          // User is signed out.
          state.isLogin = false;
          state.user = {}
          state.userProfile = {}
          state.isLoading = false
        }
      });
      firestore.collection('Stock').onSnapshot(async function (querySnapshot) {
        state.isLoading = true
        state.Stock = [];
        await querySnapshot.forEach((doc) => {
          state.Stock.push(doc)
        })
        state.isLoading = false
      });
      firestore.collection('Categories').orderBy("name").onSnapshot(async function (querySnapshot) {
        state.isLoading = true
        state.Categories = [];
        await querySnapshot.forEach((doc) => {
          state.Categories.push(doc)
        })
        state.isLoading = false
      });

    }
  },
  actions: {

  }
})
