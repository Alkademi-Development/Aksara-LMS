<template>
  <div>

        <!-- Header -->
        <ContentHeader title="Batch Jong Koding" />

        <!-- Page content -->
        <div class="container-fluid mt--6">
            
            <!-- Content Begin -->
            <div class="row">
                
                <BatchTable
                    :isBusy="isBusy"
                    :role="role"
                    :fields="fields"
                    :items="items"
                    :pagination="pagination"
                />
                
            </div>
            
            <Footer />

        </div>

    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import BatchTable from "@/components/template/micro/table/BatchTable"
import Footer from "@/components/template/dashboard/Footer"

export default {
    layout: "dashboard",
    components: {
        ContentHeader,
        Footer,
        BatchTable,
    },
    data() {
        return {
            role: 'batch',
            isBusy: false,
            fields: [
                {   
                    key: "index", 
                    label: 'No'
                },
                {
                    key: 'title',
                    label: 'Judul Batch',
                    // sortable: true
                },
                {
                    key: 'city',
                    label: 'Kota'
                },
                {
                    key: 'registration',
                    label: 'Jadwal Registrasi',
                    // sortable: true
                },
                {
                    key: 'schedule',
                    label: 'Jadwal Pelaksanaan',
                    // sortable: true
                },
                {
                    key: 'totalRegistrar',
                    label: 'Pendaftar'
                },
                {
                    key: 'totalStudents',
                    label: 'Peserta'
                },
                {
                    key: 'totalGraduates',
                    label: 'Alumni'
                },
                {
                    key: 'action',
                    label: '',
                    class: 'text-right'
                },
            ],
            items: [
                { title: 'Batch 1', cities: [ { cityName: 'Bandung' }, { cityName: 'Jakarta'} ], schedule: { start: '06-20-2021', end: '07-20-2021' }, registration: { start: '06-10-2021', end: '06-15-2021' }, totalStudents: 20, totalGraduates: 18, totalRegistrar: 30 },
                { title: 'Batch 2', cities: [ { cityName: 'Bandung' }, { cityName: 'Jakarta'} ], schedule: { start: '06-20-2021', end: '07-20-2021' }, registration: { start: '06-10-2021', end: '06-15-2021' }, totalStudents: 20, totalGraduates: 18, totalRegistrar: 30 },
                { title: 'Batch 3', cities: [ { cityName: 'Bandung' }, { cityName: 'Jakarta'} ], schedule: { start: '06-20-2021', end: '07-20-2021' }, registration: { start: '06-10-2021', end: '06-15-2021' }, totalStudents: 20, totalGraduates: 18, totalRegistrar: 30 },
                { title: 'Batch 4', cities: [ { cityName: 'Bandung' }, { cityName: 'Jakarta'} ], schedule: { start: '06-20-2021', end: '07-20-2021' }, registration: { start: '06-10-2021', end: '06-15-2021' }, totalStudents: 20, totalGraduates: 18, totalRegistrar: 30 },
                { title: 'Batch 5', cities: [ { cityName: 'Bandung' }, { cityName: 'Jakarta'} ], schedule: { start: '06-20-2021', end: '07-20-2021' }, registration: { start: '06-10-2021', end: '06-15-2021' }, totalStudents: 20, totalGraduates: 18, totalRegistrar: 30 },
                { title: 'Batch 6', cities: [ { cityName: 'Bandung' }, { cityName: 'Jakarta'} ], schedule: { start: '06-20-2021', end: '07-20-2021' }, registration: { start: '06-10-2021', end: '06-15-2021' }, totalStudents: 20, totalGraduates: 18, totalRegistrar: 30 },
                { title: 'Batch 7', cities: [ { cityName: 'Bandung' }, { cityName: 'Jakarta'} ], schedule: { start: '06-20-2021', end: '07-20-2021' }, registration: { start: '06-10-2021', end: '06-15-2021' }, totalStudents: 20, totalGraduates: 18, totalRegistrar: 30 },
                { title: 'Batch 8', cities: [ { cityName: 'Bandung' }, { cityName: 'Jakarta'} ], schedule: { start: '06-20-2021', end: '07-20-2021' }, registration: { start: '06-10-2021', end: '06-15-2021' }, totalStudents: 20, totalGraduates: 18, totalRegistrar: 30 },
            ],
            pagination: {
                currentPage: 1,
                perPage: 10,
                totalRows: 1,
                pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
            }
        }
    }
};
</script>

<style>
</style>