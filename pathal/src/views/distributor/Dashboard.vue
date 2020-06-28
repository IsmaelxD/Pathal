<template>
    <div class="Distributor_Dashboard"> <!-- Container -->
        <div class="title_nav"> <!-- title nav -->
            <ul id="titlesContent" > <!-- content -->
                <li v-on:click="validateState('RA')" id="RA" class="collections"> <!-- item with method -->
                    <div class="element"> <!-- desing -->
                        <img class="icon" v-bind:src="icon_ruta_actual" alt="Icon1"> <!-- icon -->
                    </div>
                    <div class="element">
                        <h5>Ruta Actual</h5> <!-- title -->
                    </div>
                </li>
                <li v-on:click="validateState('NR')" id="NR" class="collections">
                    <div class="element">
                        <img class="icon" v-bind:src="icon_nueva_ruta" alt="Icon2">
                    </div>
                    <div class="element">
                        <h5>Nueva Ruta</h5>
                    </div>
                </li>
            </ul>
        </div>
        <div v-if="RutaActualView" class="content_view"> <!-- container with validation -->
            <RutaActual v-bind:deliver_id="deliver_id"/> <!-- component with params -->
        </div>
        <div v-if="NuevaRutaView" class="content_view">
            <NuevaRuta v-bind:deliver_id="deliver_id"/>
        </div>
    </div>
</template>

<script>
        //imports
    //conexion
import db from "./../../components/firebaseInit"; //firebase db
import firebase from 'firebase' //firebase object

    //notification
import toastr from 'toastr'; 

    //components
import NuevaRuta from './../../components/NuevaRuta.vue'
import RutaActual from './../../components/RutaActual.vue'

export default {
    name: 'distributor_dashboard',
    components: { //reference components
        NuevaRuta,
        RutaActual
    },
    data(){ //data will be used
        return{
                //supervisor data
            deliver_id: '',
            deliver_working: false,
                //Views Status
            RutaActualView : false,
            NuevaRutaView: false,
                //Icons
            icon_ruta_actual: 'https://firebasestorage.googleapis.com/v0/b/pathal-9076d.appspot.com/o/iconos%2FRepartidor1.png?alt=media&token=16754e6b-6dd4-47d7-82cd-8a9e0878fade',
            icon_nueva_ruta: 'https://firebasestorage.googleapis.com/v0/b/pathal-9076d.appspot.com/o/iconos%2FRepartidor2.png?alt=media&token=3f2c5a9e-73f0-400b-82bf-ff7a07941db7',
        }
    },
    created() {
        db.collection('employees') //Routeing by kind of employed
        .get()
        .then(querySnapshot => { //get object
            querySnapshot.forEach(doc => { //iterate object
                if(firebase.auth().currentUser.email == doc.data().email){ //validate email
                  if(doc.data().ocupation != 'distributor'){ //validate ocupation
                    this.$router.go({path: this.$router.push('/'+doc.data().ocupation)}); //change to correct path
                  }else{
                    this.deliver_id = doc.id,//set id to baker
                    this.deliver_working = doc.data().working //set status deliver_man
                }
                }
            })
          });
    },
    methods:{//some funcionalities
        validateState(view_current){ //set component view
            switch(view_current){ //choose an option
                case "RA":
                    if(this.deliver_working){ //validate state of distribute
                        this.showComponent(view_current); //execute showing method
                    }else{
                        toastr.error('No tienes ruta actual, por lo no puedes ingresar a esta vista '); //show notification
                    }
                break;
                case "NR":
                    if(!this.deliver_working){
                        this.showComponent(view_current);
                    }else{
                        toastr.error('Tienes ruta actual, por lo no puedes ingresar a esta vista '); 
                    }
                break;
            }
        },
        showComponent(view_current){ //changes components views
                //reset all views to false
            this.NuevaRutaView = false;
            this.RutaActualView = false;
                //set classes
            document.getElementById("NR").className= 'collections';
            document.getElementById("RA").className= 'collections';
            switch(view_current){  //select option option
                case "NR":
                    this.NuevaRutaView = true; //set true view
                    document.getElementById("NR").className= 'current_collections'; //change classname
                break;
                case "RA": 
                    this.RutaActualView = true;
                    document.getElementById("RA").className= 'current_collections';
                break;
            }
        }
    }
}
</script>

<style>

.content_view{
    padding-left: 2%;
    padding-right: 2%;
}

.title_nav{
    text-align: center;
}

.titlesContent{
    text-align: center;
}

.collections{
    display: inline-block;
    margin: 20px;
    padding-left: 10px;
    padding-right: 10px;
    border-bottom: 3px solid gray;
    cursor: pointer;
}

.current_collections{
    display: inline-block;
    margin: 20px;
    padding-left: 10px;
    padding-right: 10px;
    border-bottom: 5px solid blue;
    cursor: pointer;
}

.element{
    display: inline-block;
    vertical-align: middle;
    margin:5px;
}

.icon{
    width: 50px;
    height: 50px;
}

</style>