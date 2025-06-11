<template>
    <div :class="`back-arrow ${ customClass }`" @click="onBackClick">
        <i class="ri-arrow-left-line mr-0"></i>
        {{ title }}
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    props: {
        title: {
            type: String,
            default: "Kembali"
        },
        customClass: {
            type: String,
            default: "border rounded"
        },
    },
    computed: {
        ...mapState({
            breadcrumbsState: (state) => state?.Layouts?.breadcrumbs,
        })
    },
    methods: {
        onBackClick() {
            const numberOfBreadcrumbs = this.breadcrumbsState?.length;
            this.$router?.replace(numberOfBreadcrumbs > 1 ? this.breadcrumbsState[numberOfBreadcrumbs - 2]?.route : this.breadcrumbsState[0]?.route);
            // this.$router.go(-1)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';
</style>