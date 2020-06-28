<template>
  <div class="nav-wrap"> <!-- container nav -->
    <div class="container"> <!-- container -->
      <img alt="Pathal Logo" src="../assets/Pathal.png" width="50" height="50"> <!-- icon -->
    </div>
    <div class="container"> 
      <h5>Pathal</h5> <!-- title -->
    </div>
    <div class="container">
      <h6 v-if="isLoggedIn">{{currentUser}}</h6> <!-- if true show it-->
      <button  class="btn" v-on:click="logout" v-if="isLoggedIn">Cerrar Sesion</button> <!-- btn with function -->
      <img v-if="isLoggedIn" class="icon_user" v-bind:src="url" alt="icon_user"> <!-- icon if true-->
    </div>
  </div>
</template>

<script>
    //imports
  //conextion
import db from "./../components/firebaseInit"; //db from firebase
import firebase from 'firebase'; //firebase object

export default { //default
    name: 'Navbar',
    data(){ //data will be used
      return{ //sesion data
        isLoggedIn: false,
        currentUser: false,
        url: ''
      }
    },
    created(){ //execute init view
      if(firebase.auth().currentUser){ //validate auth
        this.isLoggedIn = true; //init var
        var ocupation = '' //init var
        db.collection('employees') //get employed data
        .get()
        .then(querySnapshot => { //init object
            querySnapshot.forEach(doc => { //iterate object
                if(firebase.auth().currentUser.email == doc.data().email){ //validate user with employed data
                  this.currentUser = doc.data().name; //set value
                  ocupation = doc.data().ocupation; //set value
                }
            })
          });
        db.collection('url') //get url data
          .get()
          .then(querySnapshot => { //init object
            querySnapshot.forEach(doc => { //itarate object
              if(ocupation == doc.data().name){ //validate ocupation
                this.url = doc.data().url //set url
              }
            })
          });
      }
    },
    methods:{ 
      logout: function(){ //finish sesion
        firebase //fibase object
          .auth() //get auth object
          .signOut() //call signOut funtion
          .then(() => {
            this.$router.go({path: this.$router.path}); //redirect to path
          }
          );
      }
    }
}
</script>

<style>

.nav-wrap{
  display: flex;
  text-align: center;
  background-color: #78909c;
}
.container{
  display: block;
  color: white;
}

h6{
  display: inline;
  margin: 15px;
}

.icon_user{
  width: 50px;
  height: 50px;
  margin-left: 10px;
}

.btn{
  background-color: rgba(255, 255, 255, 0.651);
  color:black;
}

</style>
