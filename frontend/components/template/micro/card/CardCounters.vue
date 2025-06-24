<template>
    <div class="col col-12 col-md-3 mb-4 mb-md-0">
        <div class="card-counters">
            <h1>{{count}}</h1>
            <p>{{description}}</p>
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
            count: this.data.count,
            description: this.data.description
        }
    }
}
</script>