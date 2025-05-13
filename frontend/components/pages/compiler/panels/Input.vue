<template>
    <div class="flex-grow-1 overflow-auto px-3 pb-3">
        <BForm @submit="() => {}" class="d-flex flex-column gap-3">
            <BFormGroup label="Masukkan suhu:" label-for="input-1">
                <BFormInput v-model="form.suhu" id="input-1" type="number" placeholder="Masukkan Suhu..." required />
            </BFormGroup>
            <BFormGroup label="Masukkan suhu lagi:" label-for="input-2">
                <BFormInput v-model="form.suhu" id="input-2" type="number" placeholder="Masukkan Suhu..." required />
            </BFormGroup>
        </BForm>
    </div>
</template>

<script setup>
import { BForm, BFormGroup, BFormInput } from 'bootstrap-vue-next';

const form = {
  "suhu": "",
}

</script>

<style lang="scss" scoped>

</style>