<script>
    //Imports conection
import db from './../components/firebaseInit' //db firebase
import firebase from 'firebase'; //firebase object

export default { //Default execute
    name: "route", //name of view
    created(){ //execute with view
        db.collection('employees') //get employed collection
        .get()
        .then(querySnapshot => { //object of query
            querySnapshot.forEach(doc => { //iterate object
            console.log(doc);
                if(firebase.auth().currentUser.email == doc.data().email){ //validate email of current user with email of data
                    console.log("Ocupation: "+doc.data().ocupation);
                    this.$router.go({path: this.$router.push('/'+doc.data().ocupation)}); //route for kind of employed
                }
            })
          });
    }
}
</script>