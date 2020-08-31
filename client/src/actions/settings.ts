import { RequestAction } from 'interfaces/requestAction';

export const CHANGE_REMOTE_SETTINGS = 'CHANGE_REMOTE_SETTINGS';
export const FETCH_REMOTE_SETTINGS = 'FETCH_REMOTE_SETTINGS';
export const GET_REMOTE_SETTING = 'GET_REMOTE_SETTING';

export const CHANGE_REMOTE_SETTINGS_SUCCESS = `${CHANGE_REMOTE_SETTINGS}_SUCCESS`;
export const FETCH_REMOTE_SETTINGS_SUCCESS = `${FETCH_REMOTE_SETTINGS}_SUCCESS`;
export const GET_REMOTE_SETTING_SUCCESS = `${GET_REMOTE_SETTING}_SUCCESS`;

export const CHANGE_LOCAL_SETTINGS = 'CHANGE_LOCAL_SETTINGS';
export const CHANGE_LOCAL_SETTING = 'CHANGE_LOCAL_SETTING';

export const changeLocalSettings = (values: any) => {
  return {
    type: CHANGE_LOCAL_SETTINGS,
    values,
  };
};

export const changeLocalSetting = (settingName: string, value: any) => {
  return {
    type: CHANGE_LOCAL_SETTING,
    settingName,
    value,
  };
};

export const changeRemoteSettings = (values: any): RequestAction => {
  return {
    type: CHANGE_REMOTE_SETTINGS,
    request: {
      method: 'put',
      endpoint: `settings`,
      headers: {
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify({
        value: values,
      }),
    },
  };
};

export const getRemoteSettings = (): RequestAction => {
  return {
    type: FETCH_REMOTE_SETTINGS,
    request: {
      method: 'get',
      endpoint: `settings`,
    },
  };
};

export const getRemoteSetting = (settingName: string): RequestAction => {
  return {
    type: GET_REMOTE_SETTING,
    request: {
      method: 'get',
      endpoint: `settings/${settingName}`,
    },
  };
};
