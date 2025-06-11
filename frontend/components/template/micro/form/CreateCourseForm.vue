<template>
    <b-row>
        <b-col v-if="pageShow == 'empty'" cols="12" class="d-flex flex-column align-items-center justify-content-center py-8">
            <p class="text-center mb-4">
                <b>Lewati proses ini jika akan menambahkan materi nanti</b>
            </p>
            <div class="w-100 d-flex justify-content-center">
                <b-button type="button" variant="primary" class="d-flex align-items-center gap-1 pl-3" @click="setOpenModal">
                    <i class="ri-add-line" style="font-size: 18px"></i>
                    PILIH MATERI
                </b-button>
                <b-button type="button" variant="primary" class="d-flex align-items-center gap-1 pl-3" @click="onChangePage('create-course')">
                    <i class="ri-add-line" style="font-size: 18px"></i>
                    TAMBAH BARU
                </b-button>
            </div>
        </b-col>

        <b-col v-if="pageShow == 'create-course'">
            <CourseForm 
                action="create"
                customClass="pb-4" 
                hideHeader 
                isFromClass
                isStepProcess
                :classroomId="classroomId"
                @callbackSubmit="onChangePage('list')"
                @onChangePage="onChangePage"
            />
        </b-col>

        <b-col v-if="pageShow == 'list'">
            <div class="d-flex justify-content-between mb-4">
                <h3>Daftar Materi</h3>
                <div class="d-flex gap-2">
                    <b-button type="button" variant="primary" class="d-flex align-items-center gap-1 pl-3" @click="setOpenModal">
                        <i class="ri-add-line" style="font-size: 18px"></i>
                        PILIH MATERI
                    </b-button>
                    <b-button type="button" variant="primary" class="d-flex align-items-center gap-1 pl-3" @click="onChangePage('create-course')">
                        <i class="ri-add-line" style="font-size: 18px"></i>
                        TAMBAH
                    </b-button>
                </div>
            </div>
            <ListCourse
                :classId="classroomId"
                :classSlug="detailOverview?.slug"
                :classOverview="detailOverview"
                isStepProcess
                @fetchOverview="setOverviewClass"
                @onChangePage="onChangePage"
                @onChangeCourses="onChangeCourses"
            />
        </b-col>

        <b-col v-if="pageShow != 'create-course'" cols="12">
            <b-card no-body>
                <div class="card-body">
                    <b-row>
                        <b-col cols="12">
                            <div class="d-flex flex-wrap justify-content-left justify-content-md-end box-button">
                                <b-button type="button" variant="secondary" @click="$emit('changeStep', 'class')">Kembali</b-button>
                                <b-button type="button" variant="primary" @click="$emit('changeStep', 'preview')">Lanjutkan</b-button>
                            </div>
                        </b-col>
                    </b-row>
                </div>
            </b-card>
        </b-col>

        <ModalMultipleAddItem
            title="Pilih Materi"
            :onOpenModal="isModalOpen"
            :isBusy="!isLoaded"
            :fields="moduleTableFields"
            :items="moduleTableItems"
            :pagination="pagination"
            :totalModules="totalModules"
            @selectedItemsChanged="selectedItemsChanged"
            @onChangePage="onPaginateChanged"
            @onSearch="onSearch"
            @onSave="onAddMultipleModule"
        />
    </b-row>
</template>

<script>
import { toDecrypt } from '~/commons/utils';
import CourseForm from '~/components/template/micro/form/CourseForm.vue';
import ListCourse from '~/components/classrooms/pages/ListCourse.vue';
import ModalMultipleAddItem from '../modal/ModalMultipleAddItem.vue';
import { mapState } from 'vuex';
import { TABLE_SELECT_COURSE } from '~/commons/constants/course';
import moment from 'moment';

export default {
    components: {
        CourseForm,
        ListCourse,
        ModalMultipleAddItem,
    },
    props: {
        detailOverview: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            inputForm: [],
            // empty | list | create-course
            pageShow: 'list',
            classroomId: 0,
            moduleOptions: [],
            moduleTableFields: [],
            moduleTableItems: [],
            tempModuleIds: [],
            selectedModule: this.detailOverview?.modules ?? [],
            isLoaded: false,
            tempSearch: '',
            isModalOpen: false,
            totalModules: this.detailOverview?.modules?.length ?? this.selectedModule?.length ?? 0,
            pagination: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 0,
            },
        }
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
        })
    },
    created() {
        this.initialize()
    },
    watch: {
        isModalOpen() {
            if (this.isModalOpen) {
                this.tempSearch = ''
                this.fetchModules(1, null)
            }
        }
    },
    methods: {
        initialize() {
            this.classroomId = parseInt(toDecrypt(localStorage.getItem('classroomId')))
            this.inputForm = []

            this.moduleTableFields = [...TABLE_SELECT_COURSE]
            this.fetchModules()
        },
        onChangePage(page = 'empty') {
            this.pageShow = page
        },
        setOverviewClass(evt) {
        },
        async fetchModules(page = 1, search = null) {
            this.moduleTableItems = []
            await this.$store.dispatch('Services/modules', { page, type: null, search })

            if (!this.servicesState.status) {
                console.error('Failed fetch modules', this.servicesState.message)
                this.isLoaded = true
            } else {
                const modules = this.servicesState.modules ?? []
                const moduleItems = modules.map((item) => {
                    const module = {...item}
                    module.authorName = item?.author?.name ?? 'Mentor'
                    module.modulCount = item?.courses ?? 0
                    module.latestUpdate = moment(item?.updated_at).format('DD MMM YYYY')
                    module.checked = this.tempModuleIds.includes(item?.id) || this.selectedModule.includes(item?.id) || this.detailOverview?.modules?.includes(item?.id)

                    return module
                })

                this.moduleTableItems = moduleItems

                this.pagination = this.servicesState.pagination
                this.isLoaded = true
            }
        },
        selectedItemsChanged(modules = []) {
            // this.selectedModule = []
            // value?.forEach(module => this.selectedModule.push(module?.id))

            modules?.forEach(module => {
                const findModuleIdx = this.selectedModule.findIndex(moduleId => moduleId == module?.id)
                if (!module?.checked && this.selectedModule.includes(module?.id)) this.selectedModule.splice(findModuleIdx, 1)
                else if (module?.checked && !this.selectedModule.includes(module?.id)) this.selectedModule.push(module?.id)
            })

            this.totalModules = this.selectedModule?.length ?? 0
        },
        onPaginateChanged(val) {
            this.isLoaded = false
            this.fetchModules(val, this.tempSearch)
        },
        onSearch(val) {
            this.isLoaded = false
            this.tempSearch = val
            this.fetchModules(1, val)
        },
        setOpenModal() {
            this.isModalOpen = !this.isModalOpen
        },
        async onAddMultipleModule() {
            const params = {
                classroomId: this.classroomId,
                moduleIds: [...this.selectedModule]
            }

            await this.$store.dispatch('Services/classroomAssignModules', { params })
            if (!this.servicesState.status) {
                console.error('Failed add modules', this.servicesState.message)
            } else {
                this.onChangePage('empty')
                this.isModalOpen = false
                this.$emit('onFetchClassroomDetail', { slug: this.detailOverview?.slug })

                setTimeout(() => {
                    this.onChangePage('list')

                    setTimeout(() => {
                        this.totalModules = this.detailOverview?.modules?.length ?? this.selectedModule?.length ?? 0
                        this.selectedModule = this.detailOverview?.modules ?? []
                    }, 400)
                }, 400)
            }
        },
        onChangeCourses(courses) {
            this.tempModuleIds = courses?.map(module => module?.id) ?? []
            this.totalModules = this.tempModuleIds.filter(module => module?.editable == false).length
        }
    }
}
</script>
