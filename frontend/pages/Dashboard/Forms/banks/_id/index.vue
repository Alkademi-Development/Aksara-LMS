<template>
    <div class="container-fluid mt-4">

        <div class="row">

                <BankQuestionsTable 
                    :isBusy="isBusy"
                    :role="role"
                    :fields="fields"
                    :paketId="paketId"
                    :paketName="paketName"
                    :items="items"
                    :pagination="pagination"
                    @fetchData="getForms"
                    @isLoading="busyToggler"
                />

        </div>
        
        <Footer />

    </div>
</template>

<script>
import BankQuestionsTable from "@/components/template/micro/table/BankQuestionsTable"
import Footer from "@/components/template/dashboard/Footer"
import { mapState } from 'vuex'

import { toDecrypt } from '~/commons/utils'
import fieldForm from '@/store/global/form'

export default {
    layout: 'dashboard',
    components: {
        BankQuestionsTable,
        Footer
    },
    computed: {
        ...mapState({
            formsState: (state) => state.Forms
        })
    },
    async asyncData({params, query}) {
        const paketId = toDecrypt(localStorage.getItem('bankQuestionsId'))
        const paketName = params.id
        return {paketId, paketName}
    },
    data(){
        return {
            role: 'soal',
            isBusy: true,
            fields: [
                {
                    key: 'index',
                    label: 'No',
                    thStyle: 'width: 10%'
                },
                {
                    key: 'question',
                    label: 'Pertanyaan',
                    thStyle: 'width: 100%'
                },
                {
                    key: 'questionType',
                    label: 'Tipe',
                },
                {
                    key: 'category',
                    label: 'Kategori',
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
        this.getForms()
    },
    methods: {
        busyToggler(data) {
            this.isBusy = data
        },
        async getForms(data) {
            this.isBusy = true

            if (data) this.pagination.currentPage = data

            const params = {
                id: this.paketId,
                page: this.pagination.currentPage
            }

            await this.$store.dispatch('Forms/formQuestion', params)
            .then(() => {
                var formsState = this.$store.state.Forms

                if(!formsState.status) {
                    console.log('Failed get forms', formsState.message)
                    this.isBusy = false
                } else {
                    this.items = []
                    formsState.questions?.forEach(item => {
                        const questionObj = { ...item }
                        const question = fieldForm.inputFormPacketQuestion[2].options.find(opt => opt.value == item.type)
                        questionObj['questionType'] = question?.text
                        this.items.push(questionObj)
                    })
                    this.pagination = {
                        currentPage: formsState.pagination.currentPage,
                        perPage: formsState.pagination.perPage,
                        totalRows: formsState.pagination.totalRows,
                    }

                    setTimeout(() => {
                        this.isBusy = false
                    }, 1000);
                }
            })
        }
    }
}
</script>

<style>

</style>