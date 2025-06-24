<template>
    <div id="programs" :class="['wrapper', full]">
        <div class="container">
            
            <HeaderWrapper 
                :data="dataHeader"
            />

            <div v-if="isLoaded" class="row">
                <CardPrograms v-for="(item, index) in dataPrograms" :key="index" :data="item" :registrationPeriod="registrationPeriod"/>
            </div>
            <Loading v-else />
            
        </div>
    </div>
</template>

<script>
import HeaderWrapper from '@/components/template/micro/header/HeaderWrapper.vue'
import CardPrograms from '@/components/template/micro/card/CardPrograms.vue'
import moment from 'moment'

export default {
    props: ['full', 'data'],
    components:{
        HeaderWrapper,
        CardPrograms
    },
    data(){
        return {
            dataHeader: {
                title: 'Program Alkademi',
                description: 'Program pelatihan gratis bersertifikasi, berbasis project based learning dilengkapi dengan kurikulum yang relevan dan efektif yang diselenggarakan secara offline',
            },
            dataPrograms: [],
            isLoaded: false,
            registrationPeriod: false,
        }
    },
    created(){
        this.fetchPrograms()
    },
    methods: {
        async fetchPrograms(){

            await this.$store.dispatch('Programs/getPrograms')
            .then(() => {
                var statePrograms = this.$store.state.Programs

                if(!statePrograms.status) {
                    // console.log('Failed fetch programs', statePrograms.message)

                    this.isLoaded = true

                } else {
                    // console.log('Success fetch programs', statePrograms.programs)

                    this.dataPrograms = statePrograms.programs
                    this.isLoaded = true

                    // this.fetchActiveBatch()

                }
            })

        },
        // async fetchActiveBatch(){

        //     await this.$store.dispatch('Statistics/fetchStatisticActiveBatchs').then(() => {
        //         var statisticState = this.$store.state.Statistics

        //         if(!statisticState.status) {
                    
        //             console.log('Failed get statistics', statisticState.message)

        //         } else {

        //             const registrationEnd = statisticState.statistics[0].registrationEnd

        //             var timeEnd = moment(registrationEnd).valueOf()
        //             var timeNow = moment.now()

        //             if(timeEnd < timeNow) {
        //                 // console.log('Masa Pendaftaran Habis.')

        //                 this.registrationPeriod = false

        //             } else if(timeEnd >= timeNow) {
        //                 // console.log('Masa Pendaftaran.')

        //                 this.registrationPeriod = true

        //             }

        //         }
        //     })

        // },
    }
}
</script>