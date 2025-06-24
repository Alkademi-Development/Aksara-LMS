<template>
    <div>
<!-- Cities Options -->
        <div class="d-flex align-items-center mb-3">
            <b-form-input 
            v-model="selected"
            :placeholder="placeholder"
            list="list-city"
            @keydown.prevent.enter="setSelectedCity"
            ></b-form-input>
            <datalist id="list-city" hidden>
                <option v-for="(item, index) in options" :key="index" :class="item.id">{{ item.name }}</option>
            </datalist>
            <b-button class="ml-4 col col-lg-2" variant="primary" :disabled="btnDisabled" @click="setSelectedCity()">Pilih</b-button>
        </div>
<!-- Cities Selected -->
        <b-form-group
            v-if="dItemSelected.length != 0"
            :label="selectedLabel"
            label-for=""
        >
            <div id="city-selected" class="d-flex flex-wrap mx--1">
                <div v-for="(item, index) in dItemSelected" :key="index" class="city-card m-1">
                    <p class="city">{{item.name}}</p>
                    <p class="x" @click="removeCity(index, 'registrant')">&#10005;</p>
                </div>
            </div>
        </b-form-group>
<!-- Custom Fields -->
        <template v-if="isCustomFields">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="modal-title">Kebutuhan Custom Field</h5>
                <div class="d-flex align-items-center">
                    <b-button class="p-0 btn-no-styles text-primary" @click="customFields.push({ key: '', type: 'text' })">Tambah Field</b-button>
                    <b-button class="p-0 btn-no-styles text-secondary" @click="saveCustomField">Simpan</b-button>
                </div>
            </div>
            <b-alert 
                v-model="onEvent.show"
                :variant="onEvent.variant"
                dismissible
            >
                {{ onEvent.message }}
            </b-alert>
            <b-row class="align-items-center">
                <template v-for="(item, index) in customFields">
                    <b-col cols="6" md="7" lg="8" :key="`${index}-1`" class="mb-3">
                        <!-- <b-form-group label="Nama Field *"> -->
                            <b-form-input
                                type="text"
                                placeholder="Ketik nama field"
                                v-model="item.key"
                            ></b-form-input>
                        <!-- </b-form-group> -->
                    </b-col>
                    <b-col :key="`${index}-2`" class="mb-3">
                        <!-- <b-form-group label="Tipe Field *"> -->
                            <b-form-select
                                v-model="item.type"
                                :options="typeFieldOptions"
                            ></b-form-select>
                        <!-- </b-form-group> -->
                    </b-col>
                    <b-col cols="2" lg="1" v-if="customFields.length > 1" class="text-center mb-3" :key="`${index}-3`">
                        <div @click="customFields.splice(index, 1)"><i class="fas fa-trash" style="cursor: pointer"></i></div>
                    </b-col>
                </template>
            </b-row>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        selectedLabel: {
            type: String,
            default: ""
        },
        placeholder: {
            type: String,
            default: ""
        },
        isSelectedAll: {
            type: Boolean,
            default: false
        },
        options: {
            type: Array,
            default: []
        },
        itemSelected: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            btnDisabled: true,
            dIsSelectedAll: true,
            isCustomFields: false,
            selected: '',
            dItemSelected: [],
            customFields: [],

            typeFieldOptions: [ 
                {value: null, text: 'Pilih Tipe Field', disabled: true}, 
                {value: 'text', text: 'String'}, 
                {value: 'number', text: 'Number'},
                {value: 'url', text: 'URL'},
                {value: 'date', text: 'Tanggal'},
                {value: 'time', text: 'Waktu'},
            ],

            onEvent: {
                message: '',
                status: true,
                show: false,
                variant: ''
            },
        }
    },
    created() {
        this.setItemSelected()
    },
    methods: {
        setItemSelected() {
            this.dItemSelected = this.itemSelected
            this.dIsSelectedAll = this.isSelectedAll
        },
        setSelectedCity(){
            if(this.selected.trim() != '') {
                const item = this.options.find(item => item.name === this.selected)
                if(item != undefined) {
                    const filter = this.dItemSelected.find(item => item.name === this.selected)

                    if(filter == undefined) {
                        if (item.id == 0){
                            // const cities = this.$store.state.Cities.cities
                            // item.data = cities
                            this.dItemSelected = []
                            this.dItemSelected.push(item)
                            this.dIsSelectedAll = true
                        } else {
                            if (this.dIsSelectedAll) {
                                this.dItemSelected = []
                                this.dItemSelected.push(item)
                                this.dIsSelectedAll = false
                            } else {
                                this.dItemSelected.push(item)
                            }
                        }
                    }

                }
            }
            this.selected = ''
        },
        removeCity(index, type){
            this.dItemSelected.splice(index, 1)
        },
        saveCustomField() {
            let fields = {}
            
            this.customFields.map((item) => {
                fields[item.key] = item.type
            })

            this.dItemSelected.map((item, index) => {
                if (item.name == 'Custom Fields') {
                    this.dItemSelected[index].value = JSON.stringify(fields)
                }
            })

            this.setEvent('Berhasil menyimpan data custom fields', true)
        },
        setEvent(message, status){
            window.scrollTo(0,0)
            this.onEvent.message = message
            this.onEvent.status = status
            this.onEvent.variant = status == true ? 'success' : 'warning'
            this.onEvent.show = true
        },
    },
    watch: {
        selected() {
            if(this.selected != '') this.btnDisabled = false
            else this.btnDisabled = true
            return 
        },
        dIsSelectedAll() {
            return this.$emit('onChangeSelectedAll', this.dIsSelectedAll)
        },
        dItemSelected() {
            const find = this.dItemSelected.find(item => item.name == 'Custom Fields')
            if (find) {
                this.isCustomFields = true
                const jsonObject = JSON.parse(find.value)
                Object.keys(jsonObject).map((item) => {
                    this.customFields.push({ key: item, type: jsonObject[item] })
                })
            } else {
                this.isCustomFields = false
                this.customFields = []
            }
            return this.$emit('onChangeItemSelected', this.dItemSelected)
        },
    },
}
</script>