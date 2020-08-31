import { changeRemoteSettings, getRemoteSettings } from 'actions/settings';
import { useEffect } from 'react';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { getSettings } from 'selectors/settings';

interface Props {
  children: any;
}

const SettingsWatcher = ({ children }: Props) => {
  const dispatch = useDispatch();
  const settings = useSelector(getSettings);

  console.log(settings);
  useEffect(() => {
    if (!isEmpty(settings)) {
      dispatch(changeRemoteSettings(settings));
    }
  }, [dispatch, settings]);

  useEffect(() => {
    dispatch(getRemoteSettings());
  }, [dispatch]);

  if (isEmpty(settings)) return null;
  else return children;
};

export default SettingsWatcher;
