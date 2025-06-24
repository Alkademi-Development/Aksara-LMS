<template>
  <node-view-wrapper :class="`file-content ${isImage ? 'justify-content-center' : ''}`" draggable="true" data-drag-handle>
    <template v-if="!isLoading">
      <template v-if="isImage">
        <b-img-lazy
          :src="node.attrs.src"
          :alt="node.attrs.alt"
          :style="{'object-fit': 'cover', 'width': imgWidth, 'height': imgHeight}"
          blank-color="#D9D9D9"
          class="image-item--lazy"
        />
        <img
          :src="node.attrs.src"
          :alt="node.attrs.alt"
          :style="{'object-fit': 'cover', 'width': imgWidth, 'height': imgHeight, display: 'none'}"
          class="image-item--default"
        />
      </template>
      <div v-else class="file-wrapper p-3 rounded d-flex align-items-center justify-content-between gap-4">
        <div class="d-flex align-items-center gap-4">
          <FileIcon :label="valueOfFile?.format?.toUpperCase()" :bgLabel="valueOfFile?.color" width="50" style="flex-shrink: 0;" />
          <a :href="node.attrs.src" target="_blank" class="mb-0 file-label text-limit limit-2">{{ node.attrs.name }}</a>
        </div>
        <div class="action-wrapper rounded" @click="downloadResource">
          <i v-if="!isDownloading" class="ri-download-line"></i>
          <b-spinner v-else variant="gray" style="width: 20px; height: 20px;"></b-spinner>
        </div>
      </div>
    </template>
    <div v-else class="loading-wrapper">
      <b-spinner variant="primary" label="Spinning"></b-spinner>
    </div>
  </node-view-wrapper>
</template>

<script>
import FileIcon from '@/components/template/micro/icons/FileIcon.vue';
import { FILE_ICONS } from '@/commons/constants/file-icons';
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-2';
import { mapState } from "vuex";

export default {
  components: {
    NodeViewWrapper,
    FileIcon
  },

  props: nodeViewProps,
  computed: {
      ...mapState({
          driveState: (state) => state?.Drive
      })
  },
  data(){
    return{
      isLoading: false,
      isImageLoadedRender: false,
      imgWidth: "",
      imgHeight: "",
      isImage: false,
      valueOfFile: null,
      formatImage: ["png", "jpg", "jpeg", "svg", "webp"],
      isDownloading: false,
    }
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
  mounted(){
    this.initImage();
  },
  methods: {
    async initImage(){
      /**
       * Checking when parse or render component
       * When parse HTML from the server to schema tiptap, the object 'file' will be null
       * When user editing the content and insert the image, render HTML will triggered and pass the object 'file' that will prosess in this component to upload the server
       */
      let file = this.node.attrs.file;
      const isValidBase64 = this.node.attrs.src ? await this.isValidBase64Image(this.node.attrs.src) : false;
      if(isValidBase64){
        const fileImage = this.base64ToFile(this.node.attrs.src, "import");
        file = fileImage;
      }else{
        const fileType = this.getFileTypeOfUrl(this.node?.attrs.src);
        this.isImage = this.node.attrs.format ? this.formatImage.includes(this.node.attrs.format) : this.formatImage.includes(fileType);
      }

      if(file) this.uploadImage(file);
      else{
        if(this.isImage){
          // // If there is not the size unit, it's will add size unit to pixel (px) as the default size unit
          this.imgWidth = this.normalizeSizeUnit(this.node.attrs.width);
          this.imgHeight = this.normalizeSizeUnit(this.node.attrs.height);
        }else{
          this.valueOfFile = FILE_ICONS.find(file => file?.format === this.node.attrs.format);
        }
      }
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
        const fileType = this.getFileTypeOfUrl(this.driveState?.data);
        this.isImage = this.formatImage.includes(fileType);
        if(this.isImage){
          this.updateAttributes({
            src: imageUrl,
            alt: file?.name,
            file: null,
            type: file?.type,
            format: fileType,
          })
        }else{
          this.valueOfFile = FILE_ICONS.find(file => file?.format === fileType);
          this.updateAttributes({
            src: imageUrl,
            name: file?.name,
            file: null,
            type: file?.type,
            format: fileType,
          });
        }

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
    },
    getFileTypeOfUrl(url){
      if(url){
        const urlSplit = url?.split("/");
        const filename = urlSplit[urlSplit?.length - 1];
        const filenameSplit = filename?.split(".");
        return filenameSplit[filenameSplit?.length - 1];
      }else{
        return null;
      }
    },
    async downloadResource() {
      try {
          this.isDownloading = true;
          const response = await fetch(this.node.attrs.src, {
              headers: {
                  'Content-Type': this.node.attrs.type,
              },
          });
          
          // Buat blob dari response
          const blob = await response.blob();
          
          // Buat object URL
          const url = window.URL.createObjectURL(
              new Blob([blob], { type: this.node.attrs.type })
          );
          
          // Buat element untuk download
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', this.node.attrs.name);
          
          // Append ke body dan trigger click
          document.body.appendChild(link);
          link.click();
          
          // Clean up
          link.parentNode.removeChild(link);
          window.URL.revokeObjectURL(url);
          this.isDownloading = false;
      } catch (error) {
          console.error('Failed to download : ', error);
          this.isDownloading = false;
      }
    },
    isValidBase64Image(base64String) {
      try {
        // Periksa apakah string memiliki prefix "data:image/"
        if (!base64String.startsWith("data:image/")) {
          return false;
        }

        // Pisahkan header dan data Base64
        const base64Data = base64String.split(",")[1];

        // Decode Base64
        const binaryData = atob(base64Data);

        // Buat Blob dari data biner
        const byteArray = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          byteArray[i] = binaryData.charCodeAt(i);
        }
        const blob = new Blob([byteArray]);

        // Cek apakah Blob bisa dibuat sebagai gambar
        const img = new Image();
        img.src = URL.createObjectURL(blob);

        // Gunakan promise untuk memastikan gambar bisa dimuat
        return new Promise((resolve) => {
          img.onload = () => resolve(true); // Gambar valid
          img.onerror = () => resolve(false); // Gambar tidak valid
        });
      } catch (e) {
        return false; // Jika ada error, berarti tidak valid
      }
    },
    base64ToFile(base64String, fileName) {
      // Pisahkan header dan data Base64
      const [header, base64Data] = base64String.split(",");

      // Decode Base64 ke string biner
      const binaryString = atob(base64Data);

      // Ubah string biner menjadi ArrayBuffer
      const byteArray = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
      }

      // Tentukan tipe MIME dari header
      const mimeType = header.match(/:(.*?);/)[1];

      // Buat File atau Blob
      return new File([byteArray], `${fileName}.${mimeType.split("/")[1]}`, { type: mimeType });
    }
  }
}
</script>

<style lang="scss">
.file-content{
  display: flex;
  align-items: center;
  // justify-content: center;
  border-radius: 6px;
  padding: 10px 0px;

  img{
    border-radius: 6px;
  }
}

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

.file-wrapper{
  width: 100%;
  max-width: 500px;
  border: 1px solid rgb(232, 232, 232);
}

.file-label{
  font-size: 14px;
}

.action-wrapper{
  line-height: 0;
  padding: 8px;
  border: 1px solid rgb(232, 232, 232);
  cursor: pointer;

  &:hover{
    i{
      transform: translateY(-3px);
    }
  }

  i{
    font-size: 20px;
    transition: .2s;
    display: block;
  }
}
</style>