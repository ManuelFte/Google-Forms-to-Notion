'use strict';

class Structure {
  constructor (type, content) {
    this.type = type;
    this.content = content;
  }

  getPropertyStructure () {
    const structures = {
      date: {
        start: this.content
      },
      rich_text: [
        {
          text: {
            content: this.content
          }
        }
      ],
      select: {
        name: this.content
      }
    };

    if (!structures[this.type]) {
      throw new Error(`Invalid type: type=${this.type}`);
    }

    return structures[this.type];
  }

  getBlockStructure () {
    const structures = {
      heading_1: {
        object: 'block',
        type: this.type,
        [this.type]: {
          rich_text: [
            {
              text: {
                content: this.content
              }
            }
          ]
        }
      },
      paragraph: {
        object: 'block',
        type: this.type,
        [this.type]: {
          rich_text: [
            {
              text: {
                content: this.content
              }
            }
          ]
        }
      }
    };

    if (!structures[this.type]) {
      throw new Error(`Invalid type: type=${this.type}`);
    }

    return structures[this.type];
  }
}
