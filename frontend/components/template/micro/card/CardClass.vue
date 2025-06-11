<template>
    <b-card :img-src="item.logo && item.logo != '' ? item.logo : imgDefault" :img-alt="item.name" img-top class="class-card">

        <div>


            <nuxt-link :to="`/dashboard/classroom/overview/${item.slug}`"><b-card-title class="mb-2">{{item.name}}</b-card-title></nuxt-link>
            
                <!-- <div v-if="item?.tagList?.length !== 0" class="tags-container mb-2">
                    <span v-for="(item, index) in item.tagList" :key="index" class="badge badge-dark text-white m-1 p-2">{{item}}</span>
                </div> -->
            <!-- <div class="tags-container mb-1">
                <span class="badge bg-primary text-white" style="padding:4.5px">{{ item?.program }}</span>
            </div>             -->
            <p class="text-limit limit-3" style="margin-top:2px">{{ markdownReader(item.description) }}</p>
            <div class="d-flex flex-wrap" style="margin-top:.6rem; margin-bottom: 1rem">
                <span class="mr-2 badge bg-primary text-white" style="padding:4.5px" v-html="item?.program"/>
                <p :class="`mr-2 badge badge-${generateStatusBadge(item.classState, 'status')}`">{{ generateStatusBadge(item.classState, 'name') }}</p>

                <p v-if="item.classState.comingSoon || item.classState.onRegistration" class="text-sm text-primary"><span class="badge badge-danger zoom">{{beautifyDate(item.registrationStart)}} - {{beautifyDate(item.registrationEnd)}}</span></p>
                <p v-else class="text-sm text-secondary "><span class="badge badge-success zoom">{{beautifyDate(item.start)}} - {{beautifyDate(item.end)}}</span></p>
            </div>

            <b-card-text class="limit-decription mb-3" v-html="item.description"></b-card-text>

            <!-- <div class="tags-container mb-4">
                <span v-for="(item, index) in item.tagList" :key="index" class="badge badge-dark text-white m-1 p-2">{{item}}</span>
            </div> -->

        </div>

        <nuxt-link :to="`/dashboard/classroom/overview/${item.slug}`" class="btn btn-primary btn-block text-white">{{ isTestCase ? 'Detail Tes' : 'Detail Kelas' }}</nuxt-link>

        <!-- <b-button :variant="item.registered ? 'primary' : 'outline-primary'" block @click="btnClassClick(item)">{{item.registered ? item.userState ? 'Lihat Kelas' : 'Lihat Pretest' : 'Ikuti Sekarang'}}</b-button> -->

<!-- Modal -->
        <b-modal id="modalConfirmation" v-model="modalConfirmation" size="sm" centered hide-header hide-footer>
            <div class="d-flex align-items-center justify-content-center mb-4">
                <p v-if="selectedClass" class="mb-0">Anda yakin akan mengikuti kelas <strong class="text-primary">{{item.name}}</strong> ?</p>
            </div>
            <div class="d-flex align-items-center justify-content-end">
                <b-button variant="danger" size="small" @click="btnModalAction(false)">Batal</b-button>
                <b-button variant="primary" size="small" @click="btnModalAction(true)">Iya</b-button>
            </div>
        </b-modal>

        <b-modal id="modalLoading" v-model="modalLoading" size="md" centered hide-header hide-footer no-close-on-backdrop no-close-on-esc>
            <div class="d-flex align-items-center justify-content-center">
                <b-spinner label="Spinning" class="mr-3"></b-spinner><span>Loading...</span>
            </div>
        </b-modal>
    </b-card>
</template>
<script>
import customFunction from "@/store/customFunction.js"
import moment from 'moment'
import { mapState } from 'vuex';

import RequirementsClassForm from "~/components/template/micro/form/RequirementsClassForm.vue";

export default {
    props: {
        item: {
            type: Object,
            default: null
        }
    },
    components: {
        RequirementsClassForm,
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
            sassState: (state) => state.Sass,
        })
    },
    data() {
        return {
            // imgDefault: "https://drive.alkademi.id/v1/upload/alkademi-dark.png",
            imgDefault: null,

            isTestCase: false,

            modalLoading: false,
            modalConfirmation: false,
            modalRequirements: false,

            selectedClass: null,
        }
    },
    mounted() {
        this.isTestCase = this.sassState.isTestCase
        // this.checkClient()
    },
    methods: {
        // checkClient() {
        //     const settings = this.sassState.settings
        //     if (settings) {
        //         if (settings.layout == 'umptn' || settings.layout == 'jambore') this.isTestCase = true
        //     } else {
        //         let host = document.location.hostname.split('.')[0]
        //         if (host == 'jambore' || host == 'umptn') this.isTestCase = true
        //     }
        // },
        async enrollClass(code) {
            this.modalLoading = true
            // return setTimeout(() => {
            //     this.modalLoading = false
            //     this.selectedClass = null
            //     this.$emit('fetchClass')
            // }, 1000);
            await this.$store.dispatch('Services/classroomEnroll', code)

            if (!this.servicesState.status) {
                console.error('failed to enroll classroom: ', this.servicesState.message)

                let eventData = {
                    message: this.servicesState.message, 
                    status: false
                }

                this.$emit('event', eventData)
                this.selectedClass = null
                this.modalLoading = false
            } else {
                let eventData = {
                    message: `Berhasil mengikuti kelas ${this.item.name}`, 
                    status: true
                }

                this.selectedClass = null
                this.$emit('event', eventData)
                this.$emit('fetchClass')
                setTimeout(() => {
                    this.modalLoading = false

                    let res = 'classroom'
                    if (this.isTestCase) res = 'tes'
                    this.$router.push(`/dashboard/${res}/${this.item.id}`)
                }, 1000);
            }
        },

        btnModalAction(action) {
            this.modalConfirmation = false
            this.modalRequirements = false
            if (action) {
                setTimeout(() => {
                    this.enrollClass(this.selectedClass.code)
                }, 250);
            } else {
                this.selectedClass = null
            }
        },

        btnClassClick(item) {
            let res = 'classroom'

            if (this.isTestCase) res = 'tes'

            if (item.registered) this.$router.push(`/dashboard/${res}/${item.id}`);
            else {
                this.selectedClass = item
                // if (item.requirementFields != null) this.modalRequirements = true
                if (item.requirementFields != null) this.$router.push(`/dashboard/classroom/requirements/${item.code}`)
                else this.modalConfirmation = true
            }
        },

        generateStatusBadge(data, state) {
            return customFunction.statusClass(data,state)
        },

        beautifyDate(date) {
            moment.locale('id');
            return moment(date).format('D MMM YY')
        },
    }
}
</script>
<style scoped>
.class-card {
    /* height: 550px !important; */
    height: 420px !important;
}
.class-card .card-body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.class-card img {
    object-fit: contain;
    height: 140px;
    padding-top: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
}
.class-card .card-title {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /* number of lines to show */
  -webkit-box-orient: vertical;
}
.class-card .card-text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  /* number of lines to show */
  -webkit-box-orient: vertical;
}
.tags-container {
    max-height: 70px;
    overflow: hidden;
    margin: 0 -0.25rem;
}
</style>