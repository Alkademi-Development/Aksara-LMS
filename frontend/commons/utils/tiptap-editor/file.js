import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-2'
import FileContent from '~/components/editor/micro/FileContent.vue';

export default Node.create({
  name: 'fileContent',

  group: 'block',

  atom: true,

  draggable: true,

  addAttributes(){
    return{
      width: {
        default: '100%',
        renderHTML: (attributes) => ({ width: attributes.width }),
      },
      height: {
        default: 'auto',
        renderHTML: (attributes) => ({ height: attributes.height }),
      },
      file: {
        default: null,
      },
      src: {
        default: null,
      },
      name: {
        default: null,
      },
      alt: {
        default: null,
      },
      type: {
        default: null,
      },
      format: {
        default: null,
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'file-content',
      },
      {
        tag: 'img',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['file-content', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(FileContent)
  },

  addCommands(){
    return{
      addFileContent: ({ file}) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: {file}
        })
      },
      setFileImageSize: (width, height) => ({ commands }) => {
        if (this.editor.isActive(this.name)) {
          let setSize = {}
          if(width) setSize.width = width;
          if(height) setSize.height = height
          return commands.updateAttributes(this.name, setSize);
        }
      },
    }
  }
})