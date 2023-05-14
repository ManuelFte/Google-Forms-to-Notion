/* global gftnConfig getProperty getBlock UrlFetchApp */

/**
 * @fileoverview Google Apps Script to automatically forward Google Forms responses to a Notion database. Supports a wide range of customizations.
 * @author Manuel de la Fuente (https://manuel.life)
 * @version 2.0.0-dev
 * @license MIT
 */


'use strict';

function googleFormsToNotion (form) {
  const { APIkey, databaseID, pageName, responseConfigs } = gftnConfig;

  // Process the page's name. If a page name was specified, it will look for placeholders in it that match a question. If not, it will default to the form's title
  const parsePageName = (questionsAndAnswers) => {
    const processedName = pageName ? pageName.replace(/\{(.*?)\}/g, (match, p1) => questionsAndAnswers[p1] || match) : form.source.getTitle();

    return {
      title: [
        {
          text: {
            content: processedName
          }
        }
      ]
    };
  };

  const parseResponseAsProperty = (config, question, answer) => {
    const questionType = config.type || 'rich_text';
    const mappedQuestion = config.mapped || question;
    const mappedAnswer = config.answers?.find(a => a.answer === answer)?.mapped || answer;

    const property = getProperty(questionType, mappedAnswer);

    return {
      [mappedQuestion]: {
        [questionType]: property
      }
    };
  };

  const parseResponseAsBlock = (config, question, answer) => {
    // Parse the heading as a Notion block object
    const questionType = config.type || 'heading_1';
    const mappedQuestion = config.mapped || question;

    const questionBlock = getBlock(questionType, mappedQuestion);

    // Parse the content as a Notion block object
    const answerType = config.answers?.find(a => a.answer === answer)?.type || 'paragraph';
    const mappedAnswer = config.answers?.find(a => a.answer === answer)?.mapped || answer;

    const answerBlock = getBlock(answerType, mappedAnswer);

    return [questionBlock, answerBlock];
  };

  const createFields = () => {
    const responses = form.response.getItemResponses();
    const properties = {};
    const children = [];
    // This is an object storing all questions and responses as it iterates through them,
    // for later use when replacing placeholders in the title
    const questionsAndAnswers = {};

    for (const response of responses) {
      const question = response.getItem().getTitle();
      const answer = response.getResponse() || '';

      questionsAndAnswers[question] = answer;

      // Find a configuration object that matches the current question
      const config = responseConfigs.find(config => config.question === question);

      // If no configurations are specified, it will default to saving the answers as properties, in rich text format, using the question string as the property name
      if (!config) {
        properties[question] = {
          rich_text: getProperty('rich_text', answer)
        };

        continue;
      }

      // If the response is marked to be ignored..
      if (config.ignore) {
        continue;
      }

      // If the item is to be processed as a block...
      if (config.item === 'block') {
        const blocks = parseResponseAsBlock(config, question, answer);
        children.push(...blocks);
      // If the item is to be processed as a property
      } else {
        const property = parseResponseAsProperty(config, question, answer);
        Object.assign(properties, property);
      }
    }

    // Save the page's name to the properties
    properties.Name = parsePageName(questionsAndAnswers);

    return { properties, children };
  };

  const createPayload = () => {
    const { properties, children } = createFields();

    return JSON.stringify({
      object: 'page',
      parent: {
        type: 'database_id',
        database_id: databaseID
      },
      properties,
      children
    });
  };

  const sendToNotion = () => {
    const payload = createPayload();
    const params = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${APIkey}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      payload,
      contentType: 'application/json'
    };

    return UrlFetchApp.fetch('https://api.notion.com/v1/pages', params);
  };

  return sendToNotion(form);
}
