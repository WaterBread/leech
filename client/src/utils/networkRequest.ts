import { RequestActionData } from 'interfaces/requestAction';

export default async (action: RequestActionData) => {
  const fetchOptions = {
    method: action.method,
    headers: action.headers,
    body: action.payload || null,
  };

  const endpoint = `${process.env.REACT_APP_API_URL}/${action.endpoint}`;

  const response = await fetch(endpoint, fetchOptions);
  try {
    const responseBody = await response.json();
    if (!response.ok) throw responseBody;
    return responseBody;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
