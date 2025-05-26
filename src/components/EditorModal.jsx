// src/components/EditorModal.jsx
import React, { useRef, useEffect, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, Slider, TextField, Stack, Button, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Cropper } from 'react-cropper'
import useStore from '../store'

export default function EditorModal() {
  const open = useStore(s => s.modalOpen)
  const close = useStore(s => s.closeEditor)
  const { items, currentId, updateItem } = useStore()
  const item = items.find(i => i.id === currentId)
  const cropRef = useRef()
  const [name, setName] = useState('')
  const [quality, setQuality] = useState(1)
  const [formats, setFormats] = useState([])

  useEffect(() => {
    if (item) {
      setName(item.customName)
      setQuality(item.q / 100)
      setFormats(item.formats)
    }
  }, [item])

  const handleSave = () => {
    const canvas = cropRef.current?.cropper.getCroppedCanvas()
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob)
      updateItem(item.id, { customName: name, urlC: url, q: Math.round(quality * 100), formats })
      close()
    }, `image/${formats[0] || 'webp'}`, quality)
  }

  if (!item) return null
  return (
    <Dialog open={open} onClose={close} maxWidth="md" fullWidth>
      <DialogTitle>
        Редактировать
        <IconButton onClick={close} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon/></IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField label="Имя файла" fullWidth value={name} onChange={e => setName(e.target.value)} />
          <Cropper src={item.urlC||item.url} style={{ height: 400, width: '100%' }} guides ref={cropRef} />
          <Typography>Качество: {Math.round(quality*100)}%</Typography>
          <Slider value={quality} min={0.1} max={1} step={0.01} onChange={(e,v)=>setQuality(v)} />
          <Stack direction="row" spacing={1}>
            {['png','jpeg','webp'].map(fmt=>(
              <Button key={fmt} variant={formats.includes(fmt)?'contained':'outlined'} onClick={()=>setFormats(f=>f.includes(fmt)?f.filter(x=>x!==fmt):[...f,fmt])}>
                {fmt.toUpperCase()}
              </Button>
            ))}
          </Stack>
          <Button variant="contained" onClick={handleSave}>Применить</Button>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
