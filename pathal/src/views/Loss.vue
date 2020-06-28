<template>
    <div class="Loss"> <!-- container -->
        <img v-bind:src="url_404" alt="Not found" class="background_image"> <!-- img with external url -->
    </div>
</template>

<script>
export default {
    name: 'loss',
    data(){ //data will be used
        return{
            url_404: 'https://www.sageisland.com/wp-content/uploads/2015/04/creative-404-error-page-design-marketing-assets.jpg' //external image
        }
    }
}
</script>

<style>

.Loss{
    width: 100%;
    height: 100%;
}

.background_image{
    width: 100%;
    height: 100%;
}

</style>