import { parseISO } from 'date-fns';
import { ResponseType } from './interfaces';

// TODO: &amp; fucks everything up...
interface CurrentMember {
  name?: string
  value?: any
}

class XmlRpcHandler {
  values: any[];
  marks: any[];

  isFault: boolean;
  isMember: boolean;
  isMethodResponse: boolean;

  currentMember: CurrentMember;

  constructor () {
    this.values = [];
    this.marks = [];

    this.isFault = false;
    this.isMember = false;

    this.isMethodResponse = false;
    this.currentMember = {};
  }

  handleOpenTag = (tagName: string) => {
    switch (tagName) {
      case 'array':
      case 'struct':
        this.marks.push(this.values.length);
        break;
      case 'member':
        this.isMember = true;
        break;
      case 'methodResponse':
        this.isMethodResponse = true;
        break;
    }
  };

  handleTagValue = (tagName: string, tagValue: string) => {
    if (this.isMethodResponse) {
      switch (tagName) {
        case 'methodResponse':
          this.isMethodResponse = false;
          break;
        case 'fault':
          this.isFault = true;
          break;
        case 'member':
          this.values.push(this.currentMember);
          this.currentMember = {};
          this.isMember = false;
          break;
        case 'name':
          this.currentMember.name = tagValue;
          if (tagValue === 'faultString') { // Sometimes `fault` is not used -- instead its just a normal struct
            this.isFault = true;
          }
          break;
        case 'value':
          if (this.isMember) {
            const lastValue = this.values.pop();
            this.currentMember.value = lastValue;
          }
          break;
        case 'data':
        case 'param':
          return;
        case 'array':
        case 'struct': {
          const mark = this.marks.pop();
          this.values.splice(mark, this.values.length - mark, this.values.slice(mark));
          break;
        }
        case 'string':
          this.values.push(tagValue);
          break;
        case 'boolean':
          this.values.push(tagValue === '1'); // 1 is true, 0 is false
          break;
        case 'double':
          this.values.push(parseFloat(tagValue));
          break;
        case 'i4':
        case 'int':
          this.values.push(parseInt(tagValue, 10));
          break;
        case 'i8':
          this.values.push(Number(tagValue));
          break;
        case 'base64':
          this.values.push(Buffer.from(tagValue, 'base64'));
          break;
        case 'datetime.iso8601':
          this.values.push(parseISO(tagValue));
          break;
      }
    }
  };

  handleOnEnd = (): ResponseType => {
    return { response: this.values, isFault: this.isFault };
  };
}

export default XmlRpcHandler;
