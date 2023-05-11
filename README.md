# Google Forms to Notion

Google Apps Script to automatically forward Google Forms responses to a Notion database. Supports a wide range of customizations.

## Installation

<!-- Improve with screenshots and instructions on how to get the Notion API key and add the integration to the database -->
1. Create a new Google Apps Script project.
2. Copy the contents of [index.js](https://raw.githubusercontent.com/ManuelFte/Google-Forms-to-Notion/main/index.js), [Structure.js](https://raw.githubusercontent.com/ManuelFte/Google-Forms-to-Notion/main/Structure.js), and [config.default.js](https://raw.githubusercontent.com/ManuelFte/Google-Forms-to-Notion/main/config.default.js) into separate script files in the Google Apps Script editor.
3. Replace the placeholder values in `config.default.js` with your Notion API key and the ID of the Notion database you want to send the responses to.
4. Set up a trigger in the Google Apps Script project to run the `googleFormsToNotion` function when a form response is submitted.

## Configuration

### Page name with placeholders

<!-- Mention that the placeholders need to come from the responses -->
You can use placeholders in the `pageName` variable to customize the title of the Notion page. For example:

```js
pageName: 'Response from {Name}';
```

This will replace the `{Name}` placeholder with the form response for the "Name" question.

### Response configurations

Customize the `responseConfigs` variable in `config.default.js` to define how the responses should be mapped to Notion properties or blocks. If no configurations are provided, the responses will be outputted as properties in rich text format, using the question string as the property name.

### Examples

```js
responseConfigs: [
  {
    question: 'Example Question 1',
    mapped: 'Notion Property 1',
    type: 'date'
  },
  {
    question: 'Example Question 2',
    answers: [
      {
        answer: 'Option 1',
        mapped: 'Option A'
      },
      {
        answer: 'Option 2',
        mapped: 'Option B'
      }
    ]
  },
  {
    question: 'Example Question 3',
    item: 'block',
    type: 'heading_1'
  },
  {
    question: 'Example Question 4',
    item: 'block',
    answers: [
      {
        answer: 'Option 1',
        mapped: 'Option A',
        type: 'paragraph'
      },
      {
        answer: 'Option 2',
        mapped: 'Option B',
        type: 'paragraph'
      }
    ]
  },
  {
    question: 'Some string',
    ignore: true
  }
];
```

