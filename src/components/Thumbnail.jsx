// src/components/Thumbnail.jsx
import { useState } from 'react'
import {
  Box, IconButton, Chip, Stack, Typography, Tooltip,
  Slider, TextField, Menu, MenuItem, Checkbox, ListItemIcon, ListItemText
} from '@mui/material'
import { Crop, Close, RestartAlt, Visibility, VisibilityOff, MoreVert } from '@mui/icons-material'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import useStore from '../store'

export default function Thumbnail({ item, selected, list=false }) {
  const { toggleSelect, openEditor, removeItem, updateItem, setDownloadOpt } = useStore()
  const [loaded, setLoaded] = useState(false)
  const [anchor, setAnchor] = useState(null)

  const formats = ['webp','jpeg','png']
  const setField = (k,v)=> updateItem(item.id, { [k]: v })

  const toggleFormat = f => {
    if (!selected) return
    const s = new Set(item.formats)
    s.has(f)?s.delete(f):s.add(f)
    setField('formats', [...s])
  }
  const previewToggle = ()=> setField('previewOff', !item.previewOff)
  const reset = ()=>{
    setField('customName', item.name)
    setField('formats', ['webp'])
    setField('q', 100)
    setField('urlC', null)
  }

  return (
    <Box>
      <Box
        sx={{
          position:'relative',
          width: list?120:'100%',
          aspectRatio:'1/1',
          border:selected?'3px solid primary.main':'1px solid divider',
          borderRadius:2,
          overflow:'hidden',
          flexShrink:0
        }}
        onClick={()=>toggleSelect(item.id)}
        onDoubleClick={()=>openEditor(item.id)}
      >
        {!loaded && <Box sx={{position:'absolute',inset:0,backgroundColor:'action.hover'}}/>}
        <LazyLoadImage
          src={item.urlC||item.url}
          afterLoad={()=>setLoaded(true)}
          className="w-full h-full object-cover"
        />
        <Box
          sx={{
            position:'absolute', inset:0,
            display:'flex', alignItems:'center', justifyContent:'center',
            opacity:0, backgroundColor:'rgba(0,0,0,.4)', transition:'opacity .2s',
            '&:hover':{ opacity:1 }
          }}
          onClick={e=>e.stopPropagation()}
        >
          <Tooltip title="Редактировать"><IconButton size="small"><Crop sx={{ color:'#fff' }}/></IconButton></Tooltip>
        </Box>
        <IconButton
          size="small"
          sx={{position:'absolute', top:4, right:4, backgroundColor:'rgba(255,255,255,.8)'}}
          onClick={e=>{ e.stopPropagation(); removeItem(item.id) }}
        ><Close fontSize="small"/></IconButton>
      </Box>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mt={0.5}>
        <Typography variant={list?'body2':'caption'} noWrap>{item.customName}</Typography>
        <IconButton size="small" onClick={e=>{ e.stopPropagation(); setAnchor(e.currentTarget) }}><MoreVert/></IconButton>
      </Stack>

      <Menu anchorEl={anchor} open={!!anchor} onClose={()=>setAnchor(null)}>
        <MenuItem onClick={()=>{ previewToggle(); setAnchor(null) }}>
          <ListItemIcon>{ item.previewOff ? <Visibility/> : <VisibilityOff/> }</ListItemIcon>
          <ListItemText>{ item.previewOff ? 'Показать превью' : 'Скрыть превью' }</ListItemText>
        </MenuItem>
        <MenuItem onClick={()=>{ reset(); setAnchor(null) }}>
          <ListItemIcon><RestartAlt/></ListItemIcon>
          <ListItemText>Сбросить настройки</ListItemText>
        </MenuItem>
        <MenuItem onClick={()=>{ setDownloadOpt('includeOriginal', true); setAnchor(null) }}>
          <ListItemIcon><Checkbox/></ListItemIcon>
          <ListItemText>Скачать оригинал</ListItemText>
        </MenuItem>
      </Menu>

      <Stack direction="row" spacing={0.5} flexWrap="wrap" mt={0.5}>
        {formats.map(f=>(
          <Chip
            key={f}
            size="small"
            label={f.toUpperCase()}
            clickable
            disabled={!selected}
            color={selected && item.formats.includes(f) ? 'primary' : 'default'}
            onClick={e=>{ e.stopPropagation(); toggleFormat(f) }}
          />
        ))}
        {selected && (
          <Chip
            icon={<RestartAlt fontSize="small"/>}
            label="Сброс"
            size="small"
            onClick={e=>{ e.stopPropagation(); reset() }}
          />
        )}
      </Stack>

      <Box mt={1}>
        <Typography variant="caption">Качество: {item.q}%</Typography>
        <Slider
          value={item.q}
          min={1}
          max={100}
          size="small"
          disabled={!selected}
          onChange={(e,v)=>setField('q', v)}
        />
      </Box>

      <Box mt={1}>
        <TextField
          label="DPI (soon)"
          value={item.dpi || ''}
          size="small"
          disabled
          sx={{ width: 80 }}
        />
      </Box>
    </Box>
  )
}
