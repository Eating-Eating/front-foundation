

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import { createStyles,makeStyles } from "@material-ui/styles";
import { FC, ReactElement } from 'react';
import { useHistory, useLocation } from 'react-router';
const useStyles = makeStyles((theme:any) =>{
  return createStyles({
    bottom: {
      position: "fixed",
      bottom:0,
      left:0,
      right:0,
      top:'auto'
    },
  })
});
export const BottomNav:FC<{children:ReactElement}> =  ({children})=>{
  const history = useHistory()
  const location = useLocation()
  const classes = useStyles();
  return (<>
  {children}
  <BottomNavigation
    value={location.pathname}
    onChange={(event, newValue) => {
      history.push(newValue)
    }}
    showLabels
    className={classes.bottom}
  >
  <BottomNavigationAction value="/react" label="知识的宝库" icon={<RestoreIcon />} />
  <BottomNavigationAction value="/beTheKing" label="自我拷打" icon={<RestoreIcon />} />
</BottomNavigation>
</>)
}