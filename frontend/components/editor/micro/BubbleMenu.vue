<template>
  <div v-if="editor">

    <!-- Bubble Menu Common -->
    <bubble-menu
      class="bubble-menu"
      :tippy-options="{ duration: 100, zIndex: 990, maxWidth: '95vw' }"
      :editor="editor"
      :shouldShow="shouldShow('bubble-menu')"
      ref="reference"
    >
      <div class="wrapper-items">
        <div v-for="(item, index) in textStyleFormat" :key="index">
          <div v-if="item.key === 'bulletList' || item.key === 'orderedList'">
            <b-dropdown v-b-tooltip="{...optTooltip, title: item?.label}" class="btn-format-dropdown">
              <template #button-content>
                <i :class="item.icon"></i>
              </template>
              <div>
                <div v-for="(list, index) in item.options" :key="`list-${index}`" class="d-flex menu-lists">
                  <b-dropdown-item v-for="(menu, index) in list" :key="`menu-${index}`" class="list-item" @click="menu.fnc">
                    <img :src="menu.img" width="50px" class="m-0" />
                  </b-dropdown-item>
                </div>
              </div>
            </b-dropdown>
          </div>
          <div v-if="item.key === 'formatOfText'">
            <b-dropdown v-b-tooltip="{...optTooltip, title: item?.label}" title="Tipe Text" :class="`btn-format-dropdown`" :text="formatTextSelected() || 'Format type'">
              <b-dropdown-item v-for="(value) in item.options" :key="value.key" @click="value.fnc">{{ value.label }}</b-dropdown-item>
            </b-dropdown>
            <!-- <b-tooltip target="tooltip-1" triggers="hover">Catch me if you can!</b-tooltip> -->
          </div>
          <!-- <div v-if="item.key === 'fontSize'">
            <b-dropdown class="btn-format-dropdown" :text="fontSizeSelected()">
              <b-dropdown-item v-for="(value) in item.options" :key="value.key" @click="value.fnc">{{ value.label }}</b-dropdown-item>
            </b-dropdown>
          </div> -->
          <div v-if="item.key === 'lineHeight'">
            <b-dropdown v-b-tooltip="{...optTooltip, title: item?.label}" class="btn-format-dropdown">
              <template #button-content>
                <i :class="item.icon"></i>
              </template>
              <b-dropdown-item v-for="(value) in item.options" :key="value.key" @click="value.fnc">{{ value.label }}</b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
      </div>
      <div class="divider-bubble"></div>
      <div class="wrapper-items">
        <div v-for="(item, index) in textFormat" v-b-tooltip="{...optTooltip, title: item?.label}" :key="index">
          <div class="btn-format d-flex align-items-center justify-content-center" @click="item.fnc" :class="{ 'is-active': editor.isActive(item.key) }">
            <i :class="item.icon"></i>
          </div>
        </div>
      </div>
      <div class="divider-bubble"></div>
      <div class="wrapper-items">
        <div v-for="(item) in alignFormat" v-b-tooltip="{...optTooltip, title: item?.label}" :key="item.key" class="btn-format d-flex align-items-center justify-content-center" @click="item.fnc" :class="{ 'is-active': editor.isActive({ textAlign: item.key }) }">
          <i :class="item.icon"></i>
        </div>
      </div>
    </bubble-menu>

    <!-- Bubble Menu for Change Size (Image, Iframe, etc) -->
    <bubble-menu
      class="bubble-menu bubble-size"
      :tippy-options="{ duration: 100, zIndex: 990, maxWidth: '95vw' }"
      :editor="editor"
      :shouldShow="shouldShow('bubble-size')"
    >
      <div class="wrapper-items">
        <div v-for="(item, index) in settingSize" :key="index">
          <div class="btn-format d-flex align-items-center justify-content-center" @click="item.fnc">
            <i :class="item.icon"></i>
          </div>
        </div>
      </div>
    </bubble-menu>

    <!-- Bubble Menu For Table -->
    <bubble-menu
      :class="`bubble-menu ${isTypingInTable ? 'd-none' : ''}`"
      :tippy-options="{ duration: 100, zIndex: 990, maxWidth: '95vw' }"
      :editor="editor"
      :shouldShow="shouldShow('bubble-table')"
    >
      <div class="wrapper-items">
        <div v-for="(item, index) in optionsTable.tableOptions" :key="index">
          <div class="btn-format d-flex align-items-center justify-content-center" @click="item.fnc">
            <i :class="item.icon"></i>
          </div>
        </div>
      </div>
      <div class="divider-bubble"></div>
      <div class="wrapper-items">
        <div v-for="(item, index) in optionsTable.columnOptions" :key="index">
          <div class="btn-format d-flex align-items-center justify-content-center" @click="item.fnc">
            <i :class="item.icon"></i>
          </div>
        </div>
      </div>
      <div class="divider-bubble"></div>
      <div class="wrapper-items">
        <div v-for="(item, index) in optionsTable.rowOptions" :key="index">
          <div class="btn-format d-flex align-items-center justify-content-center" @click="item.fnc">
            <i :class="item.icon"></i>
          </div>
        </div>
      </div>
    </bubble-menu>

    <!-- Modal -->
    <b-modal
        v-model="isModalShow"
        id="modal-link"
        centered
        size="sm"
        hide-header
        hide-footer
    >
      <div class="">
        <div class="wrapper-url-link">
          <div class="input-link">
            <div class="wrapper-icon-link">
              <i class="ri-links-line"></i>
            </div>
            <input placeholder="Enter your link" v-model='link' />
          </div>
          <button class="btn-set-link" @click="setLink">Set Link</button>
        </div>
        <div class="wrapper-set-tab">
          <div class="d-flex align-items-center" style="gap: 10px;">
            <p>Open in new tab</p>
            <div :class="`wrapper-toggle-switch ${checkedToggle ? 'active' : ''}`" @click="checkedToggle = !checkedToggle">
              <span class="round-toggle-switch"></span>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
    <b-modal
        v-model="isModalSizeShow"
        id="modal-size"
        centered
        size="sm"
        hide-header
        hide-footer
    >
      <div class="">
        <div class="d-flex align-items-center" style="gap: 10px">
          <template v-for="item in inputSize">
            <b-form-group
                :label="item.name"
                :label-for="item.name"
                :key="item.name"
            >
                <b-form-input
                    v-model="item.value"
                    :id="item.name"
                    :type="item.type"
                    :placeholder="item.placeholder"
                    :required="item.required"
                ></b-form-input>
            </b-form-group>
          </template>
        </div>
        <div class="d-flex align-items-center">
          <b-button variant="primary" class="w-50" @click="setSize">Submit</b-button>
          <b-button variant="danger" class="w-50" @click="isModalSizeShow = false">Cancel</b-button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { BubbleMenu } from '@tiptap/vue-2'
import { isActive, isTextSelection } from "@tiptap/core";

export default {
  props: {
    editor: {
      type: Object,
      default: {},
    }
  },
  components: {
    BubbleMenu,
  },
  data(){
    return{
      isModalShow: false,
      isModalSizeShow: false,
      checkedToggle: false,
      link: "",
      selectedMode: null,
      optTooltip: {
        trigger: 'hover',
        delay: {show: 500, hide: 0},
        placement: "bottom",
        customClass: "bubble-menu-tooltip"

      },
      inputSize: [
        { name: 'width', label: 'Width', type: 'number', value: '', placeholder: '', required: true },
        { name: 'height', label: 'Height', type: 'number', value: '', placeholder: '', required: true },
      ],
      textStyleFormat: [
        { key: "bulletList", label: "Bullet List", icon: "ri-list-unordered", options: [
          [
            { key: "disc", label: 'disc', img: "/dashboard/assets/image/icon/list/bullet.png", fnc: () => this.editor?.chain().focus().toggleBulletListType('list-disc').run()},
            { key: "circle", label: 'circle', img: "/dashboard/assets/image/icon/list/circle.png", fnc: () => this.editor?.chain().focus().toggleBulletListType('list-circle').run()},
            { key: "square", label: 'square', img: "/dashboard/assets/image/icon/list/square.png", fnc: () => this.editor?.chain().focus().toggleBulletListType('list-square').run()},
          ]
        ] },
        { key: "orderedList", label: "Ordered List", icon: "ri-list-ordered", options: [
          [
            { key: "decimal", label: 'decimal', img: "/dashboard/assets/image/icon/list/decimal.png", fnc: () => this.editor?.chain().focus().toggleOrderedListType('list-decimal').run()},
            { key: "lower-alpha", label: 'lower-alpha', img: "/dashboard/assets/image/icon/list/lower-alpha.png", fnc: () => this.editor?.chain().focus().toggleOrderedListType('list-lower-alpha').run()},
            { key: "lower-roman", label: 'lower-roman', img: "/dashboard/assets/image/icon/list/lower-roman.png", fnc: () => this.editor?.chain().focus().toggleOrderedListType('list-lower-roman').run()},
          ],
          [
            { key: "decimal-leading-zero", label: 'decimal-leading-zero', img: "/dashboard/assets/image/icon/list/decimal-leading-zero.png", fnc: () => this.editor?.chain().focus().toggleOrderedListType('list-decimal-leading-zero').run()},
            { key: "upper-alpha", label: 'upper-alpha', img: "/dashboard/assets/image/icon/list/upper-alpha.png", fnc: () => this.editor?.chain().focus().toggleOrderedListType('list-upper-alpha').run()},
            { key: "upper-roman", label: 'upper-roman', img: "/dashboard/assets/image/icon/list/upper-roman.png", fnc: () => this.editor?.chain().focus().toggleOrderedListType('list-upper-roman').run()},
          ],
        ] },
        { key: "lineHeight", label: "Line Height", icon: "ri-line-height", options: [
          { key: "smaller", label: '1', fnc: () => this.editor.chain().focus().setLineHeight("100%").run()},
          { key: "small", label: '1.15', fnc: () => this.editor.chain().focus().setLineHeight("115%").run()},
          { key: "normal", label: '1.5', fnc: () => this.editor.chain().focus().setLineHeight("150%").run()},
          { key: "medium", label: '2', fnc: () => this.editor.chain().focus().setLineHeight("200%").run()},
          { key: "large", label: '2.5', fnc: () => this.editor.chain().focus().setLineHeight("250%").run()},
          { key: "extraLarge", label: '3', fnc: () => this.editor.chain().focus().setLineHeight("300%").run()},
        ] },
        { key: "formatOfText", label: "Format Text", icon: "", options: [
          { key: "heading1", label: 'Heading 1', fnc: () => this.editor.chain().focus().toggleHeading({ level: 1 }).run()},
          { key: "heading2", label: 'Heading 2', fnc: () => this.editor.chain().focus().toggleHeading({ level: 2 }).run()},
          { key: "heading3", label: 'Heading 3', fnc: () => this.editor.chain().focus().toggleHeading({ level: 3 }).run()},
          { key: "heading4", label: 'Heading 4', fnc: () => this.editor.chain().focus().toggleHeading({ level: 4 }).run()},
          { key: "heading5", label: 'Heading 5', fnc: () => this.editor.chain().focus().toggleHeading({ level: 5 }).run()},
          { key: "heading6", label: 'Heading 6', fnc: () => this.editor.chain().focus().toggleHeading({ level: 6 }).run()},
          { key: "paragraph", label: 'Paragraph', fnc: () => this.editor.chain().focus().setParagraph().run()},
        ] },
        // { key: "fontSize", label: "Font size", icon: "", options: [
        //   { key: "smaller", label: 'Smaller', fnc: () => this.editor.commands.setFontSize(12)},
        //   { key: "small", label: 'Small', fnc: () => this.editor.commands.setFontSize(14)},
        //   { key: "medium", label: 'Medium', fnc: () => this.editor.commands.setFontSize(16)},
        //   { key: "large", label: 'Large', fnc: () => this.editor.commands.setFontSize(18)},
        //   { key: "extra-large", label: 'Extra Large', fnc: () => this.editor.commands.setFontSize(24)},
        // ] },
      ],
      textFormat: [
        { key: "bold", label: "Bold", icon: "ri-bold", fnc: () => this.editor.chain().focus().toggleBold().run() },
        { key: "italic", label: "Italic", icon: "ri-italic", fnc: () => this.editor.chain().focus().toggleItalic().run() },
        { key: "strike", label: "Strike", icon: "ri-strikethrough", fnc: () => this.editor.chain().focus().toggleStrike().run() },
        { key: "link", label: "Link", icon: "ri-links-line", fnc: () => this.isModalShow = !this.isModalShow },
        { key: "clearNode", label: "Clear Format", icon: "ri-eraser-line", fnc: () => this.editor.chain().focus().unsetAllMarks().run() },
        { key: "code", label: "Code", icon: "ri-code-s-slash-line", fnc: () => this.editor.chain().focus().toggleCode().run() },
        { key: "codeBlock", label: "Code Block", icon: "ri-code-box-line", fnc: () => this.editor.chain().focus().toggleCodeBlock().run() },
      ],
      alignFormat: [
        { key: "left", label: "Align Left", icon: "ri-align-left", fnc: () => this.editor.chain().focus().setTextAlign('left').run()},
        { key: "center", label: "Align Center", icon: "ri-align-center", fnc: () => this.editor.chain().focus().setTextAlign('center').run()},
        { key: "right", label: "Align Right", icon: "ri-align-right", fnc: () => this.editor.chain().focus().setTextAlign('right').run()},
        { key: "justify", label: "Justify", icon: "ri-align-justify", fnc: () => this.editor.chain().focus().setTextAlign('justify').run()},
      ],
      settingSize: [
        { key: "size", icon: "ri-settings-4-line", fnc: () => this.isModalSizeShow = !this.isModalSizeShow},
      ],
      optionsTable: {
        tableOptions: [
          { key: "mergeCell", icon: "ri-merge-cells-horizontal", fnc: () => this.editor.chain().focus().mergeCells().run() },
          { key: "splitCell", icon: "ri-split-cells-horizontal", fnc: () => this.editor.chain().focus().splitCell().run() },
          { key: "setHeaderColumn", icon: "ri-layout-row-fill", fnc: () => this.editor.chain().focus().toggleHeaderRow().run() },
          { key: "setHeaderRow", icon: "ri-layout-column-fill", fnc: () => this.editor.chain().focus().toggleHeaderColumn().run() },
        ],
        rowOptions: [
          { key: "addRowTop", icon: "ri-insert-row-top", fnc: () => this.editor.chain().focus().addRowBefore().run() },
          { key: "addRowBottom", icon: "ri-insert-row-bottom", fnc: () => this.editor.chain().focus().addRowAfter().run() },
          { key: "deleteRow", icon: "ri-delete-row", fnc: () => this.editor.chain().focus().deleteRow().run() },
        ],
        columnOptions: [
          { key: "addColumnLeft", icon: "ri-insert-column-left", fnc: () => this.editor.chain().focus().addColumnBefore().run() },
          { key: "addColumnright", icon: "ri-insert-column-right", fnc: () => this.editor.chain().focus().addColumnAfter().run() },
          { key: "deleteColumn", icon: "ri-delete-column", fnc: () => this.editor.chain().focus().deleteColumn().run() },
        ]
      },
      isTypingInTable: false,
      isTableActive: false,
      timeoutTyping: null,
    }
  },
  methods: {
    setLink(){
      this.editor.commands.setLink({ href: this.link, target: this.checkedToggle ? '_blank' : '_self' });
      this.isModalShow = false;
      this.link = "";
      this.checkedToggle = false;
    },
    fontSizeSelected(){
      let textStyle = this.editor.getAttributes("textStyle");
      let result = "";

      if(!textStyle?.fontSize || textStyle?.fontSize == undefined) result = "Medium"
      if(textStyle?.fontSize == 12) result = "Smaller"
      if(textStyle?.fontSize == 14) result = "Small"
      if(textStyle?.fontSize == 16) result = "Medium"
      if(textStyle?.fontSize == 18) result = "Large"
      if(textStyle?.fontSize == 24) result = "Extra Large"

      return result;
    },
    formatTextSelected(){
      if(this.editor.isActive('heading', {level: 1})) return "Heading 1";
      if(this.editor.isActive('heading', {level: 2})) return "Heading 2";
      if(this.editor.isActive('heading', {level: 3})) return "Heading 3";
      if(this.editor.isActive('heading', {level: 4})) return "Heading 4";
      if(this.editor.isActive('heading', {level: 5})) return "Heading 5";
      if(this.editor.isActive('heading', {level: 6})) return "Heading 6";
      if(this.editor.isActive('paragraph')) return "Paragraph";
    },
    shouldShow(id) {
      return ({ editor, view, state, oldState, from, to }) => {
        const { doc, selection } = state;
        const { empty } = selection;
        const formatImage = ["png", "jpg", "jpeg", "svg", "webp"];

        const isImageNode = editor.isActive("image");
        const isIframe = editor.isActive("iframe");
        const isTable = editor.isActive("table");
        const getFileContentNode = editor.state.selection.node;

        const isEmptyTextBlock = !doc.textBetween(from, to).length && isTextSelection(state.selection);
        const isNodeSize = isImageNode || isIframe || formatImage.includes(getFileContentNode?.attrs?.format);

        if (!view.hasFocus() || empty || isEmptyTextBlock || (isTable && !isTextSelection(state.selection))){
          if(id === 'bubble-table' && isTable){
            this.isTypingInTable = true;
            clearTimeout(this.timeoutTyping);
            this.timeoutTyping = setTimeout(() => {
              this.isTypingInTable = false;
            }, 1000);
            return isTable;
          }else{
            return false;
          }
        }
        else {
          // Bubble menu will show if file content is image and not file content
          if(formatImage.includes(getFileContentNode?.attrs?.format) || !getFileContentNode){
            if(id === 'bubble-size') return isNodeSize;
            if(id === 'bubble-table') return isTable;
            if(id === 'bubble-menu') return !isNodeSize;
          }
        }
      };
    },
    setSize(){
      let sizeNode = {}
      this.inputSize.map((item) => {
        sizeNode[item.name] = item.value
      });
      const wrapperEditor = document.getElementById("wrapper-editor");
      const formatImage = ["png", "jpg", "jpeg", "svg", "webp"];
      const getFileContentNode = this.editor.state.selection.node;

      if(sizeNode.width > wrapperEditor.clientWidth) sizeNode.width = "100%";
      if(sizeNode.width < 100) sizeNode.width = "100";
      if(sizeNode.height < 100) sizeNode.height = "100";

      if(this.editor.isActive("image")) this.editor.commands.setImageSize(sizeNode.width, sizeNode.height);
      if(this.editor.isActive("iframe")) this.editor.commands.setIframeSize(sizeNode.width, sizeNode.height);
      if(this.editor.isActive("fileContent" && formatImage.includes(getFileContentNode?.attrs?.format))) this.editor.commands.setFileImageSize(sizeNode.width, sizeNode.height);
      this.isModalSizeShow = false;
      this.inputSize.map((item) => {
        item.value = "";
      })
    },
  }
}
</script>

<style>
.dropdown-menu.show{
  top: 45px !important;
}

.b-tooltip.bubble-menu-tooltip{
  top: -40px !important;
}
</style>

<style lang="scss" scoped>
@import "@/assets/scss/components/courses/bubble-menu.scss";
</style>