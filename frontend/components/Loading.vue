<template>
  <div class="loading">
    <ClipLoader
      :loading="true"
      :size="`${size}px`"
      :color="
          color === 'red' 
            ? 
            '#EB5757' 
            : 
            color === 'blue' 
                ? '#060066'
                :
                '#F27A54'
        "
    ></ClipLoader>
  </div>
</template>

<script>
import ClipLoader from "vue-spinner/src/ClipLoader";
export default {
  name: "loading",
  components: {
    ClipLoader
  },
  props: {
    size: {
      type: Number,
      default: 35
    },
    color: {
        type: String,
        default: '#EB5757'
    }
  }
};
</script>

<style lang="scss" scoped>
.loading {
  width: max-content;
  height: max-content;
  margin: auto;
}
</style>