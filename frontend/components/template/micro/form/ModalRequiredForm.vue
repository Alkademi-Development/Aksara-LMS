<template>
    <b-form @submit="onSubmitForm">

        <b-alert
            v-model="onEvent.show"
            :variant="onEvent.variant"
            dismissible
        >
            {{ onEvent.message }}
        </b-alert>

        <b-form-group
            class="mb-3"
            label="Nama Lengkap"
            label-for="input-fullname">
            <b-form-input
                id="input-fullname"
                v-model="inputForm.fullname"
                placeholder="Masukan nama"
                trim
            ></b-form-input>
        </b-form-group>

        <b-form-group
            label="Tanggal Lahir"
            label-for="input-birthDate">
            <b-form-input
                id="input-birthDate"
                v-model="inputForm.birthDate"
                placeholder="Masukan Tanggal Lahir"
                type="date"
                trim
            ></b-form-input>
        </b-form-group>

        <b-form-group
            label="Jenis Kelamin"
            label-for="selectGender">
            <v-select
                id="selectGender"
                class="select-gender form-control mb-3"
                placeholder="Pilih jenis kelamin"
                :options="gender"
                label="text"
                v-model="inputForm.selectedGender"
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
            label="Asal Kota"
            label-for="selectCity">
            <v-select
                id="selectCity"
                class="select-city form-control mb-3"
                :placeholder="isCityLoaded ? 'Pilih kota' : 'Memuat data...'"
                :options="cities"
                label="name"
                v-model="inputForm.selectedCity"
            >
                <template v-slot:no-options="{ search, searching }">
                    <template v-if="searching">
                    Tidak ada hasil untuk <em>{{ search }}</em>.
                    </template>
                    <em style="opacity: 0.5;" v-else>Ketik untuk mencari.</em>
                </template>
            </v-select>
        </b-form-group>

        <div v-if="!isSubmit" class="d-flex justify-content-end align-items-center">
            <b-button variant="danger" @click="logout">Logout</b-button>
            <b-button variant="primary" type="submit" :disabled="isUploading" :class="`${isUploading ? 'cursor--not-allowed' : ''}`">Simpan</b-button>
        </div>
        <div v-else class="d-flex justify-content-end align-items-center">
            <b-button variant="primary"><b-spinner class="mr-2" small></b-spinner>Loading...</b-button>
        </div>

        <b-modal v-model="isModalOpen" hide-header hide-footer centered size="sm">
            <h5 class="mb-5">Apakah data sudah benar?</h5>
            <div class="d-flex align-items-center justify-content-end">
                <b-button variant="danger" @click="isModalOpen = false">Batal</b-button>
                <b-button variant="primary" @click="fetchUpdate">Iya</b-button>
            </div>
        </b-modal>

    </b-form>
</template>
<script>
import { mapState } from "vuex";
import appToken from '~/api/app-token';
import { toDateShort } from "~/commons/utils";
import Dropzone from "~/components/Dropzone.vue";

export default {
    props: {
        layoutActive: {
            type: String,
            default: 'default'
        },
        user: {
            type: Object,
            required: true,
            default: () => {}
        }
    },
    data() {
        return {
            isSubmit: false,
            isCityLoaded: false,
            isModalOpen: false,
            isUploading: false,

            settings: null,

            onEvent: {
                message: '',
                status: true,
                show: false,
                variant: ''
            },

            inputForm: {
              phone: "",
              selectedGender: null,
              selectedCity: null,
              fullname: "",
              birthDate: "",
            },
            gender: [
                { text: "Laki-laki", value: "L" },
                { text: "Perempuan", value: "P" },
            ],
            cities: []
        }
    },
    computed: {
        ...mapState({
          sassState: (state) => state.Sass,
          servicesState: (state) => state.Services
        })
    },
    created() {
      this.settings = this.sassState.settings;
    },
    mounted() {
        this.initiateComponent();
    },
    methods: {
        async initiateComponent(){
            await this.fetchCities();
            this.setInputFilled();
        },
        setEvent(message, status){
            this.onEvent.message = message
            this.onEvent.status = status
            this.onEvent.variant = status == true ? 'success' : 'warning'
            this.onEvent.show = true
        },
        async logout() {
            const redirectTo = "?redirectTo=" + (this.layoutActive == `pesilat` ? `https://alkademi.id/pesilat` : window.location.origin)
            const alkademiAuth = process.env.alkademiAuth + "/logout"
            const lmsId = "&lmsId=" + localStorage.getItem('lmsId');
            const codeToken = `&code=${await appToken?.getCode()}`
            const generatedToken = `&generatedToken=${await appToken?.generatedToken()}`

            const url = alkademiAuth + redirectTo + lmsId + codeToken + generatedToken

            localStorage.clear()
            window.open(url, "_self")
        },

        async fetchCities() {
            this.cities = []
            this.isCityLoaded = false
            await this.$store.dispatch('Services/cities')

            if(!this.servicesState.status) {
                console.error('Failed fetch cities', this.servicesState.message)
                this.setEvent(this.servicesState.message, false)
                this.isCityLoaded = false
            } else {
                this.servicesState.data.map((item) => {
                    if (item.id != 0) {
                        const object = {
                            value: item.id,
                            name: item.name,
                        }
                        this.cities.push(object)
                    }
                })
                this.isCityLoaded = true
            }
        },

        onSubmitForm(event) {
            event.preventDefault()
            if (!this.inputForm.fullname) {
                return this.setEvent('Isikan nama terlebih dahulu', false)
            }
            if (!this.inputForm.selectedGender) {
                return this.setEvent('Pilih jenis kelamin terlebih dahulu', false)
            }
            if (!this.inputForm.selectedCity) {
                return this.setEvent('Pilih asal kota terlebih dahulu', false)
            }
            if (!this.inputForm.birthDate) {
                return this.setEvent('Pilih tanggal lahir terlebih dahulu', false)
            }

            this.onEvent.show = false
            this.isModalOpen = true
        },

        async fetchUpdate() {
            this.isModalOpen = false
            this.isSubmit = true

            let params = {
                name: this.inputForm?.fullname,
                cityId: this.inputForm.selectedCity.value,
                gender: this.inputForm.selectedGender.value,
                birthDate: this.inputForm?.birthDate
            }

            await this.$store.dispatch('Services/updateProfile', params);

            if (!this.servicesState.status) {
                console.error('Failed to update profile', this.servicesState.message);
                this.setEvent(this.servicesState.message, false)
                this.isSubmit = false;
            } else {
                this.$emit('modalOpen', false)
                this.isSubmit = false;
            }
        },

        setInputFilled(){
            // Set Name
            if(this.user?.name || !this.isOnlyNil(this.user?.name)) this.inputForm.fullname = this.user?.name;

            // Set Gender
            if(this.user?.gender) this.inputForm.selectedGender = this.gender?.find(gender => gender?.value == this.user?.gender);

            // Set City
            if(this.user?.cityId != -1) this.inputForm.selectedCity = this.cities?.find(city => city?.value == this.user?.cityId);

            // Set BirthDate
            if(this.user?.birthDate) this.inputForm.birthDate = toDateShort(this.user?.birthDate);

        },
        isOnlyNil(str) {
            return /^(\s*<nil>\s*)+$/i.test(str);
        }
    },

}
</script>

<style scoped>

.cursor--not-allowed{
    pointer-events: auto !important;
    cursor: not-allowed !important;
}

</style>