'use strict';

const getBlock = ({ type, content }) => {
  const structures = {
    // Heading 1
    heading_1: {
      object: 'block',
      type,
      [type]: {
        rich_text: [
          {
            text: {
              content
            }
          }
        ]
      }
    },
    // Paragraph
    paragraph: {
      object: 'block',
      type,
      [type]: {
        rich_text: [
          {
            text: {
              content
            }
          }
        ]
      }
    }
  };

  if (!structures[type]) {
    throw new Error(`Invalid type: type=${type}`);
  }

  return structures[type];
};
