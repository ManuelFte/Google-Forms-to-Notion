/* global notionAPIKey, databaseID, pageName, responseConfigs, getStructure, UrlFetchApp */
'use strict';

// Function called on form submission
const onFormSubmit = (form) => {
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
    const answer = response.getResponse() || '';

    questionsAndAnswers[question] = answer;

    // Find a configuration object that matches the current question
    const config = responseConfigs.find(config => config.question === question);

    // If the configuration is found and it's not marked to be ignored...
    if (config && !config.ignore) {
      // If the item is to be processed as a block...
      if (config.item === 'block') {
        // Parse the heading as a Notion block object
        const questionType = config.type || 'heading_1';
        const mappedQuestion = config.mapped || question;

        children.push(getStructure('blocks', questionType, mappedQuestion));

        // Parse the content as a Notion block object
        const answerType = config.answers?.find(a => a.answer === answer)?.type || 'paragraph';
        const mappedAnswer = config.answers?.find(a => a.answer === answer)?.mapped || answer;

        children.push(getStructure('blocks', answerType, mappedAnswer));
      } else {
        // Process as a property
        const questionType = config.type || 'rich_text';
        const mappedQuestion = config.mapped || question;
        const mappedAnswer = config.answers?.find(a => a.answer === answer)?.mapped || answer;

        // Parse the information as a Notion property object
        const propertyInfo = getStructure('properties', questionType, mappedAnswer);

        // Save the configurations in the object for properties
        properties[mappedQuestion] = {
          [questionType]: propertyInfo
        };
      }
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

  // Send a request to the Notion API to create a new page with the given payload
  UrlFetchApp.fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${notionAPIKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    payload: JSON.stringify(payload),
    contentType: 'application/json'
  });
};
