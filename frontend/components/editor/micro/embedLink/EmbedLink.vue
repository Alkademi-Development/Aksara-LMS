<template>
  <node-view-wrapper class="embedlink" draggable="true" data-drag-handle>
    <template v-if="!node.attrs.src">
      <input
        v-if="isOpenInput"
        type="text"
        name="embedlink"
        class="input-embedlink"
        placeholder="Paste a Youtube link, or Drive link and press Enter."
        v-model="url"
        @keyup.enter="embedLink"
        @keyup.delete="handleDelete"
        autocomplete="off"
      />
      <p v-if="onEvent.isShow" class="text-danger mb-0" style="font-size: 14px;">*{{ onEvent?.message }}</p>
    </template>
    <template v-else>
      <div class="embedlink-wrapper">
        <a :href="node.attrs.src" target="_blank" class="link-item d-none">{{ node.attrs.src }}</a>
        <iframe
          allow="fullscreen *"
          :src="node.attrs.src"
          :frameborder="node.attrs.src"
          :allowfullscreen="node.attrs.allowfullscreen"
          :width="node.attrs.width"
          :height="node.attrs.height"
        ></iframe>
      </div>
    </template>
  </node-view-wrapper>
</template>

<script>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-2'

export default {
  components: {
    NodeViewWrapper,
  },
  props: nodeViewProps,
  data(){
    return{
      url: null,
      onEvent: {
        isShow: false,
        message: "",
      },
      isOpenInput: false,
    }
  },
  watch: {
    url(){
      this.setEvent({isShow: false, meesage: ""});
    }
  },
  mounted(){
    // this.generateVideoDriveEmbed("https://drive.google.com/file/d/1m2qKHxErddn68ClW1onMBspvUSwcTS5_/view?usp=drive_link");
    this.initiateData()
  },
  methods: {
    initiateData(){
      if(this.editor.isEditable){
        if(!this.node.attrs.src) this.isOpenInput = true;
      }else{
        if(!this.node.attrs.src) this.deleteNode();
      }
    },
    setEvent({...value}){
      this.onEvent = value;
    },
    embedLink(){
      if(this.url && this.url.trim() !== ""){
        const splitUrl = this.url.split("/");
        let url = "";

        // Check url is from youtube
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const isUrlYoutube = this.url?.match(regExp);

        if(splitUrl?.[2] == 'drive.google.com'){
          url = this.generateVideoDriveEmbed(this.url);
        }else if(splitUrl.includes("presentation")){
          url = this.generrateSlideEmbed(this.url);
        }else if(isUrlYoutube){
          url = this.generateVideoYoutubeEmbed(isUrlYoutube[2]);
        }else{
          url = this.url;
        }
        console.log(url, 87);
        this.updateAttributes({
          src: url,
        })
        this.isOpenInput = false;
      }else{
        const messageError = {
          isShow: true,
          message: "Input tidak boleh kosong"
        }
        this.setEvent(messageError);
      }
    },
    handleDelete(){
      if(this.url == null || this.url?.trim() == ""){
        const currentPos = this.getPos();
        const previousNodePos = currentPos - 1;
        this.editor.commands.focus(previousNodePos);
        this.deleteNode();
      }
    },
    generateVideoYoutubeEmbed(videoId) {
      return `https://www.youtube.com/embed/${videoId}`
    },
    generateVideoDriveEmbed(link) {
      let generatedLink = link;
      return generatedLink.replace("/view", "/preview")
    },
    generrateSlideEmbed(link){
      const splitUrl = link.split("/");
      splitUrl[6] = "embed?start=false&delayms=8000&slide=id.p#";
      return splitUrl.join("/");
    }
  }
}
</script>

<style lang="scss" scoped>
.input-embedlink{
  width: 100%;
  padding: 10px 0px;
  color: #979898;
  font-size: 18px;
  font-weight: 600;
  border: none;
  outline: none;
  background-color: transparent;
}

.input-embedlink::placeholder{
  color: #979898;
  font-size: 18px;
  font-weight: 600;
}
</style>