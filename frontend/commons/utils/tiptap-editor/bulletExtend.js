import BulletList from "@tiptap/extension-bullet-list";

export default BulletList.extend({
  name: "myBulletList",

  // Set the default class
  addAttributes() {
    return {
      class: {
        default: 'list-disc',
      },
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: ['bulletList'],
        attributes: {
          class: {
            default: 'list-disc',
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
      toggleBulletListType:
        (className) =>
        ({ commands, chain }) => {
          if (!this.editor.isActive(this.name)) {
            return chain().toggleBulletList().updateAttributes(this.name, {
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