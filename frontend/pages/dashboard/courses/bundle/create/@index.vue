<template>
    <div class="container-fluid">
        <Stepper :steps="steps" v-model="currentStep" class="mb-4" />
        <div v-if="currentStep === 0">
        <FormInput
            v-model="formData.email"
            type="email"
            label="Email"
            :required="true"
            :error="errors.email"
            :valid="formData.email != '' && !errors.email"
            valid-feedback="Email tersedia!"
        />
        <FormInput 
            v-model="formData.password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            :suffix-icon="showPassword ? 'ri-eye-off-line' : 'ri-eye-line'"
            :on-suffix-click="togglePassword"
            placeholder="Isi kata sandi Anda."
            :error="errors.password"
            valid-feedback="Password aman!"
            :valid="formData.password != '' && !errors.password"
            max="2"
            required
        />
        <button class="btn btn-primary mt-4" @click="currentStep++">Lanjut</button>
        </div>
        <!-- Step 2 - Data Pribadi & Foto -->
        <div v-else-if="currentStep === 1">
            <FormInput
                v-model="formData.bio"
                type="textarea"
                label="Tentang Anda"
                required
            />
            <FormInput
                v-model="formData.birthdate"
                label="Tanggal Lahir"
                type="date"
                placeholder="Masukkan tanggal lahir anda"
                :error="errors.birthDate"
                :valid="formData.birthdate != '' && !errors.birthDate"
                required
            />
            <FormInput
                v-model="formData.gender"
                type="radio"
                label="Jenis Kelamin"
                :options="[
                { label: 'Laki-laki', value: 'male' },
                { label: 'Perempuan', value: 'female' }
                ]"
                required
            />
            <FormInput
                v-model="formData.isMarried"
                type="checkbox"
                label="Status Pernikahan"
                checkbox-label="Apakah sudah menikah?"
                required
            />
            <FormInput
                v-model="formData.city"
                type="select"
                label="Kota"
                :options="[
                { text: 'Pilih kota', value: '' },
                { text: 'Jakarta', value: 'jakarta' },
                { text: 'Bandung', value: 'bandung' },
                { text: 'Surabaya', value: 'surabaya' }
                ]"
                required
            />
            <FormDropzone
                label="Foto Profil"
                dropzoneText="Tarik atau klik untuk upload foto profil"
                @update:file="onFileSelected"
                required
            />
            <FormMultipleSelect
                v-model="selectedMateri"
                :options="materiOptions"
                label="List Materi"
                placeholder="Pilih Materi"
                required
                tag-position="horizontal"
                :error="selectedMateri?.length > 0 && errors.materi"
            />
            <div class="d-flex gap-2 mt-4">
                <button class="btn btn-outline-secondary" @click="currentStep--">Kembali</button>
                <button class="btn btn-primary" @click="currentStep++">Lanjutkan</button>
            </div>
        </div>
        <div v-else>
            <FormDropzone
                label="Foto Profil"
                dropzoneText="Tarik atau klik untuk upload foto profil"
                @update:file="onFileSelected"
                required
            />
            <div class="d-flex gap-2 mt-4">
                <button class="btn btn-outline-secondary" @click="currentStep--">Kembali</button>
                <button class="btn btn-primary" @click="submit">Submit</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import FormInput from "@/components/ui/forms/FormInput.vue";
import FormInputColor from "@/components/ui/forms/FormInputColor.vue";
import FormDropzone from "@/components/ui/forms/FormDropzone.vue";
import Stepper from "~/components/ui/Stepper.vue";
import FormMultipleSelect from "~/components/ui/forms/FormMultipleSelect.vue";
const materiOptions = [
  { value: "ct", label: "Computational Thinking" },
  { value: "python", label: "Dasar Pemrograman Python" },
  { value: "web", label: "Web Development Dasar" },
  { value: "alg", label: "Algoritma Pemula" },
];
const selectedMateri = ref([]);

const steps = [
  'Data Akun',
  'Data Pribadi',
  'Foto',
]
const currentStep = ref(0)

const formData = ref({
    email: "",
    username: "",
    bio: "",
    birthdate: "",
    password: "",
    photo: null,
    themeColor: "",
    gender: "",
    city: "",
    isMarried: false,
});
const errors = ref({ email: "", username: "", bio: "", birthDate: "", password: "", photo: "", city: "", gender: "", themeColor: "", isMarried: false, materi: "" });

const selectedFile = ref(null)

function onFileSelected(file) {
  selectedFile.value = file
  formData.value.photo = selectedFile.value;
}
const showPassword = ref(false);

function togglePassword() {
  showPassword.value = !showPassword.value;
}

function submit() {
    // Reset error
    errors.value = { username: "", birthDate: "", password: "", photo: "" };

    if (!formData.value.username) errors.value.username = "Username wajib diisi";
    if (!formData.value.birthdate) errors.value.birthDate = "Tanggal lahir wajib diisi";
    if (!formData.value.password) errors.value.password = "Password wajib diisi";
    if (!formData.value.photo) errors.value.photo = "Foto profil wajib diunggah";

    if (!errors.value.username && !errors.value.birthDate && !errors.value.password && !errors.value.photo) {
    alert("Form valid! Data dapat dikirim ke backend.");
    }

    console.log(formData.value)
}
</script>

<style lang="scss" scoped>

</style>