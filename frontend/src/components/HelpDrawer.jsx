import { Drawer,Box,Typography,IconButton,List,ListItem,ListItemText,Divider } from '@mui/material'
import HelpOutline from '@mui/icons-material/HelpOutline'
import Close from '@mui/icons-material/Close'
import useStore from '../store'

export default function HelpDrawer(){
  const open=useStore(s=>s.helpOpen)
  const setHelp=useStore(s=>s.setHelp)
  return(
    <Drawer anchor='right' open={open} onClose={()=>setHelp(false)}>
      <Box sx={{width:360,p:3}}>
        <Box sx={{display:'flex',alignItems:'center',mb:2}}>
          <HelpOutline/>
          <Typography variant='h6' sx={{ml:1}}>Справка</Typography>
          <IconButton sx={{ml:'auto'}} onClick={()=>setHelp(false)}><Close/></IconButton>
        </Box>
        <Typography variant='body2' mb={2}>
          Загрузите файлы, выделите, редактируйте, скачайте через диалог.
        </Typography>
        <Divider sx={{mb:1}}/>
        <List dense>
          {['U — загрузить файлы','E — открыть редактор','S — диалог скачивания','H — открыть справку','D — смена темы'].map(txt=><ListItem key={txt}><ListItemText primary={txt}/></ListItem>)}
        </List>
      </Box>
    </Drawer>
  )
}
