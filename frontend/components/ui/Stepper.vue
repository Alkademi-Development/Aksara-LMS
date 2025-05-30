<template>
    <div class="stepper d-flex align-items-center">
      <template v-for="(step, idx) in steps" :key="idx">
        <!-- Step Circle & Label -->
        <div :class="['d-flex align-items-center', wrapLabel ? 'flex-column' : 'flex-row']">
          <div
            class="step-circle"
            :class="{
              active: idx === modelValue,
              completed: idx < modelValue,
            }"
          >
            <i class="ri-check-line text-lg text-white" v-if="idx < modelValue"></i>
            <span v-else>{{ idx + 1 }}</span>
          </div>
          <span
            class="step-label"
            :class="{
              active: idx === modelValue,
              completed: idx < modelValue,
            }"
          >{{ step }}</span>
        </div>
        <!-- Divider -->
        <div
          v-if="idx < steps.length - 1"
          class="step-divider flex-grow-1"
        ></div>
      </template>
    </div>
</template>
  
<script setup>
const props = defineProps({
    steps: { type: Array, required: true },     
    modelValue: { type: Number, required: true },
    wrapLabel: { type: Boolean, default: false }
});
</script>
  
<style scoped>
  .stepper {
    width: 100%;
  }
  .step-circle {
    width: 30px;
    height: 30px;
    border: 2px solid var(--grey);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--grey2);
    font-weight: 500;
    font-size: 14px;
    background: white;
    box-shadow: 0 0 6px rgba(0,0,0,0.04);
    transition: border-color 0.2s, color 0.2s, box-shadow 0.2s;
  }
  .step-label {
    margin-left: 8px;
    color: var(--black);
    font-weight: 500;
    font-size: 16px;
    transition: color 0.2s;
  }
  .step-divider {
    border-top: 2px dashed var(--grey);
    margin: 0 16px;
    min-width: 40px;
    height: 0;
  }
  .step-circle.active {
    border-color: var(--primary);
    color: var(--primary);
    box-shadow: 0px 0px 15px -5px var(--primary);
    background: #f5fbff;
  }
  .step-label.active {
    color: var(--primary);
  }
  .step-circle.completed {
    background-color: var(--primary);
    color: var(--white);
    box-shadow: none;
    border: none;
  }
  .step-label.completed {
    color: var(--primary);
  }
  </style>