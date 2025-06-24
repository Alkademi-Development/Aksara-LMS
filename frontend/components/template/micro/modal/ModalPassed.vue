<template>
  <div class="py-3">
    <div class="wrapper-img mb-2">
      <img :src="image" class="img-checklist" />
    </div>
    <div class="wrapper-body text-center">
      <h3 class="title mb-2">{{ title }}</h3>
      <p class="description mb-0" v-html="description"></p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper-img{
  display: flex;
  justify-content: center;
  align-items: center;

  .img-checklist{
    width: 350px;
  }
}

.wrapper-body{
  .description{
    font-size: 16px;
    font-weight: 400;
  }
}
</style>