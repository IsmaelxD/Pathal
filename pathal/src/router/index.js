      //Imports

    //Default
    import Vue from 'vue'
    import Router from 'vue-router'
    
        //Views 
      //General
    import Login from '../views/Login.vue' //Login
    import Route from '../views/Route.vue' //Route
    import Loss from '../views/Loss.vue' //Loss
      //kind of employees
    import Baker_Dashboard from '../views/baker/Dashboard.vue' //Baker
    import Distributor_Dashboard from '../views/distributor/Dashboard.vue'  //Distributor
    import Supervisor_Dashboard from '../views/supervisor/Dashboard.vue'  //Supervisor
    
        //Conections
    import firebase from 'firebase' //firebase
      
          //Router
    Vue.use(Router) //Init router
    let router = new Router({ //Create a new object router
      mode: 'history', //Use history mode
      base: process.env.BASE_URL, //Define url base use
      routes: [ //posible routes
        { 
          path: '/', //raiz
          name: 'route', //nombre
          component: Route, //nombre-componente
          meta: { //meta_data
            requiresAuth: true //require autentication
          }
        },
        {
          path: '/baker',
          name: 'baker_dashboard',
          component: Baker_Dashboard,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/distributor',
          name: 'distributor_dashboard',
          component: Distributor_Dashboard,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/supervisor',
          name: 'supervisor_dashboard',
          component: Supervisor_Dashboard,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/login',
          name: 'login',
          component: Login,
          meta: {
            requiresGuest: true //require guest
          }
        },{
          path: '*', //All others routes
          name: 'loss',
          component: Loss,
          meta:{
            requiresAuth : true
          }
        }
      ]
    });
      
      //Nav Guards Sesion
    router.beforeEach((to, from, next) => { //Before any change
      if(to.matched.some(record => record.meta.requiresAuth)){ //Check for requiredAuth guard
        if(!firebase.auth().currentUser){ //Check if NOT logged in
          next({ //Go to login
            path: '/login',
            query: {
              redirect: to.fullPath
            }
          });
        } else{           
          next(); // Proceed to route
        }
      }else if(to.matched.some(record => record.meta.requiresGuest)){
        if(firebase.auth().currentUser){ //Check if logged in
          next({ //Go to Route to redirect
            path: '/',
            query: {
              redirect: to.fullPath
            }
          });
        } else{
          next(); // Proceed to route
        }
      } else {
        next(); // Proceed to route
      }
    });
    
    export default router; //Initial Router by exporting