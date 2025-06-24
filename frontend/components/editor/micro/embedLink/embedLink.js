import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-2'

import EmbedLink from './EmbedLink.vue'

export default Node.create({
  name: 'embedLink',
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
        default: '100%',
        renderHTML: (attributes) => ({ height: attributes.height }),
      },
      src: {
        default: null,
      },
      frameborder: {
        default: 0,
      },
      allowfullscreen: {
        default: this.options.allowFullscreen,
        parseHTML: () => this.options.allowFullscreen,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'EmbedLink',
      },
      {
        tag: 'iframe',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['EmbedLink', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(EmbedLink)
  },

  addCommands(){
    return{
      addEmbedLink: () => ({ commands }) => {
        return commands.insertContent({
          type: this.name
        })
      },
      setEmbedLinkSize: (width, height) => ({ commands }) => {
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