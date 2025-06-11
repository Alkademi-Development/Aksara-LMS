<template>
    <div>

        <!-- Header -->
        <ContentHeader title="Kegiatan" />

        <!-- Page Containt -->
        <div class="container-fluid mt--6">

            <!-- Content Begin -->
            <div class="row">

                <EventTable 
                    :isBusy="isBusy"
                    :role="role"
                    :fields="fields"
                    :items="items"
                    :pagination="pagination"
                    @fetchData="getEvents"
                />

            </div>
            
            <!-- Footer -->
            <Footer />

        </div>

    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import EventTable from "@/components/template/micro/table/EventTable"
import Footer from "@/components/template/dashboard/Footer"

export default {
    layout: 'dashboard',
    components: {
        ContentHeader,
        EventTable,
        Footer
    },
    data(){
        return {
            role: 'kegiatan',
            isBusy: true,
            fields: [
                {
                    key: 'index',
                    label: 'No',
                },
                {
                    key: 'title',
                    label: 'Judul',
                    // sortable: true,
                },
                {
                    key: 'date',
                    label: 'Jadwal Event',
                    // sortable: true,
                },
                {
                    key: 'totalAttendance',
                    label: 'Peserta',
                    // sortable: true,
                },
                {
                    key: 'action',
                    label: '',
                    class: 'text-right'
                }
            ],
            items: [],
            pagination: {
                currentPage: 1,
                perPage: 10,
                totalRows: 1,
                pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
            }
        }
    },
    created() {
        this.getEvents(1)
    },
    methods: {
        async getEvents(page) {
            this.isBusy = true

            await this.$store.dispatch('Events/getEvents', page)
            .then(() => {
                var eventState = this.$store.state.Events

                if(!eventState.status) {
                    console.log('Failed get events', eventState.message)
                    this.isBusy = false
                } else {
                    this.items = eventState.events
                    this.pagination = {
                        currentPage: eventState.pagination.currentPage,
                        perPage: eventState.pagination.perPage,
                        totalRows: eventState.pagination.totalRows,
                    }

                    this.isBusy = false
                }
            })
        }
    }
}
</script>

<style>

</style>