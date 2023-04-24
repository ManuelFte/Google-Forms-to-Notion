'use strict';

const getStructure = (field, type, content) => {
  const structures = {
    /*
    Properties
    */
    properties: {
    // Date
      date: {
        start: content
      },
      // Rich text
      rich_text: [
        {
          text: {
            content
          }
        }
      ],
      // Select
      select: {
        name: content
      }
    },
    /*
    Blocks
    */
    blocks: {
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
    }
  };

  if (!structures[field] || !structures[field][type]) {
    throw new Error(`Invalid field or type: field=${field}, type=${type}`);
  }

  return structures[field][type];
};
