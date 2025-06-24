<template>
    <div class="row header-wrapper">
        <div class="col-lg-8 mx-auto">
            <h1>{{title}}</h1>
            <p>{{description}}</p>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        data: Object,
        isPrimary: {
            default: false,
            type: Boolean,
        },
    },
    data(){
        return {
            title: this.data.title,
            description: this.data.description,
        }
    }
}
</script>