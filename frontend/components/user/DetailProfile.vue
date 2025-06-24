<template>
    <section>

        <div>

            <template v-if="!userLoading">
              <CardProfile
                  :role="capitalizeAllFirst(userRole)"
                  :photo="userDetail?.photo"
                  :name="userDetail?.name"
                  :city="userDetail?.city"
                  :email="userDetail?.email"
                  :phone="userDetail?.phone"
                  :linkedIn="userDetail?.linkedIn"
                  :github="userDetail?.github"
                  :user="userDetail"
                  :actionUrl="isMySelf ? '/dashboard/profile/edit' : '' "
              />
            </template>

            <div v-if="userLoading">

                <b-card no-body>

                    <b-card-body class="text-center">

                        <b-skeleton-img no-aspect height="150px" class="mb-4"></b-skeleton-img>

                        <b-skeleton width="60%" class="mb-2 mx-auto"></b-skeleton>
                        <b-skeleton width="60%" class="mb-2 mx-auto"></b-skeleton>

                    </b-card-body>

                </b-card>

            </div>

        </div>

        <div v-if="isStudent">

            <div v-if="!classLoading">

                <div v-if="studentClassrooms.length != 0">

                    <b-card class="m-0" body-class="pb-0">

                        <h5 class="mb-4">{{ isTestCase ? 'Tes' : 'Kelas' }} Yang Telah Diikuti</h5>

                        <div class="row">
                            <div v-for="(item, index) in studentClassrooms" :key="index" class="col-12 col-lg-6">
                                <div class="card-class">
                                    <ItemClass
                                        :isLoaded="true"
                                        :classId="item?.id"
                                        :urlOnClick="`/dashboard/classroom/${ item?.slug }`"
                                        :urlImg="item?.logo ?? ''"
                                        :title="item?.name ?? ''"
                                        :description="item?.description ?? ''"
                                        :statusClass="item?.classState ?? null"
                                        :slug="item?.slug"
                                        :isMySelf="isMySelf"
                                        :userId="userDetail?.id"
                                        :userDetail="userDetail"
                                        :classProgram="item.program"
                                        :isAchievement="true"
                                        :hasRaport="item?.hasRaport"
                                        :isCertificateRelease="item?.certificateRelease"
                                        />
                                    </div>
                            </div>
                        </div>

                        <div v-if="moreLoading" class="row">
                            <div class="col-12 col-lg-6">
                                <div class="card-class">
                                    <ItemClass :isLoaded="false"/>
                                </div>
                            </div>
                            <div class="col-12 col-lg-6">
                                <div class="card-class">
                                    <ItemClass :isLoaded="false"/>
                                </div>
                            </div>
                        </div>

                    </b-card>

                    <card-pagination v-if="!moreLoading" :pagination="pagination" @pageChange="onPageChange"/>

                </div>

                <div v-else>

                    <b-card class="m-0">

                        <h5 class="mb-4">{{ isTestCase ? 'Tes' : 'Kelas' }} Yang Telah Diikuti</h5>
                        <span>{{ userKind == 'student' ? 'Anda' : 'Peserta' }} belum pernah menyelesaikan {{ isTestCase ? 'tes' : 'kelas' }}.</span>

                    </b-card>

                </div>

            </div>

            <div v-else>

                <b-card no-body>

                    <b-card-body class="text-center" body-class="pb-0">

                        <b-skeleton width="40%" class="mb-4"></b-skeleton>

                        <div class="row">
                            <div class="col-12 col-lg-6">
                                <div class="card-class">
                                    <ItemClass :isLoaded="false"/>
                                </div>
                            </div>
                            <div class="col-12 col-lg-6">
                                <div class="card-class">
                                    <ItemClass :isLoaded="false"/>
                                </div>
                            </div>
                        </div>

                    </b-card-body>

                </b-card>

            </div>

        </div>

        <b-modal id="modal-detail" center :title="modalTitle" size="lg" cancel-disabled hide-footer>

            <div class="text-center">

                <b-img-lazy v-if="modalImage != null" center fluid :src="modalImage" blank blank-color="#bbb"></b-img-lazy>

                <b-card-title v-else>Tidak Ada {{modalTitle}}</b-card-title>

            </div>

        </b-modal>

    </section>
</template>

<script>
import { mapState } from 'vuex'
import { capitalizeAllFirst } from "@/commons/utils"
import { ROLES_USERS_EN } from "@/commons/constants/users"

import CardProfile from "@/components/template/micro/card/User/Profile.vue"
import ItemClass from "@/components/template/micro/items/ItemClass.vue"
import Alert from '@/components/Alert.vue'

export default {
    layout: 'dashboard',

    components: {
        CardProfile,
        ItemClass,
        Alert,
    },

    props: {
        userId: {
            type: Number,
            default: -1
        },
        isStudent: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
            sassState: (state) => state.Sass,
            authState: (state) => state.Auth,
            userState: (state) => state.Users,
        })
    },

    data() {
        return {
            user: JSON.parse(localStorage.getItem('user')),
            userKind: localStorage.getItem('user_kind'),

            settings: null,

            isTestCase: false,
            isMySelf: false,
            taskLoading: true,
            classLoading: true,
            moreLoading: false,
            userLoading: true,

            userDetail: null,
            userRole: "",

            modalImage: null,
            modalTitle: '',

            listVariants: ['info', 'primary', 'danger', 'warning'],
            listFiles: [],
            studentTasks: [],
            studentClassrooms: [],
            classSelected: null,

            pagination: {
                page: 1,
                perPage: 4,
                totalItems: 0,
                totalPages: 0,
            },

            settings: null,
        }
    },

    created() {
      this.settings = this.sassState.settings;
    },

    mounted () {
        this.isTestCase = this.sassState.isTestCase;
        this.settings = this.sassState.settings;
        if (this.userId == this.user.id) this.isMySelf = true

        this.fetchUserDetail()
    },

    methods: {
        capitalizeAllFirst,

        async fetchUserDetail() {
            this.userLoading = true

            const url = this.$router.currentRoute.fullPath
            var res = url.split('/')
            res.shift()

            const userId = this.userId == -1 ? this.user.id : this.userId

            await this.$store.dispatch('Services/userDetail', userId)

            if(!this.servicesState.status) {
                console.error('Failed fetch user detail', this.servicesState.message)
                this.setEvent(this.servicesState.message, false)
                this.userLoading = false
            } else {
                this.userDetail = this.servicesState.data

                this.$emit('removeEvent')

                this.userLoading = false
                this.classLoading = true

                this.userRole = this.setUserRole(this.userDetail?.kind)

                if (this.isStudent) this.fetchStudentClass()
            }
        },

        async fetchStudentClass() {
            let params = {
                page: this.pagination.page,
                perPage: this.pagination.perPage,
                userId: this.userId == -1 ? this.user.id : this.userId
            }

            await this.$store.dispatch('Services/classroomsHistory', params)

            if(!this.servicesState.status) {

                console.error('Failed fetch user classrooms history: ', this.servicesState.message)
                this.setEvent(this.servicesState.message, false)
                this.classLoading = false
                this.moreLoading = false

            } else {

                this.$emit('removeEvent')

                this.studentClassrooms = this.servicesState.classrooms ?? []
                this.pagination = this.servicesState.pagination

                this.classLoading = false
                this.moreLoading = false

            }
        },

        setUserRole(kind) {
            const userRole = ROLES_USERS_EN.find((item) => item?.value === kind)
            return userRole?.label
        },

        onPageChange(page) {
            this.pagination.page = page
            this.moreLoading = true
            this.fetchStudentClass()
        },

        showModalDetail(data) {
            this.modalImage = data.url
            this.modalTitle = data.title

            this.$bvModal.show('modal-detail')
        },
        setEvent(message, status) {
            const data = {
                message: message,
                status: status
            }
            this.$emit('isEvent', data)
        }
    },
}
</script>