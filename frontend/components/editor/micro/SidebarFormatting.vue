<template>
  <div class="sidebar shadow" ref="sidebar">
    <div v-if="editor">
      <div class="expand-btn" @click="slideSidebar">
        <i class="ri-arrow-left-s-line"></i>
      </div>
      <div class="wrapper-header">
        <h1>Formating</h1>
      </div>
      <div class="wrapper-body pt-3">
        <div class="w-100 wrapper-format mb-3">
          <h4 class="mb-4">Text</h4>
          <div class="d-flex align-items-center" style="gap: 10px">
            <div class="btn-format d-flex justify-content-center align-items-center" @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active-btn': editor.isActive('bold') }">
              <i class="ri-bold"></i>
            </div>
            <div class="btn-format d-flex justify-content-center align-items-center" @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active-btn': editor.isActive('italic') }">
              <i class="ri-italic"></i>
            </div>
            <!-- <div class="btn-format d-flex justify-content-center align-items-center" @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'is-active-btn': editor.isActive('unserline') }">
              <i class="ri-underline"></i>
            </div> -->
            <div class="btn-format d-flex justify-content-center align-items-center" @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active-btn': editor.isActive('strike') }">
              <i class="ri-strikethrough-2"></i>
            </div>
          </div>
        </div>
        <div class="w-100 wrapper-format">
          <h4 class="mb-4">Align</h4>
          <div class="d-flex align-items-center" style="gap: 10px">
            <div class="btn-format d-flex justify-content-center align-items-center" @click="editor.chain().focus().setTextAlign('left').run()" :class="{ 'is-active-btn': editor.isActive({ textAlign: 'left' }) }">
              <i class="ri-align-left"></i>
            </div>
            <div class="btn-format d-flex justify-content-center align-items-center" @click="editor.chain().focus().setTextAlign('center').run()" :class="{ 'is-active-btn': editor.isActive({ textAlign: 'center' }) }">
              <i class="ri-align-center"></i>
            </div>
            <div class="btn-format d-flex justify-content-center align-items-center" @click="editor.chain().focus().setTextAlign('right').run()" :class="{ 'is-active-btn': editor.isActive({ textAlign: 'right' }) }">
              <i class="ri-align-right"></i>
            </div>
            <div class="btn-format d-flex justify-content-center align-items-center" @click="editor.chain().focus().setTextAlign('justify').run()" :class="{ 'is-active-btn': editor.isActive({ textAlign: 'justify' }) }">
              <i class="ri-align-justify"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    editor: {
      type: Object,
      default: {},
    }
  },
  data(){
    return {
      isShow: false,
    }
  },
  methods: {
    slideSidebar(){
      const position = this.$refs.sidebar.style.right;
      if(position == "0px" || position == "") this.$refs.sidebar.style.right = '-250px';
      else if(position == "-250px") this.$refs.sidebar.style.right = '0px';
      
    }
  }
}
</script>

<style scoped lang="scss">

::v-deep #sidebar-right{
  .expand-btn{
    position: absolute;
    bottom: 0;
    left: -100px;
    visibility: visible !important;
  }
}

.sidebar{
  width: 250px;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0px;
  z-index: 99;
  background-color: white;
  transition: all .5s;
  padding: 20px;
}

.expand-btn{
  background-color: var(--bs-primary);
  width: 40px;
  height: 40px;
  border-radius: 50% 0px 0px 50%;
  color: white;
  padding: 7px 12px;
  position: absolute;
  top: 90px;
  left: -40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  i{
    font-size: 24px;
    
  }
}

.wrapper-header{
  h1{
    font-family: var(--bs-font-heading);
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;
    color: #000;
  }
}

.wrapper-format{
  h4{
    font-family: var(--bs-font-heading);
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    color: #000;
  }
}

.btn-format{
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;

  i{
    font-size: 18px;
  }
}

.is-active-btn{
  background-color: var(--bs-primary);
  color: white;
}
</style>


