<template>
    <div class="item-review">

        <template v-if="!isEmpty">

            <template v-if="!isLoading">
                <div class="box-title d-flex align-items-center mb-3">
                    <h5 class="title text-limit limit-1 mr-2">{{ assignment?.title }}</h5>
                    <div class="badge badge-default badge-status" @click="onClickBadge">
                        <i class="ri-file-list-line"></i>
                        <span>{{ assignment?.moduleName }}</span>
                    </div>
                </div>

                <div class="box-assignment-kind">
                    <span :class="`title ${ assignment?.type } mr-2`">{{ assignment?.type }}</span>
                    <span v-if="assignment?.type == 'form'" class="question-time">{{ assignment?.externalData?.timer ? `${assignment?.externalData?.timer} Menit` : '' }} {{ assignment?.externalData?.questions ? `${assignment?.externalData?.questions} Soal` : '' }}</span>
                </div>

                <div class="divider my-3"></div>

                <div class="box-information">
                    <div class="count-scored">
                        <i v-if="assignment?.scored === assignment?.totalStudent" class="ri-checkbox-circle-fill mr-2"></i>
                        <span>Tugas diperiksa</span>
                        <strong class="ml-1">({{ assignment?.scored }}/{{ assignment?.totalStudent }})</strong>
                    </div>
                    <div v-if="assignment?.deadline" class="calendar">
                        <i class="ri-calendar-2-line mr-2"></i>
                        <span>{{ toDateTimes(assignment?.deadline, 'd-m') }}</span>
                    </div>
                </div>
            </template>

            <template v-else>
                <div class="box-title d-flex align-items-center mb-3">
                    <b-skeleton width="100%"></b-skeleton>
                </div>

                <div class="box-assignment-kind">
                    <b-skeleton width="30%"></b-skeleton>
                </div>

                <div class="divider my-3"></div>

                <div class="box-information">
                    <b-skeleton width="30%"></b-skeleton>
                    <b-skeleton width="30%"></b-skeleton>
                </div>
            </template>

        </template>

        <template v-else>
            <div class="text-center w-100"><span class="text-muted">Belum ada tugas untuk di review</span></div>
        </template>

    </div>
</template>

<script>
import { toDateTimes } from "@/commons/utils/index.js";

export default {
    props: {
        isLoading: {
            type: Boolean,
            default: false
        },
        isEmpty: {
            type: Boolean,
            default: false
        },
        assignment: {
            type: Object,
            default: () => null
        }
    },
    methods: {
        toDateTimes,
        onClickBadge() { this.$emit('onClickBadge', this.assignment) }
    }
}
</script>