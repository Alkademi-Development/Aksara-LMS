<template>
    <div>
        <section class="container-fluid relative overflow-hidden" style="padding: 0px !important;">
            <DetailModuleEditor
                :isFromLibrary="true"
            />
        </section>
    </div>
</template>

<script>
import DetailModuleEditor from "@/components/courses/DetailModuleEditor.vue"

export default {
    layout: 'dashboard',
    components: {
        DetailModuleEditor
    },
}
</script>



<!-- <template>
    <div class="container-fluid mt-4"> -->
        
        <!-- <div class="row">
            
            <ModuleTable
                :isBusy="isBusy"
                :courseId="parseInt(courseId)"
                :courseName="courseName"
                :role="role"
                :fields="fields"
                :items="items"
                :pagination="pagination"
                :moduleDetail="moduleDetail"
                @fetchData="fetchModules"
                @isLoading="busyToggler"
            />
            
        </div> -->

        <!-- <DetailCourse :slug="slug" />
        
        <Footer />

    </div>
</template> -->

<!-- <script>
import DetailCourse from '@/components/courses/DetailCourse.vue'
// import ContentHeader from "@/components/template/dashboard/ContentHeader"
// import ModuleTable from "@/components/template/micro/table/ModuleTable"
import Footer from "@/components/template/dashboard/Footer"
import { mapState } from 'vuex';

import { toDecrypt } from '~/commons/utils'

export default {
    layout: "dashboard",
    components: {
        // ContentHeader,
        Footer,
        // ModuleTable,
        DetailCourse,
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services
        })
    },
    async asyncData({ params }) {
        const slug = params.courseId
        return { slug }
    },
    data() {
        return {
            role: 'modul',
            isBusy: false,
            courseId: null,
            courseName: null,
            fields: [
                {   
                    key: "index", 
                    label: 'No'
                },
                {
                    key: 'title',
                    label: 'Judul Modul',
                    // sortable: true
                },
                {
                    key: 'action',
                    label: '',
                    class: 'text-right'
                }
            ],
            items: [],
            moduleDetail: null,
            pagination: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 0,
            },
        }
    },
    created() {
        // this.getCredentials()
        
        // localStorage.removeItem('topicId')
    },
    methods: {
        busyToggler(data) {
            this.isBusy = data
        },
        getCredentials() {
            this.courseId = parseInt(toDecrypt(localStorage.getItem('courseId')))
            this.courseName = this.$route.params.courseId

            this.fetchModules(1)
        },
        async fetchModules(page) {
            this.isBusy = true

            await this.$store.dispatch('Services/topics', {slug: this.courseName, page: page})
            if(!this.servicesState.status) {
                console.error('Failed get topics by module', this.servicesState.message)
                this.isBusy = false
            } else {
                this.items = this.servicesState.topics ?? [];
                this.moduleDetail = this.servicesState.moduleDetail;
                this.pagination = this.servicesState.pagination
                this.isBusy = false
            }
        }
    }
};
</script>

<style>
</style> -->