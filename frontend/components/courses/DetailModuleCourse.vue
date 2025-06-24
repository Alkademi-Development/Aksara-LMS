<template>
    <b-row>

        
        <b-col cols="12" lg="4">

            <b-card class="type-module" :class="listFile.length > 0 ? 'contain' : 'empty'">

                <template #header>
                    <h5 v-if="isLoaded">{{ listFile.length > 0 ? "File Modul" : "Tidak Ada Modul" }}</h5>
                    <!-- Loading State -->
                    <div v-else class="w-100">
                        <b-skeleton width="40%"></b-skeleton>
                        <b-skeleton width="60%"></b-skeleton>
                    </div>
                </template>

                <b-card-text>

                    <ul class="type-module-list" v-if="listFile.length > 0">
                        <li 
                            v-for="(file, index) in listFile" 
                            :key="index"
                            :class="`type-module-item ${isFiles?.kind === file?.kind && isFiles?.file === file?.file ? 'active' : ''}`"
                            @click="changeFile(file)"
                        >
                            <i :class="`${filterIcons(file?.kind)}`"></i>
                            <span>{{ file?.kind?.charAt(0).toUpperCase() + file?.kind?.slice(1) }}</span>
                        </li>
                        <!-- <li class="type-module-item">
                            <i class="ri-play-circle-line vid-color"></i>
                            <span>Video</span>
                        </li>
                        <li class="type-module-item">
                            <i class="ri-file-text-line doc-color"></i>
                            <span>Document</span>
                        </li>
                        <li class="type-module-item">
                            <i class="ri-volume-up-line voi-color"></i>
                            <span>Suara</span>
                        </li>
                        <li class="type-module-item">
                            <i class="ri-file-ppt-line ppt-color"></i>
                            <span>Slide</span>
                        </li> -->
                    </ul>

                </b-card-text>

            </b-card>

        </b-col>

        <b-col cols="12" lg="8" md="8">

            <b-card class="module-detail">

                <template #header>
                    <div class="author-detail" v-if="isLoaded">
                        <img v-if="moduleDetail?.author?.photo" :src="moduleDetail?.author?.photo" alt="Profile Mentor"  class="author-img" />
                        <div>
                            <h4 class="author-name">{{ moduleDetail?.author?.name }}</h4>
                            <span class="author-status">Penulis Modul</span>
                        </div>
                    </div>
                    <!-- Loading State -->
                    <div v-else class="w-100">
                        <b-skeleton width="40%"></b-skeleton>
                        <b-skeleton width="60%"></b-skeleton>
                    </div>
                </template>

                <b-card-text>

                    <template v-if="isLoaded">
                        <div class="mb-m--3" v-if="isFiles != undefined && isUrl(isFiles.file)">
                            <b-embed
                                type="iframe"
                                allowfullscreen
                                frameborder="0"
                                :src="generateLinkEmbed(isFiles?.file)"
                            ></b-embed>
                        </div>
    
                        <p class="module-description overflow-auto" v-html="moduleDetail?.description">
                        </p>
    
                        <div class="d-flex align-items-center" :class="`${nextTopic.active && prevTopic.active ? 'justify-content-between gap-5' : !prevTopic?.active && nextTopic.active ? 'justify-content-end' : 'justify-content-start'}`">
                            <div class="card-module mt--m-6 d-flex align-items-center w-50" @click="switchTopic(prevTopic.topicId, prevTopic.topicTitle)" v-if="prevTopic.active">
                                <div>
                                    <i class="ri-arrow-left-line"></i>
                                </div>
                                <div class="card-module-title w-100 overflow-hidden" style="text-overflow: ellipsis; white-space: nowrap;">
                                    {{ prevTopic?.topicTitle }}
                                </div>
                            </div>

                            <div class="card-module mt--m-6 d-flex align-items-center w-50" @click="switchTopic(nextTopic.topicId, nextTopic.topicTitle)" v-if="nextTopic.active">
                                <div class="card-module-title w-100 overflow-hidden" style="text-overflow: ellipsis; white-space: nowrap;">
                                    {{ nextTopic?.topicTitle }}
                                </div>
                                <div>
                                    <i class="ri-arrow-right-line"></i>
                                </div>
                            </div>
                        </div>

                    </template>
                    <!-- Loading State -->
                    <div v-else class="w-100">
                        <b-skeleton width="100%" class="mb-m--3"></b-skeleton>
                        <b-skeleton width="100%"></b-skeleton>
                        <b-skeleton width="100%" class="mt--m-6"></b-skeleton>
                    </div>

                </b-card-text>

            </b-card>

        </b-col>

    </b-row>
</template>

<script>
import StudentTaskTable from '@/components/template/micro/table/StudentTaskTable.vue';
import StudentAssignmentCard from '~/components/classrooms/StudentAssignmentCard.vue';

import { mapActions, mapState } from 'vuex';
import moment from 'moment';

import { toEncrypt } from '~/commons/utils';

export default {
    components: {
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
        })
    },

    props: {
        topicId: {
            type: Number,
            default: -1
        },
        moduleId: {
            type: Number,
            default: -1
        },
    },

    data() {
        return {
            userKind: localStorage.getItem('user_kind'),
            userId: JSON.parse(localStorage.getItem('user')).id,

            action: '',
            title: '',
            nameMentor: '',
            moduleTitle: '',

            isLoaded: false,
            moduleDetail: null,
            listFile: [],
            isFiles: null,

            classId: null,

            isBusy: true,

            // Alert Event
            onEvent: {
                message: '',
                status: true,
                alertCounter: 0,
                variant: ''
            },

            // Pagination
            pagination: {
                page: 1,
                perPage: 10,
                totalItems: 0,
                totalPages: 0,
            },
            
            // topics
            listTopics: [],
            indexTopic: null,
            prevTopic: {active: null, topicId: null, topicTitle: null},
            nextTopic: {active: null, topicId: null, topicTitle: null},

            isModuleVideo: false,
        }
    },

    filters: {

        // Capitalize Char 1 on a Text
        capitalize: function (value) {
            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
        },

        // [Date Format] Remove Second
        date: function (value) {
            if (!value) return ''
            return moment(value, 'YYYY-MM-DD HH:mm:ss').format('dddd, DD MMM YYYY HH:mm')
        },
    },

    created() {
        this.getCredentials();
    },
    mounted() {
    },
    methods: {
        ...mapActions({
          setActiveTab: 'Layouts/setActiveTab',
        }),
        changeFile(value){
            this.isFiles = value
        },
        onOpenAssignment() {
            this.processAutoStart = false
            this.openAssignment = true
        },
        getCredentials() {
            const url = this.$router.currentRoute.fullPath
            var res = url.split('/')
            res.shift()

            this.title = res[1].toLowerCase()
            this.action = res[4]
            
            this.fetchModule()
            this.fetchListTopics()

        },

        async fetchModule() {
            this.isLoaded = false;

            let params = this.topicId

            await this.$store.dispatch(`Services/topicDetail`, params)

            if(!this.servicesState.status) {

                console.error('Failed get topic on classroom: ', this.servicesState.message)
                this.setEvent(this.servicesState.message)

            } else {
                this.moduleDetail = this.servicesState.topicDetail

                this.listFile = this.moduleDetail.attachments;

                this.isFiles = this.listFile[0];

                this.isLoaded = true
            }
        },
        
        async fetchListTopics(){
            this.isLoaded = false
            const params = {
                page: this.pagination.page,
                moduleId: this.moduleId
            }

            await this.$store.dispatch('Services/allTopics', params)
            if(!this.servicesState.status){
                console.error('failed fetch all topics', this.servicesState.message);
                this.setEvent(this.servicesState.message, false)
            } else{
                this.listTopics = this.servicesState?.topics.topics.items;
                if(this.listTopics === null) return ""
                const indexTopic = this.listTopics.findIndex(item => item.id === this.topicId)
                if (indexTopic == -1) {
                    this.pagination.page++
                    await this.fetchListTopics()
                    this.isLoaded = true
                    return
                }
                let result =  indexTopic - (this.listTopics.length -1)
                this.moduleTitle = this.servicesState?.topics?.module?.title

                if(indexTopic == this.listTopics.length -1){
                    this.prevTopic = {
                        active: true, topicId: this.listTopics[indexTopic-1].id, 
                        topicTitle: this.listTopics[indexTopic-1].title, 
                    }
                    this.nextTopic = {active: false, topicId: null, topicTitle: null}
                }
                else if(indexTopic == 0){
                    this.prevTopic = {active: false, topicId: null, topicTitle: null}
                    this.nextTopic = {
                        active: true, 
                        topicId: this.listTopics[indexTopic+1].id, 
                        topicTitle: this.listTopics[indexTopic+1].title,
                    }
                }
                else if(indexTopic < this.listTopics.length -1){
                    this.prevTopic = {
                        active: true, 
                        topicId: this.listTopics[indexTopic-1].id, 
                        topicTitle: this.listTopics[indexTopic-1].title,
                    }
                    this.nextTopic = {
                        active: true, 
                        topicId: this.listTopics[indexTopic+1].id, 
                        topicTitle: this.listTopics[indexTopic+1].title,
                    }
                }
            }
        },

        switchTopic(topicId, topicTitle) {
            localStorage.setItem('topicId', toEncrypt(topicId))
            this.$router.replace({
                path: `/dashboard/courses/modules/${this.moduleTitle.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}/detail/${topicTitle.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}`,
            })
        },
        
        isUrl(str) {
            const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
            return urlRegex.test(str);
        },

        setEvent(message, status) {

            window.scrollTo(0,0)

            this.onEvent.message = message
            this.onEvent.status = status
            this.onEvent.variant = status ? 'success' : 'warning'
            this.onEvent.alertCounter = 5

        },

        generateLinkEmbed(link){

            if(link.includes("presentation")) {
                return link.replace(/\/edit\?/, "/embed?start=false&loop=false&delayms=3000&rm=minimal");
            } else {
                return link.replace("/view", "/preview")
            }

        },

        validURL(url) {

            var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

            return !!pattern.test(url);
        },

        backButton() {
            this.$router.go(-1)
        },

        pageChange (e) {
            this.pagination.page = e;
            this.fetchAssignments()
        },

        filterIcons(value){
            if(value == "document") return "ri-file-text-line doc-color"
            else if(value == "video") return "ri-play-circle-line vid-color"
            else if(value == "image") return "ri-image-fill img-color"
            else if(value == "suara") return "ri-volume-up-line voi-color"
            else if(value == "slide") return "ri-file-ppt-line ppt-color"
        },
    } 
}
</script>

<style lang="scss" scoped>

@import '@/assets/scss/components/courses/module.scss';

// .doc-color{
//     color: #2F00E9
// }
// .vid-color{
//     color: #47BDFF
// }
// .ppt-color{
//     color: #DD6611
// }
// .img-color{
//     color:#41644A
// }
// .voi-color{
//     color: #47BDFF
// }

// .ri-icon {
//     font-weight: 500; 
//     font-size: 18px; 
//     min-width: inherit; 
//     margin-right: 12px;
// }
// .card-text iframe {
//     width: 100% !important;
//     min-height: 300px;
// }
// .user-prof{
//     width: 32px;
//     height: 32px;
//     border: 1px solid #212A3E;
//     background-color: #ccc;
//     border-radius: 100%;
//     overflow: hidden;
//     display: flex;
//     align-items: center;
//     justify-content: center;

//     img{
//         width: 100%;
//         height: 100%;
//         object-fit: cover;
//         background-color: white;
//     }
// }

// .list-files:hover{
//     background: #2096C4;
//     color: white;
//     border-radius: 6px;
//     transition: all;
//     transition-duration: 200ms;
//     p, i{
//         color: white;
//     }
// }

// .assignment{
//     background: white;
//     &:hover{
//         background: #DBDFEA;
//         transition: all .2s;
//     }
// }

// .pract-style{
//     background: white;
//     padding:12px;
//     &:hover{
//         background: #2096C4 !important;
//         color:white !important;
//         border-color: #2096C4 !important;
//         transition: all .2s;
//     }
// }

.card-header {
    border: none !important;
    padding-left: 12px;
    padding-top: 24px;
    padding-right: 12px;
    padding-bottom: 36px;
}

.card-body {
    padding-top: 0 !important;
    padding-left: 12px !important;
}

.card-module {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 24px 12px;
    margin-top: 24px;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 6px;
    cursor: pointer;

    .card-module-title {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 17px;
        color: #000000;
    }
}



</style>
