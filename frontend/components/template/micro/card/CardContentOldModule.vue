<template>
  <div class="mb-5">
      <template v-if="isLoaded">
        <template v-if="listFiles?.length > 0">
          <b-tabs>
            <b-tab v-for="(file, index) in listFiles" :key="index" :title="`Tab ${index + 1}`" :active="index === 0" class="tabs-module">
              <template #title>
                <div class="d-flex align-items-center gap-2 wrapper-tab" @click="changeFile(file)">
                  <i :class="`${filterIcons(file?.kind)}`"></i>
                  <p class="mb-0 title-tab">{{ file?.kind }}</p>
                </div>
              </template>
              <div class="p-4 border rounded">
                <div class="mb-m--3 position-relative" v-if="contentOfTopic != undefined && validURL(contentOfTopic?.file)">
                    <template v-if="(contentOfTopic?.kind != 'image') || (contentOfTopic?.kind == 'image' && isGoogleDriveLink(contentOfTopic?.file))">
                      <b-embed
                          v-show="!isIframeLoading"
                          @contextmenu="disableRightClick($event)"
                          type="iframe"
                          allowfullscreen
                          frameborder="0"
                          :src="generateLinkEmbed(contentOfTopic?.file, contentOfTopic?.kind)"
                          @load="onLoadedIframe"
                      ></b-embed>
                    </template>
                    <template v-else>
                      <div style="aspect-ratio: 16 / 9">
                        <img :src="contentOfTopic?.file" style="width: 100%; height: 100%; object-fit: cover" alt="Image content" />
                      </div>
                    </template>
                    <div class="d-flex align-items-center justify-content-center position-absolute" style="height: 100%; width: 100%; left: 0; top: 0;" v-if="isIframeLoading">
                      <b-spinner variant="primary" label="Spinning"></b-spinner>
                    </div>
                </div>
                <div v-else>
                  <div class="px-4 py-7 rounded d-flex align-items-center justify-content-center flex-column gap-4">
                    <img src="~/assets/img/icons/empty/no-content.png" width="150px" />
                    <h4 style="color: #A2A2A2; text-align: center">Belum ada content pada modul ini</h4>
                  </div>
                </div>
              </div>
            </b-tab>
          </b-tabs>
        </template>
        <template v-else>
          <b-tabs>
            <b-tab title="Tab 1" active>
              <template #title>
                <div class="d-flex align-items-center gap-2 wrapper-tab">
                  <i class="ri-file-list-line"></i>
                  <p class="mb-0 title-tab">Modul</p>
                </div>
              </template>
              <div class="px-4 py-7 border rounded d-flex align-items-center justify-content-center flex-column gap-4">
                <img src="~/assets/img/icons/empty/no-content.png" width="150px" />
                <h4 style="color: #A2A2A2; text-align: center">Belum ada content pada modul ini</h4>
              </div>
            </b-tab>
          </b-tabs>
        </template>
      </template>
      <!-- <template v-else>
        <b-tabs>
          <b-tab title="Tab 1" active>
            <template #title>
              <div class="d-flex align-items-center gap-2 wrapper-tab">
                <b-skeleton width="100px"></b-skeleton>
              </div>
            </template>
            <div class="p-4 border rounded">
              <div style="height: 200px;">
                <b-skeleton-img height="200px"></b-skeleton-img>
              </div>
            </div>
          </b-tab>
        </b-tabs>
      </template> -->
  </div>
</template>

<script>
export default {
  props: {
    isLoaded: {
      type: Boolean,
      default: false,
    },
    topicDetail: {
      type: Object,
      default: {},
    },
    isFromClass: {
      type: Boolean,
      default: false,
    }
  },
  watch: {
    contentOfTopic(content){
      if((content.kind != 'image') || (content?.kind === 'image' && this.isGoogleDriveLink(content?.file))) this.isIframeLoading = true;
      else this.isIframeLoading = false;
    }
  },
  data(){
    return{
      contentOfTopic: null,
      listFiles: null,
      isIframeLoading: false,
    }
  },
  mounted(){
    this.setContentModule();
    this.$nextTick(() => {
      this.$emit("callbackLoaded");
    });
  },
  methods: {
    changeFile(file){
      this.contentOfTopic = file;
    },
    setContentModule(){
      if(this.topicDetail?.type == 'url'){
        this.listFiles = this.isFromClass ? this.topicDetail?.files : this.topicDetail?.attachments;
        this.contentOfTopic = this.listFiles && this.listFiles?.length > 0 ? this.listFiles[0] : null;
      }else{
        this.listFiles = null;
        this.contentOfTopic = null;
      }
    },
    filterIcons(value){
        if(value == "document") return "ri-file-text-line doc-color"
        else if(value == "video") return "ri-play-circle-line vid-color"
        else if(value == "image") return "ri-image-fill img-color"
        else if(value == "sound") return "ri-volume-up-line voi-color"
        else if(value == "slide") return "ri-file-ppt-line ppt-color"
    },
    disableRightClick(e) {
        e.preventDefault();
    },
    generateLinkEmbed(link, type){
        let generatedLink;
        let splitUrl = link.split("/")

        if (type === 'document') {
            generatedLink = link += '#toolbar=0'
        }

        if(splitUrl[3] == "presentation") return link.replace(splitUrl[6], "embed?start=false&delayms=8000&slide=id.p#")
        generatedLink =  link.replace(splitUrl[6], "preview")
        return generatedLink
    },

    validURL(url) {

        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

        return !!pattern.test(url);
    },
    onLoadedIframe(){
      this.isIframeLoading = false;
      this.$nextTick(() => {
        this.$emit("callbackLoaded");
      });
    },
    isGoogleDriveLink(url) {
      const googleDrivePattern = /^(https?:\/\/)?(www\.)?(drive|docs)\.google\.com/;
      return googleDrivePattern.test(url);
    }
  }
}
</script>


<style scoped lang="scss">
::v-deep .tabs {
  .nav-tabs{
    flex-wrap: nowrap;
    overflow-x: auto;
    border-bottom: 0px;

    &::-webkit-scrollbar{
      width: 0px !important;
      height: 0px !important;
    }

    .nav-item{
      margin-bottom: 0px;

      a{
        padding: 0px;
        border-bottom: 0px;
        
        .wrapper-tab{
          padding: 8px 12px;
        }

        p{
          font-size: 14px;
          font-weight: 600;
          color: rgba(0, 0, 0, .4);
        }

        i{
          font-size: 16px;
          color: rgba(0, 0, 0, .4);
        }

        &.active{
          background: white;

          p, i{
            color: var(--bs-primary)
          }
        }
      }
    }
  }

  .tab-content{
    background: white;
  }
}
</style>