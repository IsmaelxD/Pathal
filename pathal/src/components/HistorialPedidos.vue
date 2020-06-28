<template>
    <div class="HistorialPedidos"> <!-- Container -->
        <table> <!-- init table -->
            <thead> <!-- title container -->
                <tr> <!-- titles -->
                    <th>Imagen</th>
                    <th>Fecha Orden</th>
                    <th>Fecha Entrega</th>
                    <th>Hora Entrega</th>
                    <th>Sucursal</th>
                    <th>Piezas</th>
                    <th>Folio</th>
                    <th>Pastelero</th>
                    <th>Repartidor</th>
                    <th>Estatus</th>
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
                    <td>{{order.fecha_orden}}</td> <!-- Show data -->
                    <td>{{order.fecha_entrega}}</td>
                    <td>{{order.hora_entrega}}</td>
                    <td>{{order.sucursal}}</td>
                    <td>{{order.pago}}</td>
                    <td>{{order.folio}}</td>
                    <td> <!-- row -->
                        <span v-for="employed in employees" v-bind:key="employed.id"> <!-- iterate by employeds -->
                            <span v-if="order.pastelero == employed.id"> <!-- validate baker with id -->
                                {{employed.name}}
                            </span>
                        </span>
                    </td>
                    <td> <!-- row -->
                        <span v-for="employed in employees" v-bind:key="employed.id"> <!-- iterate by employeds -->
                            <span v-if="order.repartidor == employed.id"> <!-- validate deliverman with id -->
                                {{employed.name}}
                            </span>
                        </span>
                    </td>
                    <td>{{order.estatus}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
        //Imports
    //Conexion
import db from "./firebaseInit"; //data base

export default { //default
    name: 'historial_pedido',
    data(){ //return data
        return{
            orders: [], //orders object
            models: [], //models object
            clients:[], //clients object
            employees:[] //employees object
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
          .where("sucursal","==",this.data_supervisor_sucursal)
          .get() 
          .then(querySnapshot => { //get object
            querySnapshot.forEach(doc => { //iterate object
              const pedido_data = { //declared object and reference with formats
                id: doc.id,
                estatus: doc.data().estatus,
                fecha_orden: doc.data().expediccion.substring(0,4) +'-' + doc.data().expediccion.substring(4,6) + '-'+doc.data().expediccion.substring(6,8),
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
        setTimeout(this.employed,750); //Call employees with retar 
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
        }
    }
}
</script>
