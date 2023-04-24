/* global notionAPIKey, databaseID, pageName, fieldConfigs, getStructure, UrlFetchApp */
'use strict';

// Function called on form submission
const onFormSubmit1 = (form) => {
  // Get all Google Form responses
  const responses = form.response.getItemResponses();
  // Objects to store the parsed properties and blocks
  const properties = {};
  const children = [];
  // This is an object storing all questions and responses as it iterates through them,
  // for later use when replacing placeholders in the title
  const questionsAndAnswers = {};

  // Process each response
  for (const response of responses) {
    const question = response.getItem().getTitle();
    const answer = response.getResponse() || '`<Empty>`';
    questionsAndAnswers[question] = answer;

    // Ignore fields listed in the 'ignore' array
    if (fieldConfigs.ignore.includes(question)) {
      continue;
    }

    // Find any property or block configuration that matches the current question
    const propertyConfigs = Object.entries(fieldConfigs.properties).find(([key, value]) => key === question);
    const blockConfigs = propertyConfigs ? null : Object.entries(fieldConfigs.blocks).find(([key, value]) => key === question);

    // If there are property configurations for this question...
    if (propertyConfigs) {
      // Extract the configurations
      const [originalQuestion, configs] = propertyConfigs;
      const mappedQuestion = configs.mapped || originalQuestion;
      const questionType = configs.type || 'rich_text';
      const mappedAnswer = configs.answers?.[answer]?.mapped || answer;

      // Parse the information as a Notion property object
      const propertyInfo = getStructure('properties', questionType, mappedAnswer);

      // Save the configurations in the object for properties
      properties[mappedQuestion] = {
        questionType: {
          propertyInfo
        }
      };
      // If there are block configurations for this question...
    } else if (blockConfigs) {
      // Extract the configurations
      const [originalQuestion, configs] = blockConfigs;
      const mappedQuestion = configs.mapped || originalQuestion;
      const questionType = configs.type || 'heading_1';
      const mappedAnswer = configs.answers?.[answer]?.mapped || answer;
      const answerType = configs.answers?.[answer]?.type || 'paragraph';

      // Parse the heading as a Notion block object
      children.push(getStructure('blocks', questionType, mappedQuestion));

      // Parse the content as a Notion block object
      children.push(getStructure('blocks', answerType, mappedAnswer));
      // If no configurations are specified, it will default to saving the answers as properties, in rich text format, using the question string as the property name
    } else {
      properties[question] = {
        rich_text: [
          {
            text: {
              content: answer
            }
          }
        ]
      };
    }
  }

  // Process the page's name. If a page name was specified, it will look for placeholders in it. If not, it will default to the form's title
  const processedName = pageName ? pageName.replace(/\{(.*?)\}/g, (match, p1) => questionsAndAnswers[p1] || match) : form.source.getTitle();

  // Save the page's name to the properties
  properties.Name = {
    title: [
      {
        text: {
          content: processedName
        }
      }
    ]
  };

  // Prepare the headers
  const url = 'https://api.notion.com/v1/pages';
  const headers = {
    Authorization: `Bearer ${notionAPIKey}`,
    'Content-Type': 'application/json',
    'Notion-Version': '2022-06-28'
  };

  // Create payload for the Notion API request using the parsed properties and blocks
  const payload = {
    object: 'page',
    parent: {
      type: 'database_id',
      database_id: databaseID
    },
    properties,
    children
  };

  console.log(JSON.stringify(payload));

  // Send a request to the Notion API to create a new page with the given payload
  UrlFetchApp.fetch(url, {
    method: 'post',
    headers,
    payload: JSON.stringify(payload),
    contentType: 'application/json'
  });
};
