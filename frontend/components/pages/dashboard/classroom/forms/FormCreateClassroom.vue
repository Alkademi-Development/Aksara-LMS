<template>
    <div>
        <h5 class="mt-6">Overview</h5>
        <div class="mt-2">
            <FormInput 
                v-model="formData.name"
                label="Name"
                :required="true"
                :valid="formData.name != ''"
                class="mb-3"
            />
            <FormDropzone
                label="Logo" 
                @update:file="onFileSelected"
                class="mb-3"
            />
            <FormInput 
                v-model="formData.description"
                type="textarea"
                label="Deskripsi"
                :required="true"
                :valid="formData.description != ''"
                class="mb-3"
            />
            <FormInput 
                v-model="formData.tags"
                type="textarea"
                label="Tags (Optional)"
                helper-text="* Contoh: seleksi, PHP (Pisahkan setiap kalimat dengan koma!)"
                :valid="formData.tags != ''"
                class="mb-3"
            />
            <FormInput 
                v-model="formData.type"
                type="select"
                label="Tipe Kelas"
                :options="[
                    { text: 'Terbuka', value: 'open' },
                    { text: 'Tertutup', value: 'close' },
                    { text: 'Publik', value: 'public' },
                ]"
                :required="true"
                class="mb-3"
            />
            <FormInput 
                v-model="formData.price"
                type="number"
                label="Harga kelas (Rp)"
                placeholder="Masukkan harga kelas"
                helper-text="* Minimal harga Rp10.000. Beri nilai 0 jika kelas gratis."
                :required="true"
                :valid="formData.price != ''"
                class="mb-3"
            />
        </div>
        <div class="mt-4">
            <button type="button" class="mb-3 w-100 d-flex align-items-center justify-content-between" @click="advancedOpen = !advancedOpen">
                <h5>Pengaturan Lanjutan (Optional)</h5>
                <i class="ri-arrow-down-s-line text-2xl" :class="{'rotate-180': advancedOpen}" style="transition: all .2s ease-in-out;"></i>
            </button>
            <div class="d-flex flex-column gap-2" v-if="advancedOpen">
                <FormInput 
                    v-model="formData.programId"
                    type="select"
                    label="Masukkan Kelas ke Program"
                    :options="[
                        { text: 'Pilih Program' , value: '' }
                    ]"
                    class="mb-3"
                />
                <FormInput 
                    v-model="formData.linkGroup"
                    label="Link Grup"
                    placeholder="Link Grup Telegram / Whatsapp"
                    class="mb-3"
                />
                <div class="row row-gap-3 mb-3">
                    <div class="col-12 col-md-4">
                        <FormInput 
                            v-model="formData.quota"
                            type="number"
                            label="Kuota"
                        />
                        <FormInput 
                            v-model="formData.quota"
                            type="checkbox"
                            checkbox-label="Tidak Terbatas"
                        />
                    </div>
                    <div class="col-12 col-md-8">
                        <FormInput 
                            v-model="formData.quota"
                            type="number"
                            min="0"
                            max="100"
                            label="Standar Kelulusan"
                            helper-text="* Masukkan nilai 0-100"
                        />
                    </div>
                </div>
                <FormMultipleSelect 
                    v-model="formData.cities"
                    :options="[
                        { value: '', label: 'Pilih Kota' },
                    ]"
                    label="Kota Pelaksanaan"
                    placeholder="Cari atau Pilih Kota Pelaksanaan"
                    required
                    tag-position="horizontal"
                />
            </div>
        </div>
        <div class="mt-4">
            <button type="button" class="mb-3 w-100 d-flex align-items-center justify-content-between" @click="scheduleOpen = !scheduleOpen">
                <h5>Pengaturan Jadwal (Optional)</h5>
                <i class="ri-arrow-down-s-line text-2xl" :class="{'rotate-180': scheduleOpen}" style="transition: all .2s ease-in-out;"></i>
            </button>
            <div class="row row-gap-3 mb-3" v-if="scheduleOpen">
                <div class="col-12 col-md-6">
                    <FormInput 
                        v-model="formData.registrationStart"
                        type="datetime-local"
                        label="Pendaftaran Dibuka"
                    />
                </div>
                <div class="col-12 col-md-6">
                    <FormInput 
                        v-model="formData.end"
                        type="datetime-local"
                        label="Pelaksanaan Dimulai"
                    />
                </div>
                <div class="col-12 col-md-6">
                    <FormInput 
                        v-model="formData.registrationEnd"
                        type="datetime-local"
                        label="Pendaftaran Ditutup"
                    />
                </div>
                <div class="col-12 col-md-6">
                    <FormInput 
                        v-model="formData.end"
                        type="datetime-local"
                        label="Pelaksanaan Berakhir"
                    />
                </div>
            </div>
            <FormInput 
                v-model="formData.alwaysOpen"
                type="checkbox"
                checkbox-label="Selalu Terbuka"
                helper-text="* Peserta dapat mengikut kelas kapanpun"
                class="mb-3"
            />
            <FormInput 
                v-model="formData.releaseCertificate"
                type="checkbox"
                checkbox-label="Terbitkan Sertifikat"
                helper-text="* Centang dan atur tanggal untuk menerbitkan sertifikat di kelas ini."
            />
        </div>
        <div class="d-flex align-items-center justify-content-between w-100 mt-6">
            <p>* Wajib Diisi</p>
            <div class="d-flex align-items-center gap-2">
                <button type="button" class="btn btn-danger px-4 py-2" @click="resetForm">Reset</button>
                <button type="button" class="btn btn-primary px-4 py-2" @click="submitForm">Lanjutkan</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import FormDropzone from '~/components/ui/forms/FormDropzone.vue';
import FormInput from '~/components/ui/forms/FormInput.vue';
import FormMultipleSelect from '~/components/ui/forms/FormMultipleSelect.vue';

const emit = defineEmits(['submit-form']);

const formData = ref({
    name: "",
    logo: "",
    description: "",
    tags: [],
    type: "open",
    price: 0,
    programId: "",
    linkGroup: "",
    quota: 0,
    minScore: 0,
    cities: [],
    provinces: [],
    prequisiteClassId: "",
    requirements: [],
    minPrecence: 0,
    registrationStart: "",
    registrationEnd: "",
    start: "",
    end: "",
    alwaysOpen: false,
    releaseCertificate: false,
})
const errors = ref({})
const advancedOpen = ref(false);
const scheduleOpen = ref(false);

function onFileSelected(file) {
  formData.value.logo = file;
}

function resetForm() {

}

function submitForm() {

    emit('submit-form');
}

</script>

<style lang="scss" scoped>

.rotate-180 {
  transform: rotate(180deg);
}

</style>