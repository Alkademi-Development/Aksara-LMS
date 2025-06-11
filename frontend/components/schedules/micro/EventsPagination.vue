<template>
    <div class="d-flex align-items-center justify-content-between">
        <b-button
            variant="-"
            class="rounded-circle btn-paginate"
            :disabled="pagination?.page === 1 ? true : false"
            @click="$emit('prev')"
        ><i class="ri-arrow-left-s-line"></i></b-button>
        <b-button
            variant="-"
            class="rounded-circle btn-paginate"
            :disabled="pagination?.page >= pagination?.totalPages"
            @click="$emit('next')"
        ><i class="ri-arrow-right-s-line"></i></b-button>
    </div>
</template>

<script>
export default {
    props: [ 'pagination' ]
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/components/schedules/micro/pagination.scss";
</style>