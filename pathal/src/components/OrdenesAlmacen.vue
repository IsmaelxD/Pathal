<template>
    <div class="OrdenesAlmacen">
        <table> <!-- init table -->
            <thead> <!-- title container -->
                <tr> <!-- titles -->
                    <th>Imagen</th>
                    <th>Fecha Entrega</th>
                    <th>Hora Entrega</th>
                    <th>Sucursal</th>
                    <th>Piezas</th>
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
                    <td>{{order.fecha_entrega}}</td>
                    <td>{{order.hora_entrega}}</td>
                    <td>{{order.sucursal}}</td>
                    <td>{{order.pago}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
        //Imports
    //conextion
import db from "./firebaseInit"; //data base

    //Others
import toastr from 'toastr'; //notification

export default {
    name: 'ordenes_almacen',
    data(){ //return data
        return{
                //object data
            orders: [], 
            models: [], 
            clients:[], 
                //icons
            icon_remove:'https://firebasestorage.googleapis.com/v0/b/pathal-9076d.appspot.com/o/iconos%2Fremove.png?alt=media&token=3e322f81-9c02-4740-9ec1-56f82663f0e0',
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
          .where("estatus","==","En sucursal") //filter by status
          .get() 
          .then(querySnapshot => { //get object
            querySnapshot.forEach(doc => { //iterate object
              const pedido_data = { //declared object and reference with formats
                id: doc.id,
                estatus: doc.data().estatus,
                fecha_entrega: doc.data().entrega.substring(0,4) +'-' + doc.data().entrega.substring(4,6) + '-'+doc.data().entrega.substring(6,8),
                hora_entrega: doc.data().entrega.substring(8,10) + ':' + doc.data().entrega.substring(10,12),
                modelo: doc.data().modelo,
                pastelero: doc.data().pastelero,
                repartidor: doc.data().repartidor,
                folio: doc.data().folio,
                id_cliente: doc.data().id_cliente,
                pago: doc.data().pago,
                sucursal: doc.data().sucursal
              };
              this.orders.push(pedido_data); //push pedido_data into orders
            });
          });
        setTimeout(this.clientData,750); //Call clientData with retar 
    },
    methods:{
        clientData(){ //method to get clients data
            db.collection("cliente") //get data of pedido
                .get() 
                .then(querySnapshot => { //get object
                    querySnapshot.forEach(doc => { //iterate object
                    const client_data = { //declared object and reference with formats
                        id: doc.id,
                        name: doc.data().name + " " + doc.data().last_name
                    };
                    this.clients.push(client_data); //push client_data into orders
                    });
                });
        },
        reloadView() { this.$router.go(0); }, //reload view
        add(current_id){ //entregar pedido function
            if (confirm("¿Verifico el pago del cliente?")){ //call method with params
                db.collection("pedido").doc(current_id).update({"estatus":"Entregado"}); //set status to Entregado
                toastr.success('Pastel Enregado'); //show notification
                setTimeout(this.reloadView,750); //Call filter with delay 
            }else{
                alert("Debé verificar la nota antes de poder entregar el pedido"); //show alert
            }
        },
        liquidar(current_id){
            if (confirm("¿Registro el pago?")){ //call method with params
                db.collection("pedido").doc(current_id).update({"pago":"0"}); //set pago to 0
                toastr.success('Pedido Liquidado'); //show notification
                setTimeout(this.reloadView,750); //Call filter with delay
            }else{
                alert("Debé registrar el pago antes de poder liquidar el pedido"); //show alert
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
