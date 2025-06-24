<template>
    <div>
        <b-alert v-model="onEvent.show" :variant="onEvent.variant" dismissible class="mb-4">{{ onEvent.message }}</b-alert>

        <b-form v-if="!isGmeetCallback" @submit="onSubmitForm" @reset="onResetForm" class="row">

            <div class="col card-wrapper" >

                <b-card no-body>
                    <b-card-header class="border-0 pb-0">
                        <h5 class="mb-0 d-inline-block">Platform Video Conference</h5>
                    </b-card-header>

                    <div class="card-body">

                        <b-row>
                            <b-col>
                                <b-form-group
                                    label="Pilih Platform"
                                    :label-for="`checkbox-platform`"
                                >
                                    <SelectVideoConference
                                        :value="selectedPlatform"
                                        :isConfiguration="true"
                                        :hiddenItems="['manual']"
                                        isFromSettings
                                        @onChange="selectedPlatform = $event"
                                    />

                                </b-form-group>
                            </b-col>
                            <template v-if="isLoaded && selectedPlatform != null">

                                <b-col v-for="(input, index) in inputPlatform" :key="index" cols="12">
                                    <b-form-group
                                        v-if="input?.type !== 'file'"
                                        :label="input?.label"
                                        :label-for="input?.name"
                                        :description="input?.description">
                                        <b-form-input
                                            v-model="input.value"
                                            :id="input?.name"
                                            :value="input?.value"
                                            :type="input?.type"
                                            :placeholder="input?.placeholder"
                                            :required="input?.required"
                                            :disabled="input?.disabled"
                                            class="text-limit limit-1"
                                            autocomplete="off"
                                        ></b-form-input>
                                    </b-form-group>
                                    <b-form-group
                                        v-if="input?.type === 'file'"
                                        :label="input?.label"
                                        :label-for="input?.name"
                                        :description="input?.description">
                                        <b-form-file
                                            v-model="gmeetCredentials"
                                            :id="input?.name"
                                            :placeholder="input?.placeholder"
                                            :required="input?.required"
                                            :accept="input?.acceptedFile"
                                            drop-placeholder="Lepaskan file disini..."
                                            browse-text="Pilih"
                                        ></b-form-file>
                                    </b-form-group>
                                </b-col>

                            </template>
                            <b-col v-else-if="!isLoaded && selectedPlatform != null" cols="12" class="text-center">
                                <span>Sedang memuat...</span>
                            </b-col>
                        </b-row>

                    </div>
                </b-card>

            </div>

            <!-- <div v-if="isLoaded && selectedPlatform === 'gmeet'" class="col-12 col-lg-4 card-wrapper">
                <b-card no-body>
                    <b-card-header class="border-0 pb-0">
                        <h5 class="mb-0 d-inline-block">Upload Credential</h5>
                    </b-card-header>

                    <div class="card-body">

                        <b-row>
                            <template v-if="isLoaded && selectedPlatform != null">

                                <b-col v-for="(input, index) in inputPlatform" :key="index" cols="12">
                                    <b-form-group
                                        v-if="input?.type === 'file'"
                                        :label="input?.label"
                                        :label-for="input?.name"
                                        :description="input?.description">
                                        <b-form-file
                                            v-model="gmeetCredentials"
                                            :id="input?.name"
                                            :placeholder="input?.placeholder"
                                            :required="input?.required"
                                            :accept="input?.acceptedFile"
                                            drop-placeholder="Lepaskan file disini..."
                                            browse-text="Pilih"
                                        ></b-form-file>
                                    </b-form-group>
                                </b-col>

                            </template>
                        </b-row>

                    </div>
                </b-card>
            </div> -->

            <div v-if="isLoaded" class="col-lg-12 card-wrapper">
                <div class="card">
                    <div class="card-body">

                        <div class="row">
                            <div class="col-12 col-md-4 mb-3 mb-md-0 d-flex align-items-center">
                                <span>* Wajib Diisi</span>
                            </div>
                            <div class="col-12 col-md-8">
                                <div class="d-flex flex-wrap justify-content-left justify-content-md-end box-button">
                                    <b-button type="submit" :disabled="isSubmit" variant="primary">{{ isSubmit ? "Loading..." : "Simpan" }}</b-button>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>

        </b-form>

        <b-card v-else>
            <b-card no-body class="mb-0">
                <div class="card-body d-flex align-items-center justify-content-center gap-3">
                    <b-spinner label="Spinning"></b-spinner>
                    <span>Menyimpan Pengaturan Google Meet...</span>
                </div>
            </b-card>
        </b-card>

        <b-modal v-model="isConfirmModal" body-class="p-0" size="md" hide-header hide-footer centered>
            <ModalConfirmation
                title="Peringatan!"
                description="Apakah anda yakin akan mengubah pengaturan website?"
                btnYesVariant="primary"
                btnNoVariant="outline-primary"
                centered
                @actionYes="fetchPost"
                @actionNo="toggleConfirmModal"/>
        </b-modal>

        <b-modal v-model="isAlertModal" body-class="p-0" size="md" hide-header hide-footer centered no-close-on-esc no-close-on-backdrop>
            <ModalConfirmation
                title="Peringatan!"
                description="Muat ulang website untuk menerapkan perubahan"
                btnYesVariant="primary"
                btnNoVariant="outline-primary"
                btnYesTitle="Muat Ulang Sekarang"
                btnNoTitle="Nanti"
                centered
                @actionNo="toggleAlertModal"
                @actionYes="toggleAlertModal('refresh')"/>
        </b-modal>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import settingsForm from '@/store/global/sass-settings';

import ModalConfirmation from "@/components/template/micro/modal/ModalConfirmation.vue";
import SelectVideoConference from '@/components/template/micro/inputs/SelectVideoConference.vue'

export default {
    layout: 'dashboard',

    components: { ModalConfirmation, SelectVideoConference },

    data() {
        return {

            isLoaded: true,
            isSubmit: false,
            isConfirmModal: false,
            isAlertModal: false,
            isGmeetCallback: false,

            selectedPlatform: null,

            gmeetCredentials: null,
            gmeetCallbackCode: null,
            inputPlatform: [],
            output: {},

            onEvent: {
                message: '',
                status: true,
                show: false,
                variant: ''
            },

            redirectUri: '/dashboard/settings'

        }
    },

    computed: {
        ...mapState({
            sassState: (state) => state?.Sass,
            settings: (state) => state?.Sass?.settings,
        })
    },

    created() {
        const __gmeetCallbackCode = this.$route?.query?.code
        if (__gmeetCallbackCode) {
            this.isGmeetCallback = true
            this.gmeetCallbackCode = __gmeetCallbackCode
        }

        if (this.isGmeetCallback) this.processGmeetCallbak()
        else {
            if (this.settings?.meetType) this.selectedPlatform = this.settings?.meetType
            this.getCredentials()
        }
    },

    watch: {
        selectedPlatform() {
            this.getCredentials()
        }
    },

    methods: {
        ...mapActions({
            allSettings: "Sass/allSettings",
            zoomSettings: "Sass/zoom",
            updateZoomSettings: "Sass/updateZoom",
            gmeetSettings: "Sass/gmeet",
            uploadGmeetCredentials: "Sass/uploadGmeetCredentials",
            updateGmeetSettings: "Sass/updateGmeet",
        }),

        setEvent(message, status){
            window.scrollTo(0,0)
            this.onEvent.message = message
            this.onEvent.status = status
            this.onEvent.variant = status == true ? 'success' : 'warning'
            this.onEvent.show = true
        },

        getCredentials() {
            this.isLoaded = false
            if (this.selectedPlatform !== null) {
                if (this.selectedPlatform === 'zoom') {
                    this.isLoaded = false
                    this.zoomSettings().then(() => {
                        if (!this.sassState?.status) {
                            this.isLoaded = false
                            return this.setEvent(this.sassState?.message, false)
                        } else {
                            this.output = this.sassState?.data ?? null
                            this.setupFormValue(this.output, this.selectedPlatform)

                            this.isLoaded = true        
                        }
                    })
                } else if (this.selectedPlatform === 'gmeet') {
                    this.gmeetSettings().then(() => {
                        if (!this.sassState?.status) {
                            this.isLoaded = false
                            return this.setEvent(this.sassState?.message, false)
                        } else {
                            this.output = this.sassState?.data ?? null

                            this.setupFormValue(this.output, this.selectedPlatform)
                            this.isLoaded = true
                        }
                    })
                }
            }
        },

        setupFormValue(itemObject, platform) {

            if (itemObject) {
                if (platform === 'zoom') this.inputPlatform = settingsForm?.inputZoomPlatform
                else if (platform === 'gmeet') this.inputPlatform = settingsForm?.inputGmeetPlatform

                Object.keys(itemObject).map(item => {
                    const findIndex = this.inputPlatform?.findIndex(input => input?.name === item)
                    if (findIndex != -1) this.inputPlatform[findIndex].value = itemObject[item]
                })
            }

        },
        
        onSubmitForm(event) {
            event.preventDefault();

            this.inputPlatform?.map(item => {
                this.output[item?.name] = item?.value
            })
            if (this.selectedPlatform === 'gmeet') {
                this.output['credential'] = this.gmeetCredentials
                const formData = new FormData()
                Object.keys(this.output).map(item => {
                    formData.append(item, this.output[item])
                })
                this.output = formData
            }

            this.toggleConfirmModal()
        },

        fetchPost() {
            this.toggleConfirmModal()
            this.isSubmit = true

            if (this.selectedPlatform === 'zoom') {
                this.updateZoomSettings(this.output).then(() => {
                    setTimeout(() => {
                        if (!this.sassState.status) this.setEvent(this.sassState.message, false)
                        else {
                            this.setEvent("Berhasil mengubah pengaturan", true)
                            this.toggleAlertModal()
                        }
                        this.isSubmit = false
                    }, 500);
                })
            } else if (this.selectedPlatform === 'gmeet') {
                const payload = {
                    redirectUri: window.location.origin + this.redirectUri + '/gmeet',
                    // redirectUri: 'https://dev.alkademi.id/dashboard/settings/gmeet',
                    params: this.output
                }
                this.uploadGmeetCredentials(payload).then(() => {
                    if (!this.sassState?.status) this.setEvent(this.sassState?.message, false)
                    else {
                        window.open(this.sassState?.data, "_self")
                        // this.isSubmit = false
                    }
                })
            }
        },

        processGmeetCallbak() {
            const params = {
                code: this.gmeetCallbackCode,
                redirectUri: window.location.origin + this.redirectUri + '/gmeet',
                // redirectUri: 'https://dev.alkademi.id/dashboard/settings/gmeet',
            }
            this.updateGmeetSettings(params).then(() => {
                if (!this.sassState.status) {
                    this.setEvent(this.sassState.message, false)
                    setTimeout(() => {
                        this.$router.replace(this.redirectUri)
                    }, 1000);
                } else {
                    this.setEvent("Berhasil mengubah pengaturan", true)
                    setTimeout(() => {
                        this.allSettings({version: 'v0'}).then(() => {
                            this.$router.replace(this.redirectUri)
                        })
                    }, 500);
                }
            })
        },

        onResetForm() {
            this.inputPlatform?.map((item, index) => {
                this.inputPlatform[index].value = ""
            })
            this.output = {}
        },

        toggleConfirmModal() {
            this.isConfirmModal = !this.isConfirmModal
        },

        toggleAlertModal(event) {
            this.isAlertModal = !this.isAlertModal

            if (event) {
                return window?.location?.replace(window?.location?.origin + this.redirectUri)
            }

            if (!this.isAlertModal) {
                if (this.isGmeetCallback) {
                    this.$router.replace(this.redirectUri)
                }
            }
        }
    },

    destroyed() {
        this.onResetForm()
    }

}
</script>

<style lang="scss" scoped>
::v-deep .color-input {
    height: 100% !important;
    width: 40px;
    aspect-ratio: 1/1;
}
</style>