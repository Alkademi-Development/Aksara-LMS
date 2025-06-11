<template>
    <b-modal 
        v-model="isModalOpen" 
        size="md" 
        centered 
        hide-header 
        hide-footer 
    >
        <template v-if="!isLoading">
            <CardProfile
                :detailUrl="`/dashboard/students/${ item?.name?.toLowerCase() }/?id=${item?.id}`"
                :photo="item?.photo"
                :name="item?.name"
                :email="item?.email"
                :phone="item?.phone"
                :linkedIn="item?.linkedIn"
                :github="item?.github"
                isPreview
                class="m-0"
                bodyClass="p-0"
                @onDetailClick="onDetailClick(item)"
            />
    
            <hr class="my-3">
    
            <h5 class="mb-3">Informasi Lainnya</h5>
    
            <b-row
                v-for="(item, index) in item?.requirements"
                :key="index"
                no-gutters
                align-v="center" class="box-contact-vertical">
                    <b-col cols="3" class="d-flex align-items-center gap-2">
                        <i :class="`${ item?.icon } text-darker`"></i>
                        <span class="title mr-2">{{ item?.title }}</span>
                    </b-col>
                    <b-col>
                        <b-card v-if="isValidUrl(item?.value)" class="mb-0" body-class="p-2">
                            <a :href="item?.value" class="text-limit limit-1" target="_blank">{{ item?.value }}</a>
                        </b-card>
                        <b-card v-else class="mb-0" body-class="p-2">
                            <span>{{ item?.value }}</span>
                        </b-card>
                    </b-col>
            </b-row>
        </template>

        <!-- Loading State -->
        <template v-else>
            <div class="d-flex flex-column align-items-center justify-content-center">
                <b-skeleton type="avatar" width="60px" height="60px" class="mb-4"></b-skeleton>
                <b-skeleton width="20%" class="mb-4"></b-skeleton>
                <div class="d-flex align-items-center justify-content-center gap-5">
                    <b-skeleton width="30px"></b-skeleton>
                    <b-skeleton width="30px"></b-skeleton>
                    <b-skeleton width="30px"></b-skeleton>
                </div>
                <hr class="my-3 w-100" style="height: 1px;">
                <div class="w-100 mb-3">
                    <b-skeleton width="30%"></b-skeleton>
                </div>
                <div class="d-flex flex-column gap-2 w-100">
                    <div v-for="index in 3" :key="`empty-${index}`" class="d-flex align-items-center gap-3">
                        <b-skeleton width="20%"></b-skeleton>
                        <b-skeleton width="80%"></b-skeleton>
                    </div>
                </div>
            </div>
        </template>

    </b-modal>
</template>

<script>
import CardProfile from "@/components/template/micro/card/User/Profile.vue"

import { toEncrypt } from '~/commons/utils'

export default {
    props: {
        onOpenModal: {
            type: Boolean,
            default: false
        },
        item: {
            type: Object,
            default: () => null
        }
    },

    components: { CardProfile },

    data() { return { isModalOpen: false } },

    watch: {
        onOpenModal() {
            this.isModalOpen = this.onOpenModal
        },
        isModalOpen() {
            if (!this.isModalOpen) this.$emit('toggleModal')
        }
    },

    methods: {

        isValidUrl(string) {
            const regex = /^(ftp|http|https):\/\/[^ "]+$/;
            return regex.test(string);
        },
        
        onDetailClick(item) {
            localStorage.setItem('userId', toEncrypt(item?.id))
            this.$router.push({
                path: `/dashboard/students/${ item?.name.toLowerCase().replace(/\s/g, '-') }`,
            })
        }

    },
    
    destroyed() {
        this.isModalOpen = false
    }
}
</script>

<style lang="scss" scoped>
.mb-3 {
    margin-bottom: 12px !important;
}

.my-3 {
    margin: 12px 0 !important;
}

h5, i {
    font-size: 14px !important;
}

.box-contact-vertical {

    &.row {
        margin-bottom: 12px;
        &:last-child {
            margin-bottom: 0;
        }
    }

    .title {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 15px;
        color: rgba(0, 0, 0, 0.5);
    }

    .card {
        background-color: #FBFBFB;
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 17px;
        color: #000000;
        box-shadow: none;
        span {
            word-break: break-all;
        }
        a {
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            line-height: 17px;
            color: #000000;
            word-break: break-all;
            &:hover {
                color: var(--bs-primary) !important;
            }
        }
    }

}
</style>