<template>
    <div class="container-fluid mt-4">
        <CourseTable
            :isBusy="isBusy"
            :role="role"
            :fields="fields"
            :items="items"
            :pagination="pagination"
            @fetchData="fetchCourses"
            @isLoading="busyToggler"
        />
            
        <Footer />

    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import CourseTable from "@/components/template/micro/table/CourseTable.vue"
import Footer from "@/components/template/dashboard/Footer"
import { mapState } from 'vuex';

export default {
    layout: "dashboard",
    components: {
        ContentHeader,
        Footer,
        CourseTable,
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services
        })
    },
    data() {
        return {
            role: 'pretest',
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
        }
    },
    created(){
        this.fetchCourses(1)
    },
    methods: {
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
            
        }
    }
};
</script>

<style>
</style>