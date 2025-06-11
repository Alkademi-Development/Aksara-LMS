<template>
    <div class="content-header d-flex align-items-center justify-content-between mb-4">
        <h5 class="fc-active-month mb-0">{{ title }}</h5>
        <b-button v-if="userKind === 'admin' || userKind === 'superadmin'" variant="outline-primary" size="sm" @click="$router.push(urlAction)"><i class="ri-add-line"></i></b-button>
    </div>
</template>

<script>
export default {
    props: ['title', 'urlAction'],

    data() {
        return { userKind: localStorage?.getItem('user_kind') }
    }
}
</script>

<style lang="scss" scoped>
button {
    font-size: 0.8rem;
    display: flex;
    width: 26px;
    height: 26px;
    margin: 0;
    padding: 0;
    align-items: center;
    justify-content: center;
}
</style>