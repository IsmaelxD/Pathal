<template> <!-- Default -->
  <div class="Baker_Dashboard"> <!-- view -->
    <!-- Current Bake -->
    <div v-if="baker_working" class="to-do"> <!-- validate working to show -->
      <ul class="collection with-header"> <!-- title container -->
        <li class="collection-header"> <!-- titlte item -->
          <h4>Pedido Actual</h4> <!-- title -->
        </li>
        <li>
          <table> <!-- init table -->
            <thead> <!-- bar title -->
                <tr> <!-- each element -->
                    <th>Imagen</th>
                    <th>Fecha Entrega</th>
                    <th>Hora Entrega</th>
                    <th>Pan</th>
                    <th>Número de Piezas</th>
                    <th>Terminar</th>
                </tr>
            </thead>
            <tbody> <!-- table components -->
                <tr v-for="order in orders" v-bind:key="order.id"> <!-- iterate by orders -->
                    <td> <!-- celd -->
                        <span v-for="model in models" v-bind:key="model.id"> <!-- iterate by models -->
                            <span v-if="order.modelo == model.id"> <!-- validate model with id -->
                                <img v-bind:src="model.url" width="100"/>  <!-- show image by external url-->
                            </span>
                        </span>
                    </td>
                    <td>{{order.fecha_entrega}}</td> <!-- show fecha_entrega -->
                    <td>{{order.hora_entrega}}</td> <!-- show hora_entrega -->
                    <td>
                        <span v-for="model in models" v-bind:key="model.id">
                            <span v-if="order.modelo == model.id">
                                <h6>{{model.pan}}</h6>
                            </span>
                        </span>
                    </td>
                    <td>
                        <span v-for="model in models" v-bind:key="model.id">
                            <span v-if="order.modelo == model.id">
                                <h6>{{order.pago}}</h6>
                            </span>
                        </span>
                    </td>
                    <td>
                      <img class="img_btn" v-on:click="finish(order)" v-bind:src="url_icon" alt="Add" width="50"> <!-- add image by external src and user onclick with finish and parse order -->
                    </td>
                </tr>
            </tbody>
          </table>
        </li>
      </ul>
    </div>

    <!-- To-Do Table -->
      <div v-if="!baker_working" class="to-do"> <!-- valida working to dont show -->
      <ul class="collection with-header"> <!-- contaniner -->
        <li class="collection-header"> <!-- title container -->
          <h4>Pedidos Pendientes</h4> <!-- titles -->
        </li>
        <li>
          <table> <!-- init table -->
            <thead> <!-- header -->
                <tr> <!-- each element -->
                    <th>Imagen</th>
                    <th>Fecha Entrega</th>
                    <th>Hora Entrega</th>
                    <th>Pan</th>
                    <th>Número Piezas</th>
                    <th>Añadir</th>
                </tr>
            </thead>
            <tbody> <!-- table body -->
                <tr v-for="order in orders" v-bind:key="order.id"> <!-- iterate by orders -->
                    <td> <!-- row -->
                        <span v-for="model in models" v-bind:key="model.id"> <!-- iterate by models -->
                            <span v-if="order.modelo == model.id"> <!-- validate model with id -->
                                <img v-bind:src="model.url" width="100"/>  <!-- show image by external url -->
                            </span>
                        </span>
                    </td>
                    <td>{{order.fecha_entrega}}</td> <!-- show fecha_entrega -->
                    <td>{{order.hora_entrega}}</td>
                    <td>
                        <span v-for="model in models" v-bind:key="model.id">
                            <span v-if="order.modelo == model.id">
                                <h6>{{model.pan}}</h6>
                            </span>
                        </span>
                    </td>
                    <td>
                        <span v-for="model in models" v-bind:key="model.id">
                            <span v-if="order.modelo == model.id">
                                <h6>{{order.pago}}</h6>
                            </span>
                        </span>
                    </td>
                    <td>
                      <img class="img_btn" v-on:click="add(order)" v-bind:src="url_icon" alt="Add" width="50"> <!-- add image by external src and user onclick with finish and parse order -->
                    </td>
                </tr>
            </tbody>
          </table>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  //Imports
import db from "./../../components/firebaseInit"; //data base
import firebase from 'firebase'; //firebase
import toastr from 'toastr'; //notification

export default { //default
  name: "baker_dashboard", //view name
  data() { //return data
    return {
        //items data
      orders: [],
      models: [],
        //baker data
      baker_id: '',
      baker_working: false,
        //icons
      url_icon:'https://firebasestorage.googleapis.com/v0/b/pathal-9076d.appspot.com/o/iconos%2Fcheckmark.png?alt=media&token=7887863d-6003-482f-9535-2a5f0c701b01' //external url for icon
    }
  },
  created() { //Method that execute init view
    db.collection('employees') //get data of employed
      .get()
      .then(querySnapshot => { //create object
        querySnapshot.forEach(doc => { //iterate object
          if(firebase.auth().currentUser.email == doc.data().email){ //validate curren email with each for object
            if(doc.data().ocupation != 'baker'){ //valdate ocupation
              this.$router.go({path: this.$router.push('/'+doc.data().ocupation)}); //redirect for correct path
            }else{
              this.baker_id = doc.id, //set id to baker
              this.baker_working = doc.data().working //set status to baker
            }
          }
        })
      });

    db.collection("modelo") //get data from modelo
      .get()
      .then(querySnapshot => { //create object
        querySnapshot.forEach(doc => { //iterate object
          const modelo_data = { //define object and insert data
            id: doc.id,
            nombre: doc.data().nombre,
            pan: doc.data().pan,
            relleno: doc.data().relleno,
            cubierta: doc.data().cubierta,
            url: doc.data().url,
            num_personas: doc.data().num_personas
          };
          this.models.push(modelo_data); //add data to models
        })
      });
    setTimeout(this.filter,750); //Call filter with retar 
  },
  methods:{ //some methods to reused
    add(order){ //add bake to baker
      db.collection("pedido").doc(order.id).update({"estatus":"Producción"}); //change status of bake to 'Producción'
      db.collection("employees").doc(this.baker_id).update({"working":true}); //change status of baker
      db.collection("pedido").doc(order.id).update({"pastelero":this.baker_id}); //set baker to bake
      toastr.success('Pastel Añadido'); //show notification
      setTimeout(this.reloadView,500); //Set timer to reload view
    },

    finish(order){ //finish bake
      db.collection("pedido").doc(order.id).update({"estatus":"Preparado"}); //change status of bake to 'Hecho'
      db.collection("employees").doc(this.baker_id).update({"working":false}); //change status of baker
      toastr.success('Pastel Terminado'); //show notification
      setTimeout(this.reloadView,500); //Set timer to reload view
    },
    reloadView() { //reload view
      this.$router.go(0);
    },
    filter(){ //Filter by working
      if(this.baker_working==true){ //Validate working
        db.collection("pedido") //get data pedido
          .where("estatus","==","Producción") //filter by status
          .where("pastelero","==",this.baker_id) //filter by baker
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
                pago: doc.data().pago
              };
              this.orders.push(pedido_data); //push pedido_data into orders
            });
          });
      }else{
        db.collection("pedido") //get data of pedido
          .where("estatus","==","Orden")
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
                pago: doc.data().pago
              };
              this.orders.push(pedido_data); //push pedido_data into orders
            });
          });
      }
    }
  }
};
</script>

<style>
/*Center text of tables*/
.collection-header, th, td{
    text-align: center;
}
/*set space btw router-vue and baker-vue*/
.Baker_Dashboard{
    padding: 2%;
}
/*change pointer*/
.img_btn:hover{ 
  cursor: pointer;
}
</style>