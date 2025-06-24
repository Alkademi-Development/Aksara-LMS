<template>
    <div :class="`modal-confirmation ${ centered ? 'centered' : '' }`">
        <h3 v-if="title" class="modal-title" v-html="title"></h3>
        <p v-if="onAlert?.isShow" :class="`text-${onAlert?.variant} alert-message`">{{ onAlert?.message }}</p>
        <div v-if="description" class="modal-description" v-html="description" @click="handleEventModal"></div>
        <b-form @submit.prevent="onSubmitForm">
            <b-form-group
                v-if="withForm"
                label="Masukkan Standar Kelulusan">
                <b-form-input
                    v-model="inputForm"
                    type="number"
                    min="0"
                    max="100"
                    required>
                </b-form-input>
            </b-form-group> 
            <b-form-group
                v-if="withCustomForm"
                :label="customLabelForm"
            >
                <b-form-textarea 
                    v-model="inputForm"
                    :type="customTypeForm"
                    :required="customRequiredForm"
                    :placeholder="customPlaceholderForm"
                    style="height: 150px;"
                ></b-form-textarea>
            </b-form-group>
            <div class="box-action">
                <b-button :hidden="btnNoHide" :variant="btnNoVariant" block :disabled="btnNoDisabled" @click="dEmit(false)">{{ btnNoTitle }}</b-button>
                <b-button v-if="withForm || withCustomForm" type="submit" :hidden="btnYesHide" :variant="btnYesVariant" block :disabled="btnYesDisabled">{{ btnYesTitle }}</b-button>
                <b-button v-else :hidden="btnYesHide" :variant="btnYesVariant" block :disabled="btnYesDisabled || isLoading" @click="dEmit(true)">
                    <div v-if="isLoading" class="d-flex align-items-center justify-content-center gap-2 loading-state">
                        <b-spinner class="align-middle"></b-spinner>
                        Loading...
                    </div>
                    <template v-else>{{ btnYesTitle }}</template>
                </b-button>
            </div>
        </b-form>
        <template v-if="!!footerMessage || footerMessage !== ''">
            <div class="footer pb-0" v-html="footerMessage"></div>
        </template>
    </div>
</template>

<script>
const ACTION_YES = 'actionYes'
const ACTION_NO = 'actionNo'

export default {
    props: {
        title: {
            type: String,
            default: ""
        },
        description: {
            type: String,
            default: ""
        },
        btnYesVariant: {
            type: String,
            default: "primary"
        },
        btnNoVariant: {
            type: String,
            default: "outline-gray"
        },
        btnYesDisabled: {
            type: Boolean,
            default: false
        },
        btnNoDisabled: {
            type: Boolean,
            default: false
        },
        btnYesHide: {
            type: Boolean,
            default: false
        },
        btnNoHide: {
            type: Boolean,
            default: false
        },
        btnYesTitle: {
            type: String,
            default: "Ya, Saya Yakin"
        },
        btnNoTitle: {
            type: String,
            default: "Tidak"
        },
        centered: {
            type: Boolean,
            default: false
        },
        withForm: {
            type: Boolean,
            default: false
        },
        footerMessage: {
            type: String,
            default: ''
        },
        isLoading: {
            type: Boolean,
            default: false,
        },
        onAlert: {
            type: Object,
            default: () => {},
        },
        withCustomForm: {
            type: Boolean,
            default: false
        },
        customLabelForm: {
            type: String,
            default: ''
        },
        customTypeForm: {
            type: String,
            default: ''
        },
        customRequiredForm: {
            type: String,
            default: ''
        },
        customPlaceholderForm: {
            type: String,
            default: ''
        }
    },

    data() {
        return {
            inputForm: "",
        }
    },

    methods: {
        dEmit(state) {
            return state ? this.$emit(ACTION_YES) : this.$emit(ACTION_NO)
        },
        onSubmitForm(event) {
            const params = {
                event: event,
                inputForm: this.inputForm
            }
            this.$emit('onSubmitForm', params) 
        },
        handleEventModal(event){
            event.preventDefault();
            const targetElement = event?.target;
            if(targetElement?.tagName?.toLowerCase() == 'a' && targetElement?.classList?.contains("nav-prasyarat")){
                const targetNavigation = targetElement?.getAttribute("href");
                this.$router.push(targetNavigation);
            }
        }
    }
}
</script>

<style lang="scss">
@import '@/assets/scss/components/micro/modal-confirmation.scss';

.danger-message {
    color: var(--bs-danger);
    
    font-weight: 500;
    font-size: 14px;
    line-height: 115%;    
    text-align: start;
}

.loading-state{
    span{
        width: 14px;
        height: 14px;
    }

    strong{
        color: white;
    }
}

.alert-message{
    margin-top: -14px;
    font-weight: 500;
}

</style>