<template>
    <div class="container-fluid mt-4">

        <!-- <CardBundle /> -->
         <template v-if="isTabShow">
            <SectionBundle v-if="getActiveTab === 'library'" :activeTab="getActiveTab" />
            <SectionMaterial :activeTab="getActiveTab" class="mt-4"/>
         </template>
            
        <!-- <CourseTable
            :isBusy="isBusy"
            :role="role"
            :fields="fields"
            :items="items"
            :pagination="pagination"
            @fetchData="fetchCourses"
            @isLoading="busyToggler"
        /> -->
        
        <!-- <Footer /> -->
    </div>
</template>

<script>
import CourseTable from "@/components/template/micro/table/CourseTable.vue"
import CardBundle from "@/components/template/micro/card/CardBundle.vue";
import SectionBundle from "~/components/template/micro/section/SectionBundle.vue";
import SectionMaterial from "@/components/template/micro/section/SectionMaterial.vue";
import { TAB_MENU_COURSES } from "~/commons/constants/layouts"

import { mapState, mapActions } from 'vuex';

export default {
    layout: "dashboard",
    components: {
        CourseTable,
        CardBundle,
        SectionBundle,
        SectionMaterial,
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
            getActiveTab: (state) => state?.Layouts?.activeTab
        }),
        isTabShow(){
            return this.getActiveTab === 'library' || this.getActiveTab === 'myCourses' || this.getActiveTab === 'draft';
        }
    },
    data() {
        return {
            role: 'module',
            isBusy: true,
            fields: [
                {   
                    key: "index", 
                    label: 'No'
                },
                {
                    key: 'title',
                    label: 'Judul',
                    // sortable: true
                },
                {
                    key: 'action',
                    label: '',
                    class: 'text-right'
                }
            ],
            items: [],
            pagination: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 0,
            },
            userRole: localStorage.getItem("user_kind"),
        }
    },
    created(){
        // this.fetchCourses(1)
        this.initializeTab();
        // localStorage.removeItem('courseId')
    },
    methods: {
        ...mapActions({
            setTabs: 'Layouts/getTabs',
            setActiveTab: 'Layouts/setActiveTab',
        }),
        busyToggler(data) {
            this.isBusy = data
        },
        async fetchCourses(page){

            this.isBusy = true

            await this.$store.dispatch('Services/modules', {page: page, type: this.role})

            if(!this.servicesState.status) {
                console.error('Failed fetch modules', this.servicesState.message)
                this.isBusy = false
            } else {
                this.items = this.servicesState.modules ?? [];
                this.pagination = this.servicesState.pagination
                this.isBusy = false
            }
            
        },
        initializeTab() {
            this.tabs = TAB_MENU_COURSES;
            const userAccessToDraft = ["superadmin", "admin"];

            this.tabs = this.tabs.filter((tab) => userAccessToDraft.includes(this.userRole) ? tab : tab?.key !== 'draft');

            this.setActiveTab("library");
            this.setTabs(this.tabs);
        }
    }
};
</script>

<style>
</style>