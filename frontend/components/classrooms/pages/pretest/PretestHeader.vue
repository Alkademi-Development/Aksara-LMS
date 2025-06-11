<template>
    <div class="d-md-flex align-items-center justify-content-between gap-4">
        <h5 v-html="title"></h5>
        <div class="d-flex gap-4 mt-4 mt-md-0">
            <b-button
                v-if="actionBtnTitle"
                class="text-uppercase mr-0"
                variant="primary"
                @click="$emit('actionBtnCallback')"
            >{{ actionBtnTitle }}</b-button>
            <b-button
                v-if="actionBtnTitle2"
                class="text-uppercase"
                variant="primary"
                @click="$emit('actionBtnCallback2')"
            >{{ actionBtnTitle2 }}</b-button>
            <!-- <nuxt-link
                v-if="actionRouteTitle"
                class="btn btn-primary text-uppercase"
                :to="actionRoute"
            >{{ actionRouteTitle }}</nuxt-link> -->
        </div>
    </div>
</template>

<script>
export default {
    props: ['title', 'actionRoute', 'actionBtnTitle', 'actionBtnTitle2']
}
</script>

<style lang="scss" scoped>
::v-deep .btn {
    white-space: nowrap;
}
</style>