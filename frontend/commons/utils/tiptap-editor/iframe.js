import { Node } from '@tiptap/core'

export default Node.create({
  name: 'iframe',

  group: 'block',

  draggable: true,

  atom: true,

  addOptions() {
    return {
      allowFullscreen: true,
      HTMLAttributes: {
        class: 'iframe-wrapper',
      },
    }
  },

  addAttributes() {
    return {
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
      width: {
        default: '100%',
      },
      height: {
        default: '100%'
      }
    }
  },

  parseHTML() {
    return [{
      tag: 'iframe',
    }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', this.options.HTMLAttributes, ['iframe', HTMLAttributes]]
  },

  addCommands() {
    return {
      setIframe: (options) => ({ tr, dispatch }) => {
        const { selection } = tr
        const node = this.type.create(options)

        if (dispatch) {
          tr.replaceRangeWith(selection.from, selection.to, node)
        }

        return true
      },
      setIframeSize: (width, height) => ({ commands }) => {
        if (this.editor.isActive(this.name)) {
          let setSize = {}
          if(width) setSize.width = width;
          if(height) setSize.height = height
          return commands.updateAttributes(this.name, setSize);
        }
      },
    }
  },
})