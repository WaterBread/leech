import { create } from 'xmlbuilder2';
import { XMLBuilder } from 'xmlbuilder2/lib/interfaces';

type ParamType = string | number | boolean| Buffer | ParamType[] | any;

export const serializeMethodCall = (methodName: string, params = [] as ParamType[], encoding?: string) => {
  const options = { version: '1.0', encoding: undefined };

  if (encoding) {
    options.encoding = encoding;
  }

  const xml = create(options)
    .ele('methodCall')
    .ele('methodName')
    .txt(methodName)
    .up()
    .ele('params');

  params.forEach((param) => {
    serializeValue(param, xml.ele('param'));
  });

  // Includes the <?xml ...> declaration
  return xml.doc().toString();
};

const serializeValue = (value: ParamType, xml: XMLBuilder) => {
  // we're about to add a new value (compound or simple)
  const valueNode = xml.ele('value');
  switch (typeof value) {
    case 'boolean':
      appendBoolean(value, valueNode);
      break;
    case 'string':
      appendString(value, valueNode);
      break;
    case 'number':
      appendNumber(value, valueNode);
      break;
    case 'object':
      if (value === null) {
        valueNode.ele('nil');
      } else if (Buffer.isBuffer(value)) {
        appendBuffer(value, valueNode);
      } else {
        if (Array.isArray(value)) {
          xml = valueNode.ele('array').ele('data');
          (value as string[]).forEach(val => serializeValue(val, xml));
        } else {
          xml = valueNode.ele('struct');
          const keys = Object.keys(value);

          keys.forEach(key => {
            const val = value[key];
            const obj = xml.ele('member');

            obj.ele('name').txt(key);
            serializeValue(val, obj);
          });
        }
      }
      break;
    default:
      break;
  }
};

function appendBoolean (value: boolean, xml: XMLBuilder) {
  xml.ele('boolean').txt((value ? 1 : 0).toString());
}

function appendString (value: string, xml: XMLBuilder) {
  if (value.length === 0) {
    xml.ele('string');
  } else {
    xml.ele('string').txt(value);
  }
}

function appendNumber (value: number, xml: XMLBuilder) {
  if (value % 1 === 0) {
    xml.ele('int').txt(value.toString());
  } else {
    xml.ele('double').txt(value.toString());
  }
}

function appendBuffer (value: Buffer, xml: XMLBuilder) {
  xml.ele('base64').txt(value.toString('base64'));
}
