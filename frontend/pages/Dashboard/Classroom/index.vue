<template>
    <section class="container-fluid mt-4">
        <template v-if="lmsLayout === 'smkcoding' && (userKind === 'student' || userKind === 'teacher')">
            <template v-if="isSchoolCase && !isHaveSchool">
                <b-row>
                    <b-col cols="12">
                        <b-card no-body>
                            <b-card-body>
    
                                <div class="mb-2">
                                    <span>Pilih sekolah kamu!<span class="font-weight-bold text-danger"> Pilihan tidak bisa diubah lagi.</span></span>
                                </div>
                                <!-- <b-button variant="primary" @click="setHaveSchool()">Buka Kunci</b-button> -->
    
                                <b-form>
                                    <b-form-group class="mb-0">
                                        <v-select
                                            class="select-city form-control mb-3"
                                            placeholder="Ketik untuk mencari sekolah"
                                            :options="listSchool"
                                            label="name"
                                            id="selectedSchool"
                                            v-model="selectedSchool"
                                        >
                                            <template v-slot:no-options="{ search, searching }">
                                                <template v-if="searching">
                                                Tidak ada hasil untuk <em>{{ search }}</em>.
                                                </template>
                                                <em style="opacity: 0.5;" v-else>Ketik untuk mencari.</em>
                                            </template>
                                        </v-select>
                                        <b-button variant="primary" @click="openSubmitSchoolModal" :disabled="isSchoolSubmit">{{ isSchoolSubmit ? 'Submitting...' : 'Submit' }}</b-button>
                                    </b-form-group>
                                </b-form>
    
                            </b-card-body>
                        </b-card>
                    </b-col>
    
                    <b-col cols="12">
                        <b-card no-body class="bg-primary">
                            <b-card-header class="bg-transparent">
                                <div class="d-flex flex-wrap align-items-center justify-content-between">
    
                                    <h3 class="text-white mb-3 mb-md-0">Sekolah anda tidak terdaftar?</h3>
                                    <a :href="`${ adminPhone }`" target="_blank" class="btn btn-white rounded-pill">Hubungi Admin</a>
    
                                </div>
                            </b-card-header>
                        </b-card>
                    </b-col>
                </b-row>
            </template>
            <template v-else>
                <SectionClass
                    v-if="isLoaded"
                    :withHeader="false"
                    :sectionFilter="true"
                    :filterBy="getActiveTab"
                    :withItemAction="true"
                    showFilter
                />
            </template>
        </template>
        <template v-else>
            <SectionClass
                v-if="isLoaded"
                :withHeader="false"
                :sectionFilter="true"
                :filterBy="getActiveTab"
                :withItemAction="true"
                showFilter
            />
        </template>

        <!-- Modal Handler -->
        <b-modal
            v-if="modalSubmitSchool"
            v-model="modalSubmitSchool"
            id="modalConfirmationSchool"
            centered
            size="sm"
            hide-header
            hide-footer
        >
            <b-row>
                <b-col>
                    <p class="mb-5">Apakah anda yakin data yang dimasukan sudah benar?</p>
                    <div class="d-flex justify-content-end align-items-center">
                        <b-button variant="danger" @click="modalSubmitSchool = false">Batal</b-button>
                        <b-button variant="primary" @click="submitSchool">Iya</b-button>
                    </div>
                </b-col>
            </b-row>
        </b-modal>
    </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import { TAB_MENU_FILTER_CLASS } from "~/commons/constants/layouts"

import SectionClass from "@/components/template/micro/section/SectionClass.vue";

export default {
    layout: 'dashboard',
    components: {
        SectionClass,
    },
    data() {
        return {
            isLoaded: false,
            isBusy: true,
            
            isSchoolCase: false,
            isHaveSchool: false,
            isTestCase: false,
            lmsLayout: '',

            modalSubmitSchool: false,
            isSchoolSubmit: false,
            listSchool: [],
            selectedSchool: null,

            userKind: '',
            adminPhone: 'https://ig.me/m/smkcoding.id/'
        }
    },
    computed: {
        ...mapState({
            servicesState: (state) => state?.Services,
            getActiveTab: (state) => state?.Layouts?.activeTab,
            sassState: (state) => state.Sass,
            schoolsState: (state) => state.Schools,
        })
    },
    created() {
        this.initializeTab()
        this.initializeDashboard()
    },
    methods: {
        ...mapActions({
            setTabs: 'Layouts/getTabs',
            setActiveTab: 'Layouts/setActiveTab',
            setAction: 'Layouts/setAction'
        }),

        async submitSchool() {
            this.modalSubmitSchool = false
            this.isSchoolSubmit = true

            const params = { schoolId: this.selectedSchool.id }

            await this.$store.dispatch('Services/updateProfile', params);

            if (!this.servicesState.status) {
                console.error('Failed to update profile', this.servicesState.message);
                this.setEvent(this.servicesState.message, false)
                this.isSchoolSubmit = false;
            } else {
                this.isSchoolSubmit = false
                
                this.$router.go()
            }
        },

        openSubmitSchoolModal() {
            if (!this.selectedSchool) return this.setEvent('Pilih sekolah terlebih dahulu.', false)
            this.modalSubmitSchool = true
        },

        initializeDashboard() {
            this.isTestCase = this.sassState?.isTestCase
            this.isSchoolCase = this.sassState?.isSchoolCase
            this.isHaveSchool = this.servicesState?.isHaveSchool
            this.lmsLayout = this.sassState?.settings?.layout
            this.userKind = localStorage.getItem('user_kind')

            if (this.isSchoolCase && !this.isHaveSchool) {
                this.fetchSchools()
            }
        },

        async fetchSchools() {
            await this.$store.dispatch('Schools/active')

            if( !this.schoolsState.status ) {
                console.error('Failed fetch active list schools: ', this.schoolsState.message)
                this.setEvent(this.schoolsState.message, false)

            } else {
                this.listSchool = this.schoolsState.data ?? []
            }

        },

        initializeTab() {
            const userKind = localStorage.getItem('user_kind') ?? null
            const filters = TAB_MENU_FILTER_CLASS
            let filterKeys = []

            localStorage.removeItem('classroomId')

            // Handle List Tab Menu
                // if (userKind === 'student') filterKeys = ['draft', 'myclass', 'registration']
                if (userKind === 'student' || userKind === 'teacher') filterKeys = ['draft', 'registration']
                else filterKeys = ['myclass', 'waiting']

                filterKeys?.map((key) => {
                    const indexToRemove = filters.findIndex(item => item?.key === key)
                    if (indexToRemove != -1) filters?.splice(indexToRemove, 1)
                })
            //~~

            // Set Tab Menu
                this.setTabs(filters).then(() => {

                    if (userKind != 'student') {

                        // If Redirect From Save Class To Draft
                        const tabRedirect = localStorage.getItem('redirectTab')
                        if (tabRedirect) {
                            this.setActiveTab(tabRedirect)
                            localStorage.removeItem('redirectTab')
                        }
                        //~~
                        else this.setActiveTab(filters?.[1]?.key)
                    }

                    if (userKind === 'admin' || userKind === 'superadmin') {
                        this.setAction('/dashboard/classroom/create').then(() => { this.isLoaded = true })
                    } else this.isLoaded = true
                    
                })
            //~~
        }
    }
}
</script>