'use strict';

const getProperty = ({ type, content }) => {
  const structures = {
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
    },
    // Title
    title: [
      {
        text: {
          content
        }
      }
    ]
  };

  if (!structures[type]) {
    throw new Error(`Invalid type: type=${type}`);
  }

  return {
    [type]: structures[type]
  };
};
