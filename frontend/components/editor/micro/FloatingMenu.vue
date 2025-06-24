<template>
  <floating-menu
    class="floating-menu"
    :tippy-options="{ duration: 100, zIndex: 990 }"
    :editor="editor"
    ref="floatingMenu"
    id="floating-menu"
  >
    <button class="btn-more-menu" @click="isShowMenu = !isShowMenu">
      <i class="ri-add-line"></i>
    </button>
    <div class="more-menu" v-if="isShowMenu">
      <div v-for="(item, index) in menu" :key="index">
        <div v-if="item.key == 'file'" class="menu-item" @click="item.fnc">
          <i :class="item.icon"></i>
          <span>{{ item?.label }}</span>
          <input type="file" style="display: none;" ref="fileInput" @change="handleFileChange">
        </div>
        <div v-else class="menu-item" @click="item.fnc">
          <i :class="item.icon"></i>
          <span>{{ item?.label }}</span>
        </div>
      </div>
    </div>
  </floating-menu>
</template>

<script>
import { FloatingMenu } from '@tiptap/vue-2'
import { mapState } from 'vuex'


export default {
  props: {
    editor: {
      type: Object,
      default: {},
    },
    fileHandlerType: {
      type: String,
      default: 'fileContent'
    }
  },
  components: {
    FloatingMenu,
  },
  computed: {
      ...mapState({
          driveState: (state) => state?.Drive
      })
  },
  data(){
    return{
      isShowMenu: false,
      menu: [
        { key: "file", label: "Upload File", icon: "ri-file-text-line", fnc: () => this.openFileExplorer() },
        { key: "embed", label: "Embed Link", icon: "ri-code-line", fnc: () => this.editor.commands.addEmbedLink() },
        { key: "codeBlock", label: "Codeblock", icon: "ri-code-box-line", fnc: () => this.addCodeBlock() },
        { key: "divider", label: "Divider", icon: "ri-separator", fnc: () => this.editor.chain().focus().setHorizontalRule().run() },
        { key: "table", label: "Table", icon: "ri-table-line", fnc: () => this.editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
      ],
    }
  },
  methods: {
    openFileExplorer() {
      this.$refs.fileInput[0].click();
    },
    async handleFileChange(event) {
      const file = event.target.files[0];
      if (this.fileHandlerType === 'fileContent') this.editor.commands.addFileContent({ file: file });
      else this.editor.commands.setImage({ file: file, alt: "Image Cover" });
    },
    addCodeBlock(){
      this.editor.chain().focus().toggleCodeBlock().run();
    }
  }
}
</script>

<style scoped lang="scss">
.floating-menu {
  display: flex;
  gap: 30px;
  padding: 0.2rem;
  position: relative;
  border-radius: 0.5rem;
  width: max-content;
  z-index: 10;
  left: -70px;

  .btn-more-menu{
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--bs-primary);
    width: 40px;
    height: 40px;
    border-radius: 10px;
    color: var(--bs-primary);
    cursor: pointer;
    background-color: white;
  }

  .more-menu{
    display: flex;
    gap: 10px;

    .menu-item{
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 6px;
      border: 1px solid var(--bs-primary);
      // width: 40px;
      height: 40px;
      border-radius: 10px;
      color: var(--bs-primary);
      cursor: pointer;
      background-color: white;
      padding-left: 12px;
      padding-right: 12px;

      span{
        font-size: 12px;
        font-weight: 600;
        color: var(--bs-primary);
      }
    }
  }
}
</style>