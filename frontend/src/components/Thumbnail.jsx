import { useState } from 'react'
import {
  Box,
  Stack,
  IconButton,
  Tooltip,
  Typography,
  Slider,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material'
import { Crop, Close, CheckCircle } from '@mui/icons-material'
import useStore from '../store'

export default function Thumbnail({ item }) {
  const {
    selected,
    toggleSelect,
    openEditor,
    removeItem,
    updateItem
  } = useStore(s => ({
    selected: s.selected.has(item.id),
    toggleSelect: s.toggleSelect,
    openEditor: s.openEditor,
    removeItem: s.removeItem,
    updateItem: s.updateItem
  }))

  const [ratio, setRatio] = useState('1/1')
  const [imgLoaded, setImgLoaded] = useState(false)

  const setField = (k, v) => updateItem(item.id, { [k]: v })

  return (
    <Box>
      <Box
        onClick={() => toggleSelect(item.id)}
        sx={{
          position: 'relative',
          aspectRatio: ratio,
          width: 180,
          borderRadius: 2,
          overflow: 'hidden',
          cursor: 'pointer',
          outline: selected
            ? '2px solid var(--mui-palette-primary-main)'
            : '1px solid var(--mui-palette-divider)',
          boxShadow: selected ? '0 0 8px rgba(0,0,0,.25)' : 'none',
          transition: 'outline .15s, box-shadow .15s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'action.hover'
        }}
      >
        <img
          src={item.urlC || item.url}
          style={{ objectFit: 'contain', width: '100%', height: '100%' }}
          onLoad={e => {
            const { naturalWidth: w, naturalHeight: h } = e.target
            if (w && h) setRatio(`${w}/${h}`)
            setImgLoaded(true)
          }}
          alt=""
        />

        {selected && (
          <CheckCircle
            fontSize="small"
            sx={{
              position: 'absolute',
              top: 6,
              left: 6,
              color: 'primary.main',
              bgcolor: 'background.paper',
              borderRadius: '50%'
            }}
          />
        )}

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: imgLoaded ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            bgcolor: 'rgba(0,0,0,.35)',
            transition: 'opacity .2s',
            '&:hover': { opacity: 1 }
          }}
          onClick={e => {
            e.stopPropagation()
            openEditor(item.id)
          }}
        >
          <Tooltip title="Редактировать">
            <IconButton size="small">
              <Crop sx={{ color: '#fff' }} />
            </IconButton>
          </Tooltip>
        </Box>

        <IconButton
          size="small"
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            bgcolor: 'rgba(0,0,0,.6)',
            color: '#fff',
            '&:hover': { bgcolor: 'rgba(0,0,0,.8)' }
          }}
          onClick={e => {
            e.stopPropagation()
            removeItem(item.id)
          }}
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>

      <Tooltip title={item.customName}>
        <Typography
          variant="body2"
          noWrap
          sx={{ mt: 2, mb: 1, maxWidth: 180 }}
        >
          {item.customName}
        </Typography>
      </Tooltip>

      <Stack spacing={1}>
        <Typography variant="caption">Качество: {item.q}%</Typography>
        <Slider
          value={item.q}
          min={1}
          max={100}
          size="small"
          onChange={(e, v) => setField('q', v)}
        />
        <ToggleButtonGroup
          size="small"
          value={item.formats}
          onChange={(e, val) => setField('formats', val)}
        >
          {['png', 'jpeg', 'webp'].map(f => (
            <ToggleButton key={f} value={f}>
              {f.toUpperCase()}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
    </Box>
  )
}
