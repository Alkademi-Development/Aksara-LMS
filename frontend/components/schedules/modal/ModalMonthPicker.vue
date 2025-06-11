<template>
    <div class="col-12 py-2 px-3 rounded position-absolute bg-white modal__month">
        <div class="text-center my-2">{{ fcYear }}</div>
        <div class="row" style="font-size: 12px" @click="$emit('modalMonth')">
            <div 
                v-for="item, idx in month"
                :key="idx"
                class="col-3 py-2 my-1 text-center cursor-pointer user-select-none"
                @click="$emit('chMonth', idx)"
                :style="`background: ${fcMonth == idx ? 'rgba(32, 150, 196, 0.15)' : '#fff'}`"
            >
                {{ item }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['fcMonth', 'fcYear', 'chMonth', 'modalMonth'],
    data() {
        return {
            month: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
            selectedColor: ''
        }
    }
}
</script>

<style lang="css">
    .modal__month {
        z-index: 100;
        top: -16px;
        left: 8px;
        box-shadow: 0 3px 4px rgba(0, 0, 0, 0.25);
        /* #2096c4 15% */
    }
</style>