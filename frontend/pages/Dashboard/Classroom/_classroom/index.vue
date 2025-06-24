<template>
    <div class="container-fluid py-4">
        <template v-if="getActiveTab === 'overview'">
            <ClassroomOverview 
                :classCode="detailOverview?.slug" 
                :isComponentLoaded="isClassDetailLoaded"
                :detailOverview="detailOverview"
                @fetchOverview="setOverviewClass"
            />
        </template>

        <template v-if="isClassDetailLoaded && getActiveTab === 'courses'">
            <!-- <Courses :classId="classroomId" :classSlug="detailOverview?.slug" :classOverview="detailOverview" @fetchOverview="setOverviewClass"/> -->
            <ListCourse :classId="classroomId" :classSlug="detailOverview?.slug" :classOverview="detailOverview" @fetchOverview="setOverviewClass"/>
        </template>

        <template v-if="isClassDetailLoaded && getActiveTab === 'assignments'">
            <Assignment :classId="classroomId" :classSlug="detailOverview?.slug" :className="detailOverview?.name" :isTestCase="isTestCase" />
        </template>

        <template v-if="isClassDetailLoaded && getActiveTab === 'student'">
            <Students :classId="classroomId" />
        </template>

        <template v-if="isClassDetailLoaded && getActiveTab === 'events'">
            <Events :classId="classroomId" :classSlug="slug" />
        </template>

        <template v-if="isClassDetailLoaded && getActiveTab === 'statistics'">
            <Statistics :classId="classroomId" :attendanceId="attendanceId" />
        </template>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { statusClassNew } from "~/commons/utils";
import { TAB_MENU_CLASSROOM, TAB_MENU_TEST, TAB_MENU_TEST_STUDENT } from "~/commons/constants/layouts"
import { toEncrypt } from '~/commons/utils';

import ClassroomOverview from "@/components/classrooms/Overview.vue"
import Courses from '~/components/classrooms/pages/Courses.vue';
import ListCourse from '~/components/classrooms/pages/ListCourse.vue';
import Students from '~/components/classrooms/pages/Students.vue';
import Assignment from '~/components/classrooms/pages/Assignment.vue';
import Events from '~/components/classrooms/pages/Events.vue';
import Statistics from '~/components/classrooms/pages/Statistics.vue';

export default {
    async asyncData ({ params }) {
        const slug = await params.classroom;
        return { slug };
    },
    layout: 'dashboard',
    components: {
        ClassroomOverview,
        Courses,
        Students,
        Assignment,
        Events,
        Statistics,
        ListCourse
    },
    data(){
        return { 
            isClassDetailLoaded: false, 
            detailOverview: null, 
            classroomId: -1, 
            tabs: TAB_MENU_CLASSROOM,
            isTestCase: false,
            attendanceId: 0
        }
    },
    computed: {
        ...mapState({
            getActiveTab: (state) => state?.Layouts?.activeTab,
            servicesState: (state) => state?.Services,
            classroomDetail: (state) => state?.Services?.classroomDetail,
            sassState: (state) => state.Sass,
            userKind: (state) => state.Auth?.user_kind,
        })
    },
    created(){
        this.getClassroomDetail()
    },
    methods: {
        statusClassNew,
        ...mapActions({
            setTabs: 'Layouts/getTabs',
            setActiveBadge: 'Layouts/setActiveBadge',
            classOverview: 'Services/classroomOverview',
        }),

        filterTabs(value){
            let kind = localStorage.getItem("user_kind")
            let result = [{key: "assignments", label: "Tugas"}, {key: "events", label: "Events"}]

            if(kind == "student" && value == 0) result?.forEach((value) => { 
                const index = this.tabs.findIndex(item => item?.key === value.key)
                if (index != -1) this.tabs?.splice(index,1)
            })

            if(kind == "student" && this.detailOverview?.kind == "event") result?.forEach(() => { 
                const index = this.tabs.findIndex(item => item?.key === "assignments")
                if (index != -1) this.tabs?.splice(index,1)
            })

            else if(kind == "student" && value == 1) result.forEach(value => {
                const filter = this.tabs.filter(item => {
                    return item.key === value.key
                })
                if(filter.length === 0){
                    this.tabs.push({key: value.key, label: value.label})
                }
            })

            // Debugging statement removed: console.log(this.tabs);
        },
        getClassroomDetail() {
            this.isClassDetailLoaded = false

            this.classOverview(this.slug).then(() => {
                this.isClassDetailLoaded = true
                this.detailOverview = this.servicesState?.data
                this.classroomId = this.detailOverview?.id
                localStorage.setItem("classroomId", toEncrypt(this.classroomId));
                this.attendanceId = this.detailOverview?.attendanceId
                if(this.detailOverview) {
                    this.isTestCase = this.detailOverview.type === 'test'

                    if (this.isTestCase && this.userKind === 'student') {
                        console.log("User is a student in a test case");
                        this.tabs = TAB_MENU_TEST_STUDENT
                    }else if (this.isTestcase && this.userKind !== 'student') {
                        console.log("User is not a student in a test case");
                        this.tabs = TAB_MENU_TEST
                    }
                }

                console.log(this.detailOverview)

                if (this.detailOverview?.kind === 'event') {
                    this.tabs = this.tabs.filter(item => item.key !== 'assignments' && item.key !== 'courses');
                }

                this.setTabs(this.tabs)
                this.filterTabs(this.detailOverview.userState)

                // Set Active Badge on Top Header
                let badges = this.statusClassNew(this.detailOverview?.classState)

                if (this.detailOverview?.state != 'release') badges = [ { label: 'Draft', style: "badge-default" } ]
                else if (this.detailOverview?.registered && !this.detailOverview?.userState) badges = [ { label: 'Menunggu Persetujuan', style: "badge-orange" } ]

                this.setActiveBadge(badges)
                //~~
            })            

            if(!isNaN(this.slug)) {
                this.$router.go(-1);
            } 

        },
        async setOverviewClass() {
            await this.setTabs(this.tabs)
            await this.getClassroomDetail()
        },
    },
    destroyed() {
        this.setActiveBadge(null)
    },
}
</script>