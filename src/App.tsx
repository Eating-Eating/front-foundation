import * as React from 'react';
import Container from '@material-ui/core/Container';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { BrowserRouter,Redirect,Route } from "react-router-dom";
import { AppBar, Breadcrumbs, Drawer, IconButton } from '@material-ui/core';
import './style.scss'
import { useState } from 'react';
import BasePage from './pages/shared/BasePage'
function handleClick(event: { preventDefault: () => void; }) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

export default function App() {
  const [ifDrawer,setDrawer] = useState(false)
  const mainList = ["React","Vue","JavaScript","TypeScript","性能监控概述","数据结构","webpack","浏览器相关","网络"]
  return (
    <BrowserRouter>
      <AppBar className="headerContainer">
          <IconButton
            edge="start"
            color="inherit"
            className="menuIcon"
            onClick={()=>setDrawer(!ifDrawer)}
          >
            <MenuIcon />
          </IconButton>
          <Breadcrumbs className="menuBreadcrumbs">
            <Link color="inherit" href="/" onClick={handleClick}>
              Material-UI
            </Link>
            <Link color="inherit" href="/getting-started/installation/" onClick={handleClick}>
              Core
            </Link>
            <Typography color="textPrimary">Breadcrumb</Typography>
          </Breadcrumbs>
      </AppBar>
      <Container maxWidth="sm" className="appContainer">
          <Route path="/">
            <Redirect to="/react" />
          </Route>
          <Route  path="/react">
            <BasePage/>
          </Route>
      </Container>
      <Drawer 
        anchor="left" 
        open={ifDrawer} 
        onClose={()=>setDrawer(false)}
        classes={{paper:"modalStyle"}}
      >
        {mainList.map(key=><div className="navBlock" key={key}>{key}</div>)}
      </Drawer>
    </BrowserRouter>
  );
}
