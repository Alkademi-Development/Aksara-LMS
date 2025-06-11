<template>
    <b-alert
        :show="onEvent.alertCounter"
        :variant="onEvent.variant"
        @dismissed="onEvent.alertCounter=0"
        @dismiss-count-down="countDownChanged"
        >
        {{ onEvent.message }}
    </b-alert>
</template>

<script>
export default {
    props: ['message', 'status'],
    data() {
        return {
            onEvent: {
                message: '',
                status: true,
                alertCounter: 0,
                variant: ''
            },
        }
    },
    methods: {
        setEvent(message, status) {
            window.scrollTo(0,0)
            this.onEvent.message = message
            this.onEvent.status = status
            this.onEvent.variant = status ? 'success' : 'warning'
            this.onEvent.alertCounter = 5
        },
        countDownChanged() {
            this.onEvent.alertCounter = 10
        },
    },
    watch: {
        message() {
            this.setEvent(this.message, this.status)
        }
    }
}
</script>