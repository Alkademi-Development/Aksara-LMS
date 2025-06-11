<template>
  <div v-if="editor" id="wrapper-editor" :style="{'padding-top': editable ? '10px' : '', overflow: editable ? '' : 'hidden'}">
    <div class="">

      <BubbleMenu
        v-if="editable"
        :editor="editor"
      />

      <FloatingMenu
        :editor="editor"
        :fileHandlerType="fileHandlerType"
      />
    </div>
    <editor-content
      :editor="editor"
      class="w-100"
    />
  </div>
</template>

<script>
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import CharacterCount from '@tiptap/extension-character-count'
import Gapcursor from '@tiptap/extension-gapcursor'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'

import CodeBlock from "@/components/editor/micro/CodeBlock.vue"
import TableComponentExtend from "@/components/editor/micro/TableComponentExtend.vue"
import bulletExtend from '~/commons/utils/tiptap-editor/bulletExtend.js'
import orderedExtend from '~/commons/utils/tiptap-editor/orderedExtend.js'
import { TextStyleExtended } from '~/commons/constants/tiptapFontSize'
import lineHeight from '~/commons/utils/tiptap-editor/lineHeight.js'
import fileContent from "@/commons/utils/tiptap-editor/file.js";
import embedLink from '@/components/editor/micro/embedLink/embedLink.js';

import { lowlight } from "lowlight";
import { mapState } from 'vuex'
import { VueNodeViewRenderer } from '@tiptap/vue-2'

import html from 'highlight.js/lib/languages/xml'

lowlight.registerLanguage('HTML', html)

import BubbleMenu from "@/components/editor/micro/BubbleMenu.vue"
import FloatingMenu from "@/components/editor/micro/FloatingMenu.vue"
import { Editor, EditorContent } from '@tiptap/vue-2';

// Mixins
import useDebounceMixin from '~/mixins/useDebounceMixin';
import imageExtend from '~/commons/utils/tiptap-editor/imageExtend';

export default {
  mixins: [ useDebounceMixin ],
  props:{
    editable: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      default: `<h1></h1>`
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    fileHandlerType: {
      type: String,
      default: 'fileContent'
    },
    featureAction: {
      type: String,
      default: "",
    }
  },
  components: {
    EditorContent,
    BubbleMenu,
    FloatingMenu,
  },
  computed: {
      ...mapState({
          driveState: (state) => state?.Drive
      })
  },
  mounted() {
    this.initializationEditor();

    window.addEventListener("keydown", this.handleKeyDown);
  },
  data(){
    return{
      editor: null,
      debounceTimeout: null,
    }
  },
  methods:{
    async uploadImage(file){
      const filename = `modules/${Date.now().toString()}`;
      const params = new FormData();
      params.append("filename", filename);
      params.append("file", file);

      await this.$store.dispatch("Drive/upload", params);
    },
    handlePaste(view, event, slice){
      const items = Array.from(event.clipboardData?.items || []);

      for (let i = 0; i < items.length; i++) {
        // if data of cliboard is image
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if(file){
            // this.editor.commands.setImage({ file: file, alt: "Image Cover" });
            // this.editor.commands.addFileContent({ file });
            if (this.fileHandlerType === 'fileContent') this.editor.commands.addFileContent({ file });
            else this.editor.commands.setImage({ file, alt: "Image Cover" });
          }
          return true;
        }
      }
      return false;
    },
    initializationEditor(){
      this.editor = new Editor({
        extensions: [
          StarterKit.configure({
            codeBlock: false
          }),
          imageExtend,
          embedLink,
          fileContent,
          bulletExtend,
          orderedExtend,
          CharacterCount,
          TextStyleExtended,
          lineHeight,
          Gapcursor,
          Table.configure({
            resizable: true,
          }).extend({
            draggable: true,
            addNodeView(){
              return VueNodeViewRenderer(TableComponentExtend)
            }
          }),
          TableCell,
          TableHeader,
          TableRow,
          CodeBlockLowlight.extend({
            draggable: true,
            isolating: true,
            languageClassPrefix: 'language-',
            addKeyboardShortcuts() {
              return {
                Tab: () => {
                  if (this.editor.isActive("codeBlock")) {
                    return this.editor.commands.insertContent("\t");
                  }
                },
              };
            },
            addNodeView(){
              return VueNodeViewRenderer(CodeBlock)
            }
          }).configure({
              lowlight,
          }),
          Link.configure({
            HTMLAttributes: {
              class: 'link',
            },
          }),
          TextAlign.configure({
            types: ['heading', 'paragraph'],
          }),
          Placeholder.configure({
            placeholder: ({node}) => {
              if (node.type.name === 'heading') {
                return 'What’s the title?'
              }

              return 'Can you add some further context?'
            },
          }),
        ],
        editable: this.editable,
        editorProps: {
          handlePaste: this.handlePaste,
        },
        onUpdate: this.updateContent,
        content: this.content,
      })

      // this.$store.dispatch("Editor/setEditor", this.editor);
      this.$store.dispatch("Editor/setEditable", this.editable);
      this.$emit("editorAction", this.editor);
    },
    handleKeyDown(event){
      // Check for window, ctrl + s
      const isWinSave = event.ctrlKey && event.key == "s";

      // Check for Mac, command + s
      const isMacSave = event.metaKey && event.key == "s";

      if(isWinSave || isMacSave) event.preventDefault(), this.$emit("shortcutSave");
    },
    updateContent({ editor }){
      this.handleAutoSave();
      this.handleNewLine(editor);
    },
    handleAutoSave(){
      this.useDebounce(() => {
        this.$emit("autoSave");
      }, 700, () => {
        this.$emit("onTyping");
      })
    },
    handleNewLine(editor){
      const { state } = editor
      const { selection, doc } = state
      const { from } = selection

      // Get ResolvedPos
      const $pos = doc.resolve(from)

      // Get node active
      const activeNode = $pos.parent

      if(activeNode.content?.content?.length == 0 && activeNode.type.name == "paragraph"){
        const currentAlign = activeNode.attrs.textAlign;

        // just change alignment if not the left
        if (currentAlign !== 'left') {
          this.editor.commands.updateAttributes(activeNode?.type, { textAlign: "left" });
        }
      }
    },
  },

  beforeDestroy() {
    this.editor.destroy();
    window.removeEventListener("keydown", this.handleKeyDown);
  },
}
</script>

<style lang="scss">
@import "@/assets/scss/components/courses/tiptap.scss";
@import "@/assets/scss/components/courses/tiptap-print.scss";
</style>