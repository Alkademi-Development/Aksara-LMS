<template>
    <div class="col col-lg-4">
        <div class="card-benefits">
            <h1>{{title}}</h1>
            <div v-html="description"></div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: Object
    },
    data() {
        return {
            title: this.data.title,
            description: this.data.description
        }
    }
}
</script>