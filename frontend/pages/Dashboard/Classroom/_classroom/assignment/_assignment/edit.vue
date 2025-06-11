<template>
    <div class="assignment-container bg-white p-4">
        <ModuleForm
            action="edit"
            customClass="py-4 col-12" 
            hideHeader
            isAssignment
            isFromClass
            :classroomModules="classroomModules"
            :classroomId="classId"
            :moduleId="assignmentId"
            :isCard="false"
            @callbackSubmit="handleCallbackSubmit"
            @callbackCancel="handleCallbackCancel"
        />
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import { toDecrypt } from '~/commons/utils';

import BackButton from '~/components/classrooms/micro/BackButton.vue';
import ModuleForm from '~/components/template/micro/form/ModuleForm.vue'

export default {
    async asyncData ({ query }) {
        const classId = parseInt(toDecrypt(localStorage.getItem('classId')));
        const assignmentId = parseInt(toDecrypt(localStorage.getItem('assignmentId')));

        return { classId, assignmentId };
    },
    layout: "dashboard",
    components: { ModuleForm, BackButton },
    data() {
        return {
            classroomModules: [],
            isModuleEmpty: false,
            selectedCourses: null,
            selectedCoursesSlug: null,
            classroomTopicsAll: [],
            isTopicsLoaded: false,
            classroomSlug: this.$route?.params?.classroom ?? '',
        }
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services
        })
    },
    created() {
        this.getListModules()
    },
    methods: {
        ...mapActions({ 
            setActiveTab: 'Layouts/setActiveTab',
        }),
        handleCallbackCancel(){
            localStorage.removeItem('assignmentId')
            localStorage.removeItem('classId')

            this.$router.go(-1);
        },
        async fetchListTopics(event) {
            const found = this.classroomTopicsAll.find((item) => item.topicId === this.selectedCourses)

            if (found && !event) this.classroomTopics = found.lists
            else {
                this.isTopicsLoaded = false
                await this.$store.dispatch('Services/classroomTopics', {classroomSlug: this.classroomSlug, moduleSlug: this.selectedCoursesSlug})

                if (!this.servicesState.status) {

                    console.error('failed fetch classroom topics', this.servicesState.message);
                    this.setEvent(this.servicesState.message, false)
                    this.isTopicsLoaded = false;

                } else {

                    this.classroomTopics = this.servicesState.topics ?? []

                    const object = {
                        topicId: this.selectedCourses,
                        lists: this.classroomTopics
                    }

                    this.classroomTopicsAll.push(object)
                    this.isTopicsLoaded = true
                }
            }
        },
        setActiveCourse(courseId = null) {
            if (courseId) this.selectedCourses = courseId
            else {
                if (this.classroomModules?.length != 0) {
                    this.selectedCourses = this.classroomModules?.[0]?.id
                    this.selectedCoursesSlug = this.classroomModules?.[0]?.slug
                }
                else {
                    this.selectedCourses = null
                    this.selectedCoursesSlug = null
                }
            }

            this.fetchListTopics(courseId)

        },
        async getListModules(state, event = null) {
            this.isModuleLoaded = false
            let params = {
                slug: this.classroomSlug,
                state: state
            }

            await this.$store.dispatch('Services/classroomModules', params)

            if (!this.servicesState.status) {

                console.error('failed fetch classroom modules: ', this.servicesState.message);
                this.setEvent(this.servicesState.message, false)
                this.isModuleLoaded = false;
                this.isModuleEmpty = true

            } else {

                this.classroomModules = this.servicesState.modules

                if (this.classroomModules?.length == 0) this.isModuleEmpty = true
                else this.isModuleEmpty = false

                this.isModuleLoaded = true
                this.setActiveCourse(event)
            }

        },
        handleCallbackSubmit() {
            localStorage.removeItem('assignmentId')
            localStorage.removeItem('classId')

            this.setActiveTab('assignments')
            // this.$router.push(`/dashboard/classroom/${this.classId}`);
            this.$router.go(-1);
        }
    }
}
</script>

<style scoped>
    .assignment-container {
        min-height: calc( 100vh - 115px);
    }
</style>