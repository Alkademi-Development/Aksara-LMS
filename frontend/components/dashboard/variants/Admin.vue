<template>
    <div>
        <div class="row">
            <LineVue
                containerClass="col-12 col-md-6"
                title="Weekly Login"
                :showDropdown="false"
                :chartData="dailyLogin?.data"
                :isBusy="dailyLogin?.isLoading"
            />
            <Bar
                containerClass="col-12 col-md-6"
                title="Most Visited Class"
                showLegend
                :chartProps="classVisitor"
                :chartData="classVisitor?.data"
                :isLoading="classVisitor?.isLoading"
                :isStacked="false"
            />
        </div>
        <div class="row">
            <Bar
                containerClass="col-12 col-lg-7"
                :title="`Program Participants ${chartProgramParticipant?.data?.counter?.lmsTotalStudent || '-'} Students`"
                showLegend
                :chartProps="chartProgramParticipant"
                :chartData="chartProgramParticipant?.data"
                :isStacked="true"
                :isLoading="chartProgramParticipant?.isLoading"
            />
            <LineVue
                containerClass="col-12 col-lg-5"
                title="Landing Page Visitor"
                showDropdown
                :chartData="landingVisitor?.data"
                :isBusy="landingVisitor?.isLoading"
                :filtersItems="landingVisitor?.filterOptions"
                :selectedFilterValue="landingVisitor?.selectedFilter"
                @onChangeFilter="(...args) => filterLoginVisitor(...args)"
            />
        </div>
        <div class="row">
            <ParticipantsTableVue 
                containerClass="col-12 col-md-6"
                title="Peringkat Teratas Minggu Ini"
                :fields="participants?.fields"
                :items="participants?.items"
                :activeClassroom="classrooms?.data"
                :isBusy="participants?.isLoading"
                :paginationFilter="classrooms?.pagination"
                :selectedFilterValue="participants?.selectedFilter"
                :isLoadMorePaginationFilter="classrooms?.isLoadMore"
                @onChangeFilter="(...args) => filterClass(...args, 'participant')"
                @onChangePageFilter="handleChangePageFilter"
            />

            <CardTaskProgress
                containerClass="col"
                :tasks="assignment?.options"
                :isLoading="assignment?.isLoading"
            />
        </div>
        <!-- <div class="row">
            
            <div class="col">
                <SectionClass
                :sectionTitle="`Semua ${isTestCase ? 'Tes' : 'Kelas'}`"
                :sectionFilter="true"
                :isFromDashboard="true"
                filterBy="all" />
            </div>
            
        </div> -->
    </div>
</template>

<script>
import ActiveTestTableVue from '~/components/template/micro/table/Dashboard/Admin/ActiveTestTable.vue'
import Bar from "@/components/template/micro/chart/Bar.vue"
import Chart from '~/components/template/micro/chart/Chart.vue'
import ParticipantsTableVue from '~/components/template/micro/table/Dashboard/Admin/ParticipantsTable.vue'
import SubmissionTable from "~/components/template/micro/table/Dashboard/Admin/SubmissionTable.vue"
import LineVue from '@/components/template/micro/chart/Line.vue'
import CardTaskProgress from '~/components/template/micro/card/CardTaskProgress.vue'
// import SectionClass from '~/components/template/micro/section/SectionClass.vue'
import Doughnat from '~/components/template/micro/chart/Doughnat.vue'
import Radar from '~/components/template/micro/chart/Radar.vue'

// Mixins
import useStatisticMixin from '~/mixins/statistic/useStatisticMixin'

export default {
    mixins: [useStatisticMixin],
    components: {
        ActiveTestTableVue,
        Bar,
        Chart,
        LineVue,
        ParticipantsTableVue,
        SubmissionTable,
        CardTaskProgress,
        // SectionClass,
        Doughnat,
        Radar
    },
    created(){
        // this.getProgramParticipants().then(() => {
        //     const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--bs-primary');
        //     this.chartProgramParticipant = this.programParticipant;
        //     this.chartProgramParticipant.options.scale.pointLabels.fontColor = primaryColor;
        //     this.$store.commit("Dashboard/SET_PROGRAM_PARTICIPANTS", this.chartProgramParticipant);
        //     console.log('CHARTPARTICIPANT', this.chartProgramParticipant);
        // });
        this.initiateComponent();
    },
    methods: {

        /**
         * Initialization data and fetching data all resource that needed
         */
        initiateComponent(){
            // this.isTestCase = this.sassState?.isTestCase;

            // Fetch all reource data that needed in this component
            this.fetchAllResource();
        },

        /**
         * Fetch all reource data that needed in this component
         */
        async fetchAllResource(){
            this.participants.isLoading = true;

            try{
                this.setDateVisitor()

                await Promise.all([
                    this.fetchClassActive(),
                    this.fetchLandingVisitor(),
                    this.fetchDailyLogin(),
                    this.fetchClassVisitor(),
                    this.fetchProgramParticipants(),
                    this.fetchAssignmentToReview()
                ])

                // Set initialization of participant
                if(this.classrooms.data?.length > 0) {
                    this.participants.selectedFilter = {
                        label: this.classrooms?.data[0]?.name,
                        value: this.classrooms?.data[0]?.id,
                    }
                    this.fetchParticipants();
                } else{
                    this.classrooms.selectedFilter = {
                        label: "Tidak adak kelas"
                    }
                    this.participants.isLoading = false;
                }
            }catch(error){
                console.error(error);
                this.participants.isLoading = false;
            }
        },

        filterClass(filter, type) {
            if (type === 'activeClass') {
                this.selectedClassFilter = filter
                this.pagination.page = 1

                this.fetchClassActive()
            } else if (type === 'participant') {
                this.participants.selectedFilter = filter
                if(filter?.value) this.fetchParticipants();
            }
        },

        // setupInfiniteScroll() {
        //     const isInfiniteScroll = (window.innerHeight + window.pageYOffset) <= (document.body.offsetHeight - 100)

        //     // Scrolled Screen Listener
        //     if (isInfiniteScroll && this.pagination.page < this.pagination.totalPages) window.addEventListener("scroll", this.handleScrolledScreen);
            
        //     // Auto Load More Without Scroll Screen
        //     else setTimeout(() => {
        //         this.loadMore()
        //     }, 200);
        // },
    },
}
</script>

<style>
</style>