<template>
    <b-card no-body>
        <b-card-header>
            <div class="row d-flex align-items-center">
                <div class="col d-flex align-items-center mb-3 mb-md-0">
                    <CircleBackButton v-if="!isPublic" class="d-inline-block" />
                    <div v-if="isLoaded">
                        <h5 v-if="userKind != 'student'" class="text-muted">{{ studentData?.name }}</h5>
                        <h3 class="mb-0 line-h-normal">{{ classOverview?.name }}</h3>
                    </div>
                    <div v-else class="w-100">
                        <b-skeleton width="40%"></b-skeleton>
                        <b-skeleton width="60%"></b-skeleton>
                    </div>
                </div>

                <!-- HIDE RADYA FELLOWSHIP CERTIFICATE -->
                <div 
                    v-if="!isPublic && classSlug !== 'radyafellowship' && DOMAIN?.DOMAIN !== 'umptn.alkademi.id' && DOMAIN?.DOMAIN !== 'jambore.informatika.org'" 
                    class="col-12 col-md-6 d-flex justify-content-md-end"
                >
                    <div v-if="isLoaded">
                        <b-button 
                            v-if="isViewPdf" 
                            class="btn btn-round btn-icon" 
                            variant="success" 
                            pill 
                            @click="handleViewPdf('certificate')"
                        >
                            <span class="btn-inner--icon"><i class="fas fa-eye"></i></span>
                            <span class="btn-inner--text">Preview Certificate</span>
                        </b-button>
                        <b-button 
                            v-if="isViewPdf" 
                            class="btn btn-round btn-icon" 
                            variant="success" 
                            pill 
                            @click="handleViewPdf('raport')"
                        >
                            <span class="btn-inner--icon"><i class="fas fa-eye"></i></span>
                            <span class="btn-inner--text">Preview Rapor</span>
                        </b-button>
                        <b-button v-else class="btn btn-round btn-icon" variant="success" pill disabled>
                            <b-spinner small></b-spinner>
                            <span class="btn-inner--text">Loading...</span>
                        </b-button>
                    </div>
                </div>
            </div>
        </b-card-header>
        <div id="accordion-task-parent" class="accordion" role="tablist">
            <template v-for="(item, index) in dataTab">
                <template v-if="isModuleLoaded">
                    <b-card v-if="item?.topics?.length > 0" no-body :key="`accordion-task-${index}`" class="m-0">
                        <b-card-header header-tag="header" role="tab" class="p-0 header-task-collapse">
    
                            <b-button block v-b-toggle="`accordion-task-${index}`" variant="transparent" class="d-block text-left" @click="!isPublic ? fetchListTopics(index, 'more') : null">
                                <h4 class="mb-0">{{ item.title }}</h4>
                                <div>
                                    <span class="text-muted">Rata-rata nilai yang didapatkan</span>
                                    <strong class="text-primary">{{ item.score }} / 100</strong>
                                </div>
                            </b-button>
    
                        </b-card-header>
    
                        <b-collapse v-if="isTopicsLoaded" :id="`accordion-task-${index}`" visible accordion="accordion-task-parent" role="tabpanel" class="p-4">
                            
                            <template v-if="item?.topics?.length != 0">
                            <div v-for="(topic, ii) in item?.topics" :key="`topic-${ii}`">
                                <div class="d-flex align-items-center justify-content-between">
                                    <div>
                                        <strong class="d-block">{{ topic?.title }}</strong>
                                        <div v-if="topic?.externalId && userKind != 'student'" class="d-flex align-items-center mt-2">
                                            <b-button variant="primary" size="sm" @click="openTask(topic?.externalId, topic?.type)">Buka Tugas</b-button>
                                        </div>
                                    </div>
                                    <div>
                                        <b-avatar
                                            :class="topic.score == 0 ? 'badge-danger' : 'badge-success'"
                                            size="3rem"
                                            :text="topic.score.toString()"
                                            >
                                        </b-avatar>
                                    </div>
                                </div>
                                <hr v-if="ii < item.topics.length - 1" class="my-4">
                            </div>
                            </template>
    
                            <strong v-else class="d-block mb-2">Tidak ada tugas</strong>
                            
                        </b-collapse>
                        <b-collapse v-else :id="`accordion-task-${index}`" visible accordion="accordion-task-parent" role="tabpanel" class="p-4">
                            
                            <b-skeleton width="80%"></b-skeleton>
                            <b-skeleton width="80%"></b-skeleton>
                            <b-skeleton width="80%"></b-skeleton>
                            
                        </b-collapse>
                    </b-card>
                </template>
                <b-card v-else no-body :key="`empty-accordion-task-${index}`" class="m-0">
                    <b-card-header header-tag="header" role="tab" class="p-0 header-task-collapse">

                        <b-button block variant="transparent" class="w-100">
                            <b-skeleton width="40%"></b-skeleton>
                            <b-skeleton width="60%"></b-skeleton>
                        </b-button>

                    </b-card-header>
                </b-card>
            </template>
        </div>
    </b-card>
</template>

<script>
import { mapState } from 'vuex';

import DOMAIN from '@/api/app-token'

export default {
    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
            assignmentState: (state) => state.Assignments,
        })
    },
    data() {
        return {
            DOMAIN,
            userKind: localStorage.getItem('user_kind'),

            isLoaded: false,
            isDownload: false,
            isModuleLoaded: false,
            isTopicsLoaded: false,
            isViewPdf: true,

            classOverview: null,
            selectedModule: null,

            classModules: [],
            classTopics: [],

            studentData: null,

            dataTab: ["Loading...", "Loading..."]
        }
    },
    mounted() {
        if (this.isPublic) this.fetchPublicAssignment()
        else this.getUserDetail()
    },
    methods: {
        
        async clickDownload() {
            this.isDownload = true
            let dispatch = 'Services/certificateDownload'
            
            let params = {
                type: 'rapor',
                userId: this.userId,
                classroomId: this.classOverview.id,
            }

            await this.$store.dispatch(dispatch, params)
            .then(() => {
                var servicesState = this.$store.state.Services

                if(!servicesState.status) {
                    console.error('Failed download raport: ', servicesState.message)
                    this.setEvent(this.servicesState.message, false)
                    this.isDownload = false
                } else {
                    this.$emit('removeEvent')
                    this.isDownload = false
                }
            })
        },
        
        async fetchListTopics(index, action) {
            this.isTopicsLoaded = false
            const params = {
                classroomId: this.classOverview.id,
                moduleId: this.classModules[index].id,
                userId: this.userId
            }
            if (action == 'more') {
                if (this.dataTab[index].topics.length == 0) {
                    await this.$store.dispatch('Assignments/list', params)

                    if (!this.assignmentState.status) {
                        console.error('failed fetch classroom topics', this.assignmentState.message);
                        this.setEvent(this.assignmentState.message, false)
                        this.isTopicsLoaded = false
                    } else {
                        this.$emit('removeEvent')
                        this.classTopics = this.assignmentState.data ?? []

                        let topics = []

                        this.classTopics.map((topic) => {
                            let object = {
                                title: topic.title,
                                score: topic.score,
                                kind: topic.kind,
                                type: topic.type,
                                externalId: topic.type == 'link' ? topic.link : topic.externalId,
                            }
                            topics.push(object)
                        })

                        this.dataTab[index].topics = topics

                        this.isModuleLoaded = true
                        this.isTopicsLoaded = true
                    }
                } else this.isTopicsLoaded = true
            } else {
                await this.$store.dispatch('Assignments/list', params)

                if (!this.assignmentState.status) {
                    console.error('failed fetch classroom topics', this.assignmentState.message);
                    this.setEvent(this.assignmentState.message, false)
                    this.isTopicsLoaded = false
                } else {
                    this.$emit('removeEvent')
                    this.classTopics = this.assignmentState.data ?? []

                    let modules = []

                    this.classModules.map((item, ii) => {
                        let object = {
                            title: item.title,
                            score: item.score,
                            topics: []
                        }

                        this.classTopics.map((topic) => {
                            let topicObject = {
                                title: topic.title,
                                score: topic.score,
                                kind: topic.kind,
                                type: topic.type,
                                externalId: topic.type == 'link' ? topic.link : topic.externalId,
                            }

                            if (index == ii) object.topics.push(topicObject)
                        })

                        modules.push(object)
                    })

                    this.dataTab = modules

                    this.isModuleLoaded = true
                    this.isTopicsLoaded = true
                }
            }
        },

		async getUserDetail() {
            await this.$store.dispatch('Services/userDetail', this.userId)

            if(!this.servicesState.status) {
                console.error('Failed fetch user detail', this.servicesState.message)
                this.isLoaded = false
            } else {
                this.studentData = this.servicesState.data ?? null
            }
            
            this.getClassroomOverview()
		},

        async getClassroomOverview() {
            await this.$store.dispatch('Services/classroomOverview', this.classSlug);

            if(!this.servicesState.status) {
                console.error('Failed fetch classroom overview', this.servicesState.message)
                this.setEvent(this.servicesState.message, false)
                this.isLoaded = false
            } else {
                this.$emit('removeEvent')

                this.classOverview = this.servicesState.data
                this.isLoaded = true
                this.getListModules()

            }
        },

        async getListModules() {
            this.isModuleLoaded = false
            let params = {
                slug: this.classOverview.slug,
                state: 'visible',
                userId: this.userId
            }
            await this.$store.dispatch('Services/classroomModules', params)

            if (!this.servicesState.status) {
                console.error('failed fetch classroom modules: ', this.servicesState.message);
                this.setEvent(this.servicesState.message, false)
                this.isModuleLoaded = false;
            } else {
                this.$emit('removeEvent')
                if (this.servicesState.modules) {
                    this.classModules = this.servicesState.modules
                    // this.selectedModule = this.classModules[0]
                    this.fetchListTopics(0, 'initial')
                } else {
                    this.classModules = []
                    this.selectedModule = null
                    this.isModuleLoaded = true
                    this.isTopicsLoaded = true
                }
            }
        },

        async fetchPublicAssignment() {
            this.isTopicsLoaded = false

            const params = {
                user: this.emailEncrypt,
                slug: this.classSlug
            }

            await this.$store.dispatch('Assignments/public', params)

            if (!this.assignmentState.status) {
                console.error('failed fetch public assignments', this.assignmentState.message);
                this.setEvent(this.assignmentState.message, false)
                this.isTopicsLoaded = false
            } else {
                this.$emit('removeEvent')
                // console.log("DATA", this.assignmentState.data)

                this.classOverview = {}
                this.dataTab = []
                const assignments = this.assignmentState?.data ?? null
                this.classOverview.name = assignments?.class

                assignments?.modules?.map(item => {
                    const moduleObject = {
                        title: item?.title,
                        score: item?.score,
                        topics: []
                    }

                    item?.listAssignments?.map(object => {
                        const topicObject = {
                            title: object?.title,
                            score: object?.score
                        }
                        moduleObject.topics.push(topicObject)
                    })

                    this.dataTab.push(moduleObject)
                })

                // this.classTopics = this.assignmentState.data ?? []

                // let topics = []

                // this.classTopics.map((topic) => {
                //     let object = {
                //         title: topic.title,
                //         score: topic.score,
                //         kind: topic.kind,
                //         type: topic.type,
                //         externalId: topic.type == 'link' ? topic.link : topic.externalId,
                //     }
                //     topics.push(object)
                // })

                // this.dataTab[index].topics = topics

                setTimeout(() => {
                    this.isLoaded = true
                    setTimeout(() => {
                        this.isModuleLoaded = true
                        setTimeout(() => {
                            this.isTopicsLoaded = true
                        }, 250);
                    }, 250);
                }, 250);
            }
        },

        handleViewPdf(type) {
            if (type === 'certificate') {
                this.$router.push(`/dashboard/students/${this.userId}/certificate/${this.classSlug}/view/${this.classOverview?.id}`)
            }else {
                this.$router.push(`/dashboard/students/${this.userId}/raport/${this.classSlug}/view/${this.classOverview?.id}`)
            }
        },

        async openTask(id, type) {

            const responseId = "&responseId=" + id
            const redirectLms = "&redirectTo=" + window.location.href

            var urlTarget = ''
            if (type == 'studio') urlTarget = process.env.editorURL + `compiler?&metronomId=${id}` + redirectLms
            if (type == 'form') urlTarget = process.env.formURL + "/preview?" + responseId + redirectLms
            if (type == 'link') urlTarget = window.open(id, '_blank')

            const baseUrl = process.env.alkademiAuth;
            const redirect = "&redirectTo=" + urlTarget;
            const lmsId = "&lmsId=" + localStorage.getItem('lmsId');
            const code = `&code=${await appToken?.getCode()}`
            const generatedToken = `&generatedToken=${await appToken?.generatedToken()}`
            const url = `${baseUrl}/check?${redirect}${lmsId}${code}${generatedToken}`;

            window.open(url, '_blank')
        },

        setEvent(message, status) {
            const data = {
                message: message,
                status: status
            }
            this.$emit('isEvent', data)
        }
    },
    props: {
        isPublic: {
            type: Boolean,
            default: false
        },
        emailEncrypt: {
            type: String,
            default: ""
        },
        userId: {
            type: Number,
            default: -1
        },
        classSlug: {
            type: String,
            default: ""
        },
    }
}
</script>
<style scoped>
.btn-task-collapse {
    box-shadow: none !important;
    border: none !important;
}
</style>