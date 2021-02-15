import { Parameter } from '../interfaces';
import { get } from 'lodash';
import { FaultError } from './faultError';

const mapItemToParameter = (item: any, param: Parameter) => {
  if (param.formatResponse) {
    const formatItem = param.formatResponse(item);
    return { apiName: param.apiName, value: formatItem };
  }

  return { apiName: param.apiName, value: item };
};

const mapItemsToParameters = <T extends Parameter>(items: any, parameters: T[]) => {
  return parameters.reduce((prev, param, idx) => {
    const { apiName, value } = mapItemToParameter(items[idx], param);
    return { ...prev, [apiName]: value };
  }, {});
};

type ErrorResponseType = [[{ name: 'faultCode', value: number }, { name: 'faultString', value: string }]];
export const createError = (item: ErrorResponseType) => {
  const faultCode = get(item, [0, 0, 'value'], -1);
  const faultString = get(item, [0, 1, 'value']);

  if (faultCode === -1) {
    console.warn('Invalid fault string returned from rtorrent. Inspect response;');
    console.log(JSON.stringify(item));
  }

  return new FaultError({ faultCode, faultString });
};

// eslint-disable-next-line max-len
export default <T extends Parameter>(item: any[][], parameters: T[]) => {
  const expectedParams = parameters.filter(param => param.expectResponse);

  return item.map((subItem) => {
    if (Array.isArray(subItem)) {
      return mapItemsToParameters(subItem, expectedParams);
    } else {
      // A single item came back
      const { value } = mapItemToParameter(subItem, expectedParams[0]);
      return value;
    }
  });
};
