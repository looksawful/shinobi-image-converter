import { useRef, useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Button,
  IconButton,
  Slider,
  ToggleButtonGroup,
  ToggleButton,
  InputAdornment
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ColorizeIcon from '@mui/icons-material/Colorize'
import { Cropper } from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import useStore from '../store'

export default function EditorModal() {
  const open = useStore(s => s.modalOpen)
  const close = useStore(s => s.closeEditor)
  const { items, currentId, updateItem } = useStore()
  const item = items.find(i => i.id === currentId)
  const cropRef = useRef(null)

  const [name, setName] = useState('')
  const [quality, setQuality] = useState(1)
  const [formats, setFormats] = useState([])
  const [w, setW] = useState('')
  const [h, setH] = useState('')
  const [ratio, setRatio] = useState('')
  const [fillColor, setFillColor] = useState('#ffffff')
  const [transparent, setTransparent] = useState(false)

  useEffect(() => {
    if (!item) return
    setName(item.customName)
    setQuality(item.q / 100)
    setFormats(item.formats)
    setW('')
    setH('')
    setRatio('')
    setFillColor('#ffffff')
    setTransparent(false)
    cropRef.current?.cropper.reset()
  }, [item])

  const applyRatio = r => {
    setRatio(r)
    const [rw, rh] = r.split(':').map(Number)
    if (rw && rh) {
      cropRef.current?.cropper.setAspectRatio(rw / rh)
    }
  }

  const handleSave = () => {
    if (!cropRef.current) return
    const croppedCanvas = cropRef.current.cropper.getCroppedCanvas()
    const srcWidth = croppedCanvas.width
    const srcHeight = croppedCanvas.height
    const outW = Number(w) || srcWidth
    const outH = Number(h) || srcHeight

    const canvas = document.createElement('canvas')
    canvas.width = outW
    canvas.height = outH
    const ctx = canvas.getContext('2d')

    if (transparent && formats.includes('png')) {
      ctx.clearRect(0, 0, outW, outH)
    } else {
      ctx.fillStyle = fillColor
      ctx.fillRect(0, 0, outW, outH)
    }

    ctx.drawImage(croppedCanvas, 0, 0, srcWidth, srcHeight)

    canvas.toBlob(
      blob => {
        const url = URL.createObjectURL(blob)
        updateItem(item.id, {
          customName: name.replace(/\.[^.]+$/, ''),
          urlC: url,
          q: Math.round(quality * 100),
          formats
        })
        close()
      },
      `image/${formats[0] || 'webp'}`,
      quality
    )
  }

  if (!item) return null

  return (
    <Dialog open={open} onClose={close} maxWidth="md" fullWidth>
      <DialogTitle>
        Редактировать
        <IconButton
          onClick={close}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 2, pb: 3 }}>
        <Stack spacing={3}>
          <TextField
            label="Имя файла"
            fullWidth
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Cropper
            ref={cropRef}
            src={item.urlC || item.url}
            style={{ height: 400, width: '100%' }}
            viewMode={1}
            guides
            background={false}
            autoCropArea={1}
          />
          <Stack direction="row" spacing={2}>
            <TextField
              label="Ширина (px)"
              type="number"
              value={w}
              onChange={e => {
                setW(e.target.value)
                setRatio('')
              }}
            />
            <TextField
              label="Высота (px)"
              type="number"
              value={h}
              onChange={e => {
                setH(e.target.value)
                setRatio('')
              }}
            />
            <TextField
              label="Соотношение w:h"
              value={ratio}
              onChange={e => applyRatio(e.target.value)}
              placeholder="1:1"
            />
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <ToggleButtonGroup
              size="small"
              exclusive
              value={transparent ? 'tr' : 'cl'}
              onChange={(e, v) => {
                if (!v) return
                setTransparent(v === 'tr')
              }}
            >
              <ToggleButton value="cl">Цвет</ToggleButton>
              <ToggleButton value="tr" disabled={!formats.includes('png')}>
                Прозрачн.
              </ToggleButton>
            </ToggleButtonGroup>
            <TextField
              disabled={transparent}
              type="color"
              label="Цвет заливки"
              value={fillColor}
              onChange={e => setFillColor(e.target.value)}
              sx={{ width: 120 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ColorizeIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />
          </Stack>
          <Stack>
            <span>Качество: {Math.round(quality * 100)}%</span>
            <Slider
              value={quality}
              min={0.1}
              max={1}
              step={0.01}
              onChange={(e, v) => setQuality(v)}
            />
          </Stack>
          <Stack direction="row" spacing={1}>
            {['png', 'jpeg', 'webp'].map(f => (
              <ToggleButton
                key={f}
                value={f}
                selected={formats.includes(f)}
                onChange={() =>
                  setFormats(cur =>
                    cur.includes(f) ? cur.filter(x => x !== f) : [...cur, f]
                  )
                }
              >
                {f.toUpperCase()}
              </ToggleButton>
            ))}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="contained" onClick={handleSave}>
          Применить
        </Button>
      </DialogActions>
    </Dialog>
  )
}
