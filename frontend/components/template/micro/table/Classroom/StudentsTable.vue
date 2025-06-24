<template>
    <div>
        <!-- <div class="d-flex align-items-center mb-2" v-if="pagination.totalItems > 0">
            <b-form-checkbox v-model="checkAllStudent" @change="checkedAllStudent()" id="checkboxAllStudent">
                <span class="mt-1 font-weight-600">Select All Student</span>
            </b-form-checkbox>
        </div> -->
        <section id="student-table" class="card border m-0">
            <b-table
                id="datatables"
                head-variant="light"
                responsive
                show-empty
                tdClass="vetical-align: middle"
                :empty-text="emptyText"
                :fields="fields"
                :items="items"
                :busy="isBusy"
                :tbody-tr-class="rowClass"
            >
                <template #head(checklist) v-if="pagination.totalItems > 0 && isShowCheckbox">
                    <input type="checkbox" v-model="checkAllStudent" @change="checkedAllStudent()" id="checkboxAllStudent">
                </template>
                <template #cell(checklist)="data" v-if="isShowCheckbox">
                    <div class="w-100 text-center">
                        <input type="checkbox" class="selectBoxStudent" :value="data?.item?.id" @click="updateSelectedStudents()">
                    </div>
                </template>
                <template #cell(no)="data">
                    <div class="w-100 text-center">{{data?.item?.rank}}</div>
                    <!-- <div class="w-100 text-center">
                        {{
                            pagination.page == 1
                            ? data.index + 1
                            : data.index + (pagination.page == 2 ? pagination.page * 5 + 1 : (pagination.page - 1) * 10 + 1 )
                        }}
                    </div> -->
                </template>
                <template #cell(name)="data">
                    <span class="name-link pointer" @click="$emit('openModalPreview', data?.item)">
                        {{ data?.item?.name ? data?.item?.name : '-' }}
                    </span>
                </template>
    
                <template #cell(email)="data">
                    <span>{{ data?.item?.email }}</span>
                </template>
    
                <template #cell(averageScore)="data">
                    <span
                        class="name-link" 
                    >{{ data?.item?.averageScore }}</span>
                </template>

                <template v-for="(item, idx) in items[0]?.assignments" v-slot:[`cell(task-${idx})`]="data">
                    <template v-if="isSubmitted(data, idx)">
                        <template v-if="isAssessed(data, idx)">
                            <template v-if="checkAssignment(data, 'link', idx)">
                                <span v-if="checkAssignment(data, 'type', idx) === 'studio' || checkAssignment(data, 'type', idx) === 'form'" :key="idx" class="cursor-pointer name-link" @click="openTaskExternal(checkAssignment(data, 'link', idx), checkAssignment(data, 'type', idx))">{{ checkAssignment(data, "score", idx) }}</span>
                                <a v-else :href="checkAssignment(data, 'link', idx)" :key="idx" class="name-link" target="_blank">{{ checkAssignment(data, "score", idx) }}</a>
                            </template>
                            <span v-else class="name-link" :key="idx">{{ checkAssignment(data, 'score', idx) }}</span>
                        </template>
                        <template v-else>
                            <img :key="`submitted-${idx}`" src="/dashboard/assets/image/progressyellow.svg" width="16" />
                        </template>
                    </template>
                    <template v-else>
                        <i :key="`submitted-${idx}`" class="ri-subtract-fill" style="font-weight: 500"></i>
                    </template>
                </template>
    
                <template #table-busy>
                    <div class="my-2 text-center text- i1 primary">
                        <b-spinner class="align-middle"></b-spinner>
                        <strong>Memuat Data...</strong>
                    </div>
                </template>
            </b-table>
            
            <b-pagination
                v-if="!isBusy"
                align="right"
                v-model="pagination.page"
                :total-rows="pagination.totalItems"
                :per-page="pagination.perPage"
                @change="onUpdatePage"
            ></b-pagination> 
    
            <ModalDetailAssignment
                hideFooter
                isFromClass
                size="md" 
                :classroomModules="selectedCourse?.items"
                :title="selectedCourse?.name" 
                :isNewCourse="false"
                :vModel="openModalAssignment" 
                @vModelChange="openModalAssignment = $event"
            />
        </section>
    </div>
</template>
  
<script>
import moment from 'moment'

import ModalDetailAssignment from '../../modal/ModalDetailAssignment.vue'
import appToken from "~/api/app-token";

export default {
    components: { 
        ModalDetailAssignment 
    },
    props: {
        isBusy: Boolean,
        role: String,
        isShowCheckbox: Boolean,
        fields: {
            type: Array
        },
        leaderboardDetail: {
            type: Object,
            default: {}
        },
        classroomDetail: {
            type: Object,
            default: {}
        },
        items: {
            type: Array,
            default: []
        },
        pagination: {
            type: Object,
            default: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 0,
            }
        },
        emptyText: {
            type: String,
            default: 'There are no records to show',
        }
    },
    filters: {
        capitalize: function (value) {
            if (!value) return "";
            value = value.toString();
            return value.charAt(0).toUpperCase() + value.slice(1);
        },
    },
    data() {
        return {
            res: "",
            userKind: localStorage.getItem("user_kind"),
            user: JSON.parse(localStorage.getItem("user")),

            openModalAssignment: false,
            selectedCourse: {},
            selectedStudents: [],

            checkAllStudent: false,
        }
    },
    mounted() {
        // Set the initial number of items
        const url = this.$router.currentRoute.fullPath;
        this.res = url.split("/");
        this.res.shift();
        this.res = this.res[1];
        this.pagination.totalItems = this.items.length;
    },
    methods: {
        onClickDetailCourse(course, courseId) {
            this.selectedCourse = course?.[courseId]

            this.openModalAssignment = !this.openModalAssignment
        },
        async onClickDownload() {
            let dispatch = "Services/classroomLeaderboardsExport";
            if (this.classroomDetail.pretest == 1)
                dispatch = "Services/pretestLeaderboardsExport";
            await this.$store.dispatch(dispatch, this.classroomDetail.id)
                .then(() => {
                var servicesState = this.$store.state.Services;
                if (!servicesState.status) {
                    console.error("Failed download leaderboard", servicesState.message);
                }
                else {
                }
            });
        },
        onClickOpen(item) {
            const url = `/dashboard/students/${item.userId}`;
            this.$router.push(url);
        },
        rowClass(item, type) {
            if (!item || type !== "row")
                return;
            if (item.userId === this.user.id)
                return "table-primary";
        },
        beautifyDate(date) {
            return moment(date).format("DD MMM YY");
        },
        onUpdatePage(val) {
            this.$emit("fetchData", val);
        },
        
        updateSelectedStudents() {
            const selectedIds = [];
            const checkboxesStudent = document.querySelectorAll('#student-table input[type=checkbox]:checked');
            checkboxesStudent.forEach((checkbox) => {
                selectedIds.push(parseInt(checkbox.value));
            });
            this.selectedStudents = selectedIds;
            this.$emit('selected-students-changed', this.selectedStudents);
        },

        checkedAllStudent() {
            const selectedIds = [];
            const allSelectedsStudent = document.querySelectorAll("#student-table input[type=checkbox]");

            if(this.checkAllStudent) {
                allSelectedsStudent.forEach(select => {
                    select.checked = true;
                    selectedIds.push(parseInt(select.value));
                })
            } else {
                allSelectedsStudent.forEach(select => {
                    select.checked = false;
                    selectedIds.pop();
                })
            }

            this.selectedStudents = selectedIds;
            this.$emit('selected-students-changed', this.selectedStudents);
        },
        checkAssignment(data, kind, index){
            const assignments = data.item.assignments;

            if (kind === "score") return assignments[index]?.score;
            else if (kind === "type") return assignments[index]?.type;
            else if (kind === "link") return assignments[index]?.type === "studio" || assignments[index]?.type === "form" ? assignments[index]?.externalId : assignments[index]?.type === "file" ? assignments[index]?.link || assignments[index]?.file : assignments[index]?.link;
        },
        async openTaskExternal(id, type){
            const responseId = "&responseId=" + id
            const redirectLms = "&redirectTo=" + window.location.href

            var urlTarget = ''
            if (type == 'studio') urlTarget = process.env.editorURL + `compiler?&metronomId=${id}` + redirectLms
            if (type == 'form') urlTarget = process.env.formURL + "/preview?" + responseId + redirectLms

            const baseUrl = process.env.alkademiAuth;
            const redirect = "&redirectTo=" + urlTarget;
            const lmsId = "&lmsId=" + localStorage.getItem('lmsId');
            const codeToken = `&code=${await appToken?.getCode()}`
            const generatedToken = `&generatedToken=${await appToken?.generatedToken()}`
            const url = `${baseUrl}/check?${redirect}${lmsId}${codeToken}${generatedToken}`;

            window.open(url, '_blank')
        },
        isSubmitted(data, index){
            const assignments = data?.item?.assignments;
            
            return assignments[index]?.submitted;
        },
        isAssessed(data, index){
            const assignments = data?.item?.assignments;
            
            return assignments[index]?.scored;
        }
    },
}
</script>
  
<style lang="scss">
    @import "@/assets/scss/components/micro/table/student-table.scss";
</style>
  