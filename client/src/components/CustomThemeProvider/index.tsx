import { useSelector } from 'react-redux';
import get from 'lodash/get';
import { ThemeOptions } from '@material-ui/core';

interface Props {
  children: (theme: ThemeOptions) => JSX.Element;
}

const CustomThemeProvider = ({ children }: Props) => {
  const customTheme = useSelector(state => get(state, 'settings.theme'));
  return children(customTheme);
};

export default CustomThemeProvider;
