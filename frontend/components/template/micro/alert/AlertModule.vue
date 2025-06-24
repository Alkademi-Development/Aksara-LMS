<template>
  <div :class="`position-fixed bg-${variant} wrapper-header`">
    <div class="d-flex align-items-center justify-content-between py-3 px-4 gap-5">
      <div :class="`d-flex align-items-center gap-3 ${!isShowAction ? 'py-2' : ''}`">
        <i v-if="iconAlert" :class="`${iconAlert} text-white`" style="font-size: 24px;"></i>
        <p class="text-limit limit-1 font-weight-bold text-white mb-0" style="font-size: 16px;">{{ textAlert }}</p>
      </div>
      <div v-if="isShowAction" class="bg-white cursor-pointer py-2 px-3 rounded" @click="$emit('onClickAction')">
        <p class="mb-0 text-primary" style="font-weight: 600">{{ textAction }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      default: 'primary'
    },
    isShowAction: {
      type: Boolean,
      default: false,
    },
    textAction: {
      type: String,
      default: ""
    },
    textAlert: {
      type: String,
      default: "",
    },
    iconAlert: {
      type: String,
      default: "",
    }
  }
}
</script>