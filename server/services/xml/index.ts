/**
 * Shitty xml parser - because I couldn't find anything else
 */

import { ResponseType } from './interfaces';
import XmlRpcHandler from './tagHandlers';

enum SPECIAL_CHARS {
  END_TAG = '>',
  START_TAG = '<',
  CLOSE_TAG = '/'
}

class Parser {
  private characterBuffer: string[];
  private isTagOpen: boolean;
  private value: string;
  private tagHandler: any; // This should have a type so I can change it out

  constructor () {
    this.characterBuffer = [];
    this.isTagOpen = false;
    this.value = undefined;

    // Make this changeable -- for now I cant be assed
    this.tagHandler = new XmlRpcHandler();
  }

  private readonly getFirstCharacterFromBuffer = () => {
    return this.characterBuffer[0];
  };

  private readonly endTag = () => {
    this.characterBuffer.shift();
    const tagName = this.characterBuffer.join('');
    this.tagHandler.handleTagValue(tagName, this.value);

    this.characterBuffer = [];
  };

  private readonly openTag = () => {
    const tagName = this.characterBuffer.join('');
    this.tagHandler.handleOpenTag(tagName);

    this.characterBuffer = [];
    return tagName;
  };

  private readonly addCharacterToBuffer = (character: string) => {
    this.characterBuffer.push(character);
  };

  private readonly setValueFromCharBuffer = () => {
    const string = this.characterBuffer.join('').trim();
    this.characterBuffer = [];

    this.value = string;
  };

  parse = (xml: string): ResponseType => {
    try {
      for (let x = 0; x < xml.length; x++) {
        const character = xml[x];

        switch (character) {
          case SPECIAL_CHARS.START_TAG:
            if (this.isTagOpen) {
              // If the tag is open, that means this char is just a regular one
              this.addCharacterToBuffer(character);
            } else {
              this.isTagOpen = true;
              this.setValueFromCharBuffer();
            }
            break;
          case SPECIAL_CHARS.END_TAG:
            if (this.isTagOpen) {
              if (this.getFirstCharacterFromBuffer() === SPECIAL_CHARS.CLOSE_TAG) {
                // End the tag
                this.endTag();
              } else {
                this.openTag();
              }
              this.isTagOpen = false;
            }

            break;
          default:
            this.addCharacterToBuffer(character);
            break;
        }
      }

      return this.tagHandler.handleOnEnd();
    } finally {
      // Clean up everything
      this.characterBuffer = [];
      this.isTagOpen = false;
      this.value = undefined;
      this.tagHandler = new XmlRpcHandler();
    }
  };
}

export default Parser;
