import get from 'lodash/get';
import Settings from 'interfaces/settings';

export const getSetting = (settingName: string) => (state: Settings) => {
  return get(state, `settings.${settingName}`);
};

export const getSettings = (state: Settings) => {
  return get(state, 'settings');
};
