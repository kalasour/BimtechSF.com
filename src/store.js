import Vue from 'vue'
import Vuex from 'vuex'
import { firestore, auth, storage } from './firebase'
import firebase from './firebase'
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
    Categories: [],
    listCate: [],
  },
  mutations: {
    AddToCart(state, data) {

    },
    DeleteItem(state, payload) {
      state.isLoading = true
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
    UploadPicture(state, payload) {
      var uploadTask = storage.ref('temp').child(payload.name).put(payload)
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
        state.listCate = []
        await querySnapshot.forEach(async (doc) => {

          state.Categories.push(doc)
          var cat = { name: doc.data().name, id: doc.id }
          await doc.ref.collection('sub').onSnapshot((async qr => {
            state.isLoading = true
            var ch = []
            await qr.forEach(q => {
              ch.push({ name: q.data().name, id: q.id, parent: { id: cat.id, name: cat.name } })
            })
            cat.children = ch
            var arr = await state.listCate
            await Vue.set(state, 'listCate', []);
            await Vue.set(state, 'listCate', arr)
            state.isLoading = false
          }))
          state.listCate.push(cat)
        })
        state.isLoading = false
      });

    }
  },
  actions: {

  }
})
