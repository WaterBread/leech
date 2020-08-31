import { Parameter } from './methods';

const parseMethodItem = (item: any, parameters: Parameter[]) => {
  return parameters.reduce((prev, param, idx) => {
    if (param.param.formatResponse) {
      const formatItem = param.param.formatResponse(item[idx]);
      return { ...prev, [param.param.apiName]: formatItem };
    }
    return { ...prev, [param.param.apiName]: item[idx] };
  }, {});
};

export default (item: any, parameters: Parameter[]) => {
  const expectedParams = parameters.filter(param => param.expectResponse);

  if (Array.isArray(item)) {
    return item.map((subItem) => parseMethodItem(subItem, expectedParams));
  }

  if (expectedParams.length > 0) {
    const firstParam = expectedParams[0];
    return { [firstParam.param.apiName]: item };
  }

  return item;
};
