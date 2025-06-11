<template>
  <div class="position-fixed bg-white border-bottom wrapper-header" :style="{top: isShow ? topPositionTop : fromPositionTop}">
    <div class="d-flex align-items-center justify-content-between p-4 gap-5">
      <h2 class="text-limit limit-1 font-weight-bold text-primary">{{ this.isFromClass ? this.classroomsState?.detailModule?.title : this.servicesState.moduleDetail?.title }}</h2>
      <div class="d-flex align-items-center bg-primary rounded gap-2 btn-start-study cursor-pointer" @click="startLearning">
        <p class="mb-0 text-white">Mulai Belajar</p>
        <i class="ri-arrow-right-s-line text-white"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    fromPositionTop: {
      type: String,
      default: "0",
    },
    topPositionTop: {
      type: String,
      default: '0',
    },
    isFromClass: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
      ...mapState({
          classroomsState: (state) => state.Classrooms,
          servicesState: (state) => state.Services,
      }),
  },
  methods: {
    startLearning(){
      this.$emit("startLearning")
    },
  }
}
</script>

<style lang="scss" scoped>
.wrapper-header{
  z-index: 99;
  width: 100vw;
  transition: all .3s;
  
  @media (max-width: 768px){
    left: 0;
  }

  @media (min-width: 768px){
    width: calc(100vw - 335px);
  }

  @media (min-width: 1200px){
    width: calc(100vw - (335px + 250px));
  }
}

.btn-start-study{
  padding: 12px;
  flex-shrink: 0;

  i{
    font-size: 18px;
    font-weight: 600;
  }

  p{
    font-size: 14px;
    font-weight: 600;
  }
}
</style>