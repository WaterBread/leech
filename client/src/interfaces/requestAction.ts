export interface RequestActionData {
  type?: string;
  method: string;
  headers?: { [key: string]: string };
  payload?: any;
  endpoint: string;
}

export interface RequestAction {
  type: string;
  request: RequestActionData;
}
