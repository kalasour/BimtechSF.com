import Vue from 'vue'
import Vuex from 'vuex'
import { firestore, auth, storage } from './firebase'
import firebase from './firebase'
import router from './router'
const uuidv1 = require('uuid/v1');
Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    Stock: [],
    isLoading: false,
    dialogLogin: false,
    dialogForgot: false,
    dialogRegister: false,
    isLogin: null,
    user: null,
    userProfile: {},
    Categories: [],
    listCate: [],
    snackbar: false,
    snackbarmsg: ''
  },
  mutations: {
    openSnackbar(state, payload) {
      state.snackbarmsg = payload
      state.snackbar = true
    },
    closeSnackbar(state, payload) {
      state.snackbar = false
    },
    setDefaultAddress(state, payload) {
      firestore.collection('Users').doc(state.user.uid).update({
        defaultAddress: payload
      })
    },
    deleteAddress(state, payload) {
      if (payload == state.userProfile.defaultAddress) firestore.collection('Users').doc(state.user.uid).update({
        defaultAddress: 0
      })
      var Arr = state.userProfile.Address.slice(0)
      Arr.splice(payload, 1)
      firestore.collection('Users').doc(state.user.uid).update({
        Address: Arr
      })
    },
    updateAddress(state, payload) {
      state.isLoading = true;
      if (payload.index == -1) {
        firestore.collection('Users').doc(state.user.uid).update({
          Address: firebase.firestore.FieldValue.arrayUnion(payload.data)
        }).then(() => {
          state.isLoading = false
          payload.res()
        }).catch(err => {
          state.isLoading = false
          alert(err.message)
        })
      } else {
        var Arr = state.userProfile.Address.slice(0)
        Arr[payload.index] = payload.data
        firestore.collection('Users').doc(state.user.uid).update({
          Address: Arr
        }).then(() => {
          state.isLoading = false
          payload.res()
        }).catch(err => {
          state.isLoading = false
          alert(err.message)
        })
      }
    },
    updatePassword(state, user) {
      state.isLoading = true
      var User = firebase.auth().currentUser;
      var credential = firebase.auth.EmailAuthProvider.credential(User.email, user.password)
      User.reauthenticateWithCredential(credential).catch(function (error) {
        var errorMessage = error.message;
        user.res(errorMessage)
        return error.message
      }).then(async (e) => {
        state.isLoading = false;
        if (typeof (e) != 'string') {
          await User.updatePassword(user.newpassword).catch(function (error) {
            state.isLoading = false;
            var errorMessage = error.message;
            user.res(errorMessage)
            return error.message
          }).then((e) => {
            if (typeof (e) != 'string')
              user.success()
            state.isLoading = false;
          })

        }

      });
    },
    updatePersonal(state, user) {
      state.isLoading = true
      var User = firebase.auth().currentUser;
      var credential = firebase.auth.EmailAuthProvider.credential(User.email, user.password)
      User.reauthenticateWithCredential(credential).catch(function (error) {
        var errorMessage = error.message;
        user.res(errorMessage)
        return error.message
      }).then(async (e) => {
        if (typeof (e) != 'string') {
          await User.updateEmail(user.email)
          await User.sendEmailVerification()
          await firestore.collection('Users').doc(User.uid).update({ lastname: user.lastname })
          await User.updateProfile({
            displayName: user.name,
          })
          user.success()
        }
        state.isLoading = false;
      });
    },
    async initUser(state, payload) {
      state.user = payload.user
      state.userProfile = payload.userProfile
    },
    AddToCart(state, payload) {
      if (state.isLogin) {
        this.commit('openSnackbar','Added')
        var findIndex = (state.userProfile.Cart == null ? [] : state.userProfile.Cart).findIndex(element => element.id == payload)
        if (findIndex == -1) {
          firestore.collection('Users').doc(state.user.uid).update({
            Cart: firebase.firestore.FieldValue.arrayUnion({ id: payload, amount: 1 })
          })
        }
        else {
          var arr = state.userProfile.Cart.slice(0)
          arr[findIndex].amount++
          firestore.collection('Users').doc(state.user.uid).update({
            Cart: arr
          })
        }
      }
      else {
        state.dialogLogin = true
      }
    },
    DeleteItem(state, payload) {
      state.isLoading = true
      storage.ref(payload).listAll().then(res => {
        res.items.forEach(itemRef => {
          itemRef.delete()
        })
      })
      firestore.collection('Stock').doc(payload).delete().then(() => {
        state.isLoading = false
      })
    },
    UpdateItem(state, payload) {
      state.isLoading = true
      firestore.collection('Stock').doc(payload.data.id).update(payload.data).then(doc => {
        payload.call(payload.data.id)
        state.isLoading = false;
      })
    },
    CreateItem(state, payload) {
      state.isLoading = true
      firestore.collection('Stock').add(payload.data).then(doc => {
        payload.call(doc.id)
        state.isLoading = false;
      })
    },
    DeletePictureItem(state, payload) {
      try {
        const ref = storage.refFromURL(payload).delete().then(() => {
          console.log('Deleted')
        })
      } catch (error) {
        console.log('No image in storage')
      }
    },
    UploadPictureItem(state, payload) {
      state.isLoading = true
      var uploadTask = storage.ref('Stock').child(payload.id).child(uuidv1() + payload.file.name).put(payload.file)
      uploadTask.on('state_changed', (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, function (error) {
        // Handle unsuccessful uploads
      }, function () {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log(uploadTask.snapshot)
          console.log('File available at', downloadURL);
          payload.call(downloadURL)
          firestore.collection('Stock').doc(payload.id).update({
            imgs: firebase.firestore.FieldValue.arrayUnion(downloadURL)
          })
          state.isLoading = false
        });
      })
    },
    CreateCate(state, payload) {
      if (payload.id) { firestore.collection('Categories').doc(payload.id).collection('sub').add({ name: payload.new }) }
      else firestore.collection('Categories').add({ name: payload.new })
    },
    EditCate(state, payload) {
      if (payload.parent) { firestore.collection('Categories').doc(payload.parent.id).collection('sub').doc(payload.id).update({ name: payload.new }) }
      else firestore.collection('Categories').doc(payload.id).update({ name: payload.new })
    },
    async DeleteCate(state, payload) {
      if (payload.parent) { firestore.collection('Categories').doc(payload.parent.id).collection('sub').doc(payload.id).delete() }
      else {
        await firestore.collection('Categories').doc(payload.id).collection('sub').get().then(
          querySnapshot => querySnapshot.forEach(
            async (doc) => {
              await doc.ref.delete()
            }
          ))
        firestore.collection('Categories').doc(payload.id).delete()
      }
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
          auth.currentUser.sendEmailVerification()
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
    Forgot(state, user) {
      state.isLoading = true
      auth.sendPasswordResetEmail(user.email).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        user.res(errorMessage)
      }).then(() => {
        state.isLoading = false
      });
    },
    async Logout(state) {
      window.location.reload()
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
    closeForgot(state) {
      state.dialogForgot = false;
    },
    openForgot(state) {
      state.dialogForgot = true;
    },
    setLoading(state, load) {
      state.isLoading = load
    },
    initialize(state) {
      // state.isLoading = true
      auth.onAuthStateChanged(async user => {
        // state.isLoading = true
        if (user) {
          // User is signed in.

          state.user = user
          state.isLogin = true;
          firestore.collection('Users').doc(state.user.uid).onSnapshot(docSnapshot => {
            state.userProfile = docSnapshot.data()
            // state.isLoading = false
          }, err => {
          });
        } else {
          // User is signed out.
          state.isLogin = false;
          state.user = null
          state.userProfile = {}
          // state.isLoading = false
        }
      });
      firestore.collection('Stock').onSnapshot(async function (querySnapshot) {
        // state.isLoading = true
        state.Stock = [];
        await querySnapshot.forEach((doc) => {
          state.Stock.push(doc)
        })
        // state.isLoading = false
      });
      firestore.collection('Categories').orderBy("name").onSnapshot(async function (querySnapshot) {
        // state.isLoading = true
        state.Categories = [];
        state.listCate = []
        await querySnapshot.forEach(async (doc) => {

          state.Categories.push(doc)
          var cat = { name: doc.data().name, id: doc.id }
          await doc.ref.collection('sub').onSnapshot((async qr => {
            // state.isLoading = true
            var ch = []
            await qr.forEach(q => {
              ch.push({ name: q.data().name, id: q.id, parent: { id: cat.id, name: cat.name } })
            })
            cat.children = ch
            var arr = await state.listCate
            await Vue.set(state, 'listCate', []);
            await Vue.set(state, 'listCate', arr)
            // state.isLoading = false
          }))
          state.listCate.push(cat)
        })
        // state.isLoading = false
      });

    }
  },
  actions: {

  }
})
