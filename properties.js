'use strict';

const getProperty = ({ type, content }) => {
  // Not supported properties: created_by, created_time, files, formula, last_edited_by, last_edited_time, multi_select, people, relation, rollup
  const structures = {
    // Checkbox
    checkbox: {
      checkbox: content
    },
    // Date
    date: {
      start: content
    },
    // Email
    email: {
      email: content
    },
    // Number
    number: {
      number: content
    },
    // Phone number
    phone_number: {
      phone_number: content
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
    // Status
    status: {
      status: {
        name: content
      }
    },
    // Title
    title: [
      {
        text: {
          content
        }
      }
    ],
    // URL
    url: {
      url: content
    }
  };

  if (!structures[type]) {
    throw new Error(`Invalid type: type=${type}`);
  }

  return {
    [type]: structures[type]
  };
};
