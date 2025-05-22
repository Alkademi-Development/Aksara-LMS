<template>
    <div class="container-fluid">
        <div class="row row-gap-2">
            <div class="col-12 col-md-7">
                <FormInput
                    v-model="formData.username"
                    label="Username"
                    :required="true"
                    :error="errors.username"
                    :valid="formData.username != '' && !errors.username"
                    valid-feedback="Username tersedia!"
                />
                <FormInput 
                    v-model="formData.birthdate"
                    label="Tanggal Lahir"
                    type="number"
                    placeholder="Masukkan tanggal lahir anda"
                    :error="errors.birthDate"
                />
                <FormInput 
                    v-model="formData.password"
                    label="Password"
                    :type="showPassword ? 'text' : 'password'"
                    :suffix-icon="showPassword ? 'ri-eye-off-line' : 'ri-eye-line'"
                    :on-suffix-click="togglePassword"
                    placeholder="Isi nama lengkap Anda."
                    :error="errors.password"
                    valid-feedback="Password aman!"
                    :valid="formData.password != '' && !errors.password"
                    required
                />
                <FormDropzone
                    label="Foto Profil"
                    dropzoneText="Tarik atau klik untuk upload foto profil"
                    @update:file="onFileSelected"
                    required
                />
                <FormInputColor />
                <button class="btn btn-primary mt-3" @click="submit">Submit</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import FormInput from "@/components/ui/forms/FormInput.vue";
import FormInputColor from "@/components/ui/forms/FormInputColor.vue";
import FormDropzone from "@/components/ui/forms/FormDropzone.vue";

const formData = ref({
  username: "",
  birthdate: "",
  password: "",
  photo: null,
});
const errors = ref({ username: "", birthDate: "", password: "", photo: "" });

const selectedFile = ref(null)

function onFileSelected(file) {
  selectedFile.value = file
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
}
</script>

<style lang="scss" scoped>

</style>