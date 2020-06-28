<template>
    <div class="Supervisor_Dashboard"> <!-- Container -->
        <div class="title_nav"> <!-- title bar -->
            <ul id="titlesContent" > <!-- content -->
                <li v-on:click="showComponent('OA')" id="OA" class="collections"> <!-- item with method-->
                    <div class="element"> <!-- design -->
                        <img class="icon" v-bind:src="supervisor1" alt="Icon1"> <!-- icon -->
                    </div>
                    <div class="element"> 
                        <h5>Ordenes en Almacen</h5> <!-- title -->
                    </div>
                </li>
                <li v-on:click="showComponent('OP')" id="OP" class="collections">
                    <div class="element">
                        <img class="icon" v-bind:src="supervisor2" alt="Icon2">
                    </div>
                    <div class="element">
                        <h5>Ordenes Pendientes</h5>
                    </div>
                </li>
                <li v-on:click="showComponent('HP')" id="HP" class="collections">
                    <div class="element">
                        <img class="icon" v-bind:src="supervisor3" alt="Icon3">
                    </div>
                    <div class="element">
                        <h5>Historial de Pedidos</h5>
                    </div>
                </li>
            </ul>
        </div>
        <div v-if="HistorialPedidoView" class="content_view"> <!-- component filter -->
            <HistorialPedido v-bind:data_supervisor_id="supervisor_id" v-bind:data_supervisor_sucursal="supervisor_sucursal"/>  <!-- component init with params -->
        </div>
        <div v-if="OrdenesPendientesView" class="content_view">
            <OrdenesPendientes v-bind:data_supervisor_id="supervisor_id" v-bind:data_supervisor_sucursal="supervisor_sucursal"/>
        </div>
        <div v-if="OrdenesAlmacenView" class="content_view">
            <OrdenesAlmacen v-bind:data_supervisor_id="supervisor_id" v-bind:data_supervisor_sucursal="supervisor_sucursal"/>
        </div>
    </div>
</template>

<script>
        //Imports
    //Conexion
import db from "./../../components/firebaseInit"; //firebase db
import firebase from 'firebase' //firebase object

    //components
import HistorialPedido from './../../components/HistorialPedidos.vue' //Historial de Pedido
import OrdenesPendientes from './../../components/OrdenesPendientes.vue' //Ordenes Pendientes
import OrdenesAlmacen from './../../components/OrdenesAlmacen.vue' //Ordenes en Almacen

export default { //default
    name: 'supervisor_dashboard',
    components: { //reference components
        HistorialPedido,
        OrdenesPendientes,
        OrdenesAlmacen
    },
    data(){ //data will be return
        return{
                //supervisor data
            supervisor_id: '',
            supervisor_sucursal: '',
                //Views Status
            OrdenesAlmacenView : false,
            OrdenesPendientesView: false,
            HistorialPedidoView: false,
                //Icons
            supervisor1: 'https://firebasestorage.googleapis.com/v0/b/pathal-9076d.appspot.com/o/iconos%2FSupersivor1.png?alt=media&token=729af1fc-ae23-431a-985f-95eaa9ebd5cb',
            supervisor2: 'https://firebasestorage.googleapis.com/v0/b/pathal-9076d.appspot.com/o/iconos%2FSupervisor2.png?alt=media&token=92528147-2ae8-4f42-841a-034eb76e8e0d',
            supervisor3: 'https://firebasestorage.googleapis.com/v0/b/pathal-9076d.appspot.com/o/iconos%2FSupervisor3.png?alt=media&token=3409f779-80a5-4467-ac12-76ceda71b7ad'
        }
    },
    created() { //execute init view
        db.collection('employees') //get data of employed
        .get()
        .then(querySnapshot => { //create object
            querySnapshot.forEach(doc => { //iterate object
                if(firebase.auth().currentUser.email == doc.data().email){ //validate curren email with each for object
                    if(doc.data().ocupation != 'supervisor'){ //valdate ocupation
                        this.$router.go({path: this.$router.push('/'+doc.data().ocupation)}); //redirect for correct path
                    }else{
                        this.supervisor_id = doc.id; //set id to baker
                        this.supervisor_sucursal = doc.data().sucursal;
                    }
                }
            })
          });
    },
    methods:{//some funcionalities
        showComponent(view_current){ //changes components views
                //reset all views to false
            this.HistorialPedidoView = false;
            this.OrdenesPendientesView = false;
            this.OrdenesAlmacenView = false;
                //set classes
            document.getElementById("HP").className= 'collections'; 
            document.getElementById("OP").className= 'collections';
            document.getElementById("OA").className= 'collections';
            switch(view_current){ //select view choosed
                case "HP":
                    this.HistorialPedidoView = true; //set true of view
                    document.getElementById("HP").className= 'current_collections'; //set class
                break;
                case "OP":
                    this.OrdenesPendientesView = true;
                    document.getElementById("OP").className= 'current_collections';
                break;
                case "OA": 
                    this.OrdenesAlmacenView = true;
                    document.getElementById("OA").className= 'current_collections';
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
