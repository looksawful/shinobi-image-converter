import { Stack,Typography } from '@mui/material'
import useStore from '../store'
import Thumbnail from './Thumbnail'
import TransparentGalleryHeader from './TransparentGalleryHeader'

export default function ListView(){
  const items=useStore(s=>s.items)
  return(
    <>
      <TransparentGalleryHeader/>
      {items.length===0?(
        <Typography variant='body2' color='text.secondary' sx={{mt:4,textAlign:'center'}}>Пока нет изображений. Загрузите файлы, чтобы начать работу.</Typography>
      ):(
        <Stack spacing={2}>
          {items.map(i=><Thumbnail key={i.id} item={i} selected={useStore.getState().selected.has(i.id)} list/>)}
        </Stack>
      )}
    </>
  )
}
