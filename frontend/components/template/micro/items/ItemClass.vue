<template>
    <div v-if="isLoaded" :class="`item-class ${ isAchievement ? 'achievement' : '' }`">

        <div class="item-header">

            <div class="box-badge d-flex align-items-start">

                <div class="d-flex align-items-start gap-3">
                    <div v-if="isListDraft" class="box-progress flex-wrap">
                        <p :class="`badge-progress badge-default`">Draft</p>
                    </div>
                    <div v-else-if="registered && !userState" class="box-progress flex-wrap">
                        <p :class="`badge-progress badge-orange`">Menunggu Persetujuan</p>
                    </div>
                    <div v-else-if="statusClassNew(statusClass)?.length != 0" class="box-progress flex-wrap" id="box-progress" ref="boxProgress"
                        @mousedown="isDragging = true" @mouseup="dragStop" @mousemove="dragging"
                        @touchstart="isDragging = true" @touchend="dragStop" @touchmove="dragging"
                    >

                        <p :class="`badge-progress badge-program`" v-if="!!classProgram">{{ classProgram }}</p>

                        <template v-if="!this.$route.fullPath.toLowerCase().includes('achievement')">
                            <template v-if="filterBy != 'myclass'">
                                <div v-for="(item, index) in statusClassNew(statusClass)" :key="index">
                                    <p :class="`badge-progress ${ item?.style }`">{{ item?.label }}</p>
                                </div>
                            </template>
                            <p v-else :class="`badge-progress badge-dark-blue`">Terdaftar</p>
                            <!-- <p v-if="!!classMode" :class="`badge-progress badge-default text-capitalize`">{{ classMode }}</p> -->
                        </template>
                    </div>

                    <div v-if="isCertificateRelease" class="wrapper-state rounded" :style="{backgroundColor: `${windowProperty?.getPropertyValue('--bs-primary')}33`}">
                        <i v-b-tooltip.hover.ds700.dh0 title="Bersertifikat" class="ri-award-line state-item text-primary"></i>
                    </div>
                </div>

                <b-dropdown v-if="withAction" no-caret variant="transparent" right size="sm" toggle-class="p-0" class="more-menu border rounded">
                    <template #button-content>
                        <i class="ri-more-line"></i>
                    </template>
                    <b-dropdown-item v-if="btnPublish" @click="$emit('onPublish')">
                        <i class="ri-volume-up-line"></i><span>Terbitkan Kelas</span>
                    </b-dropdown-item>
                    <b-dropdown-item @click="$emit('onEdit')">
                        <i class="ri-edit-line"></i><span>Edit</span>
                    </b-dropdown-item>
                    <b-dropdown-item @click="$emit('onDelete')">
                        <i class="ri-delete-bin-7-line text-danger"></i><span>Delete</span>
                    </b-dropdown-item>
                </b-dropdown>

            </div>

            <div class="box-img cursor-pointer" @click="$router.push(urlOnClick)">
                <nuxt-link :to="urlOnClick">
                    <img v-if="urlImg" :src="urlImg" alt="Logo Kelas" class="img-logo">
                    <h1 v-else class="title d-flex align-items-center gap-3">
                        <h1 class="title text-limit limit-1 mb-0">{{ title }}</h1>
                        <i class="ri-lock-2-line" v-if="visibility == 'private'"></i>
                    </h1>
                </nuxt-link>
            </div>

        </div>

        <div class="item-body cursor-pointer" @click="$router.push(urlOnClick)">
            <nuxt-link v-if="urlImg" :to="urlOnClick">
                <h1 class="title d-flex align-items-center gap-3">
                    <h1 class="title text-limit limit-1 mb-0">{{ title }}</h1>
                    <i class="ri-lock-2-line" v-if="visibility == 'private'"></i>
                </h1>
            </nuxt-link>
            <p :class="`description text-limit ${ urlImg ? 'limit-2' : 'limit-5' }`">{{ description }}</p>

            <!-- <div class="cities-container">
                <template v-for="(item, index) in classOverview?.heldCity">
                    <span :key="index" v-if="index < 5" class="badge-gray">{{ item?.name }}</span>
                </template>
                <span v-if="classOverview?.heldCity.length > 5" class="badge-gray pointer" @click="selectedObjectTags('Dilaksanakan di', classOverview?.heldCity)">Lihat Selengkapnya</span>
            </div> -->

            <div v-if="settings?.layout === 'sekolahbeta' && (classMode === 'offline' || classMode === 'hybrid')" class="cities-container">
                <template v-for="(item, idx) of heldCities">
                    <span :key="idx" v-if="idx < 2" class="badge-gray">{{ item }}</span>
                </template>
                <span v-if="heldCities?.length > 2" class="badge-gray pointer">+{{ heldCities?.length - 2 }}</span>
            </div>
        </div>

        <!-- Badge for Price -->
        <div v-if="classPrice > 0" class="badge-price">
            <span>{{ formatRupiah(classPrice) }}</span>
        </div>

        <div v-if="(dateStart || dateEnd) || listMentor.length > 0" class="divider"></div>

        <div v-if="!isAchievement && (!isAlwaysOpen || listMentor?.length != 0) || isPreparationClass" class="item-footer cursor-pointer" @click="$router.push(urlOnClick)">

            <template v-if="!isPreparationClass">

                <div v-if="listMentor && listMentor?.length != 0" class="box-user">

                    <div class="box-img">
                        <template v-for="(item, index) in listMentor">
                            <div v-if="index < 5" :key="index" class="img-container">
                                <img v-if="item?.photo" :src="item?.photo" alt="Profile Mentor" class="img-profile">
                                <h5 v-else class="name">{{ item?.name.charAt(0) }}</h5>
                            </div>
                        </template>
                    </div>

                    <div class="box-profile">

                        <h3 class="title text-limit">{{ mentorNames }}</h3>
                        <p class="name">Mentor</p>

                    </div>

                </div>

                <div v-if="!isAlwaysOpen" class="box-date">
                    <i class="far fa-calendar-check logo-calendar"></i>
                    <p class="date">{{ beautifyDate(dateStart, 'd-m') }} - {{ beautifyDate(dateEnd, 'd-m') }}</p>
                </div>
            </template>

            <template v-if="isPreparationClass">

                <div v-if="isPreparationClass" class="d-flex justify-content-between align-items-center" style="width: 100%">
                    <div class="box-user">
                        <template v-if="listMentor && listMentor?.length != 0" >
                            <div class="box-img">
                                <template v-for="(item, index) in listMentor">
                                    <div v-if="index < 3" :key="index" class="img-container">
                                        <img v-if="item?.photo" :src="item?.photo" alt="Profile Mentor" class="img-profile">
                                        <h5 v-else class="name">{{ item?.name.charAt(0) }}</h5>
                                    </div>
                                </template>
                            </div>

                            <div class="box-profile">
                                <h3 class="title text-limit">{{ mentorNames }}</h3>
                                <p class="name">Mentor</p>
                            </div>
                        </template>
                    </div>

                    <div class="d-flex justify-content-end">
                        <nuxt-link :to="urlOnClick">
                            <button class="btn btn-primary rounded-pill">Buka Kelas</button>
                        </nuxt-link>
                    </div>
                </div>
            </template>

        </div>

        <div v-if="isAchievement" class="item-achievement-footer d-flex gap-3 w-100">

            <b-card v-if="isCertificateRelease && hasRaport" class="box-item border rounded w-100 mb-0" body-class="d-flex justify-content-between align-items-center gap-3 p-0">
                <div class="box-title d-flex justify-content-center align-items-center w-100 gap-1 p-2" @click="openAchievement('raport')">
                    <i class="ri-file-paper-2-line"></i>
                    <span>Rapor</span>
                </div>
                <div class="box-action d-flex justify-content-center align-items-center border-left p-2" @click="openAchievement('raport')">
                    <i class="ri-download-line"></i>
                </div>
            </b-card>

            <b-card v-if="isCertificateRelease" class="box-item border rounded w-100 mb-0" body-class="d-flex justify-content-between align-items-center gap-3 p-0">
                <div class="box-title d-flex justify-content-center align-items-center w-100 gap-1 p-2" @click="openAchievement('certificate')">
                    <i class="ri-award-line"></i>
                    <span>Sertifikat</span>
                </div>
                <div class="box-action d-flex justify-content-center align-items-center border-left p-2" @click="openAchievement('certificate')">
                    <i class="ri-download-line"></i>
                </div>
            </b-card>

            <b-card v-if="!isCertificateRelease" class="box-item border rounded w-100 mb-0" body-class="d-flex justify-content-between align-items-center gap-3 p-0">
                <div class="box-title d-flex align-items-center text-left w-100 gap-1 p-2">
                    <span>Kelas ini tidak menerbitkan sertifikat</span>
                </div>
            </b-card>

        </div>

    </div>
    <div v-else class="">
        <b-skeleton type="avatar" class="mb-4"></b-skeleton>
        <b-skeleton width="100%"></b-skeleton>
        <b-skeleton width="100%"></b-skeleton>
        <b-skeleton width="60%"></b-skeleton>
    </div>
</template>

<script>
import { formatRupiah, statusClassNew, toDate } from '@/commons/utils/.'
import moment from 'moment'
import { mapState } from 'vuex'

export default {
    props: {
        withAction: {
            type: Boolean,
            default: false,
        },
        isAlwaysOpen: {
            type: Boolean,
            default: false,
        },
        isListDraft: {
            type: Boolean,
            default: false,
        },
        isLoaded: {
            type: Boolean,
            default: false,
        },
        isMySelf: {
            type: Boolean,
            default: false,
        },
        classId: {
            type: Number,
            default: -1,
        },
        userId: {
            type: Number,
            default: -1,
        },
        userDetail: {
            type: Object,
        },
        isAchievement: {
            type: Boolean,
            default: false,
        },
        isCertificateRelease: {
            type: String,
            default: "",
        },
        isTierOneActive: {
          type: Boolean,
          default: false,
        },
        urlOnClick: {
            type: String,
            default: "#!"
        },
        urlImg: {
            type: String,
            default: ""
        },
        title: {
            type: String,
            default: "Nama Kelas"
        },
        description: {
            type: String,
            default: ""
        },
        slug: {
            type: String,
            default: ""
        },
        dateStart: {
            type: String,
            default: "23 Feb - 30 Feb 2023"
        },
        dateEnd: {
            type: String,
            default: "23 Feb - 30 Feb 2023"
        },
        statusClass: {
            type: Object,
            default: () => null
        },
        filterBy: {
            type: String,
            default: ""
        },
        listMentor: {
            type: Array,
            default: () => null
        },
        btnPublish: {
            type: Boolean,
            default: false
        },
        registered: {
            type: Boolean,
            defaul: false
        },
        userState: {
            type: Number,
            default: 0
        },
        classProgram: {
            type: String,
            default: null
        },
        visibility: {
            type: String,
            default: 'public'
        },
        isPreparationClass: {
            type: Boolean,
            default: false
        },
        classMode: {
            type: String,
            default: ''
        },
        heldCities: {
            type: Array,
            default: () => []
        },
        classPrice: {
            type: Number,
            default: 0
        },
        hasRaport: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            mentorNames: "Jake Dulham & Emma Watson",
            userKind: localStorage.getItem('user_kind'),

            // Events
            isDragging: false,
            windowProperty: null,
        }
    },
    computed: {
        ...mapState({
            settings: (state) => state.Sass?.settings,
        }),
    },
    mounted(){
        this.generateMentorNames()
        this.windowProperty = window.getComputedStyle(document.body);
    },
    methods: {
        statusClassNew,
        toDate,
        formatRupiah,
        beautifyDate(date, format) {
            // moment.locale('id');
            return moment(date).format(format === 'd-m' ? 'DD MMM hh:mm A' :'DD MMM YYYY hh:mm A')
        },
        generateMentorNames() {
            if (this.listMentor && this.listMentor.length != 0) {

                this.mentorNames = ""

                this.listMentor.map((item, index) => {
                    if (this.listMentor.length < 2) {
                        this.mentorNames = item?.name
                    } else if (this.listMentor.length < 3) {
                        this.mentorNames += index == 0 ? item?.name : ` & ${ item?.name }`
                    } else {
                        if (index < 2) {
                            this.mentorNames += index == 0 ? item?.name : ` & ${ this.listMentor.length - 1 } Lainnya`
                        }
                    }
                })

            }
        },
        async openAchievement(kind) {
          if (this.isMySelf) this.$router.push(`/dashboard/profile/${kind}/${this.slug.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}/view/${this.classId}`)
          else this.$router.push({
              path: `/dashboard/students/${this.userDetail.name.toLowerCase().replace(/\s/g, '-')}/${kind}/${this.slug.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')}/view/${this.classId}`,
              query: {
                  id: this.userId,
              }
          })
        },

        dragging(e) {
            if(!this.isDragging) return;
            this.$refs.boxProgress.classList.add("dragging");
            this.$refs.boxProgress.scrollLeft -= e.movementX;
        },
        dragStop() {
            this.isDragging = false;
            this.$refs.boxProgress.classList.remove("dragging");
        }
    },
}
</script>

<style lang="scss" scoped>
.item-class ::v-deep {

    .wrapper-state{
        line-height: 0px;
        padding: 4.5px;

        .state-item{
            font-size: 20px;
            color: black;
            line-height: 1;
        }
    }

    &.achievement {
        min-height: 258px;
    }

    i {
        font-size: 16px;
    }

    .item-achievement-footer {
        .card-body {
            cursor: pointer;

            i {
                color: black;
            }
        }
    }

    .box-progress {
        overflow: scroll;
        cursor: grab;

        & {
            scrollbar-width: none;
            scrollbar-color: transparent transparent;
        }

        &::-webkit-scrollbar {
            height: 0;
        }

        &::-webkit-scrollbar-thumb {
            background-color: transparent;
        }

        &.dragging {
            user-select: none;
            scroll-behavior: auto;
        }
    }
    .badge-program {
        background-color: var(--bs-muted-primary);
        color: var(--bs-primary);
    }

    .cities-container {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 24px;

        .badge-gray {
            display: inline-block;
            white-space: nowrap;
            padding: 6px 12px;
            border-radius: 50px;
            background: #EBEBF0;
        }

    }
}
.title {
    .ri-lock-2-line {
        font-size: 18px;
    }
}
.badge-price {
    background-color: #f8d7da;
    color: #721c24;
    padding: 5px 10px;
    border-radius: 5px;
    font-weight: bold;
    margin-bottom: 10px;
    display: inline-block;
}
</style>