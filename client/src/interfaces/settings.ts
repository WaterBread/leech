export interface Settings {
  downloadPath: string[];
  theme: {
    palette: {
      primary: {
        main: string;
      };
      secondary: {
        main: string;
      };
      type: 'light' | 'dark';
    };
  };
}

export default Settings;
