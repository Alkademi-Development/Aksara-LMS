<template>
    <li class="nav-item">
        <nuxt-link v-if="!isLocked" :class="[`nav-link`, isActive ? 'active' : ''] " :to="to">
            <i :class="['ri-icon', icon, 'text-'+ (isActive ? 'primary' : color)]"></i>
            <span class="nav-link-text">{{ name }}</span>
        </nuxt-link>
        <nuxt-link v-else class="nav-link" to="#">
            <i class="fas fa-lock"></i>
            <span class="nav-link-text">{{ name }}</span>
        </nuxt-link>
    </li>
</template>

<script>
export default {
    props: {
        name: String,
        to: String,
        icon: String,
        color: String,
        isActive: Boolean,
        isLocked: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/layouts/sidebar.scss';
</style>