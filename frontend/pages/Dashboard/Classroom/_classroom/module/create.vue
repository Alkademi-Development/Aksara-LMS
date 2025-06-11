<template>
    <div>
        <SectionEditor
            :isFromClass="true"
        />
    </div>
</template>

<script>
import SectionEditor from '@/components/editor/template/SectionEditor.vue';

export default {
    components: {
        SectionEditor
    },
    layout: 'blank',
}
</script>

<!-- <template>
    <div class="course-container bg-white p-4">
        <ModuleForm
            action="create"
            customClass="pb-4 col-12" 
            :classroomModules="classroomModules"
            :classroomId="classId"
            :courseParam="courseId"
            isFromClass
            hideHeader
            :isCard="false"
            @callbackSubmit="handleCallbackSubmit"
            @callbackCancel="handleCallbackCancel"
        />
    </div>
</template>

<script>
import { mapState } from 'vuex';

import ModuleForm from '~/components/template/micro/form/ModuleForm.vue'

import { toDecrypt } from '~/commons/utils'

export default {
    async asyncData ({ params, query }) {
        const classId = parseInt(toDecrypt(localStorage.getItem('classId')));
        const courseId = parseInt(toDecrypt(localStorage.getItem('courseId')));
        return { classId, courseId };
    },
    layout: "dashboard",
    components: { ModuleForm },
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
        
        handleCallbackCancel() {
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
            // this.$router.push(`/dashboard/classroom/${this.classId}`);
            
            this.$router.go(-1);
        },
    }
}
</script>

<style lang="scss" scoped>
.course-container {

    min-height: calc( 100vh - 115px);
}
</style> -->