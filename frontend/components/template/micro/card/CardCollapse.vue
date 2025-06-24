<template>
  <b-card no-body>
      <b-card-header @click="isOpenCollapse = !isOpenCollapse" class="border-0 d-flex align-items-center justify-content-between cursor-pointer wrapper-header">
          <slot name="header">
            <h5 class="my-1 d-inline-block" style="font-size: 18px;">{{ title }}</h5>
            <i :class="`ri-arrow-down-s-line ${isOpenCollapse ? 'icon-rotate' : ''}`" style="font-size: 24px"></i>
          </slot>
      </b-card-header>
      <b-collapse v-model="isOpenCollapse" :accordion="group">
          <div class="card-body pt-0">
              <slot></slot>
          </div>
      </b-collapse>
  </b-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    group: {
      type: String,
      default: "",
    }
  },
  data(){
    return{
      isOpenCollapse: false,
    }
  }
}
</script>

<style scoped lang="scss">
.icon-rotate{
  transform: rotate(180deg);
}

.wrapper-header{
  i{
    transition: .3s;
  }
}
</style>