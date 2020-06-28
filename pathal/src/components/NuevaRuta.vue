<template>
    <div class="NuevaRuta">
        <div class="middle_containter"> <!-- Order -->
            <div class="title_nav"> <!-- title nav -->
                <ul id="titlesContent" > <!-- content -->
                    <li class="collectiones"> <!-- item -->
                        <h5>Pedidos Pendientes</h5> <!-- title -->
                    </li> 
                </ul>
            </div>
            <table> <!-- init table -->
                <thead> <!-- title container -->
                    <tr> <!-- titles -->
                        <th>Imagen</th>
                        <th>Fecha Entrega</th>
                        <th>Hora Entrega</th>
                        <th>Sucursal</th>
                        <th>Agregar</th>
                    </tr>
                </thead>
                <tbody> <!-- table body -->
                    <tr v-for="order_hecho in orders_hecho" v-bind:key="order_hecho.id">  <!-- iterate by orders -->
                        <td> <!-- row -->
                            <span v-for="model in models" v-bind:key="model.id"> <!-- iterate by models -->
                                <span v-if="order_hecho.modelo == model.id"> <!-- validate model with id -->
                                    <img v-bind:src="model.url" width="100"/>  <!-- show image by external url -->
                                </span>
                            </span>
                        </td>
                        <td>{{order_hecho.fecha_entrega}}</td> <!-- show info -->
                        <td>{{order_hecho.hora_entrega}}</td>
                        <td>{{order_hecho.sucursal}}</td>
                        <td>
                        <img v-on:click="agregar(order_hecho.id)" class="icon_add" v-bind:src="icon_add" alt="Add"> <!-- icon with method-->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="middle_containter"> <!-- Add -->
            <div class="title_nav"> <!-- title nav -->
                <ul id="titlesContent" > <!-- content -->
                    <li class="collectiones"> <!-- item -->
                        <h5>Pedidos Agregados</h5> <!-- title -->
                    </li>
                </ul>
            </div>
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
                    <tr v-for="order_add in orders_adds" v-bind:key="order_add.id">  <!-- iterate by orders -->
                        <td> <!-- row -->
                            <span v-for="model in models" v-bind:key="model.id"> <!-- iterate by models -->
                                <span v-if="order_add.modelo == model.id"> <!-- validate model with id -->
                                    <img v-bind:src="model.url" width="100"/>  <!-- show image by external url -->
                                </span>
                            </span>
                        </td>
                        <td>{{order_add.fecha_entrega}}</td> <!-- show info -->
                        <td>{{order_add.hora_entrega}}</td>
                        <td>{{order_add.sucursal}}</td>
                        <td>
                        <img v-on:click="cancelar(order_add.id)" class="icon_remove" v-bind:src="icon_remove" alt="Add"> <!-- icon with method-->
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="container"> <!-- container -->
                <button v-on:click="initRuta" class="btn">Iniciar Ruta</button> <!-- button with method -->
            </div>
        </div>
    </div>
</template>

<script>
  //Imports
import db from "./firebaseInit"; //data base
import toastr from 'toastr'; //notification

export default { //default
    name: 'NuevaRuta',
    data(){ //return data
        return{
            new_id_ruta : '',
            orders_hecho: [], //orders object
            orders_adds:[],
            models: [], //models object
                //icons
            icon_remove:'https://firebasestorage.googleapis.com/v0/b/pathal-9076d.appspot.com/o/iconos%2Fremove.png?alt=media&token=3e322f81-9c02-4740-9ec1-56f82663f0e0',
            icon_add: 'https://firebasestorage.googleapis.com/v0/b/pathal-9076d.appspot.com/o/iconos%2Fcheckmark.png?alt=media&token=7887863d-6003-482f-9535-2a5f0c701b01'
        }
    }, 
    props: { //get data with recive of viwe
        deliver_id:String//set format
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
        setTimeout(this.getPedidoData,750); //Call getPedidoData with retart
    },
    methods:{
        reloadView() { //reload view
            this.$router.go(0);
        },
        agregar(current_id){
            toastr.success("Pedido agregado"); //show alert
            db.collection("pedido").doc(current_id).update({"estatus":"Agregado","repartidor":this.deliver_id}); //set estatus to 'Agregadp'
            setTimeout(this.reloadView,750); //Call filter with delay
        },
        cancelar(current_id){
            if (confirm("¿Esta seguro de remover el pedido de la ruta?")){ //call method with params
                db.collection("pedido").doc(current_id).update({"estatus":"Preparado"}); //set estatus to 'Hecho'
                toastr.success('Pedido Cancelado'); //show notification
                setTimeout(this.reloadView,750); //Call filter with delay
            }else{
                toastr.warning("El pedido no se ha cancelado"); //show alert
            }
        },
        initRuta(){
            if(this.orders_adds.length != 0){ //validate number of items
                this.updatePedidoData(); //Call filter with delay
                toastr.success("Ruta Iniciada"); //show alert
                db.collection("employees").doc(this.deliver_id).update({"working":true}); //change status of baker
                setTimeout(this.reloadView,1000); //Call clientData with retar 
            }else{
                toastr.error("Debes agregar pedidos antes de iniciar la ruta"); //show alert
            }
        },
        updatePedidoData(){ //method
            this.orders_adds.forEach(misdatos => { //iterate with each element
                db.collection("pedido").doc(misdatos.id).update({"estatus":"En camino","repartidor":this.deliver_id}); //set estatus to 'En camino'
            });
        },
        getPedidoData(){
            db.collection("pedido") //get data of pedido order
                .where("estatus","==","Preparado")
                .get() 
                .then(querySnapshot => { //get object
                    querySnapshot.forEach(doc => { //iterate object
                    const pedido_hecho_data = { //declared object and reference with formats
                        id: doc.id,
                        estatus: doc.data().estatus,
                        fecha_entrega: doc.data().entrega.substring(0,4) +'-' + doc.data().entrega.substring(4,6) + '-'+doc.data().entrega.substring(6,8),
                        hora_entrega: doc.data().entrega.substring(8,10) + ':' + doc.data().entrega.substring(10,12),
                        modelo: doc.data().modelo,
                        sucursal: doc.data().sucursal
                    }; this.orders_hecho.push(pedido_hecho_data); //push pedido_hecho_data into orders_hecho
                    });
                });
            db.collection("pedido") //get data of pedido add
                .where("repartidor","==",this.deliver_id) //filter by sucursal
                .where("estatus","==","Agregado")
                .get() 
                .then(querySnapshot => { //get object
                    querySnapshot.forEach(doc => { //iterate object
                    const pedido_add_data = { //declared object and reference with formats
                        id: doc.id,
                        estatus: doc.data().estatus,
                        fecha_entrega: doc.data().entrega.substring(0,4) +'-' + doc.data().entrega.substring(4,6) + '-'+doc.data().entrega.substring(6,8),
                        hora_entrega: doc.data().entrega.substring(8,10) + ':' + doc.data().entrega.substring(10,12),
                        modelo: doc.data().modelo,
                        sucursal: doc.data().sucursal
                    }; this.orders_adds.push(pedido_add_data); //push pedido_add_data into orders_adds
                    });
                });
        }
    }
}
</script>

<style>

.collectiones{
    display: inline-block;
    margin: 0px;
    padding-left: 10px;
    padding-right: 10px;
}

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

.NuevaRuta{
    text-align: center;
}

.middle_containter{
    display: inline-block;
    width: 40%;
    margin-right: 5%; 
    vertical-align: top;
}

</style>