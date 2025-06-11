<template>
    <!-- <div class="col-lg-2"> -->
        <div class="card-industries mx-5 mb-5">
            <img :class="[sizeRaw == 'large' ? '' : 'small']" :src="imgUrl" alt="">
        </div>
    <!-- </div> -->
</template>

<script>
export default {
    props: {
        data: Object,
    },
    data(){
        return {
            imgUrl: this.data.imgUrl,
            sizeRaw: this.data.sizeRaw
        }
    }
}
</script>