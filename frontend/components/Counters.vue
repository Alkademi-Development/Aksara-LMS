<template>
    <div id="counters" class="wrapper">
        <div class="container">

            <div v-if="isLoaded" class="row align-item-center justify-content-center">
                <CardCounters v-for="(item, index) in data" :key="index" :data="item" />
            </div>

        </div>
    </div>
</template>

<script>
import CardCounters from '@/components/template/micro/card/CardCounters.vue'

export default {
    components: {
        CardCounters
    },
    data() {
        return {
            data: [],
            isLoaded: false,
        }
    },
    mounted(){
        this.getData()
        // this.generateData()
    },
    methods: {
        async getData() {
            
            await this.$store.dispatch('Statistics/fetchStatisticsLandingPage')
                .then(() => {

                    let data = this.$store.state.Statistics.statistics

                    this.generateData(data)
                })

        },
        generateData(data) {
            var object = [
                {
                    count: data.totalRegistrar,
                    description: 'Pendaftar'
                },
                // {
                //     count: data.totalStudent,
                //     description: 'Peserta'
                // },
                {
                    count: data.totalCities,
                    description: 'Kota'
                },
                // {
                //     count: data.totalStudentProject,
                //     description: 'Proyek Belajar'
                // },
                {
                    count: data.totalIndustries,
                    description: 'Dinas & Industri'
                },
            ];

            this.data = object;
            this.isLoaded = true;
        }
    }
}
</script>