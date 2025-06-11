<template>
    <li class="nav-item">
        <a 
            :class="[`nav-link`, isParentActive ? `active` : `#!`]" 
            :href="`#` + name" 
            data-toggle="collapse" 
            role="button" 
            aria-expanded="false" 
            :aria-controls="name"
        >
            <i :class="['ri-icon', icon, 'text-'+ (isParentActive ? 'primary' : color)]"></i>
            <span class="nav-link-text">{{ name }}</span>
        </a>
        <div class="collapse" :id="name">
            <ul class="nav nav-sm flex-column" v-for="(item, index) in items" :key="index">
                <li :class="[`nav-item`, routeName == item.to ? `active` : ``]">
                    <nuxt-link :to="item.to" class="nav-link">{{ item.name }}</nuxt-link>
                </li>
            </ul>
        </div>
    </li>
</template>

<script>
export default {
    props: {
        name: String,
        route: String,
        color: String,
        icon: String,
        routeName: String,
        roles: Array,
        items: Array,
        isActive: Boolean,
    },
    data() {
        return {
            isParentActive: false,
        }
    },
    watch: {
        routeName() {
            this.isParentActive = false

            this.items.map((item) => {
                if (item.to == this.routeName) this.isParentActive = true
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/layouts/sidebar.scss';
</style>