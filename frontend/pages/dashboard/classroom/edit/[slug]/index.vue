<template>
    <div class="container-fluid px-8 pb-8">
        <Stepper 
            :steps="steps"
            v-model="currentStep"
            :wrap-label="true"
            class="mt-4 mb-6"
        />
        <FormCreateClassroom @submit-form="currentStep++" v-if="currentStep == 0" />
        <Overview v-else-if="currentStep == 1" @back="currentStep--" />
    </div>
</template>

<script setup>
import FormCreateClassroom from '~/components/pages/dashboard/classroom/forms/FormCreateClassroom.vue';
import Overview from '~/components/pages/dashboard/classroom/Overview.vue';
import Stepper from '~/components/ui/Stepper.vue';

const currentStep = ref(0);
const steps = [
    'Kelas',
    'Preview'
];

</script>

<style lang="scss" scoped>

</style>