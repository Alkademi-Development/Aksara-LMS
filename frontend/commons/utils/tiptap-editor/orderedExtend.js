import OrderedList from '@tiptap/extension-ordered-list'

export default OrderedList.extend({
  name: "myOrderedList",

  // Set the default class
  addAttributes() {
    return {
      class: {
        default: 'list-decimal',
      },
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: ['orderedList'],
        attributes: {
          class: {
            default: 'list-decimal',
            parseHTML: element => element.getAttribute('class'),
            renderHTML: attributes => {
              return {
                class: attributes.class,
              };
            },
          },
        },
      },
    ];
  },

  // Add command to toggle class name
  addCommands() {
    return {
      ...this.parent?.(),
      toggleOrderedListType:
        (className) =>
        ({ commands, chain }) => {
          if (!this.editor.isActive(this.name)) {
            return chain().toggleOrderedList().updateAttributes(this.name, {
              class: className,
            });
          }

          if (!this.editor.isActive(this.name, { class: className })) {
            return commands.updateAttributes(this.name, {
              class: className,
            });
          }
        },
    };
  },
});