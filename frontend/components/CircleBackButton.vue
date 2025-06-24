<template>
    <div @click="onClick" class="btn mr-3 icon icon-shape bg-dark text-white rounded-circle shadow">
        <i class="ni ni-bold-left"></i>
    </div>
</template>

<script>
export default {
    methods: {
        onClick() {
            this.$router.go(-1)
        }
    }
}
</script>