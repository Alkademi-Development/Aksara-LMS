<template>
  <node-view-wrapper class="image-wrapper" draggable="true" data-drag-handle >
    <b-img-lazy
      v-if="!isLoading"
      :src="node.attrs.src"
      :alt="node.attrs.alt"
      :style="{'object-fit': 'cover', 'width': imgWidth, 'height': imgHeight}"
      blank-color="#D9D9D9"
    />
    <div v-else class="loading-wrapper">
      <b-spinner variant="primary" label="Spinning"></b-spinner>
    </div>
  </node-view-wrapper>
</template>

<script>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-2';
import { mapState } from "vuex";

export default {
  components: {
    NodeViewWrapper,
  },
  props: nodeViewProps,
  computed: {
      ...mapState({
          driveState: (state) => state?.Drive
      })
  },
  watch: {
    'node.attrs': {
      handler(attrs){
        this.imgWidth = this.normalizeSizeUnit(attrs.width);
        this.imgHeight = this.normalizeSizeUnit(attrs.height);
      },
      deep: true,
    }
  },
  data(){
    return{
      isLoading: false,
      isImageLoadedRender: false,
      imgWidth: "",
      imgHeight: "",
    }
  },
  mounted(){
    this.initImage();
  },
  methods: {
    initImage(){
      /**
       * Checking when parse or render component
       * When parse HTML from the server to schema tiptap, the object 'file' will be null
       * When user editing the content and insert the image, render HTML will triggered and pass the object 'file' that will prosess in this component to upload the server
       */
      const file = this.node.attrs.file;
      if(file) this.uploadImage(file);

      // If there is not the size unit, it's will add size unit to pixel (px) as the default size unit
      this.imgWidth = this.normalizeSizeUnit(this.node.attrs.width);
      this.imgHeight = this.normalizeSizeUnit(this.node.attrs.height);
    },
    async uploadImage(file){
      this.isLoading = true;

      const filename = `modules/${Date.now().toString()}`;
      const params = new FormData();
      params.append("filename", filename);
      params.append("file", file);

      await this.$store.dispatch("Drive/upload", params);
      if(!this.driveState.status){
        console.error("Failed to Upload the Image : " + this.driveState.message);
        this.isLoading = false;
        this.deleteNode();
      }else{
        const imageUrl = `${process?.env?.baseUrlDrive}v1/${this.driveState.data}`;
        this.updateAttributes({
          src: imageUrl,
          file: null
        })
        this.isLoading = false;
      }
    },
    normalizeSizeUnit(size) {
      // Regex untuk mencocokkan angka dengan atau tanpa unit
      const regex = /^(\d+(?:\.\d+)?)(px|em|rem|%)?$/;

      const match = size?.toString().trim()?.match(regex);
      
      if (match) {
        const [, value, unit] = match;
        // Jika tidak ada unit, tambahkan 'px'
        return unit ? size : `${value}px`;
      } else {
        // Jika format tidak sesuai, kembalikan string asli
        return size;
      }
    }
  }
}
</script>

<style scoped lang="scss">
.loading-wrapper{
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;

  span{
    width: 5rem;
    height: 5rem;
  }
}

.overlay-image--loading{
  width: 100%;
  height: 400px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
  background: #E0E0E0;
  border-radius: 6px;
}
</style>