<template>
    <div class="container-fluid px-8 pb-8">
        <Stepper :steps="steps" v-model="currentStep" class="mt-4 mb-6 max-w-xl mx-auto" />
        <template v-if="currentStep === 0">
            <div class="row">
                <div class="col-12 col-md-8">
                    <FormDropzone
                        label="Cover"
                        dropzoneText="Tarik atau klik untuk upload foto profil"
                        @update:file="onFileSelected"
                        class="mb-3"
                    />
                    <FormInputColor 
                        v-model="formData.cover"
                        :colors="[
                            '#ffe1cc',
                            '#d3f5ec',
                            '#ffd6e0',
                            '#e9e7fd',
                            '#e0f2fe',
                            '#fff8db',
                            '#dcfce7',
                            '#fee2e2',
                            '#ffeb3b'
                        ]"
                        label="Color Background"
                        required
                        :disabled="isCoverImage"
                        class="mb-3"
                    />
                    <FormInput
                        v-model="formData.title"
                        label="Judul"
                        :required="true"
                        :error="errors.title"
                        :valid="formData.title != '' && !errors.title"
                        class="mb-3"
                    />
                    <FormInput
                        v-model="formData.description"
                        type="textarea"
                        label="Deskripsi"
                        :required="true"
                        :error="errors.description"
                        :valid="formData.description != '' && !errors.description"
                    />
                </div>
                <div class="col-12 col-md-4">
                    <FormInput
                        v-model="formData.price"
                        type="number"
                        label="Harga"
                        :required="true"
                        :error="errors.price"
                        :valid="formData.price != '' && !errors.price"
                        class="mb-3"
                    />
                </div>
            </div>
        </template>
        <template v-else-if="currentStep === 1">
            <FormMultipleSelect
                v-model="formData.listCourses"
                :options="courseOptions"
                label="List Materi"
                placeholder="Pilih Materi"
                required
                :error="errors.listCourses"
            />
        </template>
        <div class="d-flex align-items-center justify-content-between mt-3">
            <p><span class="text-danger">*</span>Wajib Diisi</p>
            <div class="d-flex align-items-center gap-2">
                <button type="button" class="btn btn-danger px-4 py-2">Reset</button>
                <button class="btn btn-warning px-4 py-2" type="button" @click="currentStep--" v-if="currentStep != 0">Back</button>
                <button class="btn btn-primary px-4 py-2" type="button" @click="submit" v-if="currentStep == steps?.length - 1">Submit</button>
                <button class="btn btn-primary px-4 py-2" type="button" @click="currentStep++" v-else>Lanjutkan</button>
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

const currentStep = ref(0);
const steps = [
    'Create Bundle',
    'List Materi',
]

const formData = ref({
    cover: "",
    title: "",
    description: "",
    price: 0,
    listCourses: []
});
const errors = ref({ cover: "", title: "", description: "", price: 0, listCourses: [] });
const courseOptions = ref([
    { value: "ct", label: "Computational Thinking" },
    { value: "python", label: "Dasar Pemrograman Python" },
    { value: "web", label: "Web Development Dasar" },
    { value: "alg", label: "Algoritma Pemula" },
])
const isCoverImage = computed(() => !!formData.value.cover && typeof formData.value.cover === 'object');

function onFileSelected(file) {
  formData.value.cover = file;
}

function submit() {
}
</script>

<style lang="scss" scoped>

</style>