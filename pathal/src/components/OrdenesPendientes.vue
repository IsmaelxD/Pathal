<template>
    <div class="OrdenesPendientes"> <!-- Container -->
        <table> <!-- init table -->
            <thead> <!-- title container -->
                <tr> <!-- titles -->
                    <th>Imagen</th>
                    <th>Fecha Entrega</th>
                    <th>Hora Entrega</th>
                    <th>Repartidor</th>
                    <th>Sucursal</th>
                    <th>Estatus</th>
                    <th>Agregar</th>
                </tr>
            </thead>
            <tbody> <!-- table body -->
                <tr v-for="order in orders" v-bind:key="order.id">  <!-- iterate by orders -->
                    <td> <!-- row -->
                        <span v-for="model in models" v-bind:key="model.id"> <!-- iterate by models -->
                            <span v-if="order.modelo == model.id"> <!-- validate model with id -->
                                <img v-bind:src="model.url" width="100"/>  <!-- show image by external url -->
                            </span>
                        </span>
                    </td>
                    <td>{{order.fecha_entrega}}</td> <!-- Show data -->
                    <td>{{order.hora_entrega}}</td>
                    <td> <!-- row -->
                        <span v-for="employed in employees" v-bind:key="employed.id"> <!-- iterate by employeds -->
                            <span v-if="order.repartidor == employed.id"> <!-- validate deliverman with id -->
                                {{employed.name}}
                            </span>
                        </span>
                    </td>
                    <td>{{order.sucursal}}</td>
                    <td>{{order.estatus}}</td>
                    <td>
                       <img v-on:click="add(order.id)" class="icon_add" v-if="order.estatus=='En camino'" v-bind:src="icon_add" alt="Add"> 
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
        //Imports
    //conextion
import db from "./firebaseInit"; //data base
    //others
import toastr from 'toastr'; //notification

export default {
    name: 'ordenes_pendientes',
    data(){ //return data
        return{
            orders: [], //orders object
            models: [], //models object
            employees:[], //employees object
                //icons
            icon_add: 'https://firebasestorage.googleapis.com/v0/b/pathal-9076d.appspot.com/o/iconos%2Fcheckmark.png?alt=media&token=7887863d-6003-482f-9535-2a5f0c701b01'
        }
    }, 
    props: { //get data with recive of viwe
        data_supervisor_id:String, //set format
        data_supervisor_sucursal:String //set format
    },
    created(){ //Method that execute init view
        db.collection("modelo") //get data from modelo
            .get()
            .then(querySnapshot => { //create object
                querySnapshot.forEach(doc => { //iterate object
                const modelo_data = { //define object and insert data
                    id: doc.id,
                    url: doc.data().url
                };
                this.models.push(modelo_data); //add modelo_data to models
                })
            });
        db.collection("pedido") //get data of pedido
          .where("sucursal","==",this.data_supervisor_sucursal) //filter by sucursal
          .where("estatus","==","En camino") //filter by status
          .get() 
          .then(querySnapshot => { //get object
            querySnapshot.forEach(doc => { //iterate object
              const pedido_data = { //declared object and reference with formats
                id: doc.id,
                estatus: doc.data().estatus,
                fecha_entrega: doc.data().entrega.substring(0,4) +'-' + doc.data().entrega.substring(4,6) + '-'+doc.data().entrega.substring(6,8),
                hora_entrega: doc.data().entrega.substring(8,10) + ':' + doc.data().entrega.substring(10,12),
                modelo: doc.data().modelo,
                repartidor: doc.data().repartidor,
                sucursal: doc.data().sucursal
              };
              this.orders.push(pedido_data); //push pedido_data into orders
            });
          });  
        setTimeout(this.employed,750); //Call clientData with retar 
    },
    methods:{
        employed(){ //method to get employees data
            db.collection("employees") //get data of employed
                .get() 
                .then(querySnapshot => { //get object
                    querySnapshot.forEach(doc => { //iterate object
                    const employed_data = { //declared object and reference with formats
                        id: doc.id,
                        name: doc.data().name + " " + doc.data().last_name
                    };
                    this.employees.push(employed_data); //push employed_data into orders
                    });
                });
        },
        reloadView() { this.$router.go(0); }, //reload view 
        add(current_id){ //agregar pastel function
            if (confirm("¿Verifico el correcto estado del pastel?")){ //call method with params
                db.collection("pedido").doc(current_id).update({"estatus":"En sucursal"}); //set status to 'En sucursal'
                toastr.success('Pastel Agregado a Almacen'); //show notification
                setTimeout(this.reloadView,750); //Call filter with delay 
            }else{
                alert("Debé verificar el correcto estado del pastel antes de poder agregarlo"); //show alert
            }
        }
    }
}
</script>

<style>

.icon_remove{
    width: 50px;
    height: 60px;
}

.icon_add{
    width: 50px;
    height: 50px;
}

.icon_add:hover , .icon_remove:hover{
    cursor: pointer;
}

</style>
