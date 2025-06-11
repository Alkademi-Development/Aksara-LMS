<template>
  <b-toast
      id="toast-validation-warning"
      variant="white"
      solid
      :visible="value"
      @change="$emit('input', !value)"
      header-class="d-none"
      class="wrapper-toast"
      toaster="b-toaster-bottom-right"
      auto-hide-delay="60000"
    >
      <div class="toast-body p-0 d-flex gap-3">
        <div class="toast-wrapper--icon">
          <i class="ri-error-warning-fill text-warning toast-icon--default"></i>
        </div>
        <div class="toast-wrapper--content flex-grow-1">
          <h5 class="toast-content--title mb-1">{{ title }}</h5>
          <p class="toast-content--description mb-0">{{ description }}</p>
        </div>
        <div class="toast-wrapper--icon">
          <i class="ri-close-line toast-icon--close cursor-pointer" @click="$emit('input', false)"></i>
        </div>
      </div>
    </b-toast>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    }
  }
}
</script>

<style>
.b-toaster-bottom-right{
  bottom: 20px !important;
  right: 20px !important;
}
</style>

<style scoped lang="scss">
::v-deep #toast-validation-warning{
  border: none;
  border-radius: 10px;

  .toast-body{
    .toast-wrapper--icon{
      .toast-icon--default{
        font-size: 36px;
      }

      .toast-icon--close{
        font-size: 18px;
        color: gray;
      }
    }

    .toast-wrapper--content{
      .toast-content--title{
        font-size: 16px;
        font-weight: 600;
      }

      .toast-content--description{
        font-size: 14px;
        font-weight: 400;
        color: gray;
      }
    }
  }
}
</style>