<template>
    <section v-if="isShowEmpty || classrooms?.length != 0" id="section-class">

        <FilterForms
            v-if="showFilter"
            :isBusy="isBusy"
            :sortItems="sortClass"
            :fields="filterFields"
            :mdSize="12"
            :lgSize="7"
            @fetchFilters="setClassFilters"
            :searchPlaceholder="'Cari berdasarkan nama kelas'"
            :isWrap="true"
            :stateLoading="isLoading"
            :filtersData="filtersData"
            :filtersPagination="filtersPagination"
            @onChangePage="handleChangePage"
            @searchOption="handleSearchOption"
            @typingSearch="isClassLoaded = !$event"
        />


        <SectionHeader
            v-if="withHeader"
            :title="sectionTitle"
            :withAction="withAction"
            :actionType="actionType"
            :actionLabel="actionType === 'dropdown' ? selectedClassFilter?.label : actionLabel "
            :actionVariant="selectedClassFilter?.variant"
            :actionOptions="classFilters"
            :actionSelected="selectedClassFilter"
            :actionLink="isClassLoaded && classrooms?.length === 2 ? actionLink : ''"
            :actionClass="actionClass"
            @optionChanged="filterClass" />

        <template v-if="isClassLoaded && isComponentLoaded">

            <div v-if="classrooms.length != 0" class="row">

                <div v-for="(item, index) in classrooms" :key="index" class="col-12 col-lg-6">
                    <div class="card-class">

                        <ItemClass
                            :isLoaded="true"
                            :isListDraft="selectedClassFilter?.value == 'draft' ? true : false"
                            :urlOnClick="`/dashboard/classroom/${ item?.slug }`"
                            :urlImg="item?.logo ?? ''"
                            :title="item?.name ?? ''"
                            :visibility="item?.visibility ?? ''"
                            :description="item?.description ?? ''"
                            :dateStart="item?.start ?? ''"
                            :dateEnd="item?.end ?? ''"
                            :statusClass="item?.classState ?? null"
                            :listMentor="item?.mentors ?? []"
                            :filterBy="filterBy"
                            :withAction="(withItemAction && (userKind === 'admin' || userKind === 'superadmin' || userKind === 'lead_region'))"
                            :btnPublish="filterBy === 'draft'"
                            :isAchievement="filterBy === 'achievement'"
                            :isCertificateRelease="item?.certificateRelease"
                            :hasRaport="filterBy === 'achievement' && item?.hasRaport"
                            :isMySelf="filterBy === 'achievement'"
                            :classId="item?.id"
                            :userId="user?.id"
                            :slug="item?.slug"
                            :isAlwaysOpen="item?.alwaysOpen"
                            :registered="item?.registered"
                            :userState="item?.userState"
                            :classProgram="item?.program"
                            :classMode="item?.mode"
                            :heldCities="item?.heldCities ?? []"
                            :classPrice="item?.price"
                            :userDetail="userDetail"
                            @onEdit="onEditClicked(item)"
                            @onDelete="toggleDeleteClass(item)"
                            @onPublish="togglePublishClass(item)"
                          />

                    </div>
                </div>

                <!-- State Loading Load More -->
                <div v-if="isClassLoadMore" class="col-12 col-lg-6">
                    <div class="card-class">

                        <ItemClass :isLoaded="false" />

                    </div>
                </div>
                <div v-if="isClassLoadMore" class="col-12 col-lg-6">
                    <div class="card-class">

                        <ItemClass :isLoaded="false" />

                    </div>
                </div>

            </div>

            <b-row v-else>
                <b-col>
                    <b-card no-body class="border">
                        <b-card-body>
                            <div class="d-flex align-items-center justify-content-center p-3">
                                <span>{{ emptyClassMessage() }}</span>
                            </div>
                        </b-card-body>
                    </b-card>
                </b-col>
            </b-row>

        </template>

        <template v-else>
            <div class="row">
                <div class="col-12 col-lg-6">
                    <div class="card-class">

                        <ItemClass :isLoaded="false" />

                    </div>
                </div>
                <div class="col-12 col-lg-6">
                    <div class="card-class">

                        <ItemClass :isLoaded="false" />

                    </div>
                </div>
            </div>
        </template>

        <b-modal v-model="isModalConfirm" size="sm" centered hide-header hide-footer no-close-on-backdrop no-close-on-esc body-class="p-0">
            <ModalConfirmation
                :title="modalConfirmData?.title"
                :description="modalConfirmData?.description"
                :btnYesVariant="modalConfirmData?.btnYesVariant"
                :btnYesTitle="modalConfirmData?.btnYesTitle"
                :centered="true"
                :btnNoHide="isModalConfirmProcess"
                :btnYesDisabled="isModalConfirmProcess"
                @actionYes="modalConfirmData?.type === 'delete' ? deleteClass() : publishClass()"
                @actionNo="modalConfirmData?.type === 'delete' ? toggleDeleteClass() : togglePublishClass()"/>
        </b-modal>

    </section>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import { SORT_CLASS } from '~/commons/constants/filters';
import { FIELDS_FILTER_CLASS } from '~/commons/constants/forms';
import { toEncrypt } from '~/commons/utils';

import ItemClass from "@/components/template/micro/items/ItemClass.vue"
import SectionHeader from '@/components/template/micro/header/SectionHeader.vue'
import ModalConfirmation from "~/components/template/micro/modal/ModalConfirmation.vue";
import FilterForms from '~/components/classrooms/micro/FilterForms.vue';

export default {
    props: {
        withItemAction: {
            type: Boolean,
            default: false,
        },
        withHeader: {
            type: Boolean,
            default: true,
        },
        withAction: {
            type: Boolean,
            default: true,
        },
        sectionTitle: {
            type: String,
            default: "Section Title"
        },
        sectionFilter: {
            type: Boolean,
            default: false,
        },
        isComponentLoaded: {
            type: Boolean,
            default: true,
        },
        isFromDashboard: {
            type: Boolean,
            default: false,
        },
        filterBy: {
            type: String,
            default: 'running'
        },
        actionClass: {
            type: String,
            default: ''
        },
        actionType: {
            type: String,
            default: 'dropdown'
        },
        actionLink: {
            type: String,
            default: '#'
        },
        actionLabel: {
            type: String,
            default: 'Label'
        },
        limitItems: {
            type: Number,
            default: -1
        },
        showFilter: {
            type: Boolean,
            default: false
        },
        classType: {
            type: String,
            default: ''
        },
        isShowEmpty: {
            type: Boolean,
            default: true,
        }
    },

    components: {
        ItemClass,
        SectionHeader,
        ModalConfirmation,
        FilterForms
    },

    data() {
        return {
            userKind: localStorage.getItem('user_kind'),
            user: JSON.parse(localStorage.getItem('user')),
            userDetail: null,
            settings: null,

            endOfPage: false,

            isTestCase: false,
            isClassLoaded: false,
            isClassLoadMore: false,
            isModalConfirm: false,
            isModalConfirmProcess: false,
            userLoading: false,

            onModalPassed: {
              title: "",
              description: "",
              image: "/dashboard/assets/image/icon/common/checklist.webp",
              isShow: false,
            },

            selectedClassFilter: null,
            classFilters: [],
            classrooms: [],
            pagination: {
                page: 1,
                perPage: 4,
                totalItems: 0,
                totalPages: 0,
            },

            classSelected: null,
            modalConfirmData: {
                title: "",
                description: "",
                btnYesTitle: "Ya, Saya Yakin",
                btnYesVariant: "danger",
                type: "delete"
            },

            fields: null,

            sortClass: SORT_CLASS,
            filterFields: FIELDS_FILTER_CLASS,

            searchQuery: null,
            selectedSort: null,
            selectedProgram: null,

            // State Loading
            isBusy: true,

            // Filter Actions (Programs)
            // the name of variable state programs, I take the name from value of "options" filter data in forms.js, so it can dynamic
            filtersData: {
                programs: [],
            },
            isLoading: {
                programs: { data: false, pagination: false },
            },
            filtersPagination: {
                programs: {
                    page: 1,
                    perPage: 10,
                    totalItems: 0,
                    totalPages: 0,
                }
            },
            filtersKeyword: {
                programs: "",
            }
        }
    },
    computed: {
        ...mapState({
            sassState: (state) => state.Sass,
            servicesState: (state) => state.Services,
        }),
    },
    watch: {
      endOfPage() {
        if (this.endOfPage) {
            window.removeEventListener("scroll", this.handleScrolledScreen)
            this.loadMore()
        }
      },
      filterBy() {
        this.setDropdownFilter()
      },
    },
    created() {
      this.settings = this.sassState.settings;
    },
    mounted() {
        this.isTestCase = this.sassState.isTestCase
        this.setDropdownFilter()
        this.fetchPrograms()
        this.getUserDetail()
    },
    methods: {
        ...mapActions({
            deleteClassroom: "Services/deleteClassroom",
            publishClassroom: "Services/classroomRelease",
        }),
        async getUserDetail() {
          this.userLoading = true;
          await this.$store.dispatch('Services/userDetail', this.user?.id)

          if(!this.servicesState.status) {
              console.error('Failed fetch user detail', this.servicesState.message)
          } else {
              this.userDetail = this.servicesState.data ?? null
          }
          this.userLoading = false;
        },

        setClassFilters({page, perPage, sortBy, search, programs}) {
            this.pagination.page = 1
            this.searchQuery = search;
            this.selectedSort = sortBy;
            this.selectedProgram = programs;
            this.fetchClassActive()
        },

        setDropdownFilter() {
            this.classFilters = [
                { label:'Semua', value:'all', variant: 'primary' },
                { label:'Pendaftaran', value:'registration', variant: 'primary' },
                { label:'Berlangsung', value:'running', variant: 'primary' },
                { label:'Selesai', value:'finish', variant: 'primary' }
            ]

            let filter = this.classFilters[2]

            if (this.filterBy) {
                const found = this.classFilters.find(item => item.value === this.filterBy)
                if (found) filter = found
                else filter = { label:'', value:this.filterBy, variant:'' }
            }

            this.filterClass(filter)
        },

        filterClass(filter) {
            window.removeEventListener('scroll', this.handleScrolledScreen);
            this.selectedClassFilter = filter
            this.pagination.page = 1
            this.fetchClassActive()
        },

        async fetchClassActive() {
            if (!this.isClassLoadMore) this.isClassLoaded = false
            else this.isClassLoaded = true

            const params = {
                page: this.pagination?.page,
                perPage: this.limitItems != -1 ? this.limitItems : this.pagination?.perPage,
                state: this.sectionFilter ? this.selectedClassFilter?.value : null,
                search: !!this.searchQuery ? this.searchQuery : null,
                sort: !!this.selectedSort ? this.selectedSort : null,
                type: null,
                programId: !!this.selectedProgram ? this.selectedProgram : null
            }

            if (!!this.classType) params.type = this.classType

            if (this.userKind === 'student') {
                if (this.isFromDashboard) {
                    if(params?.state === "myclass"){
                        params.state = "joined"
                        await this.$store.dispatch('Services/classrooms', params)
                        delete params?.state
                    } else if (params?.state === 'all') {
                        delete params?.state
                        await this.$store.dispatch('Services/activeClassrooms', params)
                    } else await this.$store.dispatch('Services/activeClassrooms', params)
                } else {
                    if (params?.state === 'achievement') {
                        delete params?.state
                        await this.$store.dispatch('Services/classroomsHistory', params)
                    } else if (params?.state === 'myclass' || params?.state === 'all') {
                        if(params?.state === 'all') params.all = true, delete params?.state;
                        else delete params?.state;
                        await this.$store.dispatch('Services/classrooms', params)
                    } else await this.$store.dispatch('Services/classrooms', params)
                }
            }else if (params?.state === 'all') {
                delete params.state
                await this.$store.dispatch('Services/classrooms', params)
            } else if (params?.state === 'draft'){
                await this.$store.dispatch('Services/draftClassrooms', params);
            }else{
                await this.$store.dispatch('Services/classrooms', params)
            }

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

        async fetchPrograms() {
            if(!this.isLoading.programs.pagination) this.isLoading.programs.data = true;

            const params = {
                page: this.filtersPagination?.programs?.page,
                perPage: this.filtersPagination?.programs?.perPage,
                keyword: this.filtersKeyword?.programs
            }

            await this.$store.dispatch('Services/programs', params);

            if(!this.servicesState?.status){
                console.error(`Failed to fetch programs : ${this.servicesState?.message}`);
                this.isLoading.programs.data = false;
                this.isLoading.programs.pagination = false;
            }else{
                let programs = this.servicesState?.programs;
                let pagination = this.servicesState?.paginationPrograms;

                let tempPrograms = [];

                // Set Options Program for listed in dropdown filter
                programs?.map((program) => {
                    let value = program?.name

                    tempPrograms.push({
                        key: program?.id,
                        value
                    })
                })


                if(!this.isLoading.programs.pagination) this.filtersData.programs = tempPrograms;
                else{
                    this.filtersData.programs.push(...tempPrograms);
                }

                // Set Pagination
                this.filtersPagination.programs = { ...pagination };

                this.isLoading.programs.data = false;
                this.isLoading.programs.pagination = false;
            }
        },

        setupInfiniteScroll() {
            const isInfiniteScroll = (window.innerHeight + window.pageYOffset) <= (document.body.offsetHeight - 100)

            // Scrolled Screen Listener
            if (isInfiniteScroll && this.pagination.page < this.pagination.totalPages) window.addEventListener("scroll", this.handleScrolledScreen);

            // Auto Load More Without Scroll Screen
            else setTimeout(() => {
                this.loadMore()
            }, 50);
        },
        loadMore() {
            // Check is last page disabled load more
            if (this.pagination.page < this.pagination.totalPages) {

                this.isClassLoadMore = true
                this.pagination.page += 1
                setTimeout(() => {
                    this.fetchClassActive()
                }, 50);

            } else this.isClassLoadMore = false

        },

        handleScrolledScreen() {
            this.endOfPage = (window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - 100);
        },

        emptyClassMessage() {
            let classState = this.isTestCase ? 'tes' : 'kelas'
            let message = `Belum ada ${ classState } yang ${ this.selectedClassFilter?.label?.toLowerCase() } saat ini.`

            if (this.selectedClassFilter.value == 'registration') message = "Belum ada pendaftaran yang dibuka saat ini."
            else if (this.selectedClassFilter.value == 'ended') message = `Belum ada ${ classState } yang berakhir.`
            else if (this.selectedClassFilter.value == 'draft') message = `Belum ada ${ classState } yang butuh di publish.`
            else if (this.selectedClassFilter.value == 'all') message = `Belum ada ${ classState }.`
            else if (this.selectedClassFilter.value == 'waiting') message = `Anda belum pernah menyelesaikan pretest.`
            else if (this.selectedClassFilter.value == 'myclass') message = `Anda belum pernah mengikuti ${ classState }.`
            else if (this.selectedClassFilter.value == 'achievement') message = `Anda belum pernah menyelesaikan ${ classState }.`

            return message
        },
        deleteClass() {
            this.isModalConfirmProcess = true
            this.modalConfirmData.btnYesTitle = `Loading...`
            this.modalConfirmData.description = `<h5>Anda Yakin Akan Menghapus Kelas <span class='text-primary text-limit limit-5' style='font-size: inherit;'>${ this.classSelected?.name }</span> ini?<h5>`

            this.deleteClassroom(this.classSelected?.id).then(() => {
                if (this.servicesState?.status) {
                    this.filterClass({ label:'', value:this.filterBy, variant:'' })
                    this.toggleDeleteClass()
                } else {
                    this.modalConfirmData.description += `</br><p class='text-danger'>Maaf gagal menghapus kelas</p>`
                }
                this.isModalConfirmProcess = false
                this.modalConfirmData.btnYesTitle = `Iya, Saya Yakin`
            })
        },

        publishClass() {
            this.isModalConfirmProcess = true
            this.modalConfirmData.btnYesTitle = `Loading...`
            this.modalConfirmData.description = `<h5>Anda Yakin Akan Menerbitkan Kelas <span class='text-primary text-limit limit-5' style='font-size: inherit;'>${ this.classSelected?.name }</span> ini?<h5>`

            this.publishClassroom(this.classSelected?.id).then(() => {
                if (this.servicesState?.status) {
                    this.filterClass({ label:'', value:this.filterBy, variant:'' })
                    this.toggleDeleteClass()
                } else {
                    this.modalConfirmData.description += `<p class='text-danger mt-5'>Maaf gagal menerbitkan kelas: ${ this.servicesState?.message }</p><p>* Pastikan semua data yang dibutuhkan untuk membuat kelas sudah terisi!</p>`
                }
                this.isModalConfirmProcess = false
                this.modalConfirmData.btnYesTitle = `Iya, Saya Yakin`
            })
        },

        toggleDeleteClass(data) {
            this.isModalConfirm = !this.isModalConfirm
            this.modalConfirmData.type = 'delete'

            if (this.isModalConfirm) {
                this.classSelected = data
                this.modalConfirmData.btnYesVariant = 'danger'
                this.modalConfirmData.description = `<h5>Anda Yakin Akan Menghapus Kelas <span class='text-primary text-limit limit-5' style='font-size: inherit;'>${ this.classSelected?.name }</span> ini?<h5>`
            } else {
                this.classSelected = null
                this.modalConfirmData.description = ``
            }
        },

        togglePublishClass(data) {
            this.isModalConfirm = !this.isModalConfirm
            this.modalConfirmData.type = 'publish'

            if (this.isModalConfirm) {
                this.classSelected = data
                this.modalConfirmData.btnYesVariant = 'primary'
                this.modalConfirmData.description = `<h5>Anda Yakin Akan Menerbitkan Kelas <span class='text-primary text-limit limit-5' style='font-size: inherit;'>${ this.classSelected?.name }</span> ini?<h5>`
            } else {
                this.classSelected = null
                this.modalConfirmData.description = ``
            }
        },

        onEditClicked(item) {
            localStorage.setItem('classroomId', toEncrypt(item?.id))
            this.$router?.push({
                path: `/dashboard/classroom/edit/${ item?.slug }`,
            })
        },
        handleChangePage(from){
            this.filtersPagination[from].page += 1;
            this.isLoading[from].pagination = true;
            if(from == 'programs') this.fetchPrograms();
        },
        handleSearchOption(keyword, from){
            this.filtersPagination[from].page = 1;
            this.filtersKeyword[from] = keyword;

            if(from === 'programs') this.fetchPrograms();
        }

    },
    beforeDestroy() {
        window.removeEventListener("scroll", this.handleScrolledScreen);
    }

}
</script>