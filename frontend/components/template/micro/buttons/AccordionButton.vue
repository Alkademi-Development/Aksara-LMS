<template>
  <div>
    <b-collapse visible id="collapse-3" class="mb-2">
      <div class="d-flex flex-column gap-2">
        <b-button :variant="variant" class="w-100">{{ title }}</b-button>
        <b-button :variant="variant" class="w-100">{{ title }}</b-button>
      </div>
    </b-collapse>
    <b-button v-b-toggle.collapse-3 :variant="variant" class="w-100">{{ title }}</b-button>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    variant: {
      type: String,
      default: "primary"
    }
  }
}
</script>