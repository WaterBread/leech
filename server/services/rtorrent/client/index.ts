import axios from 'axios';
import XmlParser from '../../xml';

const CONTENT_ENCODING = 'utf8';
const CONTENT_TYPE = 'text/xml';

const getConnectionAuthHeader = (): { Authorization?: string } => {
  const userName = process.env.SOCK_AUTH_USER;
  const password = process.env.SOCK_AUTH_PASS;

  if (userName && password) {
    const userPassString = `${userName}:${password}`;
    return {
      Authorization: `Basic ${Buffer.from(userPassString).toString('base64')}`
    };
  }
  return {};
};

const getClientUrl = () => {
  const url = `${process.env.SOCK_HOST}:${process.env.SOCK_PORT}`;

  if (url.startsWith('http://')) {
    return url;
  } else {
    return `http://${url}`;
  }
};

const makeRequest = async (xml: string) => {
  const data = await axios({
    url: getClientUrl(),
    method: 'POST',
    headers: {
      Accept: CONTENT_TYPE,
      'Content-Type': CONTENT_TYPE,
      'Accept-Charset': CONTENT_ENCODING,
      ...getConnectionAuthHeader()
    },
    data: xml
  });
  return data;
};

// Need to expand this to suit more socket types...
export const methodCall = async (xml: string) => {
  const response = await makeRequest(xml);
  const parsedData = new XmlParser().parse(response.data);
  return parsedData;
};
