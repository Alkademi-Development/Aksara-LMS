<template>
    <div>

        <b-card v-if="isStatusLoaded && !isSchoolActive" >

            <b-row class="d-flex align-items-center">

                <b-col cols="12" md="8" class="mb-3 mb-md-0">

                    <h3>Sekolah sudah terdaftar, data anda sedang kami proses</h3>

                </b-col>

                <b-col cols="12" md="4" class="text-md-right">

                    <strong class="badge badge-danger">Menunggu Konfirmasi</strong>

                </b-col>

            </b-row>

        </b-card>
        <b-card v-if="!isStatusLoaded">

            <b-row class="d-flex align-items-center">

                <b-col cols="12" md="8" class="mb-3 mb-md-0">

                    <b-skeleton width="100%"></b-skeleton>

                </b-col>

                <b-col cols="12" md="4" class="text-md-right">

                    <b-skeleton width="100%"></b-skeleton>

                </b-col>

            </b-row>

        </b-card>

        <div class="row">

            <div class="col-12">

                <CardEvents 
                    :events="eventsList" 
                    :isBusy="!isEventsLoaded"
                />
                
            </div>

        </div>
        
    </div>
</template>

<script>
import CardEvents from "@/components/template/micro/card/CardEvents"
import moment from 'moment'
import { mapState } from "vuex";

export default {
    components: {
        CardEvents,
    },
    computed: {
        ...mapState({
            usersState: (state) => state.Users
        })
    },
    data() {
        return {
            isActiveBatch: false,
            isCounterLoaded: false,
            isRankingLoaded: false,
            isEventsLoaded: false,
            isGenerateClass: false,
            isRelease: false,
            isMapLoaded: false,
            isSchoolActive: false,
            isStatusLoaded: false,

            onEvent: {
                message: '',
                status: true,
                show: false,
                variant: ''
            },

            listGroup: [
                {
                    id: 1,
                    title: 'Program',
                    value: 'program',
                    selected: false
                },
                {
                    id: 2,
                    title: 'Kota',
                    value: 'city',
                    selected: false
                }
            ],

            listOrder: [
                {
                    id: 1,
                    title: 'Setara',
                    value: 'equal',
                    selected: false
                },
                {
                    id: 2,
                    title: 'Peringkat',
                    value: 'ranked',
                    selected: false
                }
            ],

            generateLoading: false,
            releaseLoading: false,
            listGroupSelected: [],
            max: '',
            maxState: null,
            linkRegistrar: '#',

            eventsList: [],
            batchActive: [],
            currentRound: [],
            classroomsList: [],
            rankings: [],

            fields: [
                {   
                    key: "index", 
                    label: 'No'
                },
                {
                    key: 'name',
                    label: 'Nama Peserta',
                },
                {
                    key: 'score',
                    label: 'Nilai',
                },
                {
                    key: 'action',
                    label: '',
                },
            ]
        }
    },
    created () {
        // this.getActiveBatchsStatistics()
        this.getIncomingEvents()
    },
    methods: {
        setEvent(message, status){

            this.onEvent.message = message
            this.onEvent.status = status
            this.onEvent.variant = status == true ? 'success' : 'warning'
            this.onEvent.show = true
            this.onEvent.dismissed = false

        },
        async getActiveBatchsStatistics() {

            await this.$store.dispatch('Statistics/fetchRequestStatisticCounter').then(() => {
                var statisticState = this.$store.state.Statistics

                if(!statisticState.status) {
                    
                    console.error('Failed get statistics', statisticState.message)

                } else {

                    this.activeStats = statisticState.statistics

                    if(statisticState.statistics){
                        this.fetchCurrentRound()
                    }

                }
            })

        },
        async getIncomingEvents() {
            await this.$store.dispatch('Events/fetchIncomingEvents')
                .then(() => {
                    var eventsState = this.$store.state.Events

                    if (eventsState.status == 200) {
                        this.eventsList = eventsState.incomingEvents

                        // this.fetchRankings()
                        // this.isMapLoaded = true
                        this.isEventsLoaded = true
                        this.fetchDetailSchool()
                        // this.isActiveBatch = true
                    } else {
                        console.error("Failed to fetch events", eventsState.message);
                    }
                })
        },
        async fetchDetailSchool() {
            await this.$store.dispatch('Schools/getSchoolDetail', this.usersState.detail_auth.schoolId)
                .then(() => {
                    var schoolsState = this.$store.state.Schools.school

                    if (schoolsState.status) {
                        this.isSchoolActive = schoolsState.status == 1 ? true : false
                        this.isStatusLoaded = true
                    } else {
                        this.isStatusLoaded = true
                        console.error("Failed to fetch events", schoolsState.message);
                    }
                    
                })
        },
        async fetchBatchById() {
            await this.$store.dispatch('Programs/getBatchById', this.activeStats.batchId)
            .then(() => {
                var statePrograms = this.$store.state.Programs

                if(!statePrograms.status) {

                    console.error('Failed get batch by id: ', statePrograms.message)

                } else {

                    this.batchActive = statePrograms.batch

                    this.cekGenerate() // this.getClassroomsList(1)

                    // this.fetchCurrentRound()

                }
            })
        },
        async fetchRankings() {
            await this.$store.dispatch('Programs/getRankings')
                .then(() => {
                    var statePrograms = this.$store.state.Programs

                    if (!statePrograms.status) {
                        console.error('Failed get rankings: ', statePrograms.message)
                    } else {
                        this.rankings = statePrograms.rankings

                        this.isRankingLoaded = true;
                    }
                })
        },
        async fetchCurrentRound() {
            await this.$store.dispatch('Rounds/current')
            .then(() => {
                var stateRounds = this.$store.state.Rounds

                if(!stateRounds.status) {

                    console.error('Failed get current round: ', stateRounds.message)

                } else {

                    this.currentRound = stateRounds.rounds
                    this.linkRegistrar = `/dashboard/students/registrar/batch/${this.activeStats.batchId}/rounds/${this.currentRound.id}/programs/`
                    
                    this.isCounterLoaded = true

                    // this.fetchBatchById()
                    // this.getClassroomsList(1)

                }
            })
        },
        async cekGenerate() {
            await this.$store.dispatch('Classrooms/cekGenerateClass').then(() => {

                var classroomsState = this.$store.state.Classrooms

                if (!classroomsState.status) {
                    console.error('Failed cek generate classroom', classroomsState.message);
                    
                } else {
                    if (classroomsState.classroom > 0) this.setGenerateAction(true)
                    else this.setGenerateAction(false)
                }

            })
        },
        // async getClassroomsList(page) {
        //     await this.$store.dispatch('Classrooms/getClassroomsList', {
        //         page: page
        //     }).then(() => {

        //         var classroomsState = this.$store.state.Classrooms

        //         if (!classroomsState.status) {
        //             console.error('Failed fetch classrooms', classroomsState.message);
                    
        //         } else {
        //             const stateClass = classroomsState.classrooms;
        //             const totalPage = classroomsState.pagination.lastPage
        //             const currentPage = classroomsState.pagination.currentPage
                        
        //             this.setDataClassrooms(currentPage, totalPage, stateClass)
        //         }

        //     })
        // },
        // setDataClassrooms(page, total, courses) {
        //     courses.map((item) => {
        //         this.classroomsList.push(item)
        //     })
        //     if(page < total)
        //         this.getClassroomsList(page + 1)
        //     else {
        //         this.setGenerateAction()
        //     }
        // },
        async setGenerateAction(generateClass){

            if (this.batchActive.releaseApproval == 0) {

                this.isRelease = true

            } else {
                var registrationEnd = moment(this.batchActive.registrationEnd, 'YYYY-MM-DD').valueOf()
                var dateNow = moment(moment.now()).valueOf()

                // console.log('END: ', registrationEnd)
                // console.log('NOW: ', dateNow)

                if(dateNow >= registrationEnd) {
                    // if(this.classroomsList.length != 0) {
                    //     const classFound = this.classroomsList.find((item) => item.batchId == this.batchActive.id)

                    //     if(classFound != undefined) {
                    //         this.isGenerateClass = false
                    //     } else {
                    //         this.isGenerateClass = true
                    //     }
                    // } else {
                    //     this.isGenerateClass = true
                    // }
                    this.isGenerateClass = generateClass
                } else {
                    this.isGenerateClass = false
                }
            }

            // console.log('BATCH: ', this.batchActive)
            // console.log('CLASSROOM: ', this.classroomsList)
            // console.log('GENERATE: ', this.isGenerateClass)

            // await this.fetchRounds()
                    
            // this.isCounterLoaded = true
            this.getIncomingEvents()
            
        },
        checkFormValidity() {
            const valid = this.$refs.form.checkValidity()
            this.maxState = valid
            return valid
        },
        resetModal() {
            this.onEvent.show = false
            this.max = ''
            this.listGroup.map((item, index) => {
                this.listGroup[index].selected = false
            })
            this.listOrder.map((item, index) => {
                this.listOrder[index].selected = false
            })
            this.maxState = null
        },
        handleOk(bvModalEvt) {
            // Prevent modal from closing
            bvModalEvt.preventDefault()
            // Trigger submit handler
            this.handleSubmit()
        },
        handleSubmit() {
            this.onEvent.show = false

            var compileGroup = []
            this.listGroup.map((item) => {
                if(item.selected) {
                    compileGroup.push(item.value)
                }
            })

            if(compileGroup.length == 0) {
                return this.setEvent('Pilih pengelompokan terlebih dahulu', false)
            }

            var compileOrder = ''
            this.listOrder.map((item) => {
                if(item.selected) {
                    compileOrder = item.value
                }
            })

            if(this.currentRound.roundIndex != 1 && compileOrder == '') {
                return this.setEvent('Pilih pengurutan terlebih dahulu', false)
            }

            if (!this.checkFormValidity()) {
                return
            }

            const params = {
                groupBy: compileGroup,
                orderBy: this.currentRound.roundIndex == 1 ? 'equal' : compileOrder,
                max: this.max
            }

            // console.log('PARAMS: ', params)

            this.generateClassrooms(params)
        },
        setSelectedGroup(id) {

            this.listGroup.map((item, index) => {

                if(item.id == id) {
                    
                    this.listGroup[index].selected = !this.listGroup[index].selected

                }

            })

        },
        setSelectedOrder(id) {

            this.listOrder.map((item, i) => {

                if(item.id == id) {

                    this.listOrder[i].selected = true

                } else {

                    this.listOrder[i].selected = false

                }

            })

        },
        async generateClassrooms(params) {
            this.generateLoading = true

            await this.$store.dispatch('Classrooms/generate', params).then(() => {

                var classroomsState = this.$store.state.Classrooms

                if (!classroomsState.status) {

                    console.error('Failed generate classrooms', classroomsState.message);
                    this.generateLoading = false
                    
                } else {
                    
                    this.generateLoading = false
                    
                    this.$nextTick(() => {
                        this.$bvModal.hide('modal-generate')
                    })

                    this.isActiveBatch = false
                    this.isCounterLoaded = false
                    this.isCityChartLoaded = false
                    this.isProgramChartLoaded = false
                    this.isEventsLoaded = false
                    this.isGenerateClass = false

                    this.getActiveBatchsStatistics()
                    // this.getStatisticActiveBatchChart()
                    this.getIncomingEvents()

                }

            })
        },
        async handleRelease() {
            this.releaseLoading = true

            await this.$store.dispatch('Batch/fetchReleaseApproval', this.batchActive.id).then(() => {

                var batchState = this.$store.state.Batch

                if (!batchState.status) {

                    console.error('Failed release approval', batchState.message);
                    this.releaseLoading = false
                    
                } else {
                    // setInterval(() => {
                        
                    this.releaseLoading = false
                    
                    this.$nextTick(() => {
                        this.$bvModal.hide('modal-release')
                    })

                    this.isActiveBatch = false
                    this.isCounterLoaded = false
                    this.isCityChartLoaded = false
                    this.isProgramChartLoaded = false
                    this.isEventsLoaded = false
                    this.isGenerateClass = false
                    this.isRelease = false

                    this.getActiveBatchsStatistics()
                    // this.getStatisticActiveBatchChart()
                    this.getIncomingEvents()

                    // }, 5000);

                }

            })

        }
    }
}
</script>

<style>

</style>