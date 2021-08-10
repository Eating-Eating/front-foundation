import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import { createTheme } from '@material-ui/core/styles';
import { Provider } from 'react-redux'
import {store} from './store'
import App from './App';
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
ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  </Provider>,
  document.querySelector('#root'),
);
