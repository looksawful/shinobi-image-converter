import { Grid,Typography } from '@mui/material'
import useStore from '../store'
import Thumbnail from './Thumbnail'
import TransparentGalleryHeader from './TransparentGalleryHeader'

export default function GalleryGrid(){
  const items=useStore(s=>s.items)
  return(
    <>
      <TransparentGalleryHeader/>
      {items.length===0?(
        <Typography variant='body2' color='text.secondary' sx={{mt:4,textAlign:'center'}}>Пока нет изображений. Загрузите файлы, чтобы начать работу.</Typography>
      ):(
        <Grid container spacing={2}>
          {items.map(i=><Grid item xs={6} sm={4} md={3} lg={2} key={i.id}><Thumbnail item={i} selected={useStore.getState().selected.has(i.id)}/></Grid>)}
        </Grid>
      )}
    </>
  )
}
