import { Box,Typography } from '@mui/material'
import { useRef,useState,useCallback } from 'react'
import useStore from '../store'

const MAX_SIZE = 10 * 1024 * 1024
const ACCEPTED_MIME = [
  'image/jpeg','image/jpg','image/png','image/webp',
  'image/gif','image/avif','image/heic','image/heif'
]
const ACCEPTED_EXT = ['.jpg','.jpeg','.png','.webp','.gif','.avif','.heic','.heif']

export default function UploadZone(){
  const { addFiles, showSnackbar } = useStore()
  const inputRef = useRef()
  const [drag,setDrag] = useState(false)

  const okType = f =>
    ACCEPTED_MIME.includes(f.type) ||
    ACCEPTED_EXT.some(ext => f.name.toLowerCase().endsWith(ext))

  const handleFiles = useCallback(files=>{
    const ok=[], bad=[]
    files.forEach(f=>{
      if (okType(f) && f.size <= MAX_SIZE) ok.push(f)
      else bad.push(f)
    })
    if(ok.length){
      addFiles(ok)
      showSnackbar({message:`Загружено ${ok.length}`,severity:'success'})
    }
    if(bad.length){
      const msg = bad.map(f=>{
        if(!okType(f)) return `${f.name}: формат`
        if(f.size>MAX_SIZE) return `${f.name}: >10 MB`
        return `${f.name}: ошибка`
      }).join(', ')
      showSnackbar({message:`Не загружено: ${msg}`,severity:'error'})
    }
  },[addFiles,showSnackbar])

  return(
    <Box
      onDragEnter={e=>{e.preventDefault();setDrag(true)}}
      onDragLeave={e=>{e.preventDefault();setDrag(false)}}
      onDragOver={e=>e.preventDefault()}
      onDrop={e=>{e.preventDefault();setDrag(false);handleFiles(Array.from(e.dataTransfer.files))}}
      onClick={()=>inputRef.current.click()}
      sx={{border:'2px dashed',borderColor:drag?'primary.main':'divider',borderRadius:3,p:6,textAlign:'center',cursor:'pointer',
           background:drag?'repeating-linear-gradient(45deg,transparent 0 5px,action.hover 5px 10px)':'',transition:'all .2s'}}
    >
      <input
        ref={inputRef}
        type='file'
        hidden
        multiple
        accept={ACCEPTED_MIME.join(',')}
        onChange={e=>handleFiles(Array.from(e.target.files))}
      />
      <Typography variant='body2'>Нажмите или перетащите файлы сюда</Typography>
    </Box>
  )
}
