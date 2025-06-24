<template>
    <section id="assignments">
        <template v-if="user_kind !== 'student' && withHeader">
            <ContentHeader 
                :actionButtons="actionsButton" 
                title="Daftar Tugas" 
                page="assignments" 
                :userKind="user_kind"
                :classId="classId"
            />
    
            <FilterForms
                :isBusy="isFilterBusy"
                :pagination="pagination"
                :sortItems="sortAssignments"
                :fields="filterFields"
                :searchPlaceholder="'Cari berdasarkan nama tugas'"
                :isWrap="true"
                :mdSize="10"
                :lgSize="8"
                :filtersData="filtersData"
                :stateLoading="isLoading"
                :withPaginationFilter="false"
                :withSearchFilter="false"
                @clickDropdown="onOpenDropdown"
                @fetchFilters="setFiltersAndFetch"
                @typingSearch="isAssignmentLoaded = !$event"
            />
        </template>

        <template v-if="isAssignmentLoaded">
            <template v-if="classAssignments?.length > 0">
                <section>
                    <template v-for="(assignment, idx) in classAssignments">
                        <ItemAssignment 
                            v-if="assignment?.isStarted || user_kind !== 'student'"
                            :user_kind="user_kind"
                            :assignment="assignment"
                            :isPretest="isPretest"
                            :classId="classId"
                            @onClickCourse="onClickCourse(assignment?.moduleId)"
                            @onEditAssignment="onEditAssignment(assignment)"
                            @toggleRemoveAssignment="toggleRemoveAssignment(assignment)"
                            @onClickReviewStudents="onClickReviewStudents(assignment?.id)"
                            @onClickReview="onClickReview"
                            @onRefresh="getClassAssignment"
                            @onClickDetail="onClickDetail"
                            :key="idx"
                        />
                    </template>


                    <b-pagination
                        v-if="isAssignmentLoaded"
                        class="mx-4"
                        align="right"
                        v-model="pagination.page"
                        :total-rows="pagination.totalItems"
                        :per-page="pagination.perPage"
                        @change="getClassAssignment"
                    ></b-pagination>
                </section>
            </template>
            <template v-else-if="!this.servicesState?.classroomDetail?.registered && userRole === 'student'">
                <b-card class="border">
                    <b-row>
                        <b-col>Anda tidak terdaftar dikelas ini.</b-col>
                    </b-row>
                </b-card>
            </template>
            <template v-else>
                <b-card class="border">
                    <b-row>
                        <b-col>Belum Ada Tugas</b-col>
                    </b-row>
                </b-card>
            </template>
        </template>
        <template v-else>
            <b-card class="border">
                <b-row>
                    <b-col>Loading..</b-col>
                </b-row>
            </b-card>
        </template>

        <b-modal 
            v-model="isConfirmRemoveAssignment" 
            size="md" 
            centered 
            hide-header 
            hide-footer 
            body-class="p-0"
        >
            <ModalConfirmation
                title="Peringatan!"
                :description="`<p>Apakah anda yakin akan menghapus tugas <strong>${selectedAssignment?.title}</strong> ini?</p>`"
                btnYesVariant="danger"
                @actionYes="onRemoveAssignment"
                @actionNo="isConfirmRemoveAssignment = false"
            />
        </b-modal>
    </section>
</template>

<script>
import moment from 'moment';
import { mapActions, mapState } from 'vuex';

import { SORT_ASSIGNMENTS, ASSIGNMENT_TYPE } from '@/commons/constants/filters'
import { FIELDS_FILTER_ASSIGNMENT } from '@/commons/constants/forms';
import { toDateTimes, toEncrypt } from '@/commons/utils/.'

import ContentHeader from '../micro/ContentHeader.vue';
import CircularProgresBar from '../micro/CircularProgresBar.vue';
import ModalConfirmation from '~/components/template/micro/modal/ModalConfirmation.vue';
import FilterForms from '../micro/FilterForms.vue';
import ItemAssignment from '../../template/micro/items/ItemAssignment.vue';

export default {
    components: { ContentHeader, CircularProgresBar, ModalConfirmation, FilterForms, ItemAssignment },
    props: {
        classId: {
            type: Number,
            default: 0
        },
        classSlug: {
            type: String,
            default: ''
        },
        className: {
            type: String,
            default: ''
        },
        withHeader: {
            type: Boolean,
            default: true
        },
        isPretest: {
            type: Boolean,
            default: false
        },
        isTestCase: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {          
            activeCourseIndex: null,
            activeCourseId: null,

            statusCourse: false,
            actionsButton: [
                { 
                    text: 'Tugas', 
                    class: 'btn btn-primary', 
                    type: 'button',
                    to: `/dashboard/classroom/${this.classSlug}/assignment/create`,
                    iconClass: 'ri-add-fill mr-1'
                },
            ],
            filterFields: FIELDS_FILTER_ASSIGNMENT,

            classAssignments: [],
            isAssignmentLoaded: false,

            isConfirmRemoveAssignment: false,
            selectedAssignment: {},
            
            alertMessage: "",
            alertStatus: false,

            sortAssignments: SORT_ASSIGNMENTS,

            isFilterBusy: true,

            pagination: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 1,
            },

            lastFiltered: null,

            // Filter Actions (Course and Type Assignment)
            // the name of variable state programs, I take the name from value of "options" filter data in forms.js, so it can dynamic
            filtersData: {
                modules: [],
                assignmentTypes: [...ASSIGNMENT_TYPE],
            },
            isLoading: {
                modules: { data: false, pagination: false },
            },
            userRole: null,
        }
    },
    filters: {
        humanizeDate(value) {
            moment.locale('id')
            if (!value) return ''
            return moment(value).startOf('day').fromNow()
        }
    },
    computed: {
        ...mapState({
            assignments: (state) => state.Assignments?.data,
            assignmentPaginations: (state) => state.Assignments?.pagination,
            responseStatus: (state) => state.Services?.status,
            responseMessage: (state) => state.Services?.message,
            user_kind: (state) => state.Auth?.user_kind,
            filterItems: (state) => state.Layouts?.filters,
            servicesState: (state) => state.Services,
        }),
    },
    created() {
        this.initiateComponent();

        if (typeof document.hidden !== "undefined") {
            // add listener for visibility change
            document.addEventListener("visibilitychange", this.focusWindowListener);
            this.$emit('onUpdateList')
        }
        
    },
    methods: {
        toDateTimes,
        ...mapActions({
            getAssignments: 'Assignments/list',
            getCourses: 'Services/classroomModules',
            setActiveTab: 'Layouts/setActiveTab',
            removeAssignment: 'Assignments/delete',
            setSelectedFilter: 'Layouts/setSelectedFilter'
        }),

        /**
         * initialization component
         */
        initiateComponent(){
            this.initiateData();
            this.fetchResourcesComponent();
        },

        /**
         * Fetch All Resource that needed in this component
         */
        async fetchResourcesComponent(){
            this.isAssignmentLoaded = true;

            try{
                await Promise.all([
                    this.getClassAssignment(),
                    this.getClassCourse(),
                ])
                this.isAssignmentLoaded = true;
            }catch(error){
                console.error(error);
                this.isAssignmentLoaded = true;
            }
        },

        /**
         * Set Data that needed in this component
         */
        initiateData(){
            this.userRole = localStorage.getItem("user_kind");
        },

        setFiltersAndFetch({page, pageSize, order, search, modules, assignmentTypes}) {

            this.lastFiltered = { 
                classroomId: this.classId, 
                page: page || this.pagination?.page, 
                pageSize: pageSize || this.pagination?.perPage, 
                order: order || '', 
                search: search || '', 
                moduleId: modules || '',
                type: assignmentTypes || '',
                moduleType : this.isPretest ? "pretest" : 'module'
            }

            this.getClassAssignment(page, pageSize, order, search, modules, assignmentTypes)
        },

        focusWindowListener() {
            if (!document.hidden && this.user_kind === 'student') this.getClassAssignment()
        },
        
        getClassAssignment(page, pageSize, order, search, moduleId, type) {
            this.isAssignmentLoaded = false;

            let params = { 
                classroomId: this.classId, 
                page: page || this.pagination?.page, 
                pageSize: pageSize || this.pagination?.perPage, 
                order: !!this.lastFiltered ? this.lastFiltered?.order : order || '', 
                search: !!this.lastFiltered ? this.lastFiltered?.search : search || '', 
                moduleId: !!this.lastFiltered ? this.lastFiltered?.moduleId : moduleId || '',
                type: !!this.lastFiltered ? this.lastFiltered?.type : type || '',
                moduleType : this.isPretest ? "pretest" : 'module'
            }

            this.getAssignments(params).then(() => {
                this.classAssignments = this.assignments

                this.pagination = this.assignmentPaginations

                this.isAssignmentLoaded = true
                
            })
        },

        async getClassCourse() {
            this.isLoading.modules.data = true;

            await this.getCourses({ slug: this.classSlug });

            if(!this.servicesState?.status){
                console.error(`Failed to fetch Modules : ${this.servicesState?.message}`);
                this.isLoading.modules.data = false;
            }else{
                let modules = this.servicesState?.modules;

                let tempModules = [];

                // Set Options Program for listed in dropdown filter
                modules?.map((module) => {
                    let value = module?.title

                    tempModules.push({
                        key: module?.id,
                        value
                    })
                })

                this.filtersData.modules = tempModules;
                this.isLoading.modules.data = false;
            }
        },
        
        onClickCourse(courseId) {
            if (!this.isPretest && !this.isTestCase) {
                this.setActiveTab('courses')
                this.$router.push(`/dashboard/classroom/${this.classSlug}#module-${courseId}`)
            }
        },
        onEditAssignment(assignment){
            localStorage.setItem('classId', toEncrypt(this.classId))
            localStorage.setItem('assignmentId', toEncrypt(assignment?.id))

            if (this.isPretest) this.$router.push({
                path: `/dashboard/classroom/${this.$route.params.classroom}/pretest/${assignment?.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}/edit`,
            })
            else this.$router.push({
                path: `/dashboard/classroom/${this.classSlug}/assignment/${assignment?.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}/edit`,
            })
        },
        toggleRemoveAssignment(assignment) {
            this.isConfirmRemoveAssignment = !this.isConfirmRemoveAssignment
            
            if (this.isConfirmRemoveAssignment) this.selectedAssignment = assignment
            else this.selectedAssignment = null
        },  
        onRemoveAssignment() {
            this.isAssignmentLoaded = false

            const params = {
                classroomId: this.classId,
                topicId: this.selectedAssignment?.id
            }

            this.removeAssignment(params).then(() => {

                if(!this.responseStatus) {
                    console.error('Failed remove mentor from classroom', this.responseMessage)
    
                    this.setEvent(this.responseMessage, false)
                } else {
                    this.isConfirmRemoveAssignment = false
    
                    this.getClassAssignment()
                }                
            })
        },
        onClickReview(data) {
            const findClass = this.filterItems?.find(item => item.value === this.classId)
            this.setSelectedFilter(findClass)
            this.$router.push({
                path: '/dashboard/reviews',
                query: {
                    classroomId: this.classId,
                    classroomSlug: this.classSlug,
                    classroomName: this.className,
                    assignmentId: data?.task?.id,
                }
            })
        },
        onClickDetail(data){
            localStorage.setItem('classId', toEncrypt(this.classId))
            localStorage.setItem('assignmentId', toEncrypt(data?.task?.id))
            localStorage.setItem("className", toEncrypt(this.className));

            if (this.isPretest) {
                this.$router.push({
                    path: `/dashboard/classroom/${this.classSlug}/pretest/${data?.task?.title?.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}`
                });
            } else {
                this.$router.push({
                    path: `/dashboard/classroom/${this.classSlug}/assignment/${data?.task?.title?.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}`
                });
            }
        },
        onClickReviewStudents(assignmentId) {
            this.$router.push({
                path: `/dashboard/classroom/${ this.$route.params.classroom }/pretest/${ assignmentId }/students/`,
            })
        },
        onOpenDropdown() {
            this.getClassCourse()
        },
    },

    destroyed() {
        document.removeEventListener("visibilitychange", this.focusWindowListener);
    }

}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/components/classroom/assignment.scss';

::v-deep .btn {
    font-weight: 400;
}
</style>
