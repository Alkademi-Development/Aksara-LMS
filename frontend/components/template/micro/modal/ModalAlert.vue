<template>
  <div class="d-flex" style="gap: 15px">
    <div v-if="title" class="wrapper-icon">
      <i :class="`${icon} text-${typeOfAlert}`" style="font-size: 40px"></i>
    </div>
    <div class="d-flex flex-column">
      <h5 v-if="title" class="modal-title mb-2">{{ title }}</h5>
      <p class="mb-0 modal-description" :style="{'font-size': title ? '14px' : '18px'}">{{ description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: "",
    },
    typeOfAlert: {
      type: String,
      default: "",
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-title {
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 150%;
  color: #000000;
  margin-bottom: 24px;
}

.modal-description{
  font-family: var(--bs-font-paragraph);
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  color: rgb(121, 121, 121);
}
</style>