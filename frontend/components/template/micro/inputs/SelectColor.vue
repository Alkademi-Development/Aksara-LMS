<template>
  <div class="wrapper-color d-flex align-items-center">
    <div v-for="(item, index) in options" :class="`color-item d-flex align-items-center justify-content-center rounded-circle ${contentImage ? 'cursor-disabled' : 'cursor-pointer'}`" :style="{'background-color': item.color, 'outline': value && value == item.color ? `3px solid ${item.color}` : 'none'}" :key="index" @click="setSelectColor(item.color)">
      <i v-if="value && value == item.color" class="ri-check-line font-weight-bold text-white"></i>
    </div>
    <div v-if="contentImage" class="color-item d-flex align-items-center justify-content-center rounded-circle bg-white shadow" :style="{'outline': !value ? '3px solid red' : ''}">
      <svg fill="#f5365c" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
        viewBox="0 0 167.751 167.751" xml:space="preserve">
        <path d="M0,83.875c0,46.249,37.626,83.875,83.875,83.875s83.875-37.626,83.875-83.875S130.125,0,83.875,0S0,37.626,0,83.875z
          M83.875,152.751C45.897,152.751,15,121.854,15,83.875c0-16.292,5.698-31.272,15.191-43.078l96.762,96.762
          C115.147,147.052,100.168,152.751,83.875,152.751z M152.75,83.875c0,16.292-5.698,31.272-15.19,43.078L40.797,30.191
          C52.603,20.698,67.583,15,83.875,15C121.853,15,152.75,45.897,152.75,83.875z"/>
      </svg>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    options: {
      type: Array,
      default: [],
    },
    value: {
      type: String,
      default: "",
    },
    contentImage: {
      type: Boolean,
      default: false,
    }
  },
  data(){
    return {
    }
  },
  methods: {
    setSelectColor(color){
      if(!this.contentImage){
        this.$emit("setColor", color);
      }
    }
  }
}

</script>

<style lang="scss" scoped>

.wrapper-color{
  gap: 20px;

  .color-item{
    width: 50px;
    height: 50px;
    border: 3px solid white; 

    i{
      font-size: 20px;
    }

  }
}

.cursor-disabled{
  cursor: not-allowed;
}

.cursor-pointer{
  cursor: pointer;
}

</style>