<template>
    <div>

        <section class="row">
            <ParticipantsTableVue 
                containerClass="col-12 col-lg-7"
                title="Peringkat Teratas Minggu Ini"
                :fields="participants?.fields"
                :items="participants?.items"
                :isBusy="participants?.isLoading"
                :paginationFilter="pagination"
                :isLoadMorePaginationFilter="isClassLoadMore"
                :activeClassroom="classrooms"
                @onChangeFilter="(...args)=>filterClass(...args, 'participant')"
                :selectedFilterValue="selectedParticipantFilter"
            />

            <CardTaskProgress
                containerClass="col"
                :isLoading="isLoadingAssignment"
                :tasks="assignment"
            />
        </section>

        <!-- <SectionClass
            :isComponentLoaded="fetchClassActive"
            :sectionTitle="isTestCase ? 'Tes Anda' : 'Kelas Anda'"
            :sectionFilter="true" /> -->

    </div>
</template>

<script>
import { mapState } from 'vuex'

import ParticipantsTableVue from '@/components/template/micro/table/Dashboard/Admin/ParticipantsTable.vue'
import CardTaskProgress from '@/components/template/micro/card/CardTaskProgress.vue'
import SectionClass from '@/components/template/micro/section/SectionClass.vue'
import CardClass from "@/components/template/micro/card/CardClass.vue"

export default {
    components: {
        ParticipantsTableVue,
        CardTaskProgress,
        SectionClass,
        CardClass,
    },
    computed: {
        ...mapState({
            assignmentReview: (state) => state.Assignments,
            participantsState: (state) => state.Dashboard.participants,
            dashboardState: (state) => state?.Dashboard,
            sassState: (state) => state.Sass,
            servicesState: (state) => state.Services,
        }),
    },
    data() {
        return {
            isClassLoadMore: false,
            isFetchClassActive: false,
            isTestCase: false,
            selectedParticipantFilter: null,
            participants: {
                fields: [],
                items: [],
                isLoading: false,
            },


            classrooms: [],
            assignment: [],
            assignmentPagination: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 0,
            },
            isLoadingAssignment: false,
            pagination: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 0,
            },
        }
    },
    mounted() {

        this.isTestCase = this.sassState?.isTestCase
        this.initiateComponent();

    },
    methods: {
        async initiateComponent(){
            this.participants.isLoading = true;

            try{
                await Promise.all([
                    this.fetchAssignmentToReview(),
                    this.fetchClassActive()
                ]);

                // Set initialization of participant
                if(this.classrooms?.length > 0){
                    this.selectedParticipantFilter = {
                        label: this.classrooms[0]?.name,
                        value: this.classrooms[0]?.id,
                    };
                    this.fetchParticipants();
                } else {
                    this.participants.isLoading = false;
                }
            }catch(error){
                console.error(error);
                this.participants.isLoading = false;
            }
        },
        async fetchAssignmentToReview(classroomId) {
            this.isLoadingAssignment = true;

            const params = {
                classroomId: classroomId ?? null,
                page: this.assignmentPagination?.page,
                perPage: this.assignmentPagination?.perPage,
                state: this.selectedAssignmentFilter?.value
            }

            await this.$store.dispatch('Assignments/listReview', params)

            if (!this.assignmentReview?.status) {
                console.error('failed fetch assignment: ', this.assignmentReview?.message);
                this.isLoadingAssignment = false;
            } else {
                this.assignmentPagination = this.assignmentReview?.pagination
                let assignmentData = this.assignmentReview?.data

                if (!this.isClassLoadMore) this.assignment = assignmentData
                else {
                    assignmentData.map((item) => {
                        this.assignment.push(item)
                    })
                }

                this.isLoadingAssignment = false;
            }
        },
        async fetchParticipants(){
            this.participants.isLoading = true;

            await this.$store.dispatch("Dashboard/fetchParticipants", this.selectedParticipantFilter?.value);

            if(!this.dashboardState?.status){
                console.error("Failed to get participants", this.dashboardState?.message);
                this.participants.isLoading = false;
            }else{
                this.participants.fields = this.participantsState?.fields;
                this.participants.items = this.participantsState?.items;
                this.participants.isLoading = false;
            }
        },
        async fetchClassActive() {
            if (!this.isClassLoadMore) this.isClassLoaded = false
            else this.isClassLoaded = true

            const params = {
                page: this.pagination?.page,
                perPage: this.pagination?.perPage,
                state: this.selectedClassFilter?.value
            }

            await this.$store.dispatch('Services/classrooms', params)

            if (!this.servicesState.status) {

                console.error('failed fetch active classroom: ', this.servicesState.message)

                this.isClassLoaded = true
                this.isClassLoadMore = false

            } else {

                this.pagination = this.servicesState.pagination
                let classroomsData = this.servicesState.classrooms

                if (!this.isClassLoadMore) this.classrooms = classroomsData
                else {
                    classroomsData.map((item) => {
                        this.classrooms.push(item)
                    })
                }

                // Setup Infinite Scroll Active or No
                this.setupInfiniteScroll()

                this.isClassLoaded = true
                this.isClassLoadMore = false

            }
        },

        setupInfiniteScroll() {
            const isInfiniteScroll = (window.innerHeight + window.pageYOffset) <= (document.body.offsetHeight - 100)

            // Scrolled Screen Listener
            if (isInfiniteScroll && this.pagination.page < this.pagination.totalPages) window.addEventListener("scroll", this.handleScrolledScreen);
            
            // Auto Load More Without Scroll Screen
            else setTimeout(() => {
                this.loadMore()
            }, 200);
        },

        filterClass(filter, type) {
            if (type === 'activeClass') {
                this.selectedClassFilter = filter
                this.pagination.page = 1

                this.fetchClassActive()


            } else if (type === 'participant') {
                this.selectedParticipantFilter = filter
                if(filter?.value) this.fetchParticipants();
            }
        },

        loadMore() {
            // Check is last page disabled load more
            if (this.pagination.page < this.pagination.totalPages) {

                this.isClassLoadMore = true
                this.pagination.page += 1
                setTimeout(() => {
                    this.fetchClassActive()
                }, 2000);

            } else this.isClassLoadMore = false
            
        },

        handleScrolledScreen() { 
            this.endOfPage = (window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - 100);
        },

        emptyClassMessage() {
            let classState = this.isTestCase ? 'tes' : 'kelas'
            let message = `Belum ada ${ classState } yang ${ this.selectedClassFilter?.label?.toLowerCase() } saat ini.`

            if (this.selectedClassFilter.value == 'registration') message = "Belum ada pendaftaran yang dibuka saat ini."
            else if (this.selectedClassFilter.value == 'ended') message = `Belum ada ${ classState } yang berakhir.`

            return message
        }
    },

}
</script>

<style>
</style>