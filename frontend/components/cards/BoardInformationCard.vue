<template>
    <div :class="`board ${boardType} py-3 px-5 rounded w-100`">
        <h6 class="board-title">{{ title }}</h6>
        <p class="board-content text-vsm mt-3">{{ content }}</p>
    </div>
</template>

<script setup>

const props = defineProps({
    title: String,
    content: String,
    boardType: {
        type: String,
        default: ''
    }
})

</script>

<style lang="scss" scoped>
.board {
    border: 1px solid var(--grey);
    border-width: 1px 1px 1px 6px;
}
</style>