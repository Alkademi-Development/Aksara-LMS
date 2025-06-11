<template>
    <div class="content-header d-flex align-items-center justify-content-between mb-4 flex-wrap flex-md-nowrap">
        <h5 class="fc-active-month mb-0 cursor-pointer user-select-none order-2 order-sm-1" @click="$emit('modalMonth')">{{ month[fcMonth] }} {{ fcYear }}</h5>
        <div class="fc-category d-flex align-items-center flex-wrap flex-md-nowrap gap-3 order-1 order-sm-2 mb-4 mb-sm-0">
            <div class="fc-category-item d-flex align-items-center gap-1">
                <i class="ri-checkbox-blank-circle-fill green"></i>
                <span>Pendaftaran</span>
            </div>
            <div class="fc-category-item d-flex align-items-center gap-1">
                <i class="ri-checkbox-blank-circle-fill blue"></i>
                <span>Kegiatan Kelas</span>
            </div>
            <div class="fc-category-item d-flex align-items-center gap-1">
                <i class="ri-checkbox-blank-circle-fill peach"></i>
                <span>Tugas</span>
            </div>
            <div class="fc-category-item d-flex align-items-center gap-1">
                <i class="ri-checkbox-blank-circle-fill purple"></i>
                <span>Umum</span>
            </div>
        </div>
        <div class="fc-navigation d-flex order-3 order-sm-3">
            <b-button variant="transparent" size="sm" class="border border-rounded" :disabled="!isLoaded" @click="$emit('prev')"><i class="ri-arrow-left-s-line fa-lg"></i></b-button>
            <b-button variant="transparent" size="sm" class="border border-rounded" :disabled="!isLoaded" @click="$emit('next')"><i class="ri-arrow-right-s-line fa-lg"></i></b-button>
        </div>
    </div>
</template>

<script>
export default {
    props: [ 'isLoaded', 'fcMonth', 'fcYear', 'modalMonth' ],

    data() {
        return { month: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'] }
    }
}
</script>

<style lang="scss" scoped>
.fc-navigation {
    gap: 12px;

    button {
        font-size: 0.8rem;
        display: flex;
        width: 36px;
        height: 26px;
        margin: 0;
        padding: 0;
        align-items: center;
        justify-content: center;
    }
}
</style>