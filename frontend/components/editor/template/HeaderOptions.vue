<template>
  <section class="header-options">
    <div class="header-editor-content">
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
      <div class="divider-bubble"></div>
      <div class="wrapper-items">
        <div v-for="(item, index) in textStyleFormat" :key="index">
          <div v-if="item.key === 'bulletList' || item.key === 'orderedList'">
            <b-dropdown class="btn-format-dropdown">
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
          <div v-if="item.key === 'fontSize'">
            <b-dropdown class="btn-format-dropdown" :text="fontSizeSelected()">
              <b-dropdown-item v-for="(value) in item.options" :key="value.key" @click="value.fnc">{{ value.label }}</b-dropdown-item>
            </b-dropdown>
          </div>
          <div v-if="item.key === 'lineHeight'">
            <b-dropdown class="btn-format-dropdown">
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
        <div v-for="(item, index) in textFormat" :key="index">
          <div class="btn-format d-flex align-items-center justify-content-center" @click="item.fnc" :class="{ 'is-active': editor?.isActive(item.key) }">
            <i :class="item.icon"></i>
          </div>
        </div>
      </div>
      <div class="divider-bubble"></div>
      <div class="wrapper-items">
        <div v-for="(item) in alignFormat" :key="item.key" class="btn-format d-flex align-items-center justify-content-center" @click="item.fnc" :class="{ 'is-active': editor?.isActive({ textAlign: item.key }) }">
          <i :class="item.icon"></i>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
      isBusy: {
        type: Boolean,
        default: false,
      },
      editor: {
        type: Object,
        default: {},
      },
      moduleDetail: {
        type: Object,
        default: {}
      }
  },
  data() {
      return {
        isModalShow: false,
        isModalSizeShow: false,
        checkedToggle: false,
        link: "",
        selectedMode: null,
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
          { key: "fontSize", label: "Font size", icon: "", options: [
            { key: "smaller", label: 'Smaller', fnc: () => this.editor.commands.setFontSize(12)},
            { key: "small", label: 'Small', fnc: () => this.editor.commands.setFontSize(14)},
            { key: "medium", label: 'Medium', fnc: () => this.editor.commands.setFontSize(16)},
            { key: "large", label: 'Large', fnc: () => this.editor.commands.setFontSize(18)},
            { key: "extra-large", label: 'Extra Large', fnc: () => this.editor.commands.setFontSize(24)},
          ] },
        ],
        textFormat: [
          { key: "bold", label: "Bold", icon: "ri-bold", fnc: () => this.editor.chain().focus().toggleBold().run() },
          { key: "italic", label: "Italic", icon: "ri-italic", fnc: () => this.editor.chain().focus().toggleItalic().run() },
          { key: "strike", label: "Strike", icon: "ri-strikethrough", fnc: () => this.editor.chain().focus().toggleStrike().run() },
          { key: "link", label: "Link", icon: "ri-links-line", fnc: () => this.isModalShow = !this.isModalShow },
          { key: "clearNode", label: "Clear Node", icon: "ri-eraser-line", fnc: () => this.editor.chain().focus().unsetAllMarks().run() },
          { key: "code", label: "Code", icon: "ri-code-s-slash-line", fnc: () => this.editor.chain().focus().toggleCode().run() },
          { key: "codeBlock", label: "Code Block", icon: "ri-code-box-line", fnc: () => this.editor.chain().focus().toggleCodeBlock().run() },
        ],
        alignFormat: [
          { key: "left", icon: "ri-align-left", fnc: () => this.editor.chain().focus().setTextAlign('left').run()},
          { key: "center", icon: "ri-align-center", fnc: () => this.editor.chain().focus().setTextAlign('center').run()},
          { key: "right", icon: "ri-align-right", fnc: () => this.editor.chain().focus().setTextAlign('right').run()},
          { key: "justify", icon: "ri-align-justify", fnc: () => this.editor.chain().focus().setTextAlign('justify').run()},
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
      }
  },
  computed: {},
  methods: {
    fontSizeSelected(){
      let textStyle = this.editor?.getAttributes("textStyle");
      let result = "";

      if(!textStyle?.fontSize || textStyle?.fontSize == undefined) result = "Medium"
      if(textStyle?.fontSize == 12) result = "Smaller"
      if(textStyle?.fontSize == 14) result = "Small"
      if(textStyle?.fontSize == 16) result = "Medium"
      if(textStyle?.fontSize == 18) result = "Large"
      if(textStyle?.fontSize == 24) result = "Extra Large"

      return result;
    },
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/components/courses/bubble-menu.scss";

.header-options{
  background-color: rgb(247, 247, 247);
  padding: 6px 50px;
  position: sticky;
  top: 75px;
  z-index: 999;
  height: max-content;
  border: 1px solid rgba(0, 0, 0, .08);
  width: 100%;
}

.header-editor-content{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  // overflow-x: scroll;
}

::v-deep .header-editor-content::-webkit-scrollbar {
  display: none;
}

</style>