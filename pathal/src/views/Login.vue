<template> <!-- View -->
    <div class="Login"> <!-- Login container -->
        <div class="form-request-login centre"> <!-- Model container -->
            <h2>Iniciar Sesion</h2> <!-- Title -->
            <form action=""> <!-- Form of request -->
                <div class="input-field"> <!-- Imput container -->
                    <i class="material-icons prefix">email</i> <!-- Icon -->
                    <input required class="entry" type="email" name="email" placeholder="Correo" v-model="email"> <!-- Input element -->
                </div>
                <div class="input-field"> <!-- Imput container -->
                    <i class="material-icons prefix">lock</i> <!-- Icon -->
                    <input required class="entry" type="password" name="password" placeholder="Contraseña" v-model="password"> <!-- Input element -->
                </div>                
                <button class="btn" id="btn_login" v-on:click='login' type="submit">Ingresar</button> <!-- Button to action method{login}-->
            </form>
        </div>
    </div>
</template>
<script>
    //imports
import db from "./../components/firebaseInit"; //conexion db
import firebase from 'firebase'; //firebase app
import toastr from 'toastr'; //Notification

export default {
    name: 'login', //View name
    data: function (){ //declarate data will be use
        return{ //reclared values
            email : '',
            password : '',
            url_email : '',
            url_password : ''
        }
    },created(){ //method execute with view
            //Get icons
        db.collection('url') //define collection
          .get() 
          .then(querySnapshot => { //define object
            querySnapshot.forEach(doc => { //iterate objetc
              if('correo' == doc.data().name){ //valida name
                this.url_email = doc.data().url //assing value
              }
              if('pass' == doc.data().name){  //valida name
                this.url_password = doc.data().url //assing value
              }
            })
          });
    },methods:{ 
        login: function(e){
            firebase 
            .auth() //object auth
            .signInWithEmailAndPassword(this.email, this.password) //method to sign in with email and password
            .then( //so
                user => { //object user
                    this.$router.go({path: this.$router.path}); //Redireccionar a raiz
                    user.displayName;
                },
                err => { //object err
                    toastr.error(err.message); //Show notification
                    this.email = ''; //clean input
                    this.password = '' //clean input
                }
            ); e.preventDefault(); //quita las funciones default del evento
        }
    }
}
</script>
<style>
/* Login container*/
.Login{
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
}
/* Form container*/
.form-request-login{
    margin-top: 5%;
    padding: 5%;
    background-color: #78909c;
}
/* Botton login*/
.btn_login{
    margin-top: 5%;
}
/* Icons */
.icon{
    width: 30px;
    height: 30px;
    display: block;
}
/*Containers*/
.con{ display: inline; }
/*inputs with id 'entry'*/
.entry{
    display: block;
    color: white;
}

</style>
