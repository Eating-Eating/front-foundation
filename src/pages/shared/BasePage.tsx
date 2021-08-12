import { Chip, Grid,Fab, AppBar, Breadcrumbs, Drawer, IconButton, Link, Toolbar, List, ListItem, ListItemText, ListItemProps, Slide, Container } from "@material-ui/core";
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import { FC, useMemo, useState } from "react";
import ListIcon from '@material-ui/icons/List';
import Popover from '@material-ui/core/Popover';
//@ts-ignore
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import MenuIcon from '@material-ui/icons/Menu';
import {  singleCata, useAppSelector } from '../../store'
import './BasePage.scss'
import { createStyles,makeStyles } from "@material-ui/styles";
import { useHistory, useLocation } from "react-router";
const useStyles = makeStyles((theme:any) =>{
  return createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    Fab:{
      position: "fixed",
      bottom:'50px',
      right:'50px',
      top:'auto'
    },
  })
});
const ListItemLink = (props: ListItemProps<'a', { button?: true }>)=>{
  return <ListItem button component="a" {...props} />;
}
const HideOnScroll = (props: {
  window?: () => Window;
  children: React.ReactElement;
})=>{
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}
const BasePage:FC<{}> = ({children})=> {
  const history = useHistory()
  const location = useLocation()
  const nowPaths = useMemo(()=>{
    const pathArr = location.pathname.split('/')
    pathArr.shift()
    let nowPaths:{
      pathName:string;
      labelName:string
    }[] = []
    pathArr.reduce((accumulator, currentValue)=>{
      let temp = accumulator + '/' + currentValue
      nowPaths.push({
        labelName:currentValue,
        pathName:accumulator + '/' + currentValue
      })
      return temp
    },'')
    return nowPaths
  },[location])
  const routes = useAppSelector((state)=>state.routes)
  const nowState = useMemo(()=>{
    let temp:singleCata = {
      label:'',
      mdPath:"",
      routePath:'',
      keyWords:[]
    }
    const rec = (arr:singleCata[] | string[])=>{
      if(arr.length>0){
        arr.forEach(key=>{
          if(typeof key !== "string"){
            if(key.routePath === location.pathname){
              temp = key
            }
            rec(key.keyWords)
          }
        })
      }
    }
    rec(routes)
    return temp
  },[location.pathname, routes])
  const [ifDrawer,setDrawer] = useState(false)
  // const [bottomValue,setBottomValue] = useState('whatis')
  const classes = useStyles();
  return <>
  <HideOnScroll>
  <AppBar position="fixed">
  <Toolbar>
    <IconButton
      edge="start"
      color="inherit"
      className={classes.menuButton}
      onClick={()=>setDrawer(!ifDrawer)}
    >
      <MenuIcon />
    </IconButton>
    <Breadcrumbs className={classes.title}>
      {nowPaths && nowPaths.map(key=><Link color="inherit" key={key.pathName} onClick={()=>{
        history.push(key.pathName)
      }}>
        {key.labelName}
      </Link>)}
    </Breadcrumbs>
    </Toolbar>
  </AppBar>
  </HideOnScroll>
      <Grid container justifyContent="flex-start" spacing={1}>
        {nowState.keyWords.map((key)=>{
          if(typeof key === "string"){
            return <Grid item key={key}>
            <Chip
              label={key}
            />
            </Grid>
          }else{
            return <Grid item key={key.routePath + key.label}>
            <Chip
              label={key.label}
              onClick={()=>{
                if(key.routePath){
                  history.push(key.routePath)
                }
              }}
            />
            </Grid>
          }
        }
        
          )}
      </Grid>
      <Container maxWidth="lg">
      {children}
      </Container>
      <PopupState variant="popover" popupId="demo-popup-popover">
      {(popupState: any) => (
        <div>
        <Fab
          variant="extended"
          size="small"
          color="primary"
          aria-label="add"
          className={classes.Fab}
          {...bindTrigger(popupState)}
        >
          <ListIcon />
        </Fab>
          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
          <List component="nav" aria-label="secondary mailbox folders">
            <ListItemLink href="#whatis">
              <ListItemText primary="是什么" />
            </ListItemLink>
            <ListItemLink href="#issue">
              <ListItemText primary="缺陷/优化" />
            </ListItemLink>
            <ListItemLink href="#scenario">
              <ListItemText primary="应用场景" />
            </ListItemLink>
            <ListItemLink href="#replacement">
              <ListItemText primary="代替方案" />
            </ListItemLink>
          </List>
          </Popover>
        </div>
      )}
    </PopupState>

      <Drawer 
        anchor="left" 
        open={ifDrawer} 
        onClose={()=>setDrawer(false)}
        classes={{paper:"modalStyle"}}
      >
        {routes.map(key=><div className="navBlock" key={key.routePath} onClick={()=>{
          if(key.routePath){
            history.push(key.routePath)
          }
          setDrawer(false)
        }}>{key.label}</div>)}
      </Drawer>
  </>
}
export default BasePage