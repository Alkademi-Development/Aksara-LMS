<template>
    <div v-if="isLogout" class="col-4 shortcut-item btn-logout" @click="$emit('isModalLogout')">
        <span :class="['shortcut-media avatar rounded-circle', `bg-gradient-${setColor()}`]">
            <i :class="['ni', icon]"></i>
        </span>
        <small>{{name}}</small>
    </div>
    <nuxt-link v-else-if="type == 'SidebarNavItem' || type == 'SidebarNavDropdown'" :to="to" class="col-4 shortcut-item">
        <span :class="['shortcut-media avatar rounded-circle', `bg-gradient-${setColor()}`]">
            <i :class="['ni', icon]"></i>
        </span>
        <small>{{name}}</small>
    </nuxt-link>
</template>

<script>
export default {
    props: {
        type: String,
        name: String,
        icon: String,
        color: String,
        to: String,
        isLogout: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        setColor() {
            const colors = ['red','orange','info','purple']
            return colors[Math.floor(Math.random()*colors.length)]
        }
    }
}
</script>

<style lang="scss" scoped>
.btn-logout {
    cursor: pointer;
}
</style>