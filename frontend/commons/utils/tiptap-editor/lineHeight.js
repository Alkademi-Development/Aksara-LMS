import { Extension } from '@tiptap/core'

export default Extension.create({
  name: "lineHeight",

  addOptions() {
    return {
      types: ["heading", "paragraph"],
      heights: ["100%", "115%", "150%", "200%", "250%", "300%"],
      defaultHeight: "200%",
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.options.defaultHeight,
            parseHTML: (element) =>{
              const type = element.nodeName.toLowerCase();
              // checking if line height is there, checking if the element is h or heading.
              return element.style.lineHeight ? element.style.lineHeight : type.startsWith("h") ? '150%' : this.options.defaultHeight;
            },
            renderHTML: (attributes) => {
              return { style: `line-height: ${attributes?.level ? '150%' : attributes.lineHeight}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLineHeight:
        (height) =>
        ({ commands }) => {
          if (!this.options.heights.includes(height)) {
            return false;
          }

          return this.options.types.every((type) =>
            commands.updateAttributes(type, { lineHeight: height })
          );
        },

      unsetLineHeight:
        () =>
        ({ commands }) => {
          return this.options.types.every((type) =>
            commands.resetAttributes(type, "lineHeight")
          );
        },
    };
  },
});