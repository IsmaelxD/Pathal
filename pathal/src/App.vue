<template>
  <div id="App"> <!-- container -->
    <div id="Navbar"> <!--container -->
      <Navbar/> <!-- component -->
    </div>
    <router-view/> <!-- router container -->
  </div>
</template>

<script>
    //Imports
  //components
import Navbar from '@/components/Navbar.vue' //Navbar component

  //default
export default {
  name:'App',
  components: { //init components
    Navbar
  }
}
</script>

<style>

#App {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  color: #2c3e50;
  margin: 0%;
}

</style>