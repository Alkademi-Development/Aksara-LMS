<template>
    <div>
        <div 
            v-if="action?.type === 'link'" 
            class="box-button"
        >
            <nuxt-link
                :to="!!action?.to ? action?.to : !!stateAction ? stateAction : '#'"  
                :class="['btn btn-primary btn-sm btn-top-header text-uppercase', action?.class]"
            >
                <i :class="[!!action?.icon ? action?.icon : 'ri-add-line']"></i>
                {{ action?.text }}
            </nuxt-link>
        </div>
        <div 
            v-else
            class="box-button"
        >
            <div
                :class="['btn btn-primary btn-sm btn-top-header text-uppercase', action?.class]"
                @click="onClickAction(action?.emitEvent)"
            >
                <i :class="[!!action?.icon ? action?.icon : 'ri-add-line']"></i>
                {{ action?.text }}
            </div>
        </div>

    </div>
    
</template>

<script>
export default {
    props: {
        action: {
            type: Object,
            required: false,
            default: () => {}
        },
        stateAction: {
            type: String,
            default: ''
        },
        userKind: {
            type: String,
            default: ''
        }
    },
    methods: {
        onClickAction(emitEvent) {
            this.$emit(emitEvent)
        }
    },
}
</script>

<style lang="scss" scoped>

.box-progress {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
}

.btn-top-header {
    height: 34px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px 10px;
    gap: 10px;
}

</style>