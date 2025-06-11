<template>
    <!-- Header -->
    <div class="header bg-primary pb-6">
        <div class="container-fluid">
            <div class="header-body">
                <div :class="['row align-items-center pb-4', centerForm ? 'justify-content-center' : '']">
                    <div class="col" v-if="sideButton">
                        <div class="text-right">
                            <b-button 
                                :variant="sideButton.variant"
                                :pill="sideButton.pill"
                                :size="sideButton.size"
                                :hidden="sideButton.hidden"
                                @click="goTo(sideButton.to)"> 
                                {{ sideButton.title }} 
                            </b-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['title', 'centerForm', 'sideButton'],
    methods: {
        goTo(to){
            this.$router.push(to)
        }
    }
}
</script>

<style>

</style>