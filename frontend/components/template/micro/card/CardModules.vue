<template>
    <b-card no-body>
        <b-card-body>

            <b-row align-v="start" class="align-items-stretch">

                <!-- Left Content -->
                <b-col class="mb-3 mb-lg-0">
                    
                    <div class="d-flex align-items-center">
                        <b-card-title class="m-0 mr-2">{{ item?.title != '' ? item?.title : 'Untitled' }}</b-card-title>
                        <i v-if="item?.submitted_at" class="fas fa-check-circle text-success"></i>
                    </div>

                    <h5 v-if="isAssignment" class="text-muted mb-2">{{ toDate(item?.created_at) }} &bull; {{ item?.moduleName }}</h5>

                    <div v-if="item?.kind == 'assignment'" class="d-flex flex-wrap align-items-center">

                        <div v-if="item?.deadline" :class="['d-flex align-items-center', 'mb-2 mb-md-0 mr-2', `badge badge-b-red`]">

                            <span>Deadline {{ toDateTimes(item?.deadline, 'd-m') }}</span>

                        </div>

                        <div v-if="item?.type != 'link' && (item?.externalData?.questions || item?.externalData?.timer)" :class="['d-flex align-items-center', 'mb-2 mb-md-0 mr-2', `badge badge-b-orange`]">

                            <span v-if="item?.externalData?.timer" class="mr-2"><i class="fas fa-clock"></i> {{item?.externalData?.timer}} Menit</span>
                            <span v-if="item?.type == 'form' && item?.externalData?.questions">{{item?.externalData?.questions}} Soal</span>

                        </div>

                        <span :class="['mb-2 mb-md-0 mr-2', `badge badge-${generateBadge(item?.type)}`]">{{item?.type == 'studio' ? 'Coding Studio' : item?.type == 'form' ? 'Formulir' : item?.type == 'link' ? 'Link' : ''}}</span>

                    </div>

                </b-col>

                <!-- Right Content -->
                <b-col cols="12" lg="4" class="d-flex flex-column align-items-start align-items-lg-end">

                    <small v-if="userKind != 'student' && isAssignment" class="d-block mb-1"><strong class="text-primary">{{item?.scored}} / {{item?.totalStudent}}</strong> Peserta dinilai</small>

                    <!-- Handling Wording Button & Action -->
                    <b-button v-if="isClassEnded && isAssignment && userKind == 'student'" pill variant="primary" class="mr-0" disabled>Terkunci</b-button>
                    <b-button v-else-if="!isAssignment" pill variant="primary" class="mr-0" @click="onClickEvent">Buka Modul</b-button>
                    <b-button v-else-if="userKind == 'student' && item?.isDeadline" pill variant="primary" class="mr-0" disabled>Kadaluarsa</b-button>
                    <b-button v-else-if="userKind == 'student' && item?.submitted_at && title == 'tes'" pill variant="primary" class="mr-0" disabled>Sudah Dikerjakan</b-button>
                    <b-button v-else pill variant="primary" class="mr-0" @click="onClickEvent">{{ title == 'tes' && userKind == 'student' ? 'Kerjakan' : 'Buka' }} {{ title == 'tes' ? 'Tes' : 'Tugas' }}</b-button>
                    

                </b-col>
            </b-row>

            <!-- Absolute Content Dropdown -->
            <div v-if="userKind != 'student' && isAssignment" class="module-settings dropdown">

                <!-- Menu Button -->
                <button class="btn btn-no-styles dropdown-toggle p-2 m-0" data-toggle="dropdown" id="moduleDropdown">
                    <i class="fas fa-ellipsis-vertical"></i>    
                </button>

                <!-- Dropdown Item -->
                <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="moduleDropdown">
                    <li>
                        <div class="dropdown-header">
                            <h6 class="m-0">{{ item?.title }}</h6>
                        </div>
                    </li>
                    <li>
                        <nuxt-link :to="`/dashboard/classroom/assignments/${classroomId}/edit/${item.id}`" class="dropdown-item">
                            <i class="fas fa-pen"></i>    
                            <span>Edit</span>
                        </nuxt-link>
                    </li>
                    <li>
                        <div class="dropdown-divider"></div>
                    </li>
                    <li>
                        <a href="#!" class="dropdown-item" @click="$emit('onDelete', item)">
                            <i class="fas fa-trash"></i>    
                            <span>Delete</span>
                        </a>
                    </li>
                </ul>
            </div>
            
        </b-card-body>
    </b-card>
</template>

<script>
import { toDateTimes, toDate } from '@/commons/utils/.'

export default {

    methods: {
        toDateTimes,
        toDate,
        generateBadge(type) {
            return type == 'studio' ? 'danger' : type == 'form' ? 'warning' : 'info'
        },
        onClickEvent () {
            this.$router.push(`/dashboard/${this.title}/${this.classroomId}/course/${this.courseId}/module/${this.item.id}`);
        }
    },

    props: {
        item: Object,
        isClassEnded: Boolean,
        userKind: String,
        classroomId: Number,
        courseId: Number,
        isAssignment: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: ""
        },
    },
}
</script>
<style scoped>
.dropdown-toggle::after {
    display: none !important;
}
.module-settings {
    position: absolute;
    top: 0;
    right: 0;
}
</style>