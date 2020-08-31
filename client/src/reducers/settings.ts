import * as SettingsActions from 'actions/settings';
import { get } from 'lodash';

export default (state = {}, action: any) => {
  switch (action.type) {
    case SettingsActions.FETCH_REMOTE_SETTINGS_SUCCESS:
      console.log(action);
      const fullSettings = get(action, 'payload.settings', {});
      return fullSettings;
    case SettingsActions.CHANGE_LOCAL_SETTINGS:
      return action.values;
    case SettingsActions.CHANGE_LOCAL_SETTING:
      return {
        ...state,
        [action.settingName]: action.value,
      };
    default:
      return state;
  }
};
