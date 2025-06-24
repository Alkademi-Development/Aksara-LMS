<template>
    <b-form @submit="onSubmitForm" :class="customClass">

        <div class="card-wrapper" >
            <b-card no-body>

                <b-card-body v-if="isLoaded" class="p-0">
                    <b-alert 
                        v-model="onEvent.show"
                        :variant="onEvent.variant"
                        dismissible
                    >
                        {{ onEvent.message }}
                    </b-alert>

                    <h5 v-if="classOverview" class="mb-4">
                        Yuk! Lengkapi Data Kamu Sebelum Mengikuti {{ isTestCase ? 'Tes' : 'Kelas' }} 
                        <span class="text-primary" style="font-size: inherit;">{{ classOverview.name }}</span>
                    </h5>

                    <div v-for="(input, index) in inputForm" :key="index" >
                        <b-form-group
                            v-if="input.type != 'select' && input.type != 'textarea' && input.type != 'file'"
                            :label="input.label"
                            :label-for="input.label"
                            :description="input.description"
                        >
                            <b-form-input
                                v-model="input.value"
                                :id="input.label"
                                :value="input.value"
                                :type="input.type"
                                :placeholder="input.placeholder"
                                :required='input.required'
                                :disabled='input.disabled'
                                min="0"
                            ></b-form-input>
                        </b-form-group>

                        <b-form-group
                            v-if="input.type == 'file'"
                            class="form-group"
                            :description="input.description"
                        >
                            <Dropzone
                                filedir="requirement"
                                :dropzoneId="input.name"
                                :label="input.label"
                                :disabled="input.disabled"
                                :acceptedFiles="input?.acceptedFiles"
                                :value="input.value"
                                v-model="input.value"
                                @isUploading="setUploadStatus"
                                @remove="input.value = null"/>
                        </b-form-group>

                        <!-- Text Area -->
                        <b-form-group
                            v-if="input.type == 'textarea'"
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
                            ></b-form-textarea>
                        </b-form-group>

                        <!-- V Select -->
                        <div v-if="input.type == 'select'" class="form-group">
                            <label for="selectedType">{{input.label}}</label>
                            <v-select
                                class="select-city form-control mb-3"
                                :placeholder="input.placeholder"
                                :options="input.options"
                                :disabled='input.disabled'
                                label="name"
                                id="selectedType"
                                v-model="input.value"
                                @change="onChangeCity(index)"
                            >
                                <template v-slot:no-options="{ search, searching }">
                                    <template v-if="searching">
                                    Tidak ada hasil untuk <em>{{ search }}</em>.
                                    </template>
                                    <em style="opacity: 0.5;" v-else>Ketik untuk mencari.</em>
                                </template>
                            </v-select>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12 col-md-6 mb-3 mb-md-0 d-flex align-items-center">
                            <span>* Wajib Diisi</span>
                        </div>
                        <div class="col-12 col-md-6">
                            <div class="d-flex flex-wrap justify-content-left justify-content-md-end">
                                <b-button v-if="!isSubmit" variant="danger" @click="$router.go(-1)">Batal</b-button>
                                <b-button v-if="!isSubmit" variant="primary" type="submit" :disabled="isUploading">Submit</b-button>
                                <b-button v-if="isSubmit" variant="primary" disabled><b-spinner class="text-white mr-2" small></b-spinner>Loading...</b-button>
                            </div>
                        </div>
                    </div>

                </b-card-body>

                <b-card-body class="text-center p-0" v-else>
                    <b-spinner label="Spinning"></b-spinner>
                </b-card-body>

            </b-card>
        </div>

        <b-modal v-model="isModalOpen" hide-header hide-footer centered size="sm" body-class="p-0">
            <ModalConfirmation
                @actionYes="fetchPost"
                @actionNo="isModalOpen = false"
                title=""
                :description="`<h5 class='mb-2'>Kamu Yakin Daftar Kelas Ini?</h5><p class='text-danger'>* Cek dulu kelengkapan data kamu</p>`"
                :centered="true"
                :footerMessage="classOverview?.level > 1 ? `<p class='danger-message'>*Kamu harus mengikuti <span class='text-primary'>Kelas Persiapan</span> dulu nih` : ''"
                btnYesTitle="Ya, Aku Yakin"
                btnNoTitle="Aku Cek Dulu"/>
        </b-modal>

        <b-modal v-if="isConfirmModal" v-model="isConfirmModal" hide-header hide-footer centered size="sm" body-class="p-0">
            <ModalConfirmation
                @actionYes="toggleModalConfirm('submit')"
                @actionNo="toggleModalConfirm('cancel')"
                title=""
                :description="`<h5>Kamu Yakin Mau Mengubah Kota Asalmu Menjadi <strong class='text-primary'>${ this.params['tempCity'].name }</strong> ?</h5>`"
                :centered="true"
                btnYesVariant="danger"
                btnYesTitle="Ya, Aku Yakin"
                btnNoTitle="Tidak"/>
        </b-modal>

    </b-form>
</template>
<script>
import { mapActions, mapState } from "vuex";

import ModalConfirmation from "@/components/template/micro/modal/ModalConfirmation.vue"

export default {
    props: {
        classroomSlug: String,
        customClass: String,
    },
    components: { ModalConfirmation },
    data() {
        return {
            isSubmit: false,
            isCityLoaded: false,
            isModalOpen: false,
            isLoaded: false,
            isTestCase: false,
            isConfirmModal: false,

            requirementFields: null,
            classOverview: null,
            inputForm: [],
            genderOptions: [ { name: "Laki-laki", value: "L" }, { name: "Perempuan", value: "P" } ],
            citiesOptions: [],
            schoolOptions: [],
            params: {},

            tempCity: null,
            tempSchool: null,

            onEvent: {
                message: '',
                status: true,
                show: false,
                variant: ''
            },

            isUploading: false,
        }
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
            sassState: (state) => state.Sass,
        }),
        watchInputCity() {
            return this.inputForm.find(item => item.name === 'cityId')
        }
    },
    created() {
        // if (this.requirementFields) {
            // this.getUserDetail()
            // this.loadRequirementData()
        // }
        this.isTestCase = this.sassState.isTestCase
        this.getClassroomOverview()
    },
    watch: {
        // 8 is Index Of Input Form City Object
        watchInputCity: {
            handler(newVal, oldVal) {
                if (this.tempCity && this.tempCity?.value != newVal?.value?.value) {
                    this.params["tempCity"] = newVal?.value
                    this.toggleModalConfirm()
                }
            },
            deep: true
        }
    },
    methods: {
        ...mapActions({
            setActiveTab: 'Layouts/setActiveTab',
        }),
        async getClassroomOverview() {
            // const user = JSON.parse(localStorage.getItem('user'))
            await this.$store.dispatch('Services/classroomOverview', this.classroomSlug);

            if(!this.servicesState.status) {
                console.error('Failed fetch classroom overview', this.servicesState.message)
                this.setEvent(this.servicesState.message, false)
                this.isLoaded = false
            } else {
                this.classOverview = this.servicesState.data

                let requirements = {}
                this.classOverview.requirementFields.map((fields) => {
                    requirements[`${fields}`] = null
                })

                if (this.classOverview.requirementFields.length == 0) this.requirementFields = null
                else this.requirementFields = requirements

                if (
                    !this.classOverview?.classState?.onRegistration ||
                    this.classOverview?.registered
                ) { return this.$emit('permissionDenied') }

                this.getUserDetail()
            }
        },
        async getClassroomDetail () {
            await this.$store.dispatch('Services/classroomDetail', {id: this.classOverview.id});

            if (!this.servicesState.status) {
                this.getUserDetail()
            } else {
                this.$router.push('/dashboard')
            }
        },
        async getUserDetail() {
            const user = JSON.parse(localStorage.getItem('user'))
            await this.$store.dispatch('Services/userDetail', user.id)

            if(!this.servicesState.status) {
                console.error('Failed fetch user detail', this.servicesState.message)
                this.setEvent(this.servicesState.message, false)
                this.isLoaded = false
            } else {
                this.loadRequirementData()
            }
        },
        async loadRequirementData() {
            let keys = Object.keys(this.requirementFields)
            const findKey = (items, value) => {
                return items.find((item) => this.isJSON(item) ? JSON.parse(item)?.name == value : item == value)
            }
            if (findKey(keys, 'schoolId')) await this.fetchSchools()
            else if (findKey(keys, 'cityId')) await this.fetchCities()
            else this.setFields()
        },
        setFields() {
            this.inputForm = []
            let dataProfile = this.servicesState.userDetail

            Object.keys(this.requirementFields).map((item) => {
                const itemJson = this.isJSON(item) ? JSON.parse(item) : item
                let name = this.isJSON(item) ? itemJson?.name : item
                let isReq = this.isJSON(item) ? itemJson?.isReq : true
                let nameSplit = name.split('custom_fields:')
                if (nameSplit.length > 1) {
                    name = 'custom_fields'
                }

                let object = { name: name, label: `${this.capitalize(name)} ${ isReq ? '*' : ''}`, type: 'text', value: this.requirementFields[name], placeholder: '', required: isReq, disabled: false }

                if (name == 'gender') object = { name: name, label: `Jenis Kelamin *`, type: 'select', value: this.requirementFields[name], placeholder: '', required: true, disabled: false, options: this.genderOptions }
                if (name == 'phone') object = { name: name, label: `Nomor Telepon (Whatsapp / Telegram) ${ isReq ? '*' : ''}`, type: 'number', value: this.requirementFields[name], placeholder: '', required: isReq, disabled: false }
                if (name == 'photo') object = { name: name, label: `Foto ${ isReq ? '*' : ''}`, type: 'file', description: "* Upload file dengan ekstensi .jpg / .png / .svg / .webp", value: this.requirementFields[name], placeholder: '', required: isReq, disabled: false, acceptedFiles: "image/*" }
                if (name == 'portfolio') object = { name: name, label: `Portofolio ${ isReq ? '*' : ''}`, type: 'url', value: this.requirementFields[name], description: "", placeholder: 'URL Portofolio Kamu', required: isReq, disabled: false }
                if (name == 'onlineCv') object = { name: name, label: `Online CV ${ isReq ? '*' : ''}`, type: 'url', value: this.requirementFields[name], description: "", placeholder: 'URL CV Kamu', required: isReq, disabled: false }
                if (name == 'statementLetter') object = { name: name, label: `Surat Keterangan ${ isReq ? '*' : ''}`, type: 'file', description: "* Upload file dengan ekstensi .pdf / .jpg / .png / .svg / .webp", value: this.requirementFields[name], placeholder: '', required: isReq, disabled: false, acceptedFiles: "image/*,application/pdf" }
                if (name == 'certificate') object = { name: name, label: `Ijazah ${ isReq ? '*' : ''}`, type: 'file', description: "* Upload file dengan ekstensi .pdf / .jpg / .png / .svg / .webp", value: this.requirementFields[name], placeholder: '', required: isReq, disabled: false, acceptedFiles: "image/*,application/pdf" }
                if (name == 'transcriptFile') object = { name: name, label: `Rapor ${ isReq ? '*' : ''}`, type: 'file', description: "* Upload file dengan ekstensi .pdf / .jpg / .png / .svg / .webp", value: this.requirementFields[name], placeholder: '', required: isReq, disabled: false, acceptedFiles: "image/*,application/pdf" }
                if (name == 'address') object = { name: name, label: `Alamat ${ isReq ? '*' : ''}`, type: 'textarea', value: this.requirementFields[name], placeholder: '', required: isReq, disabled: false }
                if (name == 'cityId') object = { name: name, label: `Asal Kota ${ isReq ? '*' : ''}`, type: 'select', value: this.requirementFields[name], placeholder: '', required: isReq, disabled: false, options: this.citiesOptions }
                if (name == 'schoolId') object = { name: name, label: `Asal Sekolah ${ isReq ? '*' : ''}`, type: 'select', value: this.requirementFields[name], placeholder: '', required: isReq, disabled: false, options: this.schoolOptions }
                if (name == 'github') object = { name: name, label: `Github ${ isReq ? '*' : ''}`, type: 'url', value: this.requirementFields[name], description: "", placeholder: 'URL Github Kamu', required: isReq, disabled: false }
                if (name == 'linkedIn') object = { name: name, label: `LinkedIn ${ isReq ? '*' : ''}`, type: 'url', value: this.requirementFields[name], description: "", placeholder: 'URL LinkedIn Kamu', required: isReq, disabled: false }
                if (name == 'ktp') object = { name: name, label: `KTP ${ isReq ? '*' : ''}`, type: 'file', description: "* Upload file dengan ekstensi .pdf / .jpg / .png / .svg / .webp", value: this.requirementFields[name], placeholder: '', required: isReq, disabled: false, acceptedFiles: "image/*,application/pdf" }
                if (name == 'studentCard') object = { name: name, label: `Kartu Pelajar ${ isReq ? '*' : ''}`, type: 'file', description: "* Upload file dengan ekstensi .pdf / .jpg / .png / .svg / .webp", value: this.requirementFields[name], placeholder: '', required: isReq, disabled: false, acceptedFiles: "image/*,application/pdf" }

                if (name == 'custom_fields') {
                    let customFields = this.isJSON(nameSplit[1]) ? JSON.parse(nameSplit[1]) : nameSplit[1]
                    Object.keys(customFields).map((fields) => {
                        object = { name: this.generateCustomFieldName(fields), label: `${fields} ${ isReq ? '*' : ''}`, type: customFields[fields], value: "", placeholder: '', required: isReq, disabled: false }
                        this.inputForm.push(object)
                    })
                } else this.inputForm.push(object)
            })
            // Set Default Value
            this.inputForm.map((item, index) => {
                let name = item.name

                Object.keys(dataProfile).map((data) => {
                    if (name == data && item.type != 'select') {
                        if (dataProfile[data] && dataProfile[data].length != 0) {
                            this.inputForm[index].value = dataProfile[data]
                            // if (name != 'bio' && name != 'phone' && name != 'address' && name != 'onlineCv' && name != 'portfolio' && name != 'photo') this.inputForm[index].disabled = true
                        }
                    }
                    if ((name == "cityId" && data == "city") || (name == "schoolId" && data == "school") || (name == "gender" && data == "gender")) {
                        if (dataProfile[data] && dataProfile[data].length != 0) {

                            let find = null

                            if (data == "gender") find = this.genderOptions.find((item) => item.value === dataProfile[data])
                            if (data == "city") {
                                find = this.citiesOptions.find((item) => item.value === dataProfile[data].id)
                                this.tempCity = find
                            }
                            if (data == "school") {
                                find = this.schoolOptions.find((item) => item.value === dataProfile[data].id)
                                this.tempSchool = find
                            }

                            if (find) this.inputForm[index].value = find

                            if (data == "gender") this.inputForm[index].disabled = true
                            else this.inputForm[index].disabled = false

                        }
                    }

                    if (data == 'custom_fields') {
                        if (dataProfile[data] != '') {
                            let customFields = JSON.parse(dataProfile[data])
                        
                            Object.keys(customFields).map((fields) => {
                                if (name == `custom_fields=${fields}`) if (find) this.inputForm[index].value = customFields[fields]
                            })
                        }
                    }
                })
            })
            this.isLoaded = true
        },
        async fetchSchools() {
            this.schoolOptions = [
                { value: 1, name: "SMKN 4 Malang" },
                { value: 2, name: "SMKN 8 Malang" },
                { value: 3, name: "SMKN 11 Malang" },
            ]
            let keys = Object.keys(this.requirementFields)
            if (keys.find((item) => JSON.parse(item)?.name == 'cityId') && this.citiesOptions.length == 0) await this.fetchCities()
            else this.setFields()
            // await this.$store.dispatch('Services/schools')

            // if(!this.servicesState.status) {
            //     console.error('Failed fetch schools', this.servicesState.message)
            //     this.setEvent(this.servicesState.message, false)
            //     this.isLoaded = false
            // } else {
            //     this.servicesState.data.map((item) => {
            //         if (item.id != 0) {
            //             const object = {
            //                 value: item.id,
            //                 name: item.name,
            //             }
            //             this.schoolOptions.push(object)
            //         }
            //     })
            // }
            // this.setFields()
        },
        async fetchCities() {
            this.citiesOptions = []
            await this.$store.dispatch('Services/cities')

            if(!this.servicesState.status) {
                console.error('Failed fetch cities', this.servicesState.message)
                this.setEvent(this.servicesState.message, false)
                this.isLoaded = false
            } else {
                this.servicesState.data.map((item) => {
                    if (item.id != 0) {
                        const object = {
                            value: item.id,
                            name: item.name,
                        }
                        this.citiesOptions.push(object)
                    }
                })
                let keys = Object.keys(this.requirementFields)
                if (keys.find((item) => JSON.parse(item)?.name == 'schoolId') && this.schoolOptions.length == 0) await this.fetchSchools()
                else this.setFields()
            }
        },
        onSubmitForm(event) {
            if (event) {
                if (event != 'no-modal') event.preventDefault() 
            }

            let isReady = true
            this.params = {}

            for(var i = 0; i < this.inputForm.length; i++) {
                let item = this.inputForm[i]
                    
                    if ((item.type == 'select' || item.type == 'file') && (!item.value && item.required)) {
                        this.setEvent(`Tambahkan ${item.label.replace("*", "")} terlebih dahulu.`, false)
                        isReady = false
                        break
                    }

                    // if (item.name == 'cityId' && !item.value) {
                    //     this.setEvent('Pilih kota terlebih dahulu.', false)
                    //     break
                    // }
                    // if (item.name == 'schoolId' && !item.value) {
                    //     this.setEvent('Pilih sekolah terlebih dahulu.', false)
                    //     break
                    // }
                    // if (item.type == 'files' && !item.value) {
                    //     this.setEvent('Pilih sekolah terlebih dahulu.', false)
                    //     break
                    // }

                    if ((item.type == 'select')) {
                        if (item.name === 'cityId') {
                            if (this.tempCity && this.tempCity?.value != item?.value?.value) {
                                this.params["tempCity"] = item?.value
                                // console.log(this.params["tempCity"], item?.value, "TOGGLE")
                                return this.isReady = false
                            }
                        } this.params[item.name] = item.value.value
                    }

                // }
                else this.params[item.name] = item.value
            }

            if (!isReady) return

            if (isReady) {
                let dataProfile = this.servicesState.userDetail
                let customFields = {}
                
                Object.keys(dataProfile).map((field) => {
                    if (field == 'custom_fields') {
                        if (dataProfile[field] != '') {
                            let listFields = JSON.parse(dataProfile[field])
                        
                            Object.keys(listFields).map((data) => {
                                customFields[data] = listFields[data]
                            })
                        }
                    }
                })

                let enrollCustomFields = {}
                
                Object.keys(this.params).map((field) => {
                    let fieldSplit = field.split('custom_fields=')
                    if (fieldSplit.length > 1) {
                        customFields[fieldSplit[1]] = this.params[field]
                        enrollCustomFields[fieldSplit[1]] = this.params[field]
                        delete this.params[field]
                    }
                })

                if (Object.keys(customFields).length != 0) this.params.custom_fields = JSON.stringify(customFields)
                if (Object.keys(enrollCustomFields).length != 0) this.params.enrollCustomFields = JSON.stringify(enrollCustomFields)

                // Delete Unused Object
                // delete this.params["tempCity"]

                // console.log(this.params, "PARAMS")
                // console.log(this.tempCity, this.tempSchool, "TEMP")

                this.onEvent.show = false
                if (event === 'no-modal') this.fetchPost()
                else this.isModalOpen = true
            }
        },
        async fetchPost() {
            this.isModalOpen = false
            this.isSubmit = true;

            await this.$store.dispatch('Services/updateProfile', this.params);

            if (!this.servicesState.status) {
                console.error('Failed to update profile', this.servicesState.message);
                this.setEvent(this.servicesState.message, false)
                this.isSubmit = false;
            } else {
                setTimeout(() => {
                    this.enrollClass()
                }, 500);
            }
        },
        async enrollClass() {
            
            const payload = {

                code: this.classOverview.code,
                params: { custom_fields: this.params?.enrollCustomFields ?? "{}" }
                
            }

            await this.$store.dispatch('Services/classroomEnroll', payload)

            if (!this.servicesState.status) {
                console.error('failed to enroll classroom: ', this.servicesState.message)
                this.setEvent(this.servicesState.message, false)
                this.isSubmit = false
            } else {
                let res = 'classroom'

                if (this.classOverview?.type !== 'tes') await this.setActiveTab('overview')
                
                // if (this.isTestCase) res = 'tes/assignments'
                // else if (!this.classOverview.userState) res = 'classroom/assignments'

                this.$router.replace(`/dashboard/${res}/${this.classOverview.slug}`)
            }
        },

        toggleModalConfirm(action) {
            this.isConfirmModal = !this.isConfirmModal

            if (action === 'submit') this.tempCity = this.params["tempCity"]
            
            const cityIndex = this.inputForm.findIndex(item => item.name === 'cityId')
            this.inputForm[cityIndex].value = this.tempCity
        },

        generateCustomFieldName(fields) {
            let name = fields.replace(" ", "_")
            return `custom_fields=${name.toLowerCase()}`
        },

        capitalize(item) {
            const words = item.split(" ");

            for (let i = 0; i < words.length; i++) {
                words[i] = words[i][0].toUpperCase() + words[i].substr(1);
            }

            return words
        },

        setEvent(message, status) {
            window.scrollTo(0, 0)
            this.onEvent.message = message
            this.onEvent.status = status
            this.onEvent.variant = status == true ? 'success' : 'warning'
            this.onEvent.show = true
        },

        isJSON(str) {
            try {
                JSON.parse(str)
                return true
            } catch (e) {
                return false
            }
        },
        setUploadStatus(status) {
            this.isUploading = status
        },
    },
    
}
</script>