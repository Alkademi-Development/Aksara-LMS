<template>
  <node-view-wrapper class="code-block">
    <div :class="`code-block-header ${editorState?.editable ? 'd-flex' : 'd-none'}`">
      <div
        class="drag-handle"
        contenteditable="false"
        draggable="true"
        data-drag-handle
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M8.5 7C9.32843 7 10 6.32843 10 5.5C10 4.67157 9.32843 4 8.5 4C7.67157 4 7 4.67157 7 5.5C7 6.32843 7.67157 7 8.5 7ZM8.5 13.5C9.32843 13.5 10 12.8284 10 12C10 11.1716 9.32843 10.5 8.5 10.5C7.67157 10.5 7 11.1716 7 12C7 12.8284 7.67157 13.5 8.5 13.5ZM10 18.5C10 19.3284 9.32843 20 8.5 20C7.67157 20 7 19.3284 7 18.5C7 17.6716 7.67157 17 8.5 17C9.32843 17 10 17.6716 10 18.5ZM15.5 7C16.3284 7 17 6.32843 17 5.5C17 4.67157 16.3284 4 15.5 4C14.6716 4 14 4.67157 14 5.5C14 6.32843 14.6716 7 15.5 7ZM17 12C17 12.8284 16.3284 13.5 15.5 13.5C14.6716 13.5 14 12.8284 14 12C14 11.1716 14.6716 10.5 15.5 10.5C16.3284 10.5 17 11.1716 17 12ZM15.5 20C16.3284 20 17 19.3284 17 18.5C17 17.6716 16.3284 17 15.5 17C14.6716 17 14 17.6716 14 18.5C14 19.3284 14.6716 20 15.5 20Z"></path></svg>
      </div>
      <div class="position-relative" style="width: 150px;">
        <div @click="isDrowdownOpen = !isDrowdownOpen" class="d-flex border py-1 px-2 rounded align-items-center gap-3 select-language cursor-pointer">
          <p class="mb-0 text-white flex-grow-1">{{ getLanguageSelected }}</p>
          <i class='ri-arrow-down-s-line'></i>
        </div>
        <div v-show="isDrowdownOpen" class="position-absolute bg-darker rounded options-language w-100 mt-2" style="height: 200px; overflow-y: scroll; z-index: 99">
          <div v-for="(item, index) in languagesOptions" :key="index" class="checkbox-container cursor-pointer" @click="setLanguageSelected(item)">
              <p class="checkbox-label mb-0 text-white px-2 py-1 text-uppercase">{{ item?.label }}</p>
          </div>
        </div>
      </div>
      <div class="code-block-note" v-if="editorState?.editable">
        <p class="mb-0" spellcheck="false">Tekan <code>Command/Ctrl</code> + <code>Enter</code> untuk meninggalkan Codeblock</p>
      </div>
    </div>
    <div v-if="!editorState?.editable" class="wrapper-icon">
      <i v-if="!isSuccessCopy" @click="copyToClipboard" class="ri-file-copy-line text-white icon-copy"></i>
      <i v-else class="ri-check-line text-white"></i>
    </div>
    <pre :style="{paddingRight: !editorState?.editable ? '3.5rem !important' : ''}" ><code :class="`hljs ${'language-' + language?.toLowerCase() ?? ''}`"><node-view-content /></code></pre>
  </node-view-wrapper>
</template>

<script>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-2'
import { mapState } from 'vuex';

export default {
  components: {
    NodeViewWrapper,
    NodeViewContent,
  },

  props: nodeViewProps,

  data() {
    return {
      languages: this.extension.options.lowlight.listLanguages(),
      languagesOptions: [],
      isDrowdownOpen: false,
      language: "",
      isSuccessCopy: false,
    }
  },

  computed: {
    selectedLanguage: {
      get() {
        return this.node.attrs.language
      },
      set(language) {
        this.updateAttributes({ language })
      },
    },
    ...mapState({
        editorState: (state) => state?.Editor
    }),
    getLanguageSelected(){
      const { language } = this.node.attrs;
      this.language = language;
      return !language ? "Pilih Bahasa" : language.toUpperCase();
    }
  },
  created(){
    this.setLanguage();
  },
  methods:{
    setLanguage(){
      this.languages.map(item => {
        this.languagesOptions.push({value: item, label: item});
      })
    },
    setLanguageSelected({value}){
      this.updateAttributes({ language: value });
      this.isDrowdownOpen = false;
    },
    copyToClipboard(){
      const getCode = this.node?.content?.content[0]?.text;
      if(navigator.clipboard){
        navigator.clipboard.writeText(getCode).then(() => {
          this.isSuccessCopy = true;
          setTimeout(() => {
            this.isSuccessCopy = false;
          }, 3000);
        }).catch(error => {
          console.error(error);
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.code-block{
  background: #0D0D0D;
  color: #FFF;
  font-family: 'JetBrainsMono', monospace;
  border-radius: 6px;
  position: relative;
}

.code-block-header{
  padding: 1rem 1rem .5rem 1rem;
  gap: 15px;
  align-items: center;
}

.language{
  background-color: transparent;
  color: white;
  padding: 5px;
  border-radius: 6px;

  option{
    background-color: #0D0D0D;
    color: white;
  }
}

.tiptap .code-block.is-empty::before {
  position: relative;
  top: 70px;
  left: 17px;
}

.drag-handle{
  cursor: grab;
  display: flex;
  align-items: center;

  svg{
    width: 25px;
  }
}

.code-block-note{
  p{
    color: #adb5bd !important;
    font-size: 14px !important;
    font-family: 'JetBrainsMono', monospace;

    code {
      background-color: #9d9d9d;
      color: #2c2c2c;
      padding: 3px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
    }
  }
}

input#select-language{
  background: black;
  color: white;
  font-size: 12px;
  height: 30px;
}

.custom-search-input .card-input{
  background: black !important;
  
  .checkbox-container label{
    font-size: 12px;
  }
}

.select-language{
  p{
    font-size: 12px !important;
  }
}

.options-language{
  .checkbox-container{

    &:hover{
      background: var(--bs-primary);
    }

    .checkbox-label{
      font-size: 12px;
    }
  }
}

.wrapper-icon{
  position: absolute;
  right: 10px;
  top: 10px;
  background: #0D0D0D;
  border: 1px solid rgb(210, 210, 210);
  border-radius: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  i{
    font-size: 20px;
  }

  .icon-copy{
    cursor: pointer;
  }
}
</style>