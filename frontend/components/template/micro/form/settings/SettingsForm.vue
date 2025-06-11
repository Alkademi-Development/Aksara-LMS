<template>
    <b-form @submit="onSubmitForm" @reset="onResetForm" class="row">

        <div v-if="!isLoaded" class="col-lg-12 card-wrapper" >
            <b-card no-body>
                <div class="text-center card-body">
                    <b-spinner label="Spinning"></b-spinner>
                </div>
            </b-card>
        </div>

        <div v-if="isLoaded" class="col-lg-8 card-wrapper" >

            <b-card no-body>
                <b-card-header class="border-0 pb-0">
                    <h5 class="mb-0 d-inline-block">Meta SEO</h5>
                </b-card-header>
                <div class="card-body">

                    <b-alert 
                        v-model="onEvent.show"
                        :variant="onEvent.variant"
                        dismissible
                    >
                        {{ onEvent.message }}
                    </b-alert>

                    <b-row>
                        <template v-for="(input, index) in inputMetaForm">

                            <b-col :key="index" cols="12">
                                <b-form-group
                                    v-if="!['textarea', 'select', 'file', 'checkbox', 'radio', 'date', 'time', 'range', 'password'].includes(input.type)"
                                    :label="input.label"
                                    :label-for="input.name"
                                    :description="input.description"
                                >
                                    <b-form-input
                                        v-model="input.value"
                                        :id="input.name"
                                        :value="input.value"
                                        :type="input.type"
                                        :placeholder="input.placeholder"
                                        :required='input.required'
                                        autocomplete="off"
                                    ></b-form-input>
                                </b-form-group>

                                <b-form-group
                                    v-if="input.type === 'textarea'"
                                    :label="input.label"
                                    :label-for="input.label"
                                    :description="input.description"
                                >
                                    <b-form-textarea
                                        v-model="input.value"
                                        :id="input.label"
                                        :value.sync="input.value"
                                        :type="input.type"
                                        :placeholder="input.placeholder"
                                        :required='input.required'
                                        :disabled='input.disabled'
                                        rows="4"
                                    ></b-form-textarea>
                                </b-form-group>

                                <b-form-group
                                    v-if="input.type === 'file'"
                                    :description="input?.description">
                                    <Dropzone
                                        v-model="input.value"
                                        :filedir="`settings/${settings?.layout ?? ''}`"
                                        :acceptedFiles="input?.acceptedFiles"
                                        :dropzoneId="`class-${input.name}`"
                                        :label="input.label"
                                        :disabled="input.disabled"
                                        :value="input.value"
                                        :noBodyPreview="false"
                                        @remove="input.value = null"/>
                                </b-form-group>
                                <b-form-group
                                    v-if="input.type === 'radio'"
                                    :label="input.label"
                                    :description="input.description"
                                >
                                    <b-form-radio-group
                                        v-model="input.value"
                                        :value.sync="input.value"
                                        :options="input.options"
                                        :label="input.label"  :required='input.required'
                                        :unchecked-value="false"
                                    ></b-form-radio-group>
                                </b-form-group>
                            </b-col>

                        </template>
                    </b-row>

                </div>
            </b-card>

            <b-card no-body v-if="isLoaded">
                <b-card-header class="border-0 pb-0">
                    <h5 class="my-1 d-inline-block">Logo</h5>
                </b-card-header>
                <div class="card-body">
                    <b-row>
                        <template v-for="(input, index) in inputLogoForm">

                            <b-col :key="index" cols="12">
                                <b-form-group
                                    v-if="input.type != 'textarea' && input.type != 'select' && input.type != 'file'"
                                    :label="input.label"
                                    :label-for="input.name"
                                    :description="input.description"
                                >
                                    <b-form-input
                                        v-model="input.value"
                                        :id="input.name"
                                        :value="input.value"
                                        :type="input.type"
                                        :placeholder="input.placeholder"
                                        :required='input.required'
                                        autocomplete="off"
                                    ></b-form-input>
                                </b-form-group>

                                <b-form-group
                                    v-if="input.type === 'file'"
                                    :description="input?.description">
                                    <Dropzone
                                        v-model="input.value"
                                        :filedir="`settings/${settings?.layout ?? ''}`"
                                        :acceptedFiles="input?.acceptedFiles"
                                        :dropzoneId="`class-${input.name}`"
                                        :label="input.label"
                                        :disabled="input.disabled"
                                        :value="input.value"
                                        :noBodyPreview="false"
                                        @remove="input.value = null"/>
                                </b-form-group>
                            </b-col>
                            
                        </template>
                    </b-row>
                </div>
            </b-card>

        </div>
        <div v-if="isLoaded" class="col-lg-4 card-wrapper">
            <b-row>
                <b-col cols="12">
                    <b-card no-body v-if="isLoaded">
                        <b-card-header class="border-0 pb-0">
                            <h5 class="my-1 d-inline-block">Style</h5>
                        </b-card-header>
                        <div class="card-body">
                            <b-row>
                                <template v-for="(input, index) in inputCssForm">

                                    <b-col :key="index" cols="12">
                                        <b-form-group
                                            v-if="input.type != 'textarea' && input.type != 'file'"
                                            :label="input.label"
                                            :label-for="input.name"
                                            :description="input.description"
                                        >
                                            <b-form-checkbox
                                                v-if="input.type === 'checkbox' && input.name === 'isCustomAuth'"
                                                v-model="input.value"
                                                switch
                                                size="lg"
                                                :id="input.name"
                                                :name="input.name"
                                                :required="input.required"
                                                :value="true"
                                                :unchecked-value="false"
                                            > 
                                                <p class="mb-0">{{ input.value ? 'Active' : 'Disable' }}</p>
                                            </b-form-checkbox>
                                            <SearchSelect
                                                v-if="input?.type === 'select'"
                                                class="w-100"
                                                :items="fonts"
                                                :text="input?.value?.label"
                                                :placeholder="input?.placeholder"
                                                :actionVariant="'outline-primary'"
                                                @onChange="input.value = $event"
                                                :id="`select-${ input?.name }`"/>
                                            <b-form-input
                                                v-if="input?.type === 'color'"
                                                v-model="input.value"
                                                :id="input.name"
                                                :value="input.value"
                                                :type="input.type"
                                                :placeholder="input.placeholder"
                                                :required='input.required'
                                                autocomplete="off"
                                                class="color-input"
                                            ></b-form-input>
                                            <!-- <small v-if="input.name === 'ft_primary' || input.name === 'ft_secondary'" class="form-text text-muted">
                                                * Gunakam font yang ada di
                                                <a href="https://fonts.google.com/" target="_blank" class="text-primary" style="font-size: inherit; word-break: break-all;">https://fonts.google.com/</a>
                                            </small> -->
                                        </b-form-group>
                                    </b-col>

                                </template>
                            </b-row>
                        </div>
                    </b-card>
                </b-col>
                <b-col cols="12">
                    <b-card no-body v-if="isLoaded">
                        <b-card-header class="border-0 pb-0">
                            <h5 class="my-1 d-inline-block">Kelas</h5>
                        </b-card-header>
                        <div class="card-body">
                            <b-row>
                                <template v-for="(input, index) in inputClassForm">
                                    <b-col :key="index" cols="12">
                                        <b-form-group
                                            class="mb-0"
                                            v-if="input.type === 'checkbox' && input.name === 'isLevelingCase'"
                                            :label="input.label"
                                            :label-for="input.name"
                                            :description="input.description"
                                        >
                                            <b-form-checkbox
                                                v-model="input.value"
                                                switch
                                                size="lg"
                                                :id="input.name"
                                                :name="input.name"
                                                :required="input.required"
                                                :value="true"
                                                :unchecked-value="false"
                                            > 
                                                <p class="mb-0">{{ input.value ? 'Active' : 'Disable' }}</p>
                                            </b-form-checkbox>
                                        </b-form-group>
                                    </b-col>

                                </template>
                            </b-row>
                        </div>
                    </b-card>
                </b-col>
                <b-col cols="12">
                    <b-card no-body v-if="isLoaded">
                        <b-card-header class="border-0 pb-0">
                            <h5 class="my-1 d-inline-block">Lainnya</h5>
                        </b-card-header>
                        <div class="card-body">
                            <b-row>
                                <template v-for="(input, index) in inputOtherForm">

                                    <b-col :key="index" cols="12">
                                        <b-form-group
                                            v-if="input.type != 'textarea' && input.type != 'file'"
                                            :label="input.label"
                                            :label-for="input.name"
                                            :description="input.description">
                                            <b-form-input
                                                v-model="input.value"
                                                :id="input.name"
                                                :value="input.value"
                                                :type="input.type"
                                                :placeholder="input.placeholder"
                                                :required='input.required'
                                                autocomplete="off"
                                            ></b-form-input>
                                        </b-form-group>
                                    </b-col>

                                </template>
                            </b-row>
                        </div>
                    </b-card>
                </b-col>
            </b-row>
        </div>

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
        
    </b-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import settingsForm from '@/store/global/sass-settings';

import ModalConfirmation from "@/components/template/micro/modal/ModalConfirmation.vue";
import SearchSelect from '@/components/template/micro/inputs/SearchSelect.vue'

export default {
    layout: 'dashboard',

    components: { ModalConfirmation, SearchSelect },

    data() {
        return {
            // robot: {
            //     index: '',   // isinya nanti 'index' atau 'noindex'
            //     follow: ''   // isinya nanti 'follow' atau 'nofollow'
            // },

            isLoaded: true,
            isSubmit: false,
            isConfirmModal: false,
            isAlertModal: false,

            inputLogoForm: [],
            inputMetaForm: [],
            inputCssForm: [],
            inputClassForm: [],
            inputOtherForm: [],
            output: {},

            // Web Fonts Api Key
            apiKey: 'AIzaSyDS2HpD5yvQDoEg6XL95_Az2a-Zam1wg4I',
            fonts: [],
            selectedFont: null,

            onEvent: {
                message: '',
                status: true,
                show: false,
                variant: ''
            },

        }
    },

    computed: {
        ...mapState({
            sassState: (state) => state?.Sass,
            settings: (state) => state?.Sass?.settings,
        })
    },

    created() {
        this.getCredentials()
    },

    methods: {
        ...mapActions({
            allSettings: "Sass/allSettings",
            updateSettings: "Sass/editAllSettings",
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

            this.allSettings({version: "v0"}).then(() => {
                if (!this.sassState?.status) {
                    this.isLoaded = false
                    return this.setEvent(this.sassState?.message, false)
                } else {
                    this.inputLogoForm = settingsForm?.inputLogoForm
                    this.inputMetaForm = settingsForm?.inputMetaForm
                    this.inputCssForm = settingsForm?.inputCssForm
                    this.inputClassForm = settingsForm?.inputClassForm
                    this.inputOtherForm = settingsForm?.inputOtherForm


                    this.output = this.settings

                    this.setupFormValue(this.output)
                    this.fetchFonts()
                }
            })
        },

        setupFormValue(itemObject) {
            // Form Basic Input
            Object.keys(itemObject).map(item => {
                if (item === 'logo_dark' || item === 'logo_light' || item === 'favicon') {
                    const findIndex = this.inputLogoForm?.findIndex(input => input?.name === item)
                    if (findIndex != -1) this.inputLogoForm[findIndex].value = itemObject[item]
                }
            })

            // Form Meta Input
            Object.keys(itemObject?.meta).map(item => {
                if (item === 'name' || item === 'description' || item === 'keywords') {
                    const findIndex = this.inputMetaForm?.findIndex(input => input?.name === item)
                    if (findIndex != -1) this.inputMetaForm[findIndex].value = itemObject.meta[item]
                }

                // Handle robot_index
                if(item === 'robot_index'){
                    const robotValues = itemObject.meta[item]
                    ? itemObject.meta[item]?.split(',').map(val => val.trim()) : []; // Default to empty array if null

                    const indexValue = robotValues.includes('index') ? 'index' : 'noindex';
                    const followValue = robotValues.includes('follow') ? 'follow' : 'nofollow';
                    // Set values for robot_index and robot_follow

                    const indexInput = this.inputMetaForm.find(input => input.name === 'robot_index');
                    const followInput = this.inputMetaForm.find(input => input.name === 'robot_follow');

                    if (indexInput) indexInput.value = indexValue;
                    if (followInput) followInput.value = followValue;
                }
            })

            // Form Css Input
            const ftPrimary = this.fonts.find(item => item?.family === this.settings?.css?.ft_primary)
            const ftSecondary = this.fonts.find(item => item?.family === this.settings?.css?.ft_secondary)

            Object.keys(itemObject?.css).map(item => {
                const findIndex = this.inputCssForm?.findIndex(input => input?.name === item)
                if (item === 'clr_primary' || item === 'clr_secondary' || item === 'ft_primary' || item === 'ft_secondary') {
                    if (findIndex != -1) {
                        if (item === 'ft_primary') this.inputCssForm[findIndex].value = ftPrimary
                        else if (item === 'ft_secondary') this.inputCssForm[findIndex].value = ftSecondary
                        else this.inputCssForm[findIndex].value = itemObject?.css[item]
                    }
                }
            })
            
            // Form Custom Auth
            Object.keys(itemObject).map(item => {
                if (item === 'isCustomAuth') {
                    const findIndex = this.inputCssForm?.findIndex(input => input?.name === item)
                    if (findIndex != -1) this.inputCssForm[findIndex].value = itemObject[item]
                }
            })

            // Form Class Input
            Object.keys(itemObject).map(item => {
                if (item === 'isLevelingCase') {
                    const findIndex = this.inputClassForm?.findIndex(input => input?.name === item)
                    if (findIndex != -1) this.inputClassForm[findIndex].value = itemObject[item]
                }
            })

            // Form Other Input
            Object.keys(itemObject).map(item => {
                if (item === 'helpdesk') {
                    const findIndex = this.inputOtherForm?.findIndex(input => input?.name === item)
                    if (findIndex != -1) this.inputOtherForm[findIndex].value = itemObject[item]
                }
            })

            this.isLoaded = true
        },

        fetchFonts() {
            const ctx = this
            $.getJSON(`https://www.googleapis.com/webfonts/v1/webfonts?key=${this.apiKey}`, function(fonts){
                ctx.fonts = fonts?.items

                for (let idx = 0; idx < ctx.fonts.length; idx++) {
                    const item = ctx.fonts[idx];
                    ctx.fonts[idx].label = item?.family
                }

                ctx.setupFormValue(ctx.output)
            });
        },
        
        onSubmitForm(event) {
            event.preventDefault();

            this.inputLogoForm?.map((item) => {
                if (item?.name === 'logo_dark') {
                    this.output[item?.name] = item?.value
                    this.output.meta.image = item?.value
                } else this.output[item?.name] = item?.value
            })
            this.inputMetaForm?.map((item) => {
                if (item?.name === 'name') {
                    this.output.meta[item?.name] = item?.value
                    this.output.title = item?.value
                    this.output.meta.site_name = item?.value
                } else this.output.meta[item?.name] = item?.value
            })
            this.inputCssForm?.map((item) => {
                if (item?.name === 'ft_primary' || item?.name === 'ft_secondary') this.output.css[item?.name] = item?.value?.label
                else if (item?.name === 'isCustomAuth') this.output[item?.name] = item?.value
                else this.output.css[item?.name] = item?.value
            })
            this.inputClassForm?.map((item) => {
                this.output[item?.name] = item?.value
            })
            this.inputOtherForm?.map((item) => {
                this.output[item?.name] = item?.value
            })

            this.toggleConfirmModal()
        },

        fetchPost() {
            this.toggleConfirmModal()
            this.isSubmit = true

            const payload = {
                version: "v0",
                params: this.output
            }

            this.updateSettings(payload).then(() => {
                setTimeout(() => {
                    if (!this.sassState.status) this.setEvent(this.sassState.message, false)
                    else {
                        this.setEvent("Berhasil mengubah pengaturan", true)
                        this.toggleAlertModal()
                    }
                    this.isSubmit = false
                }, 500);
            })
        },

        onResetForm() {
            this.inputLogoForm?.map((item, index) => {
                this.inputLogoForm[index].value = ""
            })
            this.inputMetaForm?.map((item, index) => {
                this.inputMetaForm[index].value = ""
            })
            this.inputCssForm?.map((item, index) => {
                this.inputCssForm[index].value = ""
            })
            this.inputClassForm?.map((item, index) => {
                this.inputClassForm[index].value = ""
            })
            this.inputOtherForm?.map((item, index) => {
                this.inputOtherForm[index].value = ""
            })
            this.output = {}
        },

        toggleConfirmModal() {
            this.isConfirmModal = !this.isConfirmModal
        },

        toggleAlertModal(event) {
            this.isAlertModal = !this.isAlertModal

            if (event) {
                location.reload()
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