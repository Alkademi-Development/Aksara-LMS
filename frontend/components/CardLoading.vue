<template>
    <b-card no-body class="overflow-hidden">

        <b-card-body>
            <div v-if="!isError" class="d-flex align-items-center justify-content-center">
                <b-spinner :variant="variant" label="Spinning" class="mr-2"></b-spinner><span :class="`text-${variant}`">{{ loadingText }}</span>
            </div>
            <div v-else class="text-center">
                <span :class="`d-block`">{{ errorText }}</span>
                <a v-if="errorAction" :class="`text-${variant} cursor-pointer`" @click="$emit('onErrorAction')">{{ actionText }}</a>
            </div>
        </b-card-body>

    </b-card>
</template>

<script>
export default {
    props: {
        isError: {
            type: Boolean,
            default: false
        },
        variant: {
            type: String,
            default: 'primary'
        },
        errorAction: {
            type: Boolean,
            default: false
        },
        actionText: {
            type: String,
            default: 'Muat ulang'
        },
        errorText: {
            type: String,
            default: 'Gagal memuat.'
        },
        loadingText: {
            type: String,
            default: 'Memuat data...',
        },
    },
}
</script>