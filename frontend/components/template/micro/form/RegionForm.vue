<template>
    <b-form @submit="onSubmitForm" class="row">
        <div :class="customClass" >
            <div :class="isCard ? 'card' : ''">
                <div v-if="!hideHeader" :class="isCard ? 'card-header' : ''">
                    <div class="row">
                        <div class="col-6 d-flex align-items-center">
                            <CircleBackButton class="d-inline-block" />
                            <h3 class="d-inline-block mb-0">{{ title }}</h3>
                        </div>
                    </div>
                </div>
                <div :class="isCard ? 'card-body' : ''" v-if="isLoaded">
                    <b-alert 
                        v-model="onEvent.show"
                        :variant="onEvent.variant"
                        dismissible
                    >
                        {{ onEvent.message }}
                    </b-alert>
                    <div>

                        <b-form-group
                            label="Nama *"
                            label-for="input-region-name"
                        >
                            <b-form-input
                                v-model="regionName"
                                id="input-region-name"
                                type="text"
                                :required='true'
                            ></b-form-input>
                        </b-form-group>

                        <b-form-group
                            label="Provinsi *"
                            label-for="input-province"
                        >
                            <SelectDropdown 
                                id="input-province"
                                selectedLabel="Provinsi Terpilih"
                                :options="provinces" 
                                :itemSelected="selectedProvinces" 
                                placeholder="Ketik untuk mencari provinsi"
                                @onChangeItemSelected="selectedProvinces = $event"/>
                        </b-form-group>

                    </div>
                </div>
                <div class="card-body text-center" v-else>
                    <b-spinner label="Spinning"></b-spinner>
                </div>
            </div>
        </div>

        <div v-if="isLoaded" :class="customClass">
            <div :class="isCard ? 'card' : ''">
                <div :class="isCard ? 'card-body' : ''">

                    <div class="row">
                        <div class="col-12 col-md-6 mb-3 mb-md-0 d-flex align-items-center">
                            <span>* Wajib Diisi</span>
                        </div>
                        <div class="col-12 col-md-6">
                            <div class="d-flex flex-wrap justify-content-left justify-content-md-end">
                                <b-button v-if="isFromModal" type="reset" :disabled="isSubmit" variant="danger" @click="$emit('canceled')">Batal</b-button>
                                <b-button v-else type="reset" :disabled="isSubmit" variant="danger">Reset</b-button>
                                <b-button type="submit" :disabled="isSubmit" variant="primary">Submit</b-button>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>

        <b-modal id="modalLoading" size="md" centered hide-header hide-footer no-close-on-backdrop no-close-on-esc>
            <div class="d-flex align-items-center justify-content-center">
                <b-spinner label="Spinning" class="mr-3"></b-spinner><span>Loading...</span>
            </div>
        </b-modal>

    </b-form>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import SelectDropdown from '@/components/template/micro/form/SelectDropdown.vue';

export default {
    layout: 'dashboard',
    computed: {
        ...mapState({
            servicesState: (state) => state.Services,
            regionState: (state) => state.Region,
        })
    },
    components: { SelectDropdown },
    data() {
        return {
            isSubmit: false,
            isLoaded: false,

            onEvent: {
                message: '',
                status: true,
                alertCounter: 0,
                variant: ''
            },

            regionName: '',

            provinces: [],
            selectedProvinces: []
        }
    },
    mounted() {
        this.fetchProvinces()
    },
    methods: {
        ...mapActions({
            getProvinces: "Services/provinces",
            addRegion: "Region/create",
            editRegion: "Region/update",
            detailRegion: "Region/detail",
        }),
        setEvent(message, status){
            window.scrollTo(0,0)
            this.onEvent.message = message
            this.onEvent.status = status
            this.onEvent.variant = status == true ? 'success' : 'warning'
            this.onEvent.show = true
        },

        fetchDetail() {
            this.detailRegion(this.id).then(() => {
                if (!this.regionState?.status) {
                    this.setEvent("Gagal memuat detail region: " + this.regionState?.message)
                    console.error("Failed to get detail region: " + this.regionState?.message)
                } else {
                    this.onEvent.show = false

                    const detailRegion = this.regionState?.data
                    this.regionName = detailRegion?.name

                    if(detailRegion?.provinceIds != null && detailRegion?.provinceIds != []) {
                        detailRegion?.provinceIds.map((id) => {
                            const province = this.provinces.find(item => item.id === id)

                            if(province != undefined) {
                                const filter = this.selectedProvinces.find(item => item.id === id)

                                if(filter == undefined) {
                                    this.selectedProvinces.push(province)
                                }

                            }
                        })
                    }

                    this.isLoaded = true

                }
            })
        },

        fetchProvinces() {
            this.getProvinces().then(() => {
                if (!this.servicesState?.status) {
                    this.setEvent("Gagal memuat list provinsi: " + this.servicesState?.message)
                    console.error("Failed to get provinces: " + this.servicesState?.message)
                } else {
                    this.onEvent.show = false
                    this.provinces = this.servicesState?.data

                    if (this.action === 'edit') this.fetchDetail()
                    else this.isLoaded = true
                }
            })
        },
        
        onSubmitForm(event) {
            event.preventDefault()

            if (this.selectedProvinces?.length === 0) return this.setEvent("Pilih Provinsi Terlebih dahulu!", false)

            let provinceIds = []
            this.selectedProvinces?.map((item) => {
                provinceIds.push(item?.id)
            })

            let params = {
                name: this.regionName,
                provinceIds: provinceIds
            }

            if (this.action === 'edit') {
                params.uuid = this.uuid
                this.fetchEditForm(params)
            } else this.fetchPostForm(params)
        },
        async fetchPostForm(params) {
            this.isSubmit = true
            this.$bvModal.show('modalLoading')

            this.addRegion(params).then(() => {
                if (!this.regionState?.status) {
                    this.setEvent("Gagal menambah region: " + this.regionState?.message)
                    console.error("Failed create region: " + this.regionState?.message)
                    this.$bvModal.hide('modalLoading')
                    this.isSubmit = false
                } else {
                    var message = `Berhasil ${this.action == 'edit' ? 'Mengubah' : 'Menambah'} Data.`
                    this.isSubmit = false
                    
                    if(this.action != 'edit') this.onResetForm()

                    this.$bvModal.hide('modalLoading')

                    setTimeout(() => {
                        if (this.isFromModal) this.$emit('submitted', true)
                        else {
                            this.setEvent(message, this.servicesState.status)
                            setTimeout(() => {
                                this.$router.go(-1)
                            }, 1000);
                        }
                    }, 500);
                }
            })
        },
        async fetchEditForm(params) {
            this.isSubmit = true
            this.$bvModal.show('modalLoading')

            this.editRegion(params).then(() => {
                if (!this.regionState?.status) {
                    this.setEvent("Gagal mengubah region: " + this.regionState?.message)
                    console.error("Failed edit region: " + this.regionState?.message)
                    this.$bvModal.hide('modalLoading')
                    this.isSubmit = false
                } else {
                    var message = `Berhasil ${this.action == 'edit' ? 'Mengubah' : 'Menambah'} Data.`
                    this.isSubmit = false
                    
                    if(this.action != 'edit') this.onResetForm()

                    this.$bvModal.hide('modalLoading')

                    setTimeout(() => {
                        if (this.isFromModal) this.$emit('submitted', true)
                        else {
                            this.setEvent(message, this.servicesState.status)
                            setTimeout(() => {
                                this.$router.go(-1)
                            }, 1000);
                        }
                    }, 500);
                }
            })
        },
        onResetForm() {
            this.regionName = ""
            this.selectedProvinces = []
        }
    },

    props: {
        // String Props
        id: {
            type: String,
            default: "#"
        },
        title: {
            type: String,
            default: 'Buat Region Baru',
        },
        action: {
            type: String,
            default: 'create',
        },
        customClass: {
            type: String,
            default: 'col-lg-8 card-wrapper',
        },

        // Boolean Props
        isFromModal: {
            type: Boolean,
            default: false,
        },
        hideHeader: {
            type: Boolean,
            default: false,
        },
        isCard: {
            type: Boolean,
            default: true,
        }
    }
    
}
</script>