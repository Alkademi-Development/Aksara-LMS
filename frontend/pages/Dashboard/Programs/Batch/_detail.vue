<template>
  <div>

        <!-- Header -->
        <ContentHeader title="Pretest Batch 1" />

        <!-- Page content -->
        <div class="container-fluid mt--6">

          <CardDetail 
            name="Batch 1"
            registration="10-06-2021 - 15-06-2021"
            schedule="20-06-2021 - 20-07-2021"
            :items="items"
          />
            
            <!-- Content Begin -->
            <div class="row">
                
                <DetailBatchTable
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
import CardDetail from "@/components/template/micro/card/CardDetail"
import DetailBatchTable from "@/components/template/micro/table/DetailBatchTable"
import Footer from "@/components/template/dashboard/Footer"

export default {
    layout: "dashboard",
    components: {
        ContentHeader,
        Footer,
        DetailBatchTable,
        CardDetail
    },
    data() {
        return {
            role: 'pretest',
            isBusy: false,
            fields: [
                {   
                    key: "index", 
                    label: 'No'
                },
                {
                    key: 'pretestTitle',
                    label: 'Judul Pretest',
                    // sortable: true
                },
                {
                    key: 'pretestQuestion',
                    label: 'Pertanyaan',
                    // sortable: true
                },
                {
                    key: 'action',
                    label: ''
                }
            ],
            items: [
                { pretestTitle: 'Title 1', pretestQuestion: 'Question 1 ?' },
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