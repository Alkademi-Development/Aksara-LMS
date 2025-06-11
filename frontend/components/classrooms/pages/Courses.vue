<template>
    <section id="courses">
        <ContentHeader 
            v-if="user_kind !== 'student'"
            title="Daftar Materi" 
            page="courses"
            :actionButtons="actionsButton"
            :classId="classId"
            :userKind="user_kind"
            @onOpenCourseModal="onOpenCourseModal"
        />
    
        <template v-if="isCourseLoaded">
            <template v-if="classCourses?.length > 0">
                <b-alert 
                    class="alert__cta d-flex flex-column flex-sm-row align-items-start align-items-sm-center mb-4"
                    variant="primary"
                    :show="classOverview?.userState === 0" 
                >   
                    {{ checkStatusClass(classOverview) }}
                    <span 
                        v-if="classOverview?.classState?.onRegistration"
                        class="register__cta d-flex align-items-center" 
                        @click="onClickRegisterCta"
                    >
                        Daftar Sekarang <i class="arrow__icon ri-arrow-right-s-line"></i>
                    </span>
                </b-alert>

                <b-card 
                    v-for="(course, idx) in classCourses" 
                    :key="idx"
                    :id="`${course?.type}-${course?.id}`" 
                    class="border mb-4" 
                >
                    <div 
                        :class="['header d-flex align-items-center justify-content-between', activeCourseIndex === idx ? 'mb-3' : '']" 
                        @click="onClickCourse(idx)"
                    >   
                        <div class="d-flex flex-row align-items-center">
                            <h4 class="title mr-3 text-limit limit-1">{{ course?.title }}</h4>
                            <div 
                                v-if="user_kind !== 'student'"
                                class="action-container d-flex flex-row align-items-center" 
                            >
                                <div class="action text-secondary border rounded px-2 modul" @click="onCreateModule(course)">
                                    <i class="ri-add-line mr-1"></i>
                                    Modul
                                </div>
                                <div class="action border rounded" @click="onEditCourse(course)"> 
                                    <i class="ri-pencil-line"></i>
                                </div> 
                                <div class="action text-danger border rounded" @click="toggleRemoveCourse(course)">
                                    <i class="ri-delete-bin-7-line"></i>
                                </div>
                            </div>
                        </div>
                        <i class="ri-arrow-up-s-fill" v-if="activeCourseIndex === idx"></i>
                        <i class="ri-arrow-down-s-fill" v-else></i>
                    </div>
                    <div class="content-wrapper" v-if="activeCourseIndex === idx">
                        <template v-if="statusCourse">
                            <template v-if="modules?.length > 0">
                                <b-card 
                                    :id="`${module?.kind}-${module?.id}`"
                                    :class="['content border', modules?.length - 1 !== idx ? 'mb-3' : 'mb-0']" 
                                    v-for="(module, moduleIdx) in modules" 
                                    :key="moduleIdx"
                                    body-class="content-body"
                                    :style="`background-color: ${classOverview.userState === 0 ? '#f0f0f0' : 'white'}`"
                                >
                                    <b-row>
                                        <b-col>
                                            <div class="title-container d-flex flex-row align-items-center mb-2">
                                                <h4 class="title mr-3" @click="onClickDetailModule(course, module)" :style="`cursor: ${classOverview.userState === 0 ? 'auto' : 'pointer'};`">
                                                    {{ module?.title }}
                                                </h4>
                                                <div 
                                                    v-if="user_kind !== 'student'"
                                                    class="action-container d-flex flex-row align-items-center" 
                                                >
                                                    <div class="action border rounded" @click="onEditModule(module, course)"> 
                                                        <i class="ri-pencil-line"></i>
                                                    </div>
                                                    <div class="action text-danger border rounded" @click="toggleRemoveModule(module)">
                                                        <i class="ri-delete-bin-7-line"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="description mb-4 mb-md-2" v-html="!!module?.description ? module?.description : '-'"></div>
                                        </b-col>
                                        <b-col cols="12" md="auto" class="d-flex align-items-center justify-content-start justify-content-md-end">
                                            <i 
                                                v-if="classOverview.userState === 0" 
                                                class="lock__icon ri-git-repository-private-line fs">
                                            </i>
                                            <button 
                                                v-else 
                                                class="btn btn-primary rounded-pill px-4" 
                                                @click="onClickDetailModule(course, module)"
                                            >
                                                Pelajari
                                            </button>
                                        </b-col>
                                    </b-row>
                                </b-card>
                            </template>
                            <template v-else>
                                <b-card class="content border mb-0">Belum ada modul</b-card>
                            </template>
                        </template>
                        <template v-else>
                            <b-card class="border">
                                <b-skeleton width="85%"></b-skeleton>
                                <b-skeleton width="55%"></b-skeleton>
                                <b-skeleton width="70%"></b-skeleton>
                            </b-card>
                        </template>
                    </div>
                </b-card>
            </template>
            <template v-else>
                <b-card class="border">
                    <b-row>
                        <b-col>Belum Ada Materi</b-col>
                    </b-row>
                </b-card>
            </template>
        </template>
        <template v-else>
            <b-card class="border">
                <b-row>
                    <b-col>Memuat..</b-col>
                </b-row>
            </b-card>
        </template>

        <ModalCreateCourse
            hideFooter
            isFromClass
            size="md" 
            title="Pilih Materi Yang Sudah Ada" 
            :isNewCourse="false"
            :classroomId="classId" 
            :vModel="openModalCourse" 
            @vModelChange="openModalCourse = $event"
            @submitted="getClassCourse()"
        />
        
        <b-modal 
            v-model="isConfirmRemoveCourse" 
            size="md" 
            centered 
            hide-header 
            hide-footer 
            body-class="p-0"
        >
            <ModalConfirmation
                title="Peringatan!"
                :description="`<p>Apakah anda yakin akan menghapus materi <strong>${selectedCourse?.title}</strong> ini?</p>`"
                btnYesVariant="danger"
                @actionYes="onRemoveCourse"
                @actionNo="isConfirmRemoveCourse = false"/>
        </b-modal>
        
        <b-modal 
            v-model="isConfirmRemoveCourse" 
            size="md" 
            centered 
            hide-header 
            hide-footer 
            body-class="p-0"
        >
            <ModalConfirmation
                title="Peringatan!"
                :description="`<p>Apakah anda yakin akan menghapus materi <strong>${selectedCourse?.title}</strong> ini?</p>`"
                btnYesVariant="danger"
                @actionYes="onRemoveCourse"
                @actionNo="isConfirmRemoveCourse = false"/>
        </b-modal>
        
        <b-modal 
            v-model="isConfirmRemoveModule" 
            size="md" 
            centered 
            hide-header 
            hide-footer 
            body-class="p-0"
        >
            <ModalConfirmation
                title="Peringatan!"
                :description="`<p>Apakah anda yakin akan menghapus modul <strong>${selectedModule?.title}</strong> ini?</p>`"
                btnYesVariant="danger"
                @actionYes="onRemoveModule"
                @actionNo="isConfirmRemoveModule = false"/>
        </b-modal>
        <b-modal v-model="isConfirmEnroll" size="md" centered hide-header hide-footer body-class="p-0">
            <ModalConfirmation
                title="Konfirmasi Pendaftaran!"
                :description="`<p class='text-break'>Apakah anda yakin akan mendaftar di kelas <strong>${ classOverview?.name }</strong>?</p>`"
                btnYesVariant="primary"
                btnNoVariant="danger"
                :btnYesTitle="`${modalLoading ? 'Proses mendaftar kelas...' : 'Ya, Saya Yakin'}`"
                :btnYesDisabled="modalLoading"
                :btnNoHide="modalLoading"
                :footerMessage="classOverview?.level > 1 ? `<p class='danger-message'>*Kamu harus mengikuti <span class='text-primary'>Kelas Persiapan</span> dulu nih` : ''"
                @actionYes="btnModalAction(true)"
                @actionNo="btnModalAction(false)"/>
        </b-modal>
        <b-modal v-model="isCannotRegister" size="md" centered hide-header hide-footer body-class="p-0">
            <ModalConfirmation
                title="Maaf, Kamu Belum Bisa Mendaftar di Kelas ini :("
                :description="registErrMessage"
                btnYesVariant="primary"
                btnYesTitle="OK"
                :btnNoHide="true"
                @actionYes="isCannotRegister = false"/>
        </b-modal>
        <b-modal v-model="finishPreparationClass" size="md" centered hide-header hide-footer body-class="p-0">
            <ModalConfirmation
                title="Maaf, Kamu Belum Bisa Mendaftar di Kelas ini :("
                :description="
                    `<p class='text-break'>
                        Kamu harus menyelesaikan 
                        <span class='text-danger'>Kelas ${classOverview?.level === 3 ? 'Online' : classOverview?.level === 2 ? 'Persiapan' : ''}</span>
                        dulu
                    </p>`
                "
                btnYesVariant="danger"
                btnYesTitle="Oke, Aku Selesaikan"
                :btnYesDisabled="modalLoading"
                btnNoHide
                @actionYes="btnModalFinishPreparationClass()" 
            />
        </b-modal>
    </section>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import ModalConfirmation from '~/components/template/micro/modal/ModalConfirmation.vue';
import ModalCreateCourse from '~/components/template/micro/modal/ModalCreateCourse.vue';
import ContentHeader from '../micro/ContentHeader.vue';

import { toEncrypt } from '~/commons/utils';

export default {
    components: { 
        ContentHeader, 
        ModalConfirmation, 
        ModalCreateCourse 
    },
    props: {
        classId: {
            type: Number,
        },
        classSlug: {
            type: String,
            default: ''
        },
        classOverview: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {          
            alertMessage: "",
            alertStatus: false,
            
            activeCourseIndex: null,
            activeCourseId: null,
            activeCourseSlug: null,

            courseSlug: [],

            statusCourse: false,
            actionsButton: [
                { 
                    text: 'Materi', 
                    class: 'btn btn-primary m-0', 
                    type: 'dropdown',
                    iconClass: 'ri-add-fill',
                    dropdownItem: [
                        { text: `Pilih Dari List Materi`, type: 'action', to: 'onOpenCourseModal' },
                        { text: 'Buat Materi Baru', type: 'link', to: `/dashboard/classroom/${this.classSlug}/course/create` }
                    ],
                    classId: this.classId
                }
            ],
            
            isConfirmRemoveCourse: false,
            openModalCourse: false,
            
            isConfirmRemoveModule: false,
            
            classCourses: [],
            isCourseLoaded: false,
            selectedCourse: {},
            
            classModule: [],
            isModuleLoaded: false,
            selectedModule: {},
            isConfirmEnroll: false,
            modalLoading: false,
            isCannotRegister: false,
            registErrMessage: "",
            finishPreparationClass: false,
        }
    },
    watch: {
        activeCourseIndex() {
            this.statusCourse = false
            
            this.setActiveCourseId()
            this.scrollToModuleActive();

            if (this.activeCourseSlug !== null) {
                this.getModules({ classroomSlug: this.classSlug, moduleSlug: this.activeCourseSlug })
                    .then(() => { 
                        this.classModule = this.modules
                        this.statusCourse = true })
            }       
        }
    },
    computed: {
        ...mapState({
            courses: (state) => state.Services?.modules,
            modules: (state) => state.Services?.topics,
            responseStatus: (state) => state.Services?.status,
            responseMessage: (state) => state.Services?.message,
            user_kind: (state) => state.Auth?.user_kind,
            isTestCase: (state) => state.Sass?.isTestCase,
            servicesState: (state) => state.Services,
        }),
    },
    created(){
        this.getClassCourse()
    },
    methods: {
        ...mapActions({
            getCourses: 'Services/classroomModules',
            getModules: 'Services/classroomTopics',
            removeCourse: 'Services/classroomDeleteModule',
            removeModule: 'Services/deleteTopic',
            setActiveTab: 'Layouts/setActiveTab',
        }),

        setEvent(message, status) {
            this.alertMessage = message
            this.alertStatus = status
        },

        getClassCourse() {
            this.getCourses({ slug: this.classSlug }).then(() => {
                this.classCourses = this.courses
                if (this.activeCourseIndex === null || this.activeCourseId === null) {
                    const moduleId = this.$route.hash ? parseInt(this.$route.hash.split("-")[1]) : 0;
                    this.activeCourseIndex = moduleId == 0 ? 0 : this.courses.findIndex(obj => obj.id == moduleId);
                    if(this.classCourses?.length == 1){
                        this.activeCourseId = this.classCourses[0].id
                        this.activeCourseSlug = this.classCourses[0].slug
                        this.statusCourse = true
                    }
                }

                this.isCourseLoaded = true
            })
        },
        setActiveCourseId() {
            this.courses?.map((course, idx) => {
                if (this.activeCourseIndex === idx) {
                    this.activeCourseId = course.id
                    this.activeCourseSlug = course.slug
                }
            })
        },
        btnModalAction(action) {
            if (action) this.enrollClass(this.classOverview?.code)
            else this.isConfirmEnroll = !this.isConfirmEnroll
        },
        onClickRegisterCta() {
            let res = 'classroom'
            if (this.user_kind == 'student') {
                if (this.isTestCase) res = 'tes/assignments'
                if (this.classOverview.registered) this.$router.push(`/dashboard/${res}/${this.classOverview.id}`);
                else {
                    this.isLoaded = true
                    if (this.classOverview?.meetLevels) {
                        if (this.classOverview.requirementFields.length != 0) this.$router.push(`/dashboard/classroom/requirements/${this.classOverview.slug}`)
                        else this.isConfirmEnroll = true
                    }else {
                        this.finishPreparationClass = true
                    }
                }
            } else {
                if (this.isTestCase) res = 'tes'
                this.$router.push(`/dashboard/${res}/${this.classOverview.id}`);
            }
        },
        btnModalFinishPreparationClass() {
            this.finishPreparationClass = false
            this.$router.push('/dashboard/')
        },
        async enrollClass(code) {
            this.modalLoading = true
            const params = {code: code}
            await this.$store.dispatch('Services/classroomEnroll', params)
            if (!this.servicesState.status) {
                console.error('failed to enroll classroom: ', this.servicesState.message)
                this.setEvent(this.servicesState.message, false)

                this.modalLoading = false
                this.isConfirmEnroll = !this.isConfirmEnroll
                this.registErrMessage = this.servicesState.message

                if (this.classOverview?.schools?.length > 0) {
                    this.registErrMessage = "<p>Sekolahmu belum terdaftar di program ini!<br>Untuk mengikuti program ini, hubungi Admin SMK Coding melalui : <br><br>WhatsApp <a href='https://wa.me/6282131362595' target='_blank'>admin</a><br>Instagram <a href='https://instagram.com/smkcoding.id' target='_blank'>@smkcoding.id</a>, atau<br>Email <a href='mailto:admin@smkcoding.id'>admin@smkcoding.id</a></p>"
                }
                this.isCannotRegister = true
            } else {
                setTimeout(() => {
                    this.modalLoading = false
                    this.btnModalAction(false)
                    this.$emit('fetchOverview')
                    if (this.classOverview?.type !== 'tes') this.setActiveTab('courses')
                }, 1000);

            }

        },
        onClickCourse(idx) {
            this.activeCourseIndex === idx ? this.activeCourseIndex = null : this.activeCourseIndex = idx
        },
        onClickDetailModule(course, module){
            localStorage.setItem('courseId', toEncrypt(course?.id))
            localStorage.setItem('moduleId', toEncrypt(module?.id))
            
            let path = `/dashboard/classroom/${this.classSlug}/course/${course?.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}/module/${module?.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}`
            
            if(this.classOverview.userState === 0) return 
            this.$router.push({
                path: path,
            })
        },
        onOpenCourseModal() {
            this.openModalCourse = !this.openModalCourse
        },
        onEditCourse(course){
            localStorage.setItem('courseId', toEncrypt(course?.id))
            this.$router.push({
                path: `/dashboard/classroom/${this.classSlug}/course/${course?.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}/edit`,
            })
        },
        onEditModule(module, course){
            localStorage.setItem('classId', toEncrypt(this.classId))
            localStorage.setItem('moduleId', toEncrypt(module?.id))
            localStorage.setItem('courseId', toEncrypt(course?.id))

            this.$router.push({
                path: `/dashboard/classroom/${this.classSlug}/module/${module?.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}/edit`,
            })
        },

        summaryText(value) {
            const regexCharsHtml = /(<([^>]+)>)/gi;
            const descriptionContent = value.replace(regexCharsHtml, "")
            if(descriptionContent.length > 160) {
                let descriptionSummary = descriptionContent.substring(0, 160);
                return descriptionSummary.match(/[,!@#$%^&*()]\s*$/) ? descriptionContent.substring(0, 160).slice(0, -1) + '.' : descriptionContent.substring(0, 160);
            }

            return descriptionContent + '.'
        },
        toggleRemoveCourse(course) {
            this.isConfirmRemoveCourse = !this.isConfirmRemoveCourse
            
            if (this.isConfirmRemoveCourse) this.selectedCourse = course
            else this.selectedCourse = null
        },
        async onRemoveCourse() {
            this.isCourseLoaded = false
            const params = {
                moduleId: this.selectedCourse?.id,
                classroomId: this.classId
            }

            await this.removeCourse(params)

            if(!this.responseStatus) {
                console.error('Failed remove course from classroom', this.responseMessage)

                this.setEvent(this.responseMessage, false)
                this.isCourseLoaded = true
            } else {
                this.isConfirmRemoveCourse = false

                this.getClassCourse()
            }
        },
        
        toggleRemoveModule(module) {
            this.isConfirmRemoveModule = !this.isConfirmRemoveModule
            
            if (this.isConfirmRemoveModule) this.selectedModule = module
            else this.selectedModule = null
        },
        async onRemoveModule() {

            this.removeModule(this.selectedModule?.id)

            if(!this.responseStatus) {
                console.error('Failed remove module from classroom', this.responseMessage)

                this.setEvent(this.responseMessage, false)
            } else {
                this.isConfirmRemoveModule = false
                
                this.getModules({ classroomSlug: this.classSlug, moduleSlug: this.activeCourseSlug })
            }
        },

        onCreateModule(course) {
            localStorage.setItem('courseId', toEncrypt(course?.id))
            localStorage.setItem('classId', toEncrypt(this.classId))
            this.$router.push(`/dashboard/classroom/${this.classSlug}/module/create`)
        },

        checkStatusClass(dataOverview){
            if(dataOverview?.classState?.comingSoon) return "Pendaftaran Belum dibuka."
            if(dataOverview?.classState?.onRegistration) return "Daftar kelas ini untuk membuka course modul. "
            if(dataOverview?.classState?.ended || dataOverview?.classState?.started) return "Pendaftaran ditutup."
        },
        scrollToModuleActive(){
            const moduleId = this.$route.hash ? this.$route.hash.split("#")[1] : '';
            if(moduleId !== ''){
                this.$nextTick(() => {
                    const elementActive = document.getElementById(`${moduleId}`);
                    if(elementActive){
                        elementActive.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest",
                        })
                    }
                })
            }
        }
    },
    beforeDestroy(){
        const pathWithoutHash = this.$route.fullPath.split("#")[0]; 
        this.$router.push({ path: pathWithoutHash });
    }
}
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/components/classroom/courses.scss';
    .description {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .lock__icon {
        font-size: 24px;
    }
    
    .alert__cta {
        gap: 2px;
        .register__cta {
            width: fit-content;
            gap: 4px;
            font-weight: 600;
            cursor: pointer;
            color: #FFF;
            
            .arrow__icon {
                line-height: 100%;
                font-size: 16px;
            }

            &:hover {
                text-decoration: underline;
            }
        }
    }
</style>
