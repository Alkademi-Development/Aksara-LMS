import Image from '@tiptap/extension-image'
import ImageNodeView from '~/components/editor/micro/ImageNodeView.vue';
import { VueNodeViewRenderer } from '@tiptap/vue-2';

export default Image.extend({
  addAttributes(){
    return{
      ...this.parent?.(),
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
      }
    }
  },
  addNodeView(){
    return VueNodeViewRenderer(ImageNodeView);
  },
  addCommands() {
    return {
      ...this.parent?.(),
      setImageSize: (width, height) => ({ commands }) => {
        if (this.editor.isActive("image")) {
          let setSize = {}
          if(width) setSize.width = width;
          if(height) setSize.height = height
          return commands.updateAttributes("image", setSize);
        }
      },
    }
  },
})