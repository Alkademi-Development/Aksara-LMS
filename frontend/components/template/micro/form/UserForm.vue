<template>
    <div class="col-lg-8 card-wrapper" >
        <div class="card">
            <div class="card-header">
                <div class="row">
                    <div class="col-6 d-flex align-items-center">
                        <!-- <CircleBackButton class="d-inline-block" /> -->
                        <h3 class="d-inline-block mb-0">{{ action | capitalize }} {{ title | capitalize }}</h3>
                    </div>
                </div>
            </div>
            <div class="card-body" v-if="isLoaded">
                <b-alert 
                    v-model="onEvent.show"
                    :variant="onEvent.variant"
                    dismissible
                    fade
                >
                    {{ onEvent.message }}
                </b-alert>
                <b-form @submit.stop.prevent="onSubmitForm">
                    <div v-for="(input, index) in inputForm" :key="index" >
                        <b-form-group
                            v-if="input.type != 'select' && input.type != 'textarea' && input.type != 'role' && input.type != 'radio' && input.type != 'file'"
                            :label="input.label"
                            :label-for="input.label"
                            :description="input.description"
                        >
                            <b-form-input
                                v-model="input.value"
                                :id="input.label"
                                :min="!!input.min ? input.min : 0"
                                :placeholder="input.placeholder"
                                :required="input.type === 'password' && action === 'edit' ? false : input.required"
                                :type="input.type"
                                :value="input.value"
                                :disabled="input.type === 'email' && action === 'edit'"
                                :aria-describedby="input.name"
                                ></b-form-input>
                                <b-form-text :id="input.name">
                                    <span v-if="input.type === 'email' && action === 'edit'">
                                        Email yang telah terdaftar tidak dapat diubah.
                                    </span>
                                    <!-- <span v-if="input.type === 'password'">
                                        Your password must be 8-20 characters long, contain letters and numbers, and must not
                                        contain spaces, special characters, or emoji.
                                    </span> -->
                                </b-form-text>
                            </b-form-group>

                        <b-form-group
                            v-if="input.type === 'select' && input.name === 'program'"
                            :label="input.label"
                            :label-for="input.label"
                        >
                            <b-form-select
                            v-model="input.value"
                            :id="input.label"
                            :value="input.value"
                            :options="input.options"
                            :required='input.required' />
                        </b-form-group>
                            
                        <b-form-group
                            v-if="input.type === 'file' && input.name === 'photo'"
                            :label="input.label"
                            :label-for="input.label"
                        >
                            <b-form-file
                                v-model="photoProfile"
                                :state="Boolean(input.value)"
                                placeholder="Pilih file atau letakkan di sini..."
                                drop-placeholder="Letakkan di sini..."
                                accept="image/jpeg, image/png"
                            ></b-form-file>
                        </b-form-group>

                        <b-form-group
                            v-if="input.type === 'file' && input.name === 'raport'"
                            :label="input.label"
                            :label-for="input.label"
                        >
                            <b-form-file
                            v-model="raportFile"
                            :state="Boolean(input.value)"
                            placeholder="Pilih file atau letakkan di sini..."
                            drop-placeholder="Letakkan di sini..."
                            ></b-form-file>
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
                            ></b-form-textarea>
                        </b-form-group>

                        <b-form-group
                            v-if="input.type == 'select' && input.name === 'gender'"
                            :label="input.label"
                            :label-for="input.label"
                            :description="input.description"
                        >
                            <b-form-select v-model="selectedGender" :options="gender"></b-form-select>
                        </b-form-group>

                        <b-form-group
                            v-if="input.type == 'select' && input.name === 'regionId' && selectedKind?.value === 9"
                        >
                            <div class="d-flex align-items-center justify-content-between mb-3">
                                <label :for="input.label" class="d-block mb-0 mr-2">{{ input.label }}</label>
                                <b-button class="btn btn-transparent d-flex align-items-center py-1 px-2 text-primary" variant="transparent" @click="isModalCreateRegion = true">
                                    <i class="ri-add-line"></i>
                                    Tambah Baru
                                </b-button>
                            </div>
                            <v-select
                                class="select-city form-control mb-3"
                                placeholder="Ketik untuk mencari region"
                                :options="regions"
                                label="name"
                                :id="input.label"
                                v-model="selectedRegion"
                            >
                                <template v-slot:no-options="{ search, searching }">
                                    <template v-if="searching">
                                    Tidak ada hasil untuk <em>{{ search }}</em>.
                                    </template>
                                    <em style="opacity: 0.5;" v-else>Ketik untuk mencari.</em>
                                </template>
                            </v-select>
                        </b-form-group>

                        <b-form-group
                            v-if="input.type == 'select' && input.name === 'programId' && selectedKind?.value === 7"
                        >
                            <div class="d-flex align-items-center justify-content-between mb-3">
                                <label :for="input.label" class="d-block mb-0 mr-2">{{ input.label }}</label>
                            </div>
                            <v-select
                                class="select-city form-control mb-3"
                                placeholder="Ketik untuk mencari program"
                                :options="programs"
                                label="name"
                                :id="input.label"
                                v-model="selectedProgram"
                            >
                                <template v-slot:no-options="{ search, searching }">
                                    <template v-if="searching">
                                    Tidak ada hasil untuk <em>{{ search }}</em>.
                                    </template>
                                    <em style="opacity: 0.5;" v-else>Ketik untuk mencari.</em>
                                </template>
                            </v-select>
                        </b-form-group>

                        <!-- Kind Options -->
                        <b-form-group
                            v-if="input.name === 'kind'"
                            :label="input.label"
                            :label-for="input.label"
                            :description="input.description"
                        >
                            <div id="city-selected">
                                <div class="mb-3 row">
                                    <div v-for="(item, index) in kinds" :key="index" class="col col-lg-4 mb-3">
                                        <div 
                                            :class="['w-100 border-0 program-card', item.selected ? 'bg-primary text-white' : '', item.isDisabled ? 'disabledbutton' : '']" 
                                            @click.stop.prevent="setSelectedKind(item.value)"
                                        >
                                            <span class="program" style="color: inherit;">{{ item.label | capitalize }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-form-group>
                    </div>

                    <div v-if="!isSubmit">
                        <b-button type="submit" variant="primary">{{ action | capitalize }} User</b-button>
                    </div>
                    <div v-else class="text-center card-body">
                        <b-spinner label="Spinning"></b-spinner>
                    </div>
                </b-form>
            </div>
            <div class="text-center" v-else>
                <b-spinner label="Spinning"></b-spinner>
            </div>
        </div>
        <b-modal v-model="isModalCreateRegion" size="md" centered hide-header hide-footer no-close-on-backdrop no-close-on-esc>
            <h5 class="mb-3">Tambah Region Baru</h5>
            <RegionForm
                :isFromModal="true"
                :hideHeader="true"
                :isCard="false"
                customClass="col-lg-12"
                @canceled="isModalCreateRegion = false"
                @submitted="submitHandle($event)"/>
        </b-modal>
        <b-modal id="modalLoading" size="md" centered hide-header hide-footer no-close-on-backdrop no-close-on-esc>
            <div class="d-flex align-items-center justify-content-center">
                <b-spinner label="Spinning" class="mr-3"></b-spinner>
                <span>Loading...</span>
            </div>
        </b-modal>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { ROLES_USERS } from '@/commons/constants/users'
import fieldForm from '@/store/global/users'

import { toDecrypt } from '~/commons/utils'

import RegionForm from '@/components/template/micro/form/RegionForm.vue'

export default {
    layout: 'dashboard',
    components: { RegionForm },
    data() {
        return {
            action: '',
            title: '',
            userId: null,

            submitted: false,
            isLoaded: false,
            isSubmit: false,
            isModalCreateRegion: false,

            fieldForm: fieldForm,
            fieldSelectProgram: {
                label: "Pilih Program *",
                name: "program",
                placeholder: "",
                options: [],
                required: true,
                type: ""
            },
            
            photoProfile: null,
            raportFile: null,
            inputForm: [],
            selectedKind: {},
            selectedGender: '',
            cities: [],
            gender: [
                {
                    text: 'Laki - laki',
                    value: 'L'
                },
                {
                    text: 'Perempuan',
                    value: 'P'
                },
            ],

            kinds: [],

            programs: [],
            selectedProgram:{},

            regions: [],
            selectedRegion: {},
            
            onEvent: {
                message: '',
                status: true,
                show: false,
                variant: ''
            },
            user: [],
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
            usersState: (state) => state?.Users,
            regionState: (state) => state?.Region,
            servicesState: (state) => state?.Services
        })
    },
    created(){
        this.getCredentials()
    },
    methods: {
        ...mapActions({
            getRegions: "Region/list"
        }),
        setSelectedKind(value) {
            this.kinds.map((item, i) => {
                if(item.value === value) {
                    this.kinds[i].selected = true
                    this.selectedKind = item
                    // const index = this.inputForm.findIndex(item => item.name === "program")
                    // if(this.kinds[i].label === "Lead Program" && this.kinds[i].selected){
                    //     this.inputForm.splice(4,0,this.fieldSelectProgram)
                    // }
                    // else if(index > -1) this.inputForm.splice(index, 1)
                    // else{
                    //     if(index > -1) this.inputForm.splice(index, 1)
                    // }
                } else {
                    this.kinds[i].selected = false
                }
            })
        },
        getCredentials() {
            const url = this.$router.currentRoute.fullPath
            var res = url.split('/')
            res.shift()

            this.title = res?.[1]
            this.action = res?.[2]?.split('?')?.[0]
            this.userId = toDecrypt(localStorage.getItem('userId')) || res?.[3]

            this.fetchRegion()
            this.fetchProgram()

        },
        fetchRegion(state) {
            this.getRegions().then(() => {
                this.regions = this.regionState?.data ?? []
                if (!state) this.fetchForm()
            })
        },
        async fetchProgram(state){
            const payload = {
                page: null,
                perPage: null,
                sort: null,
                keyword: null
            }
            await this.$store.dispatch('Services/programs', payload)

            if(!this.servicesState.status){
                console.error("failed to fetch programs : ", this.servicesState.message)
                this.setEvent(this.servicesState.message)
            } else{
                this.programs = this.servicesState?.data ?? []
                if (!state) this.fetchForm()
            }
        },
        fetchForm() {
            this.inputForm = this.fieldForm?.inputCommonUser
            this.kinds = ROLES_USERS

            if(this.action == 'edit' && this.userId != null) {
                this.onResetForm()
                this.fetchUserById()
            } else{
                this.onResetForm()
                this.isLoaded = true
            }
        },
        async fetchUserById() {
            await this.$store.dispatch('Users/getDetailUser', this.userId)

            if(!this.usersState.status) {
                console.error('Failed fetch module', this.usersState.message)
                this.setEvent(this.usersState.message, false)
                this.isLoaded = true
            } else {
                let userDetail = this.usersState.user
                this.inputForm.map((item) => {
                    switch (item.name) {
                        case 'kind':
                            this.setSelectedKind(userDetail?.user?.kind)
                            item.value = userDetail?.user?.kind
                            break;
                        case 'name':
                            item.value = userDetail?.user?.name
                            break;
                        case 'email':
                            item.value = userDetail?.user?.email
                            break;
                        case 'phone':
                            item.value = userDetail?.user?.phone
                            break;
                        case 'regionId':
                            const region = userDetail?.user?.region
                            this.selectedRegion = region ?? {}
                            break;
                        case 'programId':
                            const program = userDetail?.user?.program
                            this.selectedProgram = program ?? {}
                            break;
                        case 'gender':
                            this.selectedGender = userDetail?.user?.gender
                            item.value = userDetail?.user?.gender
                            break;
                        default:
                            break;
                    }
                })
                this.isLoaded = true
            }
        },
        onResetForm() {
            this.inputForm.forEach(item => {
                if (item.name == 'type') item.value = this.$route.query.type ?? 'module'
                else item.value = '';
            });
            this.kinds.forEach(item => {
                item.selected = false;
            })
            this.selectedKind = {}
            this.selectedGender = ''
        },
        onSubmitForm() {
            let output = {}
            let pass = ''
            let retypepass = ''

            const isKindEmpty = Object.keys(this.selectedKind).length === 0
                && this.selectedKind.constructor === Object 

            const isRegionEmpty = Object.keys(this.selectedRegion).length === 0
                && this.selectedRegion.constructor === Object 

            const isProgramEmpty = Object.keys(this.selectedProgram).length === 0
                && this.selectedProgram.constructor === Object 
                

            this.inputForm.forEach(item => {
                if (item.name === 'password') {
                    pass = item.value
                }
                if (item.name === 'retypepassword') {
                    retypepass = item.value
                }

                if (this.action === 'create') {
                    if (item.name !== 'retypepassword') {
                        output[item.name] = item.value
                    }
                }
                
                if (this.action === 'edit') {
                    if (item.name === 'password') {
                        if (!!item.value) {
                            output[item.name] = item.value
                        }
                    }else {
                        if (item.name !== 'retypepassword') {
                            output[item.name] = item.value
                        }
                    }

                }
                

                if (item.name === 'gender') {
                    output[item.name] = this.selectedGender
                }
                if (item.name === 'kind') {
                    output[item.name] = this.selectedKind.value
                }
                if (item.name === 'regionId' && this.selectedKind.value === 9) {
                    output[item.name] = this.selectedRegion.id
                }
                if (item.name === 'programId' && this.selectedKind.value === 7) {
                    output[item.name] = this.selectedProgram.id
                }
            })
            
            if (this.selectedKind.value !== 7) delete output.programId
            if (this.selectedKind.value !== 9) delete output.regionId

            if (isKindEmpty) {
                return this.setEvent("Pilih role terlebih dahulu!", false)
            }

            if (isRegionEmpty && this.selectedKind.value === 9) {
                return this.setEvent("Pilih region terlebih dahulu!", false)
            }

            if (isProgramEmpty && this.selectedKind === 7) {
                return this.setEvent("Pilih program terlebih dahulu!", false)
            }
            
            if (pass !== retypepass) {
                return this.setEvent("Password tidak sama!", false)
            }else {
                return this.handlePostUser(output)
            }

        },
        async handlePostUser(params) {
            this.isSubmit = true
            this.$bvModal.show('modalLoading')
            
            let dispatch = 'Users/postUser'
            let payload = params

            if (this.action === 'edit') {
                dispatch = 'Users/editUser'
                payload = {
                    userId: this.userId,
                    body: params,
                }
            }

            await this.$store.dispatch(dispatch, payload)
            
            if(!this.usersState.status) {
                console.error(`Failed ${this.action == 'edit' ? 'edit' : 'create'} module`, this.usersState.message)
                this.isSubmit = false
                this.$bvModal.hide('modalLoading')
                setTimeout(() => {
                    this.setEvent(this.usersState.message, this.usersState.status)
                }, 500);
            } else {
                let message = `Berhasil ${this.action == 'edit' ? 'Mengubah' : 'Menambah'} Data.`
                this.isSubmit = false
                this.$bvModal.hide('modalLoading')

                this.onResetForm()

                setTimeout(() => {
                    this.setEvent(message, this.usersState.status)
                    setTimeout(() => {
                        this.$router.replace(`/dashboard/users`)
                    }, 1000);
                }, 500);
            }
        },
        submitHandle(event){
            this.fetchRegion("refresh")
            this.isModalCreateRegion = false
        },
        setEvent(message, status){
            window.scrollTo(0,0)
            this.onEvent.message = message
            this.onEvent.status = status
            this.onEvent.variant = status == true ? 'success' : 'warning'
            this.onEvent.show = true
        },
    }
}
</script>

<style lang="scss" scoped>
    .disabledbutton {
        pointer-events: none;
        opacity: 0.6;
    }
</style>