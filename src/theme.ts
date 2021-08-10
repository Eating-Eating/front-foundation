import { createTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      light: '#ffffff',
      main: '#fce4ec',
      dark: '#c9b2ba',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  }
});
export default theme;
