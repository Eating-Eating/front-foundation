import * as React from 'react';
import Container from '@material-ui/core/Container';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import ProTip from './ProTip';
import { BrowserRouter } from "react-router-dom";
import { AppBar, Breadcrumbs, Drawer, IconButton, Toolbar } from '@material-ui/core';
import './style.scss'
import { useState } from 'react';
function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}
function handleClick(event: { preventDefault: () => void; }) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

export default function App() {
  const [ifDrawer,setDrawer] = useState(false)
  const mainList = ["React","Vue","JavaScript","TypeScript","性能监控概述","数据结构","webpack","浏览器相关","网络"]
  return (
    <BrowserRouter>
      <AppBar>
          <IconButton
            edge="start"
            color="inherit"
            className="menuIcon"
            onClick={()=>setDrawer(!ifDrawer)}
          >
            <MenuIcon />
          </IconButton>
          <Breadcrumbs>
            <Link color="inherit" href="/" onClick={handleClick}>
              Material-UI
            </Link>
            <Link color="inherit" href="/getting-started/installation/" onClick={handleClick}>
              Core
            </Link>
            <Typography color="textPrimary">Breadcrumb</Typography>
          </Breadcrumbs>
      </AppBar>
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create React App v5-beta example with TypeScript
          </Typography>
          <ProTip />
          <Copyright />
        </Box>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create React App v5-beta example with TypeScript
          </Typography>
          <ProTip />
          <Copyright />
        </Box>
      </Container>
      <Drawer 
        anchor="left" 
        open={ifDrawer} 
        onClose={()=>setDrawer(false)}
        classes={{paper:"modalStyle"}}
      >
        {mainList.map(key=><div>{key}</div>)}
      </Drawer>
    </BrowserRouter>
  );
}
