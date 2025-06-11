<template>
    <b-card body-class="d-flex align-items-center justify-content-between gap-3 p-3" :class="`card-event-item`">
        <div class="d-flex align-items-center gap-3 w-100" @click="$emit('toggleModal')">
            <i :class="`ri-checkbox-blank-circle-fill circle-${ item?.kind }`"></i>
            <div class="event-content">
                <h5 class="text-limit limit-1">{{ item?.kind === 'class' ? item?.className : item.name }}</h5>
                <div class="content-bottom">
                    <template>
                        <template v-if="convertDate(item?.startDate) === convertDate(item?.endDate) && item?.kind != 'assignment'">
                            <i class="ri-calendar-2-line"></i>
                            <span class="text-nowrap">{{ convertDate(item?.startDate) }}</span>
                        </template>
                        <template v-else>
                            <template v-if="item?.kind === 'assignment'">
                                <template v-if="item?.endDate">
                                    <i class="ri-calendar-2-line"></i>
                                </template>
                            </template>
                            <i v-else class="ri-calendar-2-line"></i>
                            <span v-if="item?.kind === 'assignment' && item?.endDate" class="text-nowrap">{{ convertDate(item?.endDate) }}</span>
                            <span v-else-if="item?.kind === 'meet'" class="text-nowrap">{{ convertDate(item?.startDate, "DD") }} - {{ convertDate(item?.endDate) }}</span>
                            <span v-else-if="item?.kind === 'class'" class="text-nowrap">{{ convertDate(item?.startDate, "DD MMM") }} - {{ convertDate(item?.endDate) }}</span>
                            <span v-else-if="item?.kind === 'announcement'" class="text-limit limit-1">{{ convertDate(item?.startDate) }} - {{ convertDate(item?.endDate) }}</span>
                        </template>
                    </template>
                    <template v-if="item?.kind == 'meet' || item?.kind == 'assignment'">
                        <i class="ri-stack-fill"></i>
                        <span class="text-limit limit-1">{{ item?.className }}</span>
                    </template>
                </div>
            </div>
        </div>
        <div class="event-action align-items-center" v-if="userKind == 'admin' || userKind == 'superadmin'">
            <template v-if="item?.kind === 'announcement'" >
                <b-button size="sm" variant="transparent" class="border border-rounded" @click="$router.push(editAction)"><i class="ri-edit-2-line"></i></b-button>
                <b-button size="sm" variant="transparent" class="border border-rounded" @click="$emit('toggleRemove')"><i class="ri-delete-bin-7-line text-danger"></i></b-button>
            </template>
            <span v-if="item?.kind === 'assignment' && item?.endDate" class="text-danger">{{ convertTime(item?.endDate) }}</span>
        </div>
    </b-card>
</template>

<script>
import moment from "moment"
import { capitalizeAllFirst } from "@/commons/utils"

export default {
    props: {
        item: {
            type: Object,
            default: () => null
        },
        editAction: {
            type: String,
            default: ""
        }
    },

    data() {
        return {
            userKind: localStorage?.getItem('user_kind') || null
        }
    },

    methods: {

        capitalizeAllFirst,

        convertDate(date, format = "DD MMM YYYY") {
            moment.locale('id')
            if (!date) return ''
            date = this.dateFilter(date)
            return moment(date).format(format)
        },

        convertTime(date) {
            date = this.dateFilter(date)
            date = moment(date).format("H.mm")
            return date
        },

        dateFilter(value) {
            if (value) {
                const splitDot = value.split(".");
                const splitZ = value.split("Z");
                if (splitDot.length > 1)
                    value = splitDot[0];
                else if (splitZ.length > 1)
                    value = splitZ[0];
            }
            return value;
        },

    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/components/schedules/micro/card-item.scss";
</style>