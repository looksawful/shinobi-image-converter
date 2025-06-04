import { AppBar,Toolbar,Typography,IconButton } from '@mui/material'
import Brightness4 from '@mui/icons-material/DarkMode'
import Brightness7 from '@mui/icons-material/LightMode'
import useStore from '../store'

export default function Header(){
  const dark=useStore(s=>s.dark)
  const toggle=useStore(s=>s.toggleDark)
  return(
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' sx={{flexGrow:1}}>Shinobi Converter</Typography>
        <IconButton color='inherit' onClick={toggle}>{dark?<Brightness7/>:<Brightness4/>}</IconButton>
      </Toolbar>
    </AppBar>
  )
}
