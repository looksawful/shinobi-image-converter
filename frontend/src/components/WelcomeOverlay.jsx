import { Dialog,DialogTitle,DialogContent,Typography,Button } from '@mui/material'
import useStore from '../store'

export default function WelcomeOverlay(){
  const open=useStore(s=>s.welcomeOpen)
  const setWelcome=useStore(s=>s.setWelcome)
  return(
    <Dialog open={open} onClose={()=>setWelcome(false)}>
      <DialogTitle>Добро пожаловать в Shinobi Converter</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>Загрузите файлы, редактируйте, скачивайте и получайте помощь.</Typography>
        <Button onClick={()=>setWelcome(false)} variant='contained' sx={{mt:2}}>Начать</Button>
      </DialogContent>
    </Dialog>
  )
}
