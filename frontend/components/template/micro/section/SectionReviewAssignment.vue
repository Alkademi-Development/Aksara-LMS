<template>
    <b-row>

        <b-col cols="12" md="6" lg="5" class="mx-h-content pb-4">

            <ButtonDropdownFilter
                id="review-assignment-filter"
                class="style-2 w-100 mb-4 sticky-content"
                :text="actionSelected?.label"
                variant="outline-primary"
                :items="actionOptions"
                :selectedItem="actionSelected"
                toggleClass="w-100"
                menuClass="w-100"
                @onChange="setSelectedFilter"
            />

            <template v-if="isAssignmentsLoaded">

                <template v-if="reviewAssignments?.length != 0">
                    <ItemAssignment
                        v-for="(assignment, idx) in reviewAssignments"
                        @onClickCard="setSelectedAssignment(assignment)"
                        @onClickCourse="openCourse(assignment)"
                        :isActiveCard="assignment?.id === activeAssignment?.id ? true : false"
                        isReview
                        :assignment="assignment"
                        :classId="activeClass?.value"
                        :user_kind="userKind"
                        :key="idx"
                    />
                </template>

                <template v-else>
                    <b-card body-class="p-4" class="border card-review mb-4">
                        <ItemReview :isEmpty="true"/>
                    </b-card>
                </template>

            </template>

            <b-card v-else body-class="p-4" class="border card-review mb-4">
                <ItemReview :isLoading="true"/>
            </b-card>

        </b-col>

        <b-col cols="12" md="6" lg="7" class="mx-h-content">
            <Tabs
                class="mb-4 sticky-content"
                :disabled="isBusy"
                :tabs="tabsItems"
                :activeTab="activeTab"
                @setActiveTab="setMovingTab"
            />

            <FilterForms
                searchPlaceholder="Cari berdasarkan nama / email"
                :lgSize="8"
                :mdSize="12"
                :showFilter="false"
                :sortItems="null"
                :pagination="tablePagination"
                @fetchFilters="fetchToggle"
                @typingSearch="isBusy = $event"
            />

            <ReviewTable
                :isBusy="isBusy"
                :fields="tableFields"
                :items="tableItems"
                :pagination="tablePagination"
                @onClickBtnScore="toggleModalScoring"
                @onChangePagination="onChangePagination"
                @onFormOpened="(responseId) => openedForm = responseId"
            />
        </b-col>

        <!-- Modal Section -->
        <ModalScoring
            :onOpenModal="isModalScoring"
            :isScoring="isScoring"
            :modalError="modalError"
            :item="selectedStudent"
            :activeAssignment="activeAssignment"
            @onSubmit="scoringStudent"
            @toggleModal="toggleModalScoring"
        />
    </b-row>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { TABLE_COLUMN_REVIEW } from "~/commons/constants/reviews";
import { TAB_MENU_CLASSROOM } from "~/commons/constants/layouts"

import Tabs from "@/components/template/micro/header/Tabs.vue";
import ButtonDropdownFilter from "@/components/template/micro/buttons/ButtonDropdownFilter.vue";
import ItemReview from "@/components/template/micro/items/ItemReview.vue";
import ItemAssignment from '@/components/template/micro/items/ItemAssignment.vue';
import ReviewTable from "@/components/template/micro/table/Review/ReviewTable.vue";
import ModalScoring from "@/components/template/micro/modal/ModalScoring.vue";
import FilterForms from '~/components/classrooms/micro/FilterForms.vue';

export default {

    components: { ButtonDropdownFilter, ItemReview, ItemAssignment, Tabs, ReviewTable, ModalScoring, FilterForms },

    props: {
        propAssignmentId: {
            type: Number,
            default: null,
        }
    },

    data() {
        return {
            userKind: localStorage.getItem('user_kind'),

            isBusy: true,
            isScoring: false,
            isAssignmentsLoaded: false,
            isModalScoring: false,
            isShowMarkdown: false,

            actionOptions: [],
            actionSelected: null,

            tabsItems: [],
            activeTab: '',

            tableFields: [],
            tableItems: [],
            tablePagination: {
                page: 1,
                perPage: 10,
                totalItems: 1,
                totalPages: 1,
            },
            assignmentById: 0,

            reviewAssignments: [],
            activeAssignment: null,

            selectedStudent: null,

            modalError: null,
            filterOptions: {
                search: ''
            },
            openedForm: null,
            isMoveCardAssignment: false,
        }
    },

    computed: {
        ...mapState({
            assignmentsState: (state) => state?.Assignments,
            assignments: (state) => state?.Assignments?.data ?? [],
            activeClass: (state) => state?.Layouts?.stateFilter ?? null,
            servicesState: (state) => state?.Services,
        })
    },

    mounted() {
        this.setFilter()
        // this.setAssignments()
        // this.setTabs()
        // this.setTable()
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
    },
    beforeDestroy() {
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    },

    watch: {
        activeClass() {
            this.tablePagination = {
                page: 1,
                perPage: 10,
                totalItems: 1,
                totalPages: 1,
            };
            this.setAssignments();
        },
    },

    methods: {
        ...mapActions({
            getAssignments: "Assignments/listReview",
            getStudents: "Assignments/students",
            getTabs: 'Layouts/getTabs',
            setActiveTab: "Layouts/setActiveTab",
            assignScore: "Services/classroomAssignScore",
        }),

        handleVisibilityChange() {
            if(!document.hidden && !!this.openedForm && this.activeTab == "assigned"){
                const selectedItem = this.activeAssignment
                this.activeAssignment = null;
                this.setAssignments(selectedItem)
            }
        },

        onChangePagination(page) {
            this.isBusy = true

            const params = {
                page: page,
                pageSize: this.tablePagination?.perPage,
                topicId: this.activeAssignment?.id,
                state: this.activeTab,
                search: this.filterOptions.search
            }

            this.getStudents(params).then(() => {
                this.tableItems = this.assignmentsState?.data
                this.tablePagination = this.assignmentsState?.pagination ?? this.tablePagination
                this.isBusy = false
            })
        },

        setAssignments(item = null) {
            if(this.activeClass || item){
                if(!this.isMoveCardAssignment) this.isAssignmentsLoaded = false;
                this.isBusy = true;

                const params = {
                    classroomId: this.activeClass?.value,
                    order: this.actionSelected?.value
                };

                this.getAssignments(params).then(() => {
                    if (this.assignments?.length !== 0) {
                        this.reviewAssignments = this.assignments;
                        if (!item) {
                            this.assignmentById = this.assignmentById === 0 ? !!this.propAssignmentId ? this.propAssignmentId : this.assignmentById : this.assignmentById;
                            let indexAssignment = 0;
                            if (!!this.assignmentById) {
                                indexAssignment = this.reviewAssignments.findIndex(assignment => assignment.id === this.assignmentById);
                            }
                            this.setActiveAssignment(this.reviewAssignments[indexAssignment]);
                        } else {
                            const foundAssignment = this.reviewAssignments.find(assignment => assignment?.id === item?.id);
                            this.setActiveAssignment(foundAssignment);
                        }
                    } else {
                        this.reviewAssignments = [];
                        this.setActiveAssignment(null);
                    }

                    this.isAssignmentsLoaded = true;
                    this.isMoveCardAssignment = false;

                    if (this.activeAssignment) {
                        this.tablePagination.page = 1;
                        // this.setTable();
                    }
                });
            }
        },


        setSelectedAssignment(data) {
            this.isMoveCardAssignment = true;
            this.assignmentById = data?.id;
            const findAssignment = this.reviewAssignments?.find((item) => item?.id === data?.id)
            if (this.activeAssignment) {
                if (this.activeAssignment?.id != data?.id) {
                    this.activeAssignment = findAssignment;
                    this.setAssignments(findAssignment);
                    // this.setActiveAssignment(findAssignment)
                } else return // Do Nothing
            } else this.activeAssignment = findAssignment, this.setAssignments(findAssignment);
            // } else this.setActiveAssignment(findAssignment)
        },

        setActiveAssignment(data) {
            this.activeAssignment = data

            const params = {
                unassigned: data?.unassigned,
                assigned: data?.assigned,
                scored: data?.scored,
            }

            this.setTabs(params)
            // this.setTable()
        },

        setFilter() {
            this.actionOptions = [
                {
                    label: "Urutkan Berdasarkan Deadline Terdekat",
                    value: "deadline.asc",
                },
                {
                    label: "Urutkan Berdasarkan Deadline Terjauh",
                    value: "deadline.desc",
                },
            ]

            this.actionSelected = this.actionOptions[0]
            this.setAssignments()
        },

        setSelectedFilter(filter) {
            this.actionSelected = filter
            this.setAssignments()
        },

        setTabs(params) {
            this.tabsItems = [
                {
                    label: `Belum Diperiksa (${params?.assigned ?? 0})`,
                    key: "assigned"
                },
                {
                    label: `Sudah Diperiksa (${params?.scored ?? 0})`,
                    key: "scored"
                },
                {
                    label: `Belum Mengumpulkan (${params?.unassigned ?? 0})`,
                    key: "unassigned"
                },
            ]

            if(!!this.activeTab) this.setActiveTabMenu(this.activeTab)
            // this.setActiveTabMenu(this.activeTab)
        },

        setTable() {
            this.isBusy = true
            this.tableFields = TABLE_COLUMN_REVIEW
            if (this.activeAssignment) {

                const params = {
                    page: this.tablePagination?.page,
                    pageSize: this.tablePagination?.perPage,
                    topicId: this.activeAssignment?.id,
                    state: this.activeTab,
                    search: this.filterOptions.search
                }

                this.getStudents(params).then(() => {
                    this.tableItems = this.assignmentsState?.data
                    this.tablePagination = this.assignmentsState?.pagination ?? this.tablePagination
                    this.isBusy = false
                    this.scrollToElementActive();
                    if(!!this.openedForm && (!this.tableItems || this.tableItems?.find(v => v.externalId == this.openedForm && v.scored != 0))){
                        this.openedForm = null;
                    }
                })

            } else {
                this.tableItems = []
                this.isBusy = false
            }
        },

        scoringStudent(event) {
            event.preventDefault()

            const params = {
                classroomId: this.activeClass?.value,
                topicId: this.activeAssignment?.id,
                userId: this.selectedStudent?.userId,
                score: parseInt(this.selectedStudent?.score),
                mentorNotes: this.selectedStudent?.mentorNotes
            }

            // return console.log(params, "PARAMS")
            this.isScoring = true
            this.assignScore(params).then(() => {
                if (!this.servicesState?.status) {
                    this.modalError = this.servicesState?.message
                    this.isScoring = false
                } else {
                    const selectedItem = this.activeAssignment
                    this.activeAssignment = null
                    setTimeout(() => {
                        this.toggleModalScoring()
                        this.setAssignments(selectedItem)
                        this.modalError = null
                        this.isScoring = false
                    }, 50);
                }
            })
        },

        setActiveTabMenu(tab) {
            this.tablePagination.page = 1
            this.activeTab = tab
            this.setTable()
        },

        toggleModalScoring(data) {

            this.isModalScoring = !this.isModalScoring

            if (this.isModalScoring) {
                this.selectedStudent = { ...data }
                setTimeout(() => {
                    this.isShowMarkdown = true
                }, 100);
            } else {
                this.isShowMarkdown = false
                this.selectedStudent = null
            }

        },

        openCourse(event) {
            this.getTabs(TAB_MENU_CLASSROOM)
            this.setActiveTab('courses')
            this.$router.push(`/dashboard/classroom/${this.activeClass?.slug}#module-${event?.moduleId}`)
        },

        fetchToggle({page, perPage, sortBy, search}) {
            this.tablePagination.page = page
            this.filterOptions.search = search
            this.setTable()
        },
        scrollToElementActive(){
            const classActive = document.querySelector(".item-assignment.active");
            const parentContainer = document.querySelector(".mx-h-content");
            const scrollToTop = classActive.offsetTop - parentContainer.offsetTop;
            parentContainer.scrollTo({
                top: scrollToTop,
                behavior: "smooth"
            });
        },
        setMovingTab(tab){
            this.isMoveCardAssignment = true;
            this.tablePagination.page = 1
            this.activeTab = tab;
            this.setAssignments(this.activeAssignment);
        }
    }

}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/components/classroom/assignment.scss';

::v-deep {
    .mx-h-content {
        max-height: calc(100vh - 215px);
        overflow: auto;
    }
    .item-tab {
        padding: 0 0 16px 0 !important;
    }
    .sticky-content {
        position: sticky;
        top: 0;
        z-index: 10;
        background: white;
    }
}
</style>