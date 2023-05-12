'use strict';
const gftnBlocks = {
  // Heading 1
  heading_1: {
    object: 'block',
    type: this.type,
    [this.type]: {
      rich_text: [
        {
          text: {
            content: this.content
          }
        }
      ]
    }
  },
  // Paragraph
  paragraph: {
    object: 'block',
    type: this.type,
    [this.type]: {
      rich_text: [
        {
          text: {
            content: this.content
          }
        }
      ]
    }
  }
};
