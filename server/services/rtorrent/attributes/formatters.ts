// eslint-disable-next-line max-len
const urlExpr = /(?:https?|udp):\/\/(?:www\.)?([-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,18}\b)*(\/[/\d\w.-]*)*(?:[?])*(.+)*/i;

export const parseTracker = (tracker: string) => {
  const domain = urlExpr.exec(tracker);
  return domain[1];
};

export const toBoolean = (val: string) => {
  return Number(val) === 1;
};

export const splitStringBySeparator = (value = '') => {
  return value.split('/');
};
