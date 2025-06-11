<template>
  <div>

        <!-- Header -->
        <ContentHeader title="Peserta"/>

        <!-- Page content -->
        <div class="container-fluid mt--6">

            <b-alert
                :show="onEvent.alertCounter"
                :variant="onEvent.variant"
                @dismissed="onEvent.alertCounter=0"
                @dismiss-count-down="countDownChanged"
                >
                {{ onEvent.message }}
            </b-alert>
            
            <!-- Content Begin -->
            <div class="row">
                <StudentClassroomTable
                    :isBusy="isBusy"
                    :role="role"
                    :fields="fields"
                    :classroomDetail="classroomDetail"
                    :items="items"
                    :pagination="pagination"
                    @setEvent="setEvent($event.message, $event.status)"
                    @fetchData="getStudents"
                    @toggleInviteModal="toggleInviteModal"
                />
            </div>

            <!-- Footer -->
            <Footer />

        </div>

        <b-modal v-model="modalInvite" size="lg" centered hide-header hide-footer no-close-on-backdrop no-close-on-esc>

            <h3 class="text-center mb-3">Tambah Peserta</h3>

            <b-form @submit="inviteStudent">
                <b-form-group label="" label-for="inputEmail">
                    <div class="d-flex justify-content-between m-0">
                        <b-form-input 
                        v-model="selectCity"
                        :placeholder="isLoadStudentsNotJoin ? 'Loading...' : 'Tekan untuk memilih email peserta'"
                        class="mr-2"
                        list="list-city"
                        ></b-form-input>
                        <datalist id="list-city" hidden>
                            <option v-for="(item, index) in cityOptions" :key="index" :class="item.email">{{ item.email }}</option>
                        </datalist>
                        <b-button class="" variant="primary" :disabled="addDisabled" @click="setSelectedCity()">Pilih</b-button>
                    </div>
                </b-form-group>
                <b-form-group
                    v-if="citySelected.length != 0"
                    label="Email Terpilih"
                    label-for=""
                >
                    <div id="city-selected">
                        <div class="row">
                            <div v-for="(item, index) in citySelected" :key="index" class="col col-lg-6">
                                <div class="city-card">
                                    <p class="city">{{item.email}}</p>
                                    <p class="x" @click="removeCity(index)">x</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </b-form-group>
                <p v-if="modalError" class="text-center mb-3">{{modalError}}</p>
                <div v-if="!isInvite" class="d-flex align-items-center justify-content-end">
                    <b-button variant="danger" @click="toggleInviteModal">Batal</b-button>
                    <b-button variant="primary" type="submit" :disabled="citySelected.length != 0 ? false : true" >Tambahkan</b-button>
                </div>
                <div v-else class="d-flex align-items-center justify-content-end">
                    <b-button variant="primary" class="d-flex align-items-center"><b-spinner small class="mr-2"></b-spinner>Loading</b-button>
                </div>
            </b-form>
        </b-modal>

    </div>
</template>

<script>
import ContentHeader from "@/components/template/dashboard/ContentHeader"
import Footer from "@/components/template/dashboard/Footer"
import StudentClassroomTable from "@/components/template/micro/table/StudentClassroomTable"

import { mapState } from 'vuex';

export default {
    layout: 'dashboard',
    components: {
        ContentHeader,
        Footer,
        StudentClassroomTable,
    },
    data () {
        return {
            onEvent: {
                message: '',
                status: true,
                alertCounter: 0,
                variant: ''
            },
            role: 'kelas',
            isBusy: true,
            modalInvite: false,
            isInvite: false,
            isLoadStudentsNotJoin: false,
            classroomId: this.$route.params.classroomId,
            queryAddStudent: this.$route.query.addStudents,
            classroomDetail: null,
            modalError: null,

            cityOptions: [],
            selectCity: '',
            citySelected: [],
            addDisabled: true,
            
            email: "",
            fields: [],
            items: [],

            pagination: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 0,
            },

        }
    },
    created() {
        this.getClassroomDetail()
        this.setFields()
        if (this.queryAddStudent == 'true') this.toggleInviteModal()
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
        })
    },
    watch: {
        selectCity() {
            if(this.selectCity != ''){
                this.addDisabled = false
            } else {
                this.addDisabled = true
            }
            return 
        }
    },
    methods: {
        setEvent(message, status) {
            window.scrollTo(0,0)
            this.onEvent.message = message
            this.onEvent.status = status
            this.onEvent.variant = status ? 'success' : 'warning'
            this.onEvent.alertCounter = 5
        },
        countDownChanged() {
            this.onEvent.alertCounter = 10
        },
        toggleInviteModal() {
            this.modalInvite = !this.modalInvite
            this.citySelected = []
            this.modalError = null
            this.isInvite = false;

            if(this.modalInvite) this.getStudentsNotJoin()
        },
        setFields() {
            this.fields = [
                {   
                    key: "index", 
                    label: 'No',
                    thStyle: 'width: 10%'
                },
                {
                    key: 'name',
                    label: 'Nama',
                },
                {
                    key: 'email',
                    label: 'Email',
                    thStyle: 'width: 100%'
                },
                {
                    key: 'action',
                    label: '',
                    class: 'text-right'
                }
            ]
        },
        removeCity(index){
            this.citySelected.splice(index, 1)
        },
        setSelectedCity(){
            if(this.selectCity.trim() != '') {
                const city = this.cityOptions.find(city => city.email === this.selectCity)
                if(city != undefined) {
                    const filter = this.citySelected.find(city => city.email === this.selectCity)

                    if(filter == undefined) {
                        if (city.id == 0){
                            const cities = this.$store.state.Cities.cities
                            city.data = cities
                            this.citySelected = []
                            this.citySelected.push(city)
                            this.isSelectedAllCities = true
                        } else {
                            if (this.isSelectedAllCities) {
                                this.citySelected = []
                                this.citySelected.push(city)
                                this.isSelectedAllCities = false
                            } else {
                                this.citySelected.push(city)
                            }
                        }
                    }

                }
            }
            this.selectCity = ''
        },
        async getClassroomDetail () {
            this.isBusy = true;
            await this.$store.dispatch('Services/classroomDetail', {id: this.classroomId});

            if (!this.servicesState.status) {
                console.error('failed fetch classroom detail', this.servicesState.message);
                this.setEvent(this.servicesState.message, false)
                this.isBusy = true;
            } else {
                this.classroomDetail = this.servicesState.classroomDetail
                this.getStudents()
            }
        },
        async getStudents() {
            this.isBusy = true;
            await this.$store.dispatch('Services/classroomStudents', this.classroomId);

            if (!this.servicesState.status) {
                console.error('Failed fetch students', this.servicesState.message);
                this.setEvent(this.servicesState.message, false)
                this.isBusy = true;
            } else {
                this.items = this.servicesState.data;
                this.pagination = {
                    page: 1,
                    perPage: 10,
                    totalItems: this.items.length,
                    totalPages: 0,
                },

                this.isBusy = false;
            }
        },
        async getStudentsNotJoin() {
            this.cityOptions = []
            this.isLoadStudentsNotJoin = true;
            await this.$store.dispatch('Services/classroomStudentsNotJoin', this.classroomId);

            if (!this.servicesState.status) {
                console.error('Failed fetch students', this.servicesState.message);
                this.modalError = this.servicesState.message
                this.isLoadStudentsNotJoin = false;
            } else {
                this.modalError = null
                this.cityOptions = this.servicesState.data;

                this.isLoadStudentsNotJoin = false;
            }
        },
        async inviteStudent(event) {
            event.preventDefault()
            this.isInvite = true;
            var emails = []

            this.citySelected.map((item) => {
                emails.push(item.email)
            })

            const params = {
                emails: emails,
                code: this.classroomDetail.code
            }
            await this.$store.dispatch('Services/classroomInviteStudent', params);

            if (!this.servicesState.status) {
                console.error('Failed invite student', this.servicesState.message);
                this.modalError = this.servicesState.message
                this.isInvite = false;
            } else {
                this.setEvent('Berhasil menambahkan peserta', true)
                this.citySelected = []
                this.modalError = null
                this.isInvite = false;
                this.toggleInviteModal()
                this.getClassroomDetail()
            }
        },
    }
}
</script>

<style>

</style>