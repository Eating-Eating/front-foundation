import Container from '@material-ui/core/Container';
import { BrowserRouter,Route, Switch,  } from "react-router-dom";
import './style.scss'
import { ThemeProvider } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core/styles';
import BasePage from '@/pages/shared/BasePage'
import {AsyncCompoennt} from './pages/shared/asyncComponent'
import {BeTheKing} from '@/pages/BeTheKing'
import {BottomNav} from '@/pages/shared/BottomNav'
function App() {
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
    <BottomNav>
      <Switch>
        <Route path="/beTheKing" exact>
          <BeTheKing/>
        </Route>
        <BasePage>
        <Route path="/react" key="/react" exact>
          {AsyncCompoennt(import("./pages/markdown/react/index.md"))}
        </Route>
        <Route path="/react/key" key="/react/key" exact>
          {AsyncCompoennt(import("./pages/markdown/react/key.md"))}
        </Route>
        <Route path="/react/hooks" key="/react/hooks" exact>
          {AsyncCompoennt(import("./pages/markdown/react/hooks.md"))}
        </Route>
<Route path="/react/fiber" key="/react/fiber" exact>{AsyncCompoennt(import("./pages/markdown/react/fiber.md"))}</Route>
<Route path="/react/diff" key="/react/diff" exact>{AsyncCompoennt(import("./pages/markdown/react/diff.md"))}</Route>
<Route path="/react/update" key="/react/update" exact>{AsyncCompoennt(import("./pages/markdown/react/update.md"))}</Route>
<Route path="/react/redux" key="/react/redux" exact>{AsyncCompoennt(import("./pages/markdown/react/redux.md"))}</Route>
<Route path="/vue" key="/vue" exact>{AsyncCompoennt(import("./pages/markdown/vue/index.md"))}</Route>
<Route path="/vue/key" key="/vue/key" exact>{AsyncCompoennt(import("./pages/markdown/vue/key.md"))}</Route>
<Route path="/vue/diff" key="/vue/diff" exact>{AsyncCompoennt(import("./pages/markdown/vue/diff.md"))}</Route>
<Route path="/vue/watch" key="/vue/watch" exact>{AsyncCompoennt(import("./pages/markdown/vue/watch.md"))}</Route>
<Route path="/vue/vuex" key="/vue/vuex" exact>{AsyncCompoennt(import("./pages/markdown/vue/vuex.md"))}</Route>
<Route path="/webBrowser" key="/webBrowser" exact>{AsyncCompoennt(import("./pages/markdown/webBrowser/index.md"))}</Route>
<Route path="/webBrowser/cookie" key="/webBrowser/cookie" exact>{AsyncCompoennt(import("./pages/markdown/webBrowser/cookie.md"))}</Route>
<Route path="/webBrowser/crossPage" key="/webBrowser/crossPage" exact>{AsyncCompoennt(import("./pages/markdown/webBrowser/crossPage.md"))}</Route>
<Route path="/webBrowser/memory" key="/webBrowser/memory" exact>{AsyncCompoennt(import("./pages/markdown/webBrowser/memory.md"))}</Route>
<Route path="/webBrowser/performance" key="/webBrowser/performance" exact>{AsyncCompoennt(import("./pages/markdown/webBrowser/performance.md"))}</Route>
<Route path="/webBrowser/pwa" key="/webBrowser/pwa" exact>{AsyncCompoennt(import("./pages/markdown/webBrowser/pwa.md"))}</Route>
<Route path="/webBrowser/safety" key="/webBrowser/safety" exact>{AsyncCompoennt(import("./pages/markdown/webBrowser/safety.md"))}</Route>
        </BasePage>
        
      </Switch>
    </BottomNav>
    </ThemeProvider>
      </Container>
    </BrowserRouter>
  );
}
export default App