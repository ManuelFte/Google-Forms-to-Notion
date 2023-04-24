# Google Forms to Notion

Google Apps Script to automatically forward Google Forms responses to a Notion database. Supports a wide range of customizations.

## Installation

<!-- Improve with screenshots and instructions on how to get the Notion API key and add the integration to the database -->
1. Create a new Google Apps Script project.
2. Copy the contents of [main.js](https://raw.githubusercontent.com/ManuelFte/Google-Forms-to-Notion/main/main.js), [structures.js](https://raw.githubusercontent.com/ManuelFte/Google-Forms-to-Notion/main/structures.js), and [variables.default.js](https://raw.githubusercontent.com/ManuelFte/Google-Forms-to-Notion/main/variables.default.js) into separate script files in the Google Apps Script editor.
3. Replace the placeholder values in `variables.js` with your Notion API key and the ID of the Notion database you want to send the responses to.
4. Set up a trigger in the Google Apps Script project to run the `onFormSubmit` function when a form response is submitted.

## Configuration

### Page name with placeholders

<!-- Mention that the placeholders need to come from the responses -->
You can use placeholders in the `pageName` variable to customize the title of the Notion page. For example:

```js
const pageName = 'Response from {Name}';
```

This will replace the `{Name}` placeholder with the form response for the "Name" question.

### Response configurations

Customize the `responseConfigs` object in `variables.js` to define how the responses should be mapped to Notion properties or blocks. You can use the following configurations: <!-- I need to state how they're going to be outputted by default if no configurations are provided -->

<!-- I don't like this wording -->
- `properties`: Define which form responses should be saved as properties in Notion.
- `blocks`: Define which form responses should be saved as blocks in Notion.
- `ignore`: Define form responses to ignore.

### Examples

#### Properties

```js
const responseConfigs = {
  properties: {
    'Example Question 1': {
      mapped: 'Notion Property 1',
      type: 'date'
    },
    'Example Question 2': {
      answers: {
        'Option 1': {
          mapped: 'Option A'
        },
        'Option 2': {
          mapped: 'Option B'
        }
      }
    }
  },
  // ...
};
```

#### Blocks

```js
const responseConfigs = {
  // ...
  blocks: {
    'Example Question 3': {
      type: 'heading_1'
    },
    'Example Question 4': {
      answers: {
        'Option 1': {
          mapped: 'Option A',
          type: 'paragraph'
        },
        'Option 2': {
          mapped: 'Option B',
          type: 'paragraph'
        }
      }
    }
  },
  // ...
};
```

