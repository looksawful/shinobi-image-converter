import { Box,Paper,LinearProgress,Typography,Slide,Stack } from '@mui/material'
import useStore from '../store'

export default function ProgressCenter(){
  const tasks=useStore(s=>s.tasks)
  return(
    <Box sx={{position:'fixed',bottom:16,right:16,zIndex:1300,width:280,maxHeight:'50vh',overflowY:'auto'}}>
      {tasks.map(t=>(
        <Slide key={t.id} direction='up' in mountOnEnter unmountOnExit>
          <Paper elevation={4} sx={{mb:1.5,p:1.5}}>
            <Typography variant='caption'>{t.label}</Typography>
            <LinearProgress variant='determinate' value={t.value} sx={{height:6,borderRadius:1,mt:1}}/>
            <Stack direction='row' justifyContent='space-between' mt={.5}>
              <Typography variant='caption' color='text.secondary'>{t.value.toFixed(0)}%</Typography>
              <Typography variant='caption' color='text.secondary'>{t.speed.toFixed(1)} KB/s</Typography>
            </Stack>
          </Paper>
        </Slide>
      ))}
    </Box>
  )
}
