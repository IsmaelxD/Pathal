    //Imports
  //Default
  import Vue from 'vue';
  import App from './App.vue';
  import router from './router';
  import store from './store';
  
      //Conexion
  import firebase from 'firebase'; //firebase object
  import './components/firebaseInit'; //firebase data conexion
  
  Vue.config.productionTip = false  //default
  
  let app; //asing app object
  
      //keep sesion btw changes
  firebase.auth().onAuthStateChanged(user => { 
    if(!app){
      app = new Vue({
        router,
        store,
        render: h => h(App)
      }).$mount('#app')
    }
    user.displayName
  });