import Container from '@material-ui/core/Container';
import { BrowserRouter,Route } from "react-router-dom";
import './style.scss'
import { ThemeProvider } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core/styles';
import BasePage from '@/pages/shared/BasePage'
import {AsyncCompoennt} from './pages/shared/asyncComponent'

export default function App() {
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
    }
  });
  return (
    <BrowserRouter basename="/eating-eating">
      <Container maxWidth="lg" className="appContainer">

    <ThemeProvider theme={theme}>
        <BasePage>
        <Route path="/react" key="/react" exact>{AsyncCompoennt(import("./pages/react/index.md"))}</Route>
<Route path="/react/key" key="/react/key" exact>{AsyncCompoennt(import("./pages/react/key.md"))}</Route>
<Route path="/react/hooks" key="/react/hooks" exact>{AsyncCompoennt(import("./pages/react/hooks.md"))}</Route>
<Route path="/react/fiber" key="/react/fiber" exact>{AsyncCompoennt(import("./pages/react/fiber.md"))}</Route>
<Route path="/react/diff" key="/react/diff" exact>{AsyncCompoennt(import("./pages/react/diff.md"))}</Route>
<Route path="/react/update" key="/react/update" exact>{AsyncCompoennt(import("./pages/react/update.md"))}</Route>
<Route path="/react/redux" key="/react/redux" exact>{AsyncCompoennt(import("./pages/react/redux.md"))}</Route>
<Route path="/vue" key="/vue" exact>{AsyncCompoennt(import("./pages/vue/index.md"))}</Route>
<Route path="/vue/key" key="/vue/key" exact>{AsyncCompoennt(import("./pages/vue/key.md"))}</Route>
<Route path="/vue/diff" key="/vue/diff" exact>{AsyncCompoennt(import("./pages/vue/diff.md"))}</Route>
<Route path="/vue/watch" key="/vue/watch" exact>{AsyncCompoennt(import("./pages/vue/watch.md"))}</Route>
<Route path="/vue/vuex" key="/vue/vuex" exact>{AsyncCompoennt(import("./pages/vue/vuex.md"))}</Route>
<Route path="/webBrowser" key="/webBrowser" exact>{AsyncCompoennt(import("./pages/webBrowser/index.md"))}</Route>
<Route path="/webBrowser/cookie" key="/webBrowser/cookie" exact>{AsyncCompoennt(import("./pages/webBrowser/cookie.md"))}</Route>
<Route path="/webBrowser/crossPage" key="/webBrowser/crossPage" exact>{AsyncCompoennt(import("./pages/webBrowser/crossPage.md"))}</Route>
<Route path="/webBrowser/memory" key="/webBrowser/memory" exact>{AsyncCompoennt(import("./pages/webBrowser/memory.md"))}</Route>
<Route path="/webBrowser/performance" key="/webBrowser/performance" exact>{AsyncCompoennt(import("./pages/webBrowser/performance.md"))}</Route>
<Route path="/webBrowser/pwa" key="/webBrowser/pwa" exact>{AsyncCompoennt(import("./pages/webBrowser/pwa.md"))}</Route>
<Route path="/webBrowser/safety" key="/webBrowser/safety" exact>{AsyncCompoennt(import("./pages/webBrowser/safety.md"))}</Route>
        </BasePage>
    </ThemeProvider>
      </Container>
    </BrowserRouter>
  );
}
