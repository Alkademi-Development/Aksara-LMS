<template>
  <section>
    <client-only>
      <quill-editor
        :id="id"
        ref="editor"
        :content="value"
        :options="editorOption"
        @ready="onEditorReady"
        @input="onEditorChange"
      />
    </client-only>
  </section>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import hljs from 'highlight.js';

export default {
  props: {
    value: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "Insert text here ....."
    },
    id: {
        type: String,
        default: ""
    },
    height: {
      type: Number,
      default: null,
    }
  },
  components: {
    quillEditor
  },
  data () {
    return {
      editorOption: {
        placeholder: this.placeholder,
        theme: 'snow',
        modules: {
          syntax: {
            highlight: text => hljs.highlightAuto(text).value
          },
          toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            ['link', 'image', 'video'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'direction': 'rtl' }],
            [{ 'align': [] }],
            ['clean'],
          ],
        }
      },
      editorContainer: null,
      editorElement: null,
      tooltipElement: null,
      observer: null,
    }
  },
  methods: {
    setHeightEditor(){
      if(this.height && this.height !== null){
        const editor = document.querySelector(".ql-editor");
        editor.style.height = `${this.height}px`;
      }
    },
    setPlaceholder(){
      const inputTooltop = document.querySelectorAll(".quill-editor .ql-tooltip input");
      inputTooltop.forEach(input => {
        input.setAttribute("data-link", "https://google.com");
        input.placeholder = "https://google.com";
      })
    },

    getElementTooltip(){
      const getElementEditor = this.$refs.editor.$el;

      // Get Element ql-container
      getElementEditor.children.forEach(element => {
        const splitClass = element.className.split(" ");
        if(splitClass.includes("ql-container")) this.editorContainer = element;
      });

      // Get Tooltip element & Editor Element
      this.editorContainer.children.forEach(element => {
        const splitClass = element.className.split(" ");
        if(splitClass.includes("ql-editor")) this.editorElement = element;
        if(splitClass.includes("ql-tooltip")) this.tooltipElement = element;
      })
    },

    // This function is used to adjust the position of the tooltip so that its position does not go out of bounds
    setPositionTooltip() {
      this.observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach(mutation => {
          if (mutation.type === 'attributes') {
            const splitClass = this.tooltipElement.className.split(" ");
            if(splitClass.includes("ql-editing") && !splitClass.includes("ql-hidden")){
              this.tooltipElement.style.left = this.calculatePositionLeft();
            }
          }
        });
      });

      if (this.tooltipElement) {
        this.observer.observe(this.tooltipElement, { attributes: true, attributeFilter: ["class"] });
      }
    },
    calculatePositionLeft(){
      const leftPos = parseFloat(this.tooltipElement.style.left);
      const computedStyleTooltip = window.getComputedStyle(this.tooltipElement);
      const computedStyleEditor = window.getComputedStyle(this.editorElement);
      const paddingLeft = parseFloat(computedStyleEditor.paddingLeft);
      const paddingRight = parseFloat(computedStyleEditor.paddingRight);
      const widthTooltip = parseFloat(computedStyleTooltip.width);
      const widthEditor = parseFloat(computedStyleEditor.width);

      if(leftPos < 0) return `${0 + paddingLeft}px`;
      else if(leftPos > (widthEditor - widthTooltip)) return `${widthEditor - widthTooltip - paddingRight}px`;
      else return `${leftPos}px`;
    },
    onEditorReady(){
      // this.setContentImageAndVideo();
      this.setHeightEditor();
      this.setPlaceholder();
      this.getElementTooltip();
      this.setPositionTooltip();

      // change handler img
      // this.$refs.editor.quill.getModule('toolbar').addHandler('image', this.imageHandler);

      // change handler video
      // this.observeVideoAddition(this.$refs.editor.quill);
    },
    // setContentImageAndVideo(){
    //   const images = this.$refs.editor.quill.container.querySelectorAll("img");
    //   images.forEach(image => {
    //     image.style.width = "100%";
    //     image.style.maxWidth = '700px';
    //     image.style.height = 'auto';
    //     image.setAttribute('data-custom-style', 'true');
    //   })

    //   const videos = this.$refs.editor.quill.container.querySelectorAll(".ql-video");
    //   videos.forEach(video => {
    //     video.style.width = "100%";
    //     video.style.maxWidth = '700px';
    //     video.style.aspectRatio = '16 / 9';
    //     video.setAttribute('data-custom-style', 'true');
    //   })
    // },
    // imageHandler() {
    //   const input = document.createElement('input');
    //   input.setAttribute('type', 'file');
    //   input.setAttribute('accept', 'image/*');
    //   input.click();

    //   input.onchange = () => {
    //     const file = input.files[0];
    //     if (file) {
    //       const reader = new FileReader();
    //       reader.onload = (e) => {
    //         const quill = this.$refs.editor.quill;
    //         const range = quill.getSelection(true);
    //         quill.insertEmbed(range.index, 'image', e.target.result);
    //         this.setImageStyle(quill, range.index);
    //       };
    //       reader.readAsDataURL(file);
    //     }
    //   };
    // },
    // setImageStyle(quill, index) {
    //   setTimeout(() => {
    //     const images = quill.container.querySelectorAll('img');
    //     const lastImage = images[images.length - 1];
    //     if (lastImage) {
    //       lastImage.style.width = '100%';
    //       lastImage.style.maxWidth = '700px';
    //       lastImage.style.height = 'auto';
    //       lastImage.setAttribute('data-custom-style', 'true');
    //       this.updateContent();
    //     }
    //   }, 0);
    // },
    // setVideoStyle(videoNode) {
    //   videoNode.style.width = '100%';
    //   videoNode.style.maxWidth = '700px';
    //   videoNode.style.aspectRatio = '16 / 9';
    //   videoNode.setAttribute('data-custom-style', 'true');
    //   this.updateContent();
    // },
    // observeVideoAddition(editor) {
    //   const observer = new MutationObserver((mutations) => {
    //     mutations.forEach((mutation) => {
    //       if (mutation.type === 'childList') {
    //         mutation.addedNodes.forEach((node) => {
    //           if (node.nodeName === 'IFRAME' && node.classList.contains('ql-video')) {
    //             this.setVideoStyle(node);
    //           }
    //         });
    //       }
    //     });
    //   });

    //   observer.observe(editor.root, {
    //     childList: true,
    //     subtree: true
    //   });
    // },
    updateContent() {
      const quill = this.$refs.editor.quill;
      const content = quill.root.innerHTML;
      this.$emit('input', content);
    },
    onEditorChange() {
      this.updateContent();
    },
  },
}
</script>

<style lang="scss">

.quill-editor {
  overflow-y: auto;

  .ql-toolbar{
    .ql-formats{
      border-right: 1px solid #ccc;
      margin-right: 0px !important;

      &:last-child{
        border-right: 0px !important;
      }
    }
  }

  .ql-tooltip{
    align-items: center;
    margin-top: 0px;
    width: auto;

    .ql-action::before{
      margin-left: 12px;
    }

    .ql-action:after{
      display: none;
    }
  }

  .ql-tooltip:before{
    border: none;
    position: static;
    transform: translateX(0);
    margin-right: 10px;
  }

  .ql-tooltip:after{
    border: none;
  }

  .ql-container{
    border-radius: 0rem 0rem .25rem .25rem;
    border-color: #dee2e6;

    .ql-editor{
      height: 250px;

      p{
        font-weight: 400;
        font-size: 14px;
        line-height: 2;

        a{
          font-size: 14px !important;
          color: #1B75D0;
          text-decoration: underline;
          line-height: 2;
        }

        img{
          width: 100%;
          max-width: 700px;
          aspect-ratio: 16 / 9;
        }
      }

      &.ql-blank::before{
        font-style: normal;
        font-size: 14px;
      }

      blockquote{
        display: block;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 40px;
        margin-inline-end: 40px;
        unicode-bidi: isolate;
        border-left: none;
        font-size: 14px;
        color: #000000;
        padding-left: 0px;
        line-height: 2;
      }

      iframe{
        width: 100%;
        max-width: 700px;
        aspect-ratio: 16 / 9;
      }

      ol li{
        font-size: 14px;
        color: #000000;
        line-height: 2;
      }

      ul li{
        font-size: 14px;
        color: #000000;
        line-height: 2;
      }
    }
  }
}
  
</style>