<template>
    <div class="RutaActual">
        <table> <!-- init table -->
            <thead> <!-- title container -->
                <tr> <!-- titles -->
                    <th>Imagen</th>
                    <th>Fecha Entrega</th>
                    <th>Hora Entrega</th>
                    <th>Sucursal</th>
                    <th>Cancelar</th>
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
                    <td>{{order.fecha_entrega}}</td> <!-- show info -->
                    <td>{{order.hora_entrega}}</td>
                    <td>{{order.sucursal}}</td>
                    <td>
                       <img v-on:click="cancelar(order.id)" class="icon_remove" v-bind:src="icon_remove" alt="Add"> <!-- icon with method-->
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="container"> <!-- container -->
            <button v-on:click="finishRoute" class="btn">Finalizar Ruta</button> <!-- button with method -->
        </div>
    </div>
</template>

<script>
        //Imports   
    //firebase
import db from "./firebaseInit"; //data base
    //toastr
import toastr from 'toastr'; //notification

export default { //default
    name: 'ruta_actual',
    data(){ //return data
        return{
            orders: [], //orders object
            models: [], //models object
                //icons
            icon_remove:'https://firebasestorage.googleapis.com/v0/b/pathal-9076d.appspot.com/o/iconos%2Fremove.png?alt=media&token=3e322f81-9c02-4740-9ec1-56f82663f0e0',
            icon_add: 'https://firebasestorage.googleapis.com/v0/b/pathal-9076d.appspot.com/o/iconos%2Fcheckmark.png?alt=media&token=7887863d-6003-482f-9535-2a5f0c701b01'
        }
    }, 
    props: { //get data with recive of viwe
        deliver_id:String,//set format
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
        setTimeout(this.getRutaData,750); //Call getEutaData with retart
    },
    methods:{
        reloadView() { //reload view
            this.$router.go(0);
        },
        cancelar(current_id){
            if (confirm("¿Esta seguro?")){ //call method with params
                db.collection("pedido").doc(current_id).update({"estatus":"Preparado","repartidor":""}); //set estatus to 'Hecho'
                toastr.success('Pedido Cancelado'); //show notification
                setTimeout(this.reloadView,750); //Call filter with delay
            }else{
                toastr.warning("El pedido no se ha cancelado"); //show alert
            }
        },
        finishRoute(){
            if(this.orders.length == 0){ //validate number of items
                toastr.success("Ruta finalizada"); //show alert
                db.collection("employees").doc(this.deliver_id).update({"working":false}); //change status of baker
                setTimeout(this.reloadView,1000); //Call clientData with retar 
            }else{
                toastr.error("Debes resolver las entregas antes de finalizar la ruta"); //show alert
            }
        },
        getRutaData(){
            db.collection("pedido") //get data of pedido
                .where("repartidor","==",this.deliver_id) //filter by ruta
                .where("estatus","==","En camino")
                .get() 
                .then(querySnapshot => { //get object
                    querySnapshot.forEach(doc => { //iterate object
                    const pedido_data = { //declared object and reference with formats
                        id: doc.id,
                        estatus: doc.data().estatus,
                        fecha_entrega: doc.data().entrega.substring(0,4) +'-' + doc.data().entrega.substring(4,6) + '-'+doc.data().entrega.substring(6,8),
                        hora_entrega: doc.data().entrega.substring(8,10) + ':' + doc.data().entrega.substring(10,12),
                        modelo: doc.data().modelo,
                        sucursal: doc.data().sucursal
                    }; this.orders.push(pedido_data); //push pedido_data into orders
                    });
                });
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

.container{
    text-align: center;
}

.btn{
    margin: 2%;
}

</style>