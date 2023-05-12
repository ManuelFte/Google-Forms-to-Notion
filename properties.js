'use strict';

const gftnProperties = {
  // Date
  date: {
    start: this.content
  },
  // Rich text
  rich_text: [
    {
      text: {
        content: this.content
      }
    }
  ],
  // Select
  select: {
    name: this.content
  }
};
