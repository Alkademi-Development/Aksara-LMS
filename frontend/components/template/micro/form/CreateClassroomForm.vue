<template>
    <b-form @submit="onSubmitForm" @reset="onResetForm" class="row" name="create-classroom">

        <div v-if="!isLoaded" class="col-lg-12 card-wrapper" >
            <b-card no-body>
                <div class="text-center card-body">
                    <b-spinner label="Spinning"></b-spinner>
                </div>
            </b-card>
        </div>

        <template v-if="!isPreview">
            <div v-if="isLoaded" class="col-lg-12 card-wrapper" >

                <b-card no-body>
                    <b-card-header class="border-0 pb-0">
                        <h5 class="mb-0 d-inline-block" style="font-size: 18px">Overview</h5>
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
                            <b-col
                                v-for="(input, index) in inputOverview"
                                :key="index"
                                :cols="input.name == 'quota' || input.name == 'minScore' ? 6 : 12"
                            >
                                <b-form-group
                                    v-if="input.type != 'textarea' && input.type != 'select' && input.type != 'image'"
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
                                        :required="activeState === 'draft' ? false : input.required"
                                        :max="input.name == 'minScore' ? 100 : 1000000000000"
                                        :disabled="input?.name === 'quota' ? isUnlimited ? true : false : false"
                                        autocomplete="off"
                                        :min="input.min ? input.min : 0"
                                        :name="input.name"
                                    ></b-form-input>
                                    <b-form-checkbox v-if="input?.name === 'quota'" v-model="isUnlimited" class="mt-1"><span class="mt-1">Tidak Terbatas</span></b-form-checkbox>
                                </b-form-group>

                                <div
                                    v-if="input.type === 'image'"
                                    class="form-group"
                                >
                                    <Dropzone
                                        v-model="input.value"
                                        filedir="class"
                                        acceptedFiles="image/*"
                                        :dropzoneId="`class-${input.name}`"
                                        :label="input.label"
                                        :disabled="input.disabled"
                                        :value="input.value"
                                        :noBodyPreview="false"
                                        @remove="input.value = null"
                                    />
                                </div>

                                <!-- Text Area -->
                                <b-form-group
                                    v-if="input.name == 'tags'"
                                    :label="input.label"
                                    :label-for="input.name"
                                    :description="input.description"
                                >
                                    <b-form-textarea
                                        v-model="input.value"
                                        :id="input.name"
                                        :value.sync="input.value"
                                        :type="input.type"
                                        :placeholder="input.placeholder"
                                        :name="input.name"
                                        :required="activeState === 'draft' ? false : input.required"
                                    ></b-form-textarea>
                                </b-form-group>

                                <b-form-group
                                    v-if="input.name == 'description'"
                                    ref="classDesc"
                                    :label="input.label"
                                    :label-for="input.name"
                                    :description="input.description">

                                    <DescriptionEditor
                                        v-model="input.value"
                                        :placeholder="input.placeholder"
                                    />

                                </b-form-group>

                                <b-form-group
                                    v-if="input?.name === 'registrantCity'"
                                    :label="input?.label"
                                    :label-for="`checkbox-${input?.name}`"
                                >
                                    <!-- <b-button v-if="input?.name == 'registrantCity'" :variant="citySelected?.length == 0 ? 'light' : 'primary'" block @click="toggleModalSelect(input?.name)">{{citySelected?.length == 0 ? 'Pilih Kota' : `${citySelected?.length} Dipilih`}}</b-button> -->
                                    <SearchDropdownCheckbox
                                        :id="`checkbox-${input?.name}`"
                                        class="w-100"
                                        buttonTitle="Pilih kota"
                                        :placeholder="input?.placeholder"
                                        :items="cityOptions"
                                        @onChange="setSelectedCity($event)"/>

                                </b-form-group>

                                <!-- <b-form-group
                                    v-if="input.name == 'type'"
                                    :label="input.label"
                                    :label-for="`select-${ input?.name }`"
                                    :description="input.description"
                                >

                                    <SearchSelect
                                        class="w-100"
                                        :items="optionType"
                                        :text="selectedType?.label"
                                        :placeholder="input?.placeholder"
                                        @onChange="selectedType = $event"
                                        :id="`select-${ input?.name }`"
                                    />
                                </b-form-group> -->

                                <b-form-group
                                    v-if="input.name == 'visibility'"
                                    :label="input.label"
                                    :label-for="input.label"
                                    :description="input.description"
                                >

                                    <SearchSelect
                                        class="w-100"
                                        :items="optionVisibility"
                                        :text="selectedVisibility?.label"
                                        :placeholder="input?.placeholder"
                                        @onChange="selectedVisibility = $event"
                                        :id="`select-${ input?.name }`"/>

                                </b-form-group>

                                <b-form-group
                                    v-if="input?.name === 'schools' && isSchoolCase"
                                    :label="input?.label"
                                    :label-for="`checkbox-${input?.name}`">

                                    <SearchDropdownCheckbox
                                        :id="`checkbox-${input?.name}`"
                                        class="w-100"
                                        itemClass="w-100"
                                        buttonTitle="Pilih sekolah"
                                        :description="input?.description"
                                        :placeholder="input?.placeholder"
                                        :items="schoolOptions"
                                        @onChange="schoolsSelected = $event"
                                    />

                                </b-form-group>
                            </b-col>
                        </b-row>
                    </div>
                </b-card>

            </div>

            <!-- Pengaturan Lanjutan (Optional) -->
            <div v-if="isLoaded" class="col-12 card-wrapper">
                <div class="row">
                    <div class="col-12">
                        <CardCollapse v-if="isLoaded" title="Pengaturan Lanjutan (Optional)">
                            <b-row>
                                <template v-for="(input, index) in inputAdvanced">

                                    <b-col :key="index" :cols="input.name == 'quota' ? 4 : input.name == 'minScore' ? 8 : 12">
                                        <b-form-group
                                            v-if="input.type != 'select'"
                                            :label="input.label"
                                            :label-for="input.name"
                                            :description="input.description"
                                        >
                                            <b-form-input
                                                v-model="input.value"
                                                :id="input.name"
                                                :name="input.name"
                                                :value="input.value"
                                                :type="input.type"
                                                :placeholder="input.placeholder"
                                                :required="activeState === 'draft' ? false : input.required"
                                                :max="input.name == 'minScore' ? 100 : 1000000000000"
                                                :disabled="input?.name === 'quota' ? isUnlimited ? true : false : false"
                                                autocomplete="off"
                                                min="0"
                                            ></b-form-input>
                                            <b-form-checkbox v-if="input?.name === 'quota'" v-model="isUnlimited" class="mt-1"><span class="mt-1">Tidak Terbatas</span></b-form-checkbox>
                                        </b-form-group>

                                        <!-- Programs Options -->
                                        <b-form-group
                                            v-if="input.name == 'programId'"
                                            :label="input.label"
                                            :label-for="`select-program-${ input?.name }`"
                                            :description="input.description"
                                        >

                                            <SearchSelect
                                                class="w-100"
                                                :items="programs ?? []"
                                                :isListUpdate="isProgramUpdate"
                                                :text="selectedProgram?.label"
                                                :placeholder="input?.placeholder"
                                                :withAction="true"
                                                :actionTitle="'+ Program Baru'"
                                                :actionVariant="'outline-primary'"
                                                :requestChangeValue="programRequestChangeValue"
                                                @onChange="onProgramChanged"
                                                @actionSubmit="isModalProgram = true"
                                                :id="`select-program-${ input?.name }`"
                                            />
                                        </b-form-group>

                                        <b-form-group
                                            v-if="input?.name === 'registrantCity'"
                                            :label="input?.label"
                                            :label-for="`checkbox-${input?.name}`"
                                        >
                                            <!-- <b-button v-if="input?.name == 'registrantCity'" :variant="citySelected?.length == 0 ? 'light' : 'primary'" block @click="toggleModalSelect(input?.name)">{{citySelected?.length == 0 ? 'Pilih Kota' : `${citySelected?.length} Dipilih`}}</b-button> -->
                                            <SearchDropdownCheckbox
                                                :id="`checkbox-${input?.name}`"
                                                class="w-100"
                                                buttonTitle="Pilih kota"
                                                :placeholder="input?.placeholder"
                                                :items="cityOptions"
                                                @onChange="setSelectedCity($event)"
                                            />
                                        </b-form-group>

                                        <b-form-group
                                            v-if="input?.name === 'cityHeld'"
                                            :label="input?.label"
                                            :label-for="`checkbox-${input?.name}`"
                                        >
                                            <SearchDropdownCheckbox
                                                :id="`checkbox-${input?.name}`"
                                                class="w-100"
                                                buttonTitle="Pilih kota"
                                                :placeholder="input?.placeholder"
                                                :items="cityHeldOptions"
                                                @onChange="setSelectedCityHeld($event)"
                                            />

                                        </b-form-group>

                                        <b-form-group
                                            v-if="input?.name === 'requirementFields'"
                                            :label="input?.label"
                                            :label-for="`checkbox-${input?.name}`"
                                        >
                                            <SearchDropdownCheckboxOptions
                                                :id="`checkbox-${input?.name}`"
                                                class="w-100"
                                                buttonTitle="Pilih Persyaratan"
                                                :description="input?.description"
                                                :placeholder="input?.placeholder"
                                                :items="requirementOptions"
                                                @onChange="requirementSelected = $event"
                                            />

                                        </b-form-group>

                                        <b-form-group
                                            v-if="input.name == 'prerequisite'"
                                            :label="input.label"
                                            :label-for="input.label"
                                            :description="input.description"
                                        >
                                            <SearchSelect
                                                class="w-100"
                                                :canCancelItem="true"
                                                :items="listClass"
                                                :text="classSelected?.label"
                                                :placeholder="input?.placeholder"
                                                @onChange="classSelected = $event"
                                                :id="`select-${ input?.name }`"
                                            />

                                        </b-form-group>

                                    </b-col>
                                </template>
                            </b-row>
                        </CardCollapse>
                    </div>
                </div>
            </div>

            <!-- Pengaturan Jadwal (Optional) -->
            <div v-if="isLoaded" class="col-12 card-wrapper">
                <div class="row">
                    <div class="col-12">
                        <CardCollapse v-if="isLoaded" title="Pengaturan Jadwal (Optional)">
                            <b-row>
                                <template v-for="(input, index) in inputDate">
                                    <b-col :key="index" cols="6" v-if="input?.name != 'certificateRelease'">
                                        <b-form-group
                                            :label="input.label"
                                            :label-for="input.name"
                                            :description="input.description"
                                        >
                                            <b-form-input
                                                v-model="input.value"
                                                :id="input.name"
                                                :name="input.name"
                                                :value="input.value"
                                                :type="input.type"
                                                :placeholder="input.placeholder"
                                                :required="activeState === 'draft' ? false : input.required"
                                                :disabled="isAlwaysOpen ? true : false"
                                                autocomplete="off"
                                                min="0"
                                            ></b-form-input>
                                        </b-form-group>
                                    </b-col>
                                </template>
                                <b-col cols="12">
                                    <b-form-group description="* Peserta dapat mengikuti kelas kapanpun" class="mb-3">
                                        <b-form-checkbox v-model="isAlwaysOpen" class="mt-1"><span class="mt-1">Selalu Terbuka</span></b-form-checkbox>
                                    </b-form-group>
                                </b-col>
                                <b-col cols="12">
                                    <b-form-group :description="`* Centang dan atur tanggal untuk menerbitkan sertifikat di kelas ini.`" class="mb-0">
                                        <b-form-checkbox
                                            id="checkbox-publish-certificate"
                                            v-model="isPublishCertificate"
                                            name="checkbox-publish-certificate"
                                            class="mb-2"
                                        >Terbitkan Sertifikat</b-form-checkbox>
                                        <b-form-input
                                            v-if="isPublishCertificate"
                                            v-model="publishCertificateDate"
                                            id="input-publish-certificate"
                                            :value="publishCertificateDate"
                                            type="date"
                                            :required="true"
                                        ></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                        </CardCollapse>
                    </div>
                </div>
            </div>
        </template>

        <div v-if="false" class="col-lg-12 card-wrapper">
            <div class="card">
                <div class="card-body">

                    <div class="row">
                        <div class="col-12 col-md-4 mb-3 mb-md-0 d-flex align-items-center">
                            <span>* Wajib Diisi</span>
                        </div>
                        <div class="col-12 col-md-8">
                            <div class="d-flex flex-wrap justify-content-left justify-content-md-end box-button">
                                <b-button type="reset" :disabled="isSubmit" variant="danger">Reset</b-button>
                                <b-button v-if="action != 'edit'" :disabled="isSubmit" variant="default" @click="saveToDraft()">Simpan ke Draft</b-button>
                                <b-button type="submit" :disabled="isSubmit" variant="primary">{{ action === 'edit' ? 'Simpan' : 'Terbitkan' }}</b-button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
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
                                <b-button v-if="!isPreview" type="reset" :disabled="isSubmit" variant="danger">Reset</b-button>
                                <b-button v-if="isPreview" type="button" variant="secondary" @click="$emit('changeStep', 'course')">Kembali</b-button>
                                <b-button v-if="isPreview" :disabled="isSubmit" variant="default" @click="saveToDraft()">Simpan ke Draft</b-button>
                                <b-button type="submit" :disabled="isSubmit" variant="primary">Lanjutkan</b-button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <b-modal v-model="modalConfirmation" hide-header hide-footer centered size="md" body-class="p-0" :no-close-on-backdrop="isSubmit ? true : false" :no-close-on-esc="isSubmit ? true : false">
            <ModalConfirmation
                :title="modalDataPublish?.title"
                :description="modalDataPublish?.description"
                @actionYes="processFormData('release')"
                @actionNo="modalConfirmation = false, processFormData('draft')"
                :btnYesTitle="modalDataPublish?.btnYesTitle"
                :btnNoTitle="modalDataPublish?.btnNoTitle"
                btnNoVariant="outline-gray"/>
        </b-modal>

        <b-modal v-model="modalModeConfirmation" hide-header hide-footer centered size="md" body-class="p-0" :no-close-on-backdrop="isSubmit ? true : false" :no-close-on-esc="isSubmit ? true : false">
            <ModalConfirmation
                :title="modalChangeMode?.title"
                :description="modalChangeMode?.description"
                @actionYes="processFormData(null)"
                @actionNo="modalModeConfirmation = false"
                :btnYesTitle="modalChangeMode?.btnYesTitle"
                :btnNoTitle="modalChangeMode?.btnNoTitle"
                btnNoVariant="outline-gray"/>
        </b-modal>

        <ModalCreateProgram
            size="md"
            title="Buat Program"
            :hideFooter="true"
            :vModel="isModalProgram"
            @vModelChange="isModalProgram = $event"
            @submitted="fetchAllPrograms($event)" />

    </b-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import fieldForm from '@/store/global/createClassroom';
import Editor from '@tinymce/tinymce-vue'
import moment from 'moment';

import SelectDropdown from '@/components/template/micro/form/SelectDropdown.vue';
import ModalCreateProgram from '@/components/template/micro/modal/ModalCreateProgram.vue'
import SearchDropdownCheckbox from '@/components/template/micro/inputs/SearchDropdownCheckbox.vue'
import SearchDropdownCheckboxOptions from '@/components/template/micro/inputs/SearchDropdownCheckboxOptions.vue'
import SearchSelect from '@/components/template/micro/inputs/SearchSelect.vue'
import ModalConfirmation from "@/components/template/micro/modal/ModalConfirmation.vue"
import DescriptionEditor from "@/components/template/micro/editor/DescriptionEditor.vue";
import CardCollapse from '@/components/template/micro/card/CardCollapse.vue';

import { toDecrypt, toEncrypt } from '~/commons/utils';

export default {
    layout: 'dashboard',
    components: {
        Editor,
        SelectDropdown,
        ModalCreateProgram,
        SearchDropdownCheckbox,
        SearchSelect,
        ModalConfirmation,
        SearchDropdownCheckboxOptions,
        DescriptionEditor,
        CardCollapse
    },
    props: {
        isPreview: {
            type: Boolean,
            default: false
        },
        isEditPage: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            onEvent: {
                message: '',
                status: true,
                show: false,
                variant: ''
            },
            isProgramUpdate: true,
            // Credentials
            action: '',
            title: '',
            // LMS CASE
            isTestCase: false,
            isSchoolCase: false,
            // Classroom
            classroomId: null,
            imageLogo: null,
            isUnlimited: false,
            isAlwaysOpen: false,
            isPublishCertificate: false,
            // State
            isSubmit: false,
            isLoaded: false,
            isSaveToDraft: false,
            isModalSelectForm: false,
            modalConfirmation: false,
            modalModeConfirmation: false,
            modalToShow: null,
            modalTitle: null,
            //Program
            errorProgramMessage: "",
            isModalProgram: false,
            isLoadPrograms: false,
            currentRound: null,
            programs: [],
            selectedProgram: null,
            programRequestChangeValue: null,
            // Modules
            moduleOptions: [],
            modulesSelected: [],
            // Requirements
            requirementOptions: [],
            requirementSelected: [],
            // City
            isSelectedAllCities: false,
            isSelectedAllHeldCities: false,
            cityOptions: [],
            citySelected: [],
            cityHeldOptions: [],
            cityHeldSelected: [],
            // Province
            provinceOptions: [],
            provinceSelected: [],
            provinceHeldOptions: [],
            provinceHeldSelected: [],
            // Form
            publishCertificateDate: "",
            activeState: 'draft',
            inputForm: [],
            inputDetail: [],
            inputDate: [],
            inputOther: [],
            inputOverview: [],
            inputAdvanced: [],
            output: {},
            // Schools
            listSchool: [],
            selectedSchool: null,
            schoolOptions: [],
            schoolsSelected: [],

            // Visibility
            optionVisibility: [
                { value: 'public', label: 'Terbuka' },
                { value: 'private', label: 'Tertutup' },
                { value: "guest", label: "Publik" },
            ],
            selectedVisibility: null,

            // Type
            optionType: [
                { value: 'bootcamp', label: 'Belajar' },
                { value: 'test', label: 'Tes'}
            ],
            selectedType: null,

            // Mode
            optionMode: [
                { value: 'online', label: 'Online' },
                { value: 'offline', label: 'Offline'},
                { value: 'hybrid', label: 'Hybrid'}
            ],
            selectedMode: null,
            tempSelectedMode: null,

            // Level
            optionLevel: [
                { value: 0, label: 'Reguler' },
                { value: 1, label: 'Fase 1' },
                { value: 2, label: 'Fase 2'},
                { value: 3, label: 'Fase 3'}
            ],
            selectedLevel: null,

            // Users
            userOptions: [],
            usersSelected: null,

            modalDataPublish: {
                // title: "Anda Yakin Akan Menerbitkan Kelas Ini <strong>Tanpa Pretest</strong> ?",
                title: "Anda Yakin Akan Menerbitkan Kelas Ini?",
                // description: "<p>Perhatikan Hal di Bawah ini :</p><ul><li>Simpan ke <strong>Draft</strong> , untuk membuat pretest</li><li>Anda bisa membuat <strong>lebih dari satu</strong> pretest tiap kelas</li></ul>",
                btnYesVariant: "primary",
                btnYesTitle: "Terbitkan Sekarang",
                btnNoTitle: "Simpan Ke Draft"
            },
            isLevelingCase: false,

            modalChangeMode: {
                title: 'Anda Yakin Mengubah <strong>Mode Kelas</strong> ?',
                description: 'Jika mengubah mode kelas ke online akan membuat jarak absensi menjadi tidak terbatas',
                btnYesVariant: "primary",
                btnYesTitle: "Ubah Mode Kelas",
                btnNoTitle: "Tidak"
            },

            listClass: [],
            classSelected: null,
            detailClassroom: null,
        }
    },
    filters: {
        capitalize: function (value) {
            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
        },
    },
    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
            usersState: (state) => state.Users,
            sassState: (state) => state.Sass,
            roundState: (state) => state.Rounds,
            citiesState: (state) => state.Cities,
            schoolsState: (state) => state.Schools,
            settings: (state) => state?.Sass?.settings,
        })
    },
    created() {
        this.getCredentials();
    },
    methods: {
        ...mapActions({
            setActiveTab: 'Layouts/setActiveTab',
            allSettings: 'Sass/allSettings',
        }),
        saveToDraft() {
            this.isSaveToDraft = true
            this.processFormData('draft')
        },
        // Setting Modal Select
        toggleModalSelect(name) {
            this.isModalSelectForm = true
            this.modalToShow = name
        },
        // State Event
        setEvent(message, status){
            window.scrollTo(0,0)
            this.onEvent.message = message
            this.onEvent.status = status
            this.onEvent.variant = status == true ? 'success' : 'warning'
            this.onEvent.show = true
        },
        // Setup Credentials
        getCredentials() {
            this.isLoaded = false
            const url = this.$router.currentRoute.fullPath
            var res = url.split('/')
            res.shift()

            this.allSettings({version: "v0"}).then(() => {
                if (!this.sassState?.status) {
                    this.isLoaded = false
                    return this.setEvent(this.sassState?.message, false)
                } else {
                    this.output = this.settings
                    this.isLevelingCase = this.settings.isLevelingCase
                }
            })

            this.isTestCase = this.sassState.isTestCase
            this.isSchoolCase = this.sassState.isSchoolCase
            this.title = res[1];
            this.action = this.isPreview || !!localStorage.getItem('classroomId') ? 'edit' : res[2];
            this.classroomId = toDecrypt(localStorage.getItem('classroomId')) || res[3];

            this.inputForm = []
            this.inputOverview = JSON.parse(JSON.stringify(fieldForm?.inputFormOverview));
            this.inputDetail = JSON.parse(JSON.stringify(fieldForm?.inputFormDetail));
            this.inputDate = JSON.parse(JSON.stringify(fieldForm?.inputFormDate));
            this.inputOthers = JSON.parse(JSON.stringify(fieldForm?.inputFormOthers));
            this.inputAdvanced = JSON.parse(JSON.stringify(fieldForm?.inputFormAdvanced));

            this.fetchCities();
            if(this.action === 'create') this.fetchListClass();
            // this.fetchCurrentRound()
        },
        // Start Cities Process
        async fetchCities(){
            let cityOptions = []

            await this.$store.dispatch('Services/locationList')

            if(!this.servicesState.status) {
                console.error('Failed fetch cities', this.servicesState.message)
                this.setEvent(this.servicesState.message, false)
                this.isLoaded = true
            } else {
                const cities = this.servicesState.data ?? []
                cities.map((item) => {
                    let object = {
                        value: item.id,
                        label: item.name,
                        checked: false,
                        isProvince: item.isProvince
                    }
                    cityOptions.push(object)
                })
                this.cityOptions = cityOptions
                this.setCitiesHeld()
            }
        },
        setCitiesHeld() {
            let cityHeldOptions = []
            const cities = this.servicesState.data ?? []
            cities.map((item) => {
                let object = {
                    value: item.id,
                    label: item.name,
                    checked: false,
                    isProvince: item.isProvince
                }
                cityHeldOptions.push(object)
            })
            this.cityHeldOptions = cityHeldOptions
            this.fetchModules()
        },

        setSelectedCity(selectedCity) {
            let tempCity = []
            let tempProvince = []

            selectedCity.forEach(city => {
                if (!!city?.isProvince) {
                    tempProvince.push(city)
                }else {
                    tempCity.push(city)
                }
            });

            this.citySelected = [...tempCity]
            this.provinceSelected = [...tempProvince]
        },

        setSelectedCityHeld(selectedCity) {
            let tempCity = []
            let tempProvince = []

            selectedCity.forEach(city => {
                if (!!city?.isProvince) {
                    tempProvince.push(city)
                }else {
                    tempCity.push(city)
                }
            });

            this.cityHeldSelected = [...tempCity]
            this.provinceHeldSelected = [...tempProvince]
        },

        async fetchModules(){
            this.moduleOptions = []
            await this.$store.dispatch('Services/modules', {page: null, type: null})

            if(!this.servicesState.status) {
                console.error('Failed fetch modules', this.servicesState.message)
                this.setEvent(this.servicesState.message, false)
                this.isLoaded = true
            } else {
                const modules = this.servicesState.modules ?? []
                modules.map((item) => {
                    let object = {
                        value: item.id,
                        label: item.title,
                        checked: false,
                    }
                    this.moduleOptions.push(object)
                })
                this.fetchRequirementFields()
            }
        },
        async fetchRequirementFields(){
            this.requirementOptions = []
            await this.$store.dispatch('Services/classroomRequirements')

            if(!this.servicesState.status) {
                console.error('Failed fetch requirements', this.servicesState.message)
                this.setEvent(this.servicesState.message, false)
                this.isLoaded = true
            } else {
                const fields = this.servicesState.data ?? []
                fields.map((item) => {

                    let object = {
                        value: item,
                        label: item,
                    }

                    if (item == 'bio') object = { value: item, label: `Bio`, isReq: false }
                    if (item == 'gender') object = { value: item, label: `Jenis Kelamin`, isReq: false }
                    if (item == 'phone') object = { value: item, label: `No Telpon (Whatsapp / Telegram)`, isReq: false }
                    if (item == 'photo') object = { value: item, label: `Upload Foto Profile`, isReq: false }
                    if (item == 'portfolio') object = { value: item, label: `URL Portofolio`, isReq: false }
                    if (item == 'onlineCv') object = { value: item, label: `URL Online CV`, isReq: false }
                    if (item == 'statementLetter') object = { value: item, label: `Upload Surat Keterangan (.pdf)`, isReq: false }
                    if (item == 'certificate') object = { value: item, label: `Upload Ijazah (.pdf)`, isReq: false }
                    if (item == 'transcriptFile') object = { value: item, label: `Upload Rapor (.pdf)`, isReq: false }
                    if (item == 'address') object = { value: item, label: `Alamat`, isReq: false }
                    if (item == 'cityId') object = { value: item, label: `Asal Kota`, isReq: false }
                    if (item == 'schoolId') object = { value: item, label: `Asal Sekolah`, isReq: false }
                    if (item == 'github') object = { value: item, label: `URL Github`, isReq: false }
                    if (item == 'linkedIn') object = { value: item, label: `URL LinkedIn`, isReq: false }
                    if (item == 'ktp') object = { value: item, label: 'KTP', isReq: false }

                    if (item == 'studentCard' && this.settings?.layout == 'smkcoding') object = { value: item, label: 'Kartu Pelajar', isReq: false }

                    object.checked = false
                    this.requirementOptions.push(object)

                })

                // this.requirementOptions.push({ value: 'custom_fields', name: `Custom Fields`, value: `{\"\": \"text\"}` })

                if (this.isSchoolCase) this.getSchools()
                else this.fetchAllPrograms()
            }
        },

        async getSchools() {

            const params = { page: null }

            await this.$store.dispatch( 'Schools/list', params )

            if( !this.schoolsState.status ) {

                console.error('Failed fetch list schools: ', this.servicesState.message)
                this.setEvent(this.servicesState.message, false)
                this.isLoaded = true

            } else {

                this.listSchool = this.schoolsState.data ?? []

                const schools = this.listSchool ?? []
                schools.map((item) => {
                    const object = {
                        value: item?.id,
                        label: item?.name,
                        checked: false,
                    }
                    this.schoolOptions.push(object)
                })

                this.fetchAllPrograms()

            }

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
        // Classrooms
        async fetchClassroomDetail(){
            await this.$store.dispatch('Services/classroomDetail', {id: this.classroomId})

            if(!this.servicesState.status) {
                console.error('Failed fetch classroom detail', this.servicesState.message)
                this.setEvent(this.servicesState.message, false)
                this.isLoaded = true
            } else {
                const classroomDetail = this.servicesState.classroomDetail
                this.detailClassroom = classroomDetail;

                this.imageLogo = classroomDetail?.logo

                this.inputOverview?.map((item, index) => {
                    if(item.name == 'quota') {
                        if (classroomDetail?.quota === -1) {
                            this.isUnlimited = true
                            this.inputOverview[index].value = ""
                        } else this.inputOverview[index].value = classroomDetail?.quota
                    }else if((item.name == 'schoolId' || item.name == 'schools') && this.isSchoolCase) {
                        if (classroomDetail?.schools) {
                            this.selectedSchool = [...classroomDetail?.schools]
                        } else {
                            this.selectedSchool = null
                        }

                        // if (classroomDetail?.schoolId) {
                        //     this.selectedSchool = {
                        //         id: classroomDetail?.schoolId ?? -1,
                        //         name: classroomDetail?.school ?? 'Nama Sekolah'
                        //     }
                        // } else this.selectedSchool = null
                    }else if(item?.name === 'visibility'){
                        this.selectedVisibility = this.optionVisibility.find((item) => item?.value === classroomDetail?.visibility)
                    }else{
                        this.inputOverview[index].value = classroomDetail?.[item.name] ?? null
                    }
                })

                this.inputDetail?.map((item, index) => {
                    if(item.name == 'groupLink') {
                        this.inputDetail[index].value = classroomDetail?.groupLink
                    }
                    if(item.name == 'visibility') {
                        this.selectedVisibility = this.optionVisibility.find((item) => item?.value === classroomDetail?.visibility)
                    }

                    if(item.name == 'mode') {
                        this.selectedMode = this.optionMode.find((item) => item?.value === classroomDetail?.mode)
                        this.tempSelectedMode = this.optionMode.find((item) => item?.value === classroomDetail?.mode)
                    }

                    if(item.name == 'type') {
                        this.selectedType = this.optionType.find((item) => item?.value === classroomDetail?.type)
                    }

                    if(item.name == 'level') {
                        this.selectedLevel = this.optionLevel.find((item) => item?.value === classroomDetail?.level)
                    }
                    if((item.name == 'schoolId' || item.name == 'schools') && this.isSchoolCase) {
                        if (classroomDetail?.schools) {
                            this.selectedSchool = [...classroomDetail?.schools]
                        } else {
                            this.selectedSchool = null
                        }

                        // if (classroomDetail?.schoolId) {
                        //     this.selectedSchool = {
                        //         id: classroomDetail?.schoolId ?? -1,
                        //         name: classroomDetail?.school ?? 'Nama Sekolah'
                        //     }
                        // } else this.selectedSchool = null
                    }
                })

                this.inputAdvanced?.map((item, index) => {
                    if(item.name == 'quota') {
                        if (classroomDetail?.quota === -1) {
                            this.isUnlimited = true;
                            this.inputAdvanced[index].value = "";
                        } else this.inputAdvanced[index].value = classroomDetail?.quota;
                    }else{
                        this.inputAdvanced[index].value = classroomDetail?.[item?.name];
                    }
                })

                this.inputDate?.map((item, index) => {
                    if (classroomDetail?.alwaysOpen) this.isAlwaysOpen = true
                    else {
                        this.isAlwaysOpen = false
                        this.inputDate[index].value = moment(classroomDetail?.[item?.name]).format('YYYY-MM-DD HH:mm:ss')
                    }
                    if(item.name == 'certificateRelease') {
                        if (classroomDetail?.certificateRelease) {
                            this.inputDate[index].value = moment(classroomDetail?.certificateRelease).format('YYYY-MM-DD')
                            this.publishCertificateDate = this.inputDate[index].value
                            this.isPublishCertificate = true
                        }
                    }
                })

                this.activeState = classroomDetail?.state

                if (this.activeState === 'draft') this.isSaveToDraft = true

                 // Set Registrar City
                if(classroomDetail.registrarCity != null && classroomDetail.registrarCity != []) {
                    classroomDetail.registrarCity.map((item) => {
                        const cityIndex = this.cityOptions.findIndex((city) => city.value === item.id)
                        if (cityIndex != -1){
                            this.cityOptions[cityIndex].checked = true
                            this.citySelected.push(this.cityOptions[cityIndex]);
                        }
                    })
                }

                // Set City Held
                if(classroomDetail.heldCity != null && classroomDetail.heldCity != []) {
                    classroomDetail.heldCity.map((item) => {
                        const cityIndex = this.cityHeldOptions.findIndex((city) => city.value === item.id)
                        if (cityIndex != -1) {
                            this.cityHeldOptions[cityIndex].checked = true;
                            this.cityHeldSelected.push(this.cityHeldOptions[cityIndex]);
                        }
                    })
                }

                if(classroomDetail.mentors != null && classroomDetail.mentors != []) {
                    classroomDetail.mentors.map((item) => {
                        const userIndex = this.userOptions.findIndex((user) => user.value === item.id)
                        if (userIndex != -1) this.userOptions[userIndex].checked = true
                    })

                    this.userOptions?.forEach((user) => {
                        if (user.checked) this.usersSelected.push(user)
                    })
                }

                if(classroomDetail?.preClassId){
                    this.classSelected = this.listClass.find((item) => item?.value === classroomDetail?.preClassId);
                }

                if(classroomDetail?.schoolId) {
                    const schoolIndex = this.schoolOptions.findIndex((school) => school.value === classroomDetail?.schoolId)
                    if (schoolIndex != -1) this.schoolOptions[schoolIndex].checked = true

                    this.selectedSchool = null
                }

                if(classroomDetail?.schools != null && classroomDetail?.schools != []) {
                    classroomDetail.schools.map((item) => {
                        const schoolIndex = this.schoolOptions.findIndex((school) => school.value === item.id)
                        if (schoolIndex != -1){
                            this.schoolOptions[schoolIndex].checked = true;
                            this.schoolsSelected.push(this.schoolOptions[schoolIndex]);
                        }
                    })
                }

                if(classroomDetail.modules != null && classroomDetail.modules != []) {
                    classroomDetail.modules.map((id) => {
                        const moduleIndex = this.moduleOptions.findIndex((modul) => modul.value === id)
                        if (moduleIndex != -1) this.moduleOptions[moduleIndex].checked = true
                    })
                }

                if(classroomDetail.requirementFields != null && classroomDetail.requirementFields != []) {
                    classroomDetail.requirementFields.map((item) => {
                        const isJSON = (str) => {
                            try {
                                JSON.parse(str)
                                return true
                            } catch (e) {
                                return false
                            }
                        }

                        let name = isJSON(item) ? JSON.parse(item)?.name : item
                        let nameSplit = name.split('custom_fields:')
                        if (nameSplit.length > 1) {
                            name = 'custom_fields'
                        }
                        const requirementIndex = this.requirementOptions.findIndex(requirement => requirement.value === name)
                        if (requirementIndex != -1) {
                            this.requirementOptions[requirementIndex].checked = true

                            if (isJSON(item)) {
                                if (JSON.parse(item)?.isReq) this.requirementOptions[requirementIndex].isReq = true;
                            } else this.requirementOptions[requirementIndex].isReq = true;

                            this.requirementSelected.push(this.requirementOptions[requirementIndex]);
                        }
                    })
                }

                if(this.programs) {
                    if(this.programs?.length != 0) {

                        this.programs?.map((item) => {

                            if(item?.value === classroomDetail.programId) {
                                this.setSelectedProgram(item)
                            }

                        })

                    }
                }

                // this.isLoaded = true
            }
        },
        // Progrmas
        async fetchAllPrograms(event = null) {
            if (event) {
                this.isProgramUpdate = false
                this.isLoadPrograms = true
            }

            this.programs = []
            this.selectedProgram = null

            await this.$store.dispatch('Services/allPrograms')

            if(!this.servicesState.status) {
                console.error('Failed fetch programs', this.servicesState.message)
                this.setEvent(this.servicesState.message, false)
                this.isLoaded = true
                this.isLoadPrograms = false
                this.errorProgramMessage = this.servicesState.message
            } else {
                this.errorProgramMessage = ""
                const programs = this.servicesState.programs ?? []
                programs.map((item) => {
                    const object = {
                        value: item?.id,
                        label: item?.name,
                    }
                    this.programs.push(object)
                })
                if (event) {
                    this.isLoadPrograms = false
                    this.programRequestChangeValue = {
                        label: event?.name,
                        value: event?.id
                    }
                    this.isProgramUpdate = true
                } else {
                    this.fetchMentors()

                }
            }
        },
        // Mentors
        async fetchMentors() {

            const params = { kind: 2 }

            await this.$store.dispatch('Users/users', params)

            if(!this.usersState.status) {
                console.error('Failed fetch users', this.usersState.message)
                this.setEvent(this.usersState.message, false)
                this.isLoaded = true
            } else {
                const users = this.usersState.users ?? []
                users.map((item) => {
                    const object = {
                        value: item?.id,
                        label: item?.name,
                        checked: false,
                    }
                    this.userOptions.push(object)
                })

                if (this.action == 'edit' || this.isPreview) {
                    this.onResetForm()
                    if(this.action === 'edit') await this.fetchListClass();
                    await this.fetchClassroomDetail()
                    this.isLoaded = true;
                } else {
                    this.onResetForm();

                    // Add default price
                    this.inputOverview?.map((input) => {
                        if(input?.name === 'price') input.value = 0;
                    })

                    this.isLoaded = true
                }

            }

        },
        setSelectedProgram(data) {
            this.selectedProgram = data
            // this.programs.map((item, i) => {
            //     if(item.id == id) {
            //         this.programs[i].selected = true
            //         this.selectedProgram = item
            //     } else {
            //         this.programs[i].selected = false
            //     }
            // })
        },
        // Submit Form
        onSubmitForm(event) {
            event.preventDefault();

            if (!this.isSaveToDraft && !this.isEditPage) {

                // if (this.selectedProgram == null) {
                //     return this.setEvent('Pilih Program Terlebih Dahulu', false)
                // }
                // if (this.selectedMode == null) {
                //     return this.setEvent('Pilih Mode Kelas Terlebih Dahulu', false)
                // }
                // if (this.selectedType == null) {
                //     return this.setEvent('Pilih Tipe Kelas Terlebih Dahulu', false)
                // }
                // if (this.isSchoolCase && this.selectedSchool == null) {
                //     return this.setEvent('Pilih Sekolah Terlebih Dahulu', false)
                // }

                // if (this.isSchoolCase && this.schoolsSelected?.length === 0) {
                //     return this.setEvent('Pilih Sekolah Terlebih Dahulu', false)
                // }
                // if(this.citySelected.length === 0 && this.provinceSelected?.length === 0) {
                //     return this.setEvent('Pilih Kota / Provinsi Pendaftar Terlebih Dahulu', false)
                // }
                if (this.tempSelectedMode != null && this.tempSelectedMode != this.selectedMode) {
                    return this.modalModeConfirmation = true
                }
                // if (!this.isUnlimited) {
                //     let isQuotaZero = false
                //     this.inputAdvanced?.forEach((item, index) => {
                //         console.log(item.name, item.value, 1206);
                //         if(item.name == 'quota' && (item.value == 0 || item.value == '0')) isQuotaZero = true
                //     })
                //     if (isQuotaZero) return this.setEvent('Quota kelas tidak boleh 0', false)
                // }

            }

            if (this.action == 'edit' && (!this.isPreview || this.isEditPage)) {
                this.processFormData(null)
            } else {
                // if (this.isSaveToDraft) this.processFormData('draft')
                // else this.modalConfirmation = true
                if (!this.isPreview) this.processFormData('draft')
                else this.modalConfirmation = true
            }
        },
        processFormData(state) {

            this.modalConfirmation = false

            this.inputForm = this.inputOverview.concat(this.inputAdvanced);

            // Validation of Setting Schedule
            const resultProcessInputDate = this.checkingInputDate();
            if(!resultProcessInputDate?.isSuccess) return this.setEvent(resultProcessInputDate?.messageError, false);
            else this.output = { ...this.output, ...resultProcessInputDate.data };

            // Validation of price
            const priceClass = this.inputForm?.find(input => input.name === 'price');
            if(priceClass?.value > 0 && priceClass?.value < 10000) return this.setEvent("Harga kelas minimal adalah Rp10.000, harap perbarui harga Anda.", false);

            let textDescription = ""

            this.inputForm.map((item) => {
                if(item.name == 'quota'){
                    if(!item?.value || (item.value == 0 || item.value == '0')){
                        this.output[item.name] = -1;
                        this.isUnlimited = true;
                    }else this.output[item.name] = parseInt(item.value);
                }else if(item.name == "minScore") this.output[item.name] = !item?.value ? 0 : parseInt(item.value);
                else if(item.name == 'description') {
                    textDescription = item?.value ?? null
                    this.output[item.name] = item?.value ?? null
                } else if (item.type == 'number') this.output[item.name] = item?.value ? parseInt(item?.value) : 0
                else if (item.name == 'schoolId' && this.isSchoolCase) this.output[item.name] = this.selectedSchool?.id
                else if (item.name == 'schools' && this.isSchoolCase) {
                    let school_id = []
                    if(this.schoolsSelected?.length > 0){
                        this.schoolsSelected.forEach(school => school_id.push(school?.value));
                    }
                    this.output[item.name] = school_id
                }
                else this.output[item.name] = item?.value ?? null
            });

            if (!this.isSaveToDraft && !textDescription) {
                return this.setEvent("Isi Deskripsi Kelas Terlebih Dahulu")
            }

            // Registrant CityId
            var cityId = []
            if(this.citySelected?.length > 0){
                this.citySelected.map((item) => {
                    cityId.push(item.value)
                })
            }else cityId.push(0);

            // City Held
            var cityIdHeld = []
            if(this.cityHeldSelected?.length > 0){
                this.cityHeldSelected.map((item) => {
                    cityIdHeld.push(item.value)
                })
            }else cityIdHeld.push(0);


            var provinceId = []
            this.provinceSelected.map((item) => {
                provinceId.push(item.value)
            })

            var provinceIdHeld = []
            this.provinceHeldSelected.map((item) => {
                provinceIdHeld.push(item.value)
            })

            var modulesId = []
            this.modulesSelected.map((item) => {
                modulesId.push(item.value)
            })

            var mentorsId = []
            if(this.usersSelected?.length > 0){
                this.usersSelected.map((item) => {
                    mentorsId.push(item.value)
                })
            }

            let schoolsId = []
            this.schoolsSelected.map((item) => {
                schoolsId.push(item.value)
            })

            var requirementFields = []
            this.requirementSelected.map((item) => {

                if (item.id == 'custom_fields') {
                    const data = {
                        name: `custom_fields:${item.value}`,
                        isReq: item.isReq
                    }
                    requirementFields.push(JSON.stringify(data))
                }
                else {
                    const data = {
                        name: item.value,
                        isReq: item.isReq
                    }
                    requirementFields.push(JSON.stringify(data))
                }

            })

            this.output.programId = this.selectedProgram?.value ?? null
            this.output.visibility = this.selectedVisibility?.value ?? null
            this.output.mode = this.selectedMode?.value ?? null
            this.output.type = this.selectedType?.value ?? null
            this.output.level = this.selectedLevel?.value ?? null

            this.output.registrarCity = cityId ?? null;
            this.output.heldCity = cityIdHeld ?? null;

            this.output.registrarProvince = provinceId ?? null
            this.output.heldProvince = provinceIdHeld ?? null

            // this.output.modules = modulesId ?? null
            this.output.mentors = mentorsId ?? null
            // this.output.schools = schoolsId ?? null
            this.output.requirementFields = requirementFields ?? null
            // this.output.alwaysOpen = this.isAlwaysOpen ?? null
            this.output.preClassId = this.classSelected?.value ?? null;

            if (this.isUnlimited) this.output.quota = -1

            // if (this.action != 'edit') this.output.state = state
            if (this.isPreview) this.output.state = state
            else if (this.action != 'edit') this.output.state = 'draft'
            else this.output.state = this.activeState

            // Delete unused attribute
            delete this.output.registrantCity
            delete this.output.cityHeld
            delete this.output.registrantProvince
            delete this.output.provinceHeld

            // Delete schools if school case false
            if (!this.isSchoolCase) {
                delete this.output.schoolId
                delete this.output.schools
            }

            if(this.action == 'edit') {

                if(this.output['logo'] == '' || this.output['logo'] == null) {

                    if(this.imageLogo) this.output['logo'] = this.imageLogo ?? ''

                }

            } else {

                if(this.imageLogo) this.output['logo'] = this.imageLogo

            }

            this.fetchPost(this.output, state);

            this.output = {};
            this.inputForm = []
        },
        async fetchPost(params, state) {
            this.isSubmit = true;

            var dispatch = ""
            var parameters = params

            if (this.action == 'edit') {
                dispatch = 'Services/editClassroom'
                parameters = {
                    classroomId: this.classroomId,
                    params: params,
                }
            } else dispatch = 'Services/createClassroom'

            try {
                await this.$store.dispatch(dispatch, parameters);

                if (!this.servicesState.status) {
                    console.error(`Failed ${this.action} classroom`, this.servicesState.message)

                    this.modalConfirmation = false
                    setTimeout(() => {
                        this.isSubmit = false;
                        this.setEvent(this.servicesState.message, false);
                    }, 500)
                } else {
                    // var message = `Berhasil ${this.action != 'edit' ? `Menambah` : 'Mengubah'} Data.`
                    if(this.action != 'edit') this.onResetForm()

                    setTimeout(() => {

                        this.modalConfirmation = false
                        // this.setEvent(message, true)
                        this.isSubmit = false;

                        const res = this.isTestCase ? 'tes' : 'classroom'

                        setTimeout(() => {
                            localStorage.removeItem('redirectTab')
                            if (params?.state === 'draft') localStorage.setItem('redirectTab', 'draft')
                            else this.setActiveTab('all')
                            // localStorage.removeItem('classroomId')
                            // this.$router.replace(`/dashboard/${res}`)

                            localStorage.setItem('classroomId', toEncrypt(this.servicesState?.data?.id))
                            this.$emit('onSave', { slug: this.servicesState?.data?.slug, step: 'course' })
                            // this.$emit('changeStep', 'course')

                            if (this.isPreview) this.$router.replace(`/dashboard/${res}`)
                        }, 50);

                    }, 50);

                }
            } catch (error) {
                console.error(`Gagal ${this.action != 'edit' ? `Menambah` : 'Mengubah'} Data.`, error);
                this.setEvent(error, false);

                this.modalConfirmation = false
                setTimeout(() => {
                    this.isSubmit = false;
                }, 500);
            }
        },
        // Reset Form Input
        onResetForm() {
            this.inputOverview?.map((item, index) => {
                // if (item?.name === 'logo') this.inputOverview[index].value = null
                // else this.inputOverview[index].value = ""
                this.inputOverview[index].value = ""
            })
            this.inputOthers?.map((item, index) => {
                this.inputOthers[index].value = ""
            })
            this.inputDetail?.map((item, index) => {
                // if (item?.name === 'visibility') this.inputDetail[index].value = this.optionVisibility[0]
                // if (item?.name === 'type') this.inputDetail[index].value = this.optionType[0]
                if (item?.name === 'level') this.inputDetail[index].value = this.optionLevel[0]
                else this.inputDetail[index].value = ""
            })

            this.inputAdvanced.map((item, index) => {
                if(item?.name === 'quota'){
                    this.isUnlimited = false;
                    this.inputAdvanced[index].value = "";
                }else this.inputAdvanced[index].value = "";
            })


            this.inputDate?.map((item, index) => {
                this.inputDate[index].value = "";
            })
            this.isAlwaysOpen = false;
            this.isPublishCertificate = false;


            //Program
            this.selectedProgram = null
            // City
            this.cityOptions?.map((item, index) => {
                this.cityOptions[index].checked = false
            })
            this.cityHeldOptions?.map((item, index) => {
                this.cityHeldOptions[index].checked = false
            })
            this.citySelected = []
            this.cityHeldSelected = []
            // Requirements
            this.requirementOptions?.map((item, index) => {
                this.requirementOptions[index].checked = false
            })
            this.requirementSelected = []
            // Users
            this.userOptions?.map((item, index) => {
                this.userOptions[index].checked = false
            })
            this.usersSelected = []
            // Schools
            this.schoolOptions?.map((item, index) => {
                this.schoolOptions[index].checked = false
            })
            this.schoolsSelected = []
            // Modules
            this.moduleOptions?.map((item, index) => {
                this.moduleOptions[index].checked = false
            })
            this.modulesSelected = []
            // Form
            this.activeState = 'release'
            this.output = {}
            this.inputForm = []
            // Type
            this.selectedMode = this.optionMode[0]
            this.selectedType = this.optionType[0]
            this.selectedLevel = this.optionLevel[0]
            this.selectedVisibility = this.optionVisibility[0]

            // Prerequisite Class
            this.classSelected = null;
        },

        onProgramChanged(event) {
            this.selectedProgram = event
            this.programRequestChangeValue = null
        },
        async fetchListClass(){
            const params = {};

            if(this.action === "edit") params.preClass = this.detailClassroom?.id;

            await this.$store.dispatch("Services/classrooms", params);

            if(!this.servicesState?.status){
                console.error("Failed to Fetch list class : " + this.servicesState?.message);
                this.setEvent(this.servicesState.message, false);
            }else{
                const classrooms = this.servicesState?.classrooms;
                classrooms?.map((item) => {
                    const object = {
                        value: item?.id,
                        label: item?.name,
                    }
                    this.listClass.push(object)
                });
            }
        },
        checkingInputDate(){
            let output = {};
            let listInputNotFilled = [];

            const inputScheduleOfClass = this.inputDate.filter(item => item.name !== "certificateRelease");
            const isAllNotInputFilled = inputScheduleOfClass.every(input => input.value == "");
            if(isAllNotInputFilled && !this.isAlwaysOpen) this.isAlwaysOpen = true;

            this.inputDate.map(item => {
                if(item.type == 'datetime-local' && item.name != 'certificateRelease') {
                    if (this.isAlwaysOpen) {
                        output["alwaysOpen"] = this.isAlwaysOpen
                        output[item.name] = null
                    } else {
                        if(item.value) output[item.name] =  moment(item.value).format('YYYY-MM-DDTHH:mm:ssZ');
                        else output[item.name] = null, listInputNotFilled.push(item);
                        output["alwaysOpen"] = this.isAlwaysOpen
                    }
                } else if(item.type == 'datetime-local' && item.name == 'certificateRelease') {
                    if (this.isPublishCertificate) output[item.name] = this.publishCertificateDate ? moment(this.publishCertificateDate).format('YYYY-MM-DDTHH:mm:ssZ') : null;
                    else output[item.name] = null
                }
            })

            if(listInputNotFilled.length > 0) return { isSuccess: false, messageError: `Mohon untuk mengisi ${listInputNotFilled[0]?.label}`, data: null};
            else return { isSuccess: true, messageError: "", data: { ...output } };
        }
    },

    destroyed() {
        this.onResetForm()
    }

}
</script>

<style lang="scss" scoped>
.box-button ::v-deep {
    margin: 0;
    gap: 12px;
}
</style>