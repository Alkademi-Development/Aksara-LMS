<template>
    <div id="student">
    
        <b-row>
            <b-col>
                <b-alert
                    :show="onEvent.alertCounter"
                    :variant="onEvent.variant"
                    @dismissed="onEvenpagt.alertCounter=0"
                    @dismiss-count-down="countDownChanged"
                >
                    {{ onEvent.message }}
                </b-alert>

            </b-col>
        </b-row>

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
                                <a :href="`https://wa.me/${ adminPhone }`" target="_blank" class="btn btn-white rounded-pill">Hubungi Admin</a>

                            </div>
                        </b-card-header>
                    </b-card>
                </b-col>
            </b-row>
        </template>
        <template v-else>
            <template v-if="isLevelingCase">
                <h5 class="mb-4">Kelas Persiapan</h5>
                <template v-if="classrooms.length > 0" >
                    <b-row v-if="screenWidth >= 768">
                        <b-col
                            v-for="(itemClass, index) in classrooms" 
                            :key="index" 
                            class="col-6"
                        >
                            <!-- <div class="d-flex flex-column flex-md-row align-items-md-center border bg-white p-3 mb-3 rounded-lg">
                                <div class="col-12 col-md-6 col-lg-7 d-flex flex-column gap-4">
                                    <div class="box-badge d-flex">
                                        <div class="mb-1 box-progress">
                                            <p class="badge-progress badge-program">{{itemClass?.program}}</p>
                                        </div>
                                    </div>
                                    <div class="box-img"  v-if="itemClass?.logo">
                                        <img :src="itemClass?.logo" :alt="itemClass?.name" class="img-logo">
                                    </div>
                                    <div class="flex-column gap-3">
                                        <h4 class="cursor-pointer text-limit limit-1" @click="onOpenClass(itemClass?.slug)">{{itemClass.name}}</h4>
                                        <p class="text-limit limit-2 mt-2 mt-md-0 mb-0">{{itemClass.description}}</p>
                                    </div>
                                </div>
                                <b-col class="mt-2 mt-md-0 text-md-right">
                                    <button class="btn btn-primary rounded-pill" @click="onOpenClass(itemClass?.slug)">Buka Kelas</button>
                                </b-col>
                            </div> -->
                            <div class="card-class">
                                <ItemClass
                                    :isLoaded="true"
                                    :urlOnClick="`/dashboard/classroom/${itemClass?.slug}`"
                                    :urlImg="itemClass?.logo ?? ''"
                                    :title="itemClass?.name ?? ''"
                                    :classProgram="itemClass?.program ?? ''"
                                    :isAlwaysOpen="true"
                                    :statusClass="itemClass?.classState ?? null"
                                    :listMentor="itemClass?.mentors ?? []"
                                    :isPreparationClass="true"
                                    :classMode="itemClass?.mode"
                                    :heldCities="itemClass?.heldCities ?? []"
                                />
                            </div>
                        </b-col>
                    </b-row>
                    <b-row v-else>
                        <b-col
                            v-for="(itemClass, index) in classrooms" 
                            :key="index"
                            class="col-12 col-lg-6 p-0"
                        >
                            <div class="card-class">
                                <ItemClass
                                    :isLoaded="true"
                                    :urlOnClick="`/dashboard/classroom/${itemClass?.slug}`"
                                    :urlImg="itemClass?.logo ?? ''"
                                    :title="itemClass?.name ?? ''"
                                    :description="itemClass?.description ?? ''"
                                    :classProgram="itemClass?.program ?? ''"
                                    :isAlwaysOpen="true"
                                    :statusClass="itemClass?.classState ?? null"
                                    :listMentor="itemClass?.mentors ?? []"
                                    :isPreparationClass="true"
                                    :classMode="itemClass?.mode"
                                    :heldCities="itemClass?.heldCities ?? []"
                                />
                            </div>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col class="d-flex justify-content-center">
                            <b-pagination
                                align="right"
                                v-model="pagination.page"
                                :total-rows="pagination.totalItems"
                                :per-page="pagination.perPage"
                                @change="onUpdatePage"
                            ></b-pagination> 
                        </b-col>
                    </b-row>
                </template>
                <template v-else>
                    <div class="d-flex align-items-center border bg-white p-3 mb-3 rounded-lg">
                        <div class="col d-flex flex-column">
                            <p class="text-limit limit-3 mb-0 text-center">Belum ada kelas persiapan yang dimulai</p>
                        </div>
                    </div>
                </template>
            </template>

            <SectionClass
                :sectionTitle="`${isTestCase ? 'Tesku' : 'Kelasku'}`"
                :withHeader="true"
                :sectionFilter="true"
                :isShowEmpty="false"
                actionClass="text-primary"
                actionLabel="Lihat Semua"
                actionType="link"
                actionLink="/dashboard/classroom"
                :limitItems="2"
                :isFromDashboard="true"
                filterBy="myclass" />

            <SectionClass
                :sectionTitle="`Tes Yang Dibuka`"
                :sectionFilter="true"
                :isFromDashboard="true"
                :isShowEmpty="false"
                filterBy="registration" 
                classType="test"
            />

            <SectionClass
                :sectionTitle="`${isTestCase ? 'Tes' : 'Kelas'} Yang Tersedia`"
                :sectionFilter="true"
                :isFromDashboard="true"
                filterBy="all" 
                classType="bootcamp"
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
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { TAB_MENU_FILTER_CLASS } from "~/commons/constants/layouts"

import SectionClass from '@/components/template/micro/section/SectionClass.vue'
import ItemClass from "@/components/template/micro/items/ItemClass.vue"
import { SORT_CLASS } from '~/commons/constants/filters'

export default {
    components: {
        SectionClass,
        ItemClass,
    },
    data() {
        return {
            isTestCase: false,
            isSchoolCase: false,
            isHaveSchool: false,
            isLevelingCase: null,

            isClassLoaded: false,
            isClassLoadMore: false,
            pagination: {
                page: 1,
                perPage: 4,
                totalItems: 0,
                totalPages: 0,
            },
            limitItems: 4,
             
            sortClass: SORT_CLASS,
            filterFields: null,

            searchQuery: null,
            selectedSort: null ,
            

            selectedClassFilter: null,
            classFilters: [],
            classrooms: [],

            classroomsTest: [],
            classTestPagination: {
                page: 1,
                perPage: 6,
                totalItems: 0,
                totalPages: 0,
            },

            adminPhone: "6282131362595",
            modalSubmitSchool: false,
            isSchoolSubmit: false,
            listSchool: [],
            selectedSchool: null,

            onEvent: {
                message: '',
                status: true,
                alertCounter: 0,
                variant: ''
            },

            screenWidth: (window.innerWidth > 0) ? window.innerWidth : screen.width

        }
    },
    computed: {
        ...mapState({
            sassState: (state) => state.Sass,            
            servicesState: (state) => state.Services,            
            schoolsState: (state) => state.Schools,
        }),
    },
    mounted() {
        this.initializeStudent()
        window.addEventListener('resize', () => this.screenWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width)
    },
    unmounted() {
        window.addEventListener('resize', () => this.screenWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width)
    },
    methods: {
        ...mapActions({
            getTabs: 'Layouts/getTabs',
            setActiveTab: "Layouts/setActiveTab", 
            allSettings: "Sass/allSettings",
            updateSettings: "Sass/editAllSettings",
        }),
        initializeStudent() {
            this.isTestCase = this.sassState?.isTestCase
            this.isSchoolCase = this.sassState?.isSchoolCase
            this.isHaveSchool = this.servicesState?.isHaveSchool

            this.getTabs(TAB_MENU_FILTER_CLASS)
            this.setActiveTab('all')
            this.getCredentials()

            this.fetchClassActive()
        },
        

        countDownChanged() {
            this.onEvent.alertCounter = 10
        },

        setEvent(message, status) {
            window.scrollTo(0,0)
            this.onEvent.message = message
            this.onEvent.status = status
            this.onEvent.variant = status ? 'success' : 'warning'
            this.onEvent.alertCounter = 5
        },

        getCredentials(){
            this.isLoaded = false
            this.allSettings({version: "v0"}).then(() => {
                if (!this.sassState?.status) {
                    this.isLoaded = false
                    return this.setEvent(this.sassState?.message, false)
                } else {
                    this.isLevelingCase = this.sassState.settings.isLevelingCase

                    if (this.isSchoolCase && !this.isHaveSchool) {
                        this.fetchSchools()
                    }
                }
            })
        },

        onOpenClass(slug) {
            this.$router.push(`/dashboard/classroom/${slug}`)
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

        async fetchClassActive() {
            // if (!this.isClassLoadMore) this.isClassLoaded = false
            // else this.isClassLoaded = true

            const params = {
                page: this.pagination?.page,
                perPage: this.limitItems != -1 ? this.limitItems : this.pagination?.perPage,
                state: this.sectionFilter ? this.selectedClassFilter?.value : null,
                search: !!this.searchQuery ? this.searchQuery : null,
                sort: !!this.selectedSort ? this.selectedSort : null,
                level: 1
            }

            await this.$store.dispatch('Services/activeClassrooms', params)

            if (!this.servicesState.status) {
                console.error('failed fetch active classroom: ', this.servicesState.message)

                this.isClassLoaded = false
                this.isClassLoadMore = false

            } else {
                this.pagination = this.servicesState?.pagination
                let classroomsData = this.servicesState?.classrooms ?? []

                if (!this.isClassLoadMore) this.classrooms = classroomsData
                else {
                    classroomsData?.map((item) => {
                        this.classrooms.push(item)
                    })
                }

                // Setup Infinite Scroll Active or No
                if (this.limitItems == -1) {
                    this.setupInfiniteScroll()
                }

                this.isClassLoaded = true
                this.isClassLoadMore = false

            }
        },
        
        onUpdatePage(page) {
            this.pagination.page = page
            this.fetchClassActive()
        },

        async fetchAuthorize() {

            await this.$store.dispatch('Services/authorize');

            if (!this.servicesState.status) {

                console.error('Failed to fetch user active detail', this.servicesState.message);
                this.setEvent(this.servicesState.message, false)

            } else {

                this.initializeStudent()
                this.isSchoolSubmit = false
                this.isLoaded = false
                
            }

        },

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

                this.fetchAuthorize()

            }

        },
        
        openSubmitSchoolModal() {
            if (!this.selectedSchool) return this.setEvent('Pilih sekolah terlebih dahulu.', false)
            this.modalSubmitSchool = true
        },
    },

}
</script>

<style lang="scss" scoped>
.box-badge {
    .box-progress {
        .badge-program {
            background-color: var(--bs-muted-primary);
            color: var(--bs-primary);
        }
    }
}
.mw-max {
	max-width: 268px !important;
	@media screen and (max-width: 1028px) {
	}
}

.box-img {
    
    .img-logo {
        max-height: 40px;
    }
}
</style>
