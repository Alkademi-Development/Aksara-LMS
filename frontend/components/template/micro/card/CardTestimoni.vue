<template>
    <div class="card-testimoni">
        <p>"{{comment}}"</p>
        <h4>- {{name}}</h4>
        <span>{{origin}}</span>
    </div>
</template>

<script>
export default {
    props:{
        data: Object
    },
    data() {
        return {
            comment: this.data.comment,
            name: this.data.name,
            origin: this.data.origin,
        }
    }
}
</script>