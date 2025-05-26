// src/components/Layout/Header.jsx
import React, { useRef } from 'react'
import { AppBar, Toolbar, Typography, IconButton, Fab, alpha } from '@mui/material'
import { styled } from '@mui/material/styles'
import UploadIcon from '@mui/icons-material/Upload'
import DownloadIcon from '@mui/icons-material/Download'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import useStore from '../store'

// Extended FAB по Material 3
const StickyDownloadButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  padding: theme.spacing(0, 2),
  height: theme.spacing(6),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  boxShadow: `0 2px 4px ${alpha(theme.palette.primary.main, 0.5)}`,
  textTransform: 'none',
  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
  '&:hover:not(.Mui-disabled)': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.6)}`,
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
    boxShadow: 'none',
  }
}))

export default function Header() {
  const fileRef = useRef()
  const dark = useStore(s => s.dark)
  const toggleDark = useStore(s => s.toggleDark)
  const openDownload = useStore(s => s.openDownload)
  const addFiles = useStore(s => s.addFiles)
  const setHelp = useStore(s => s.setHelp)
  const selected = useStore(s => s.selected)

  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={0}>
        <Toolbar sx={{ minHeight: 64 }}>
          <IconButton edge="start" onClick={() => fileRef.current.click()} sx={{ mr: 2 }}>
            <UploadIcon />
          </IconButton>
          <input
            ref={fileRef}
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={e => addFiles(Array.from(e.target.files))}
          />

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Shinobi Image Converter
          </Typography>

          <IconButton onClick={toggleDark} sx={{ mr: 1 }}>
            {dark ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          <IconButton onClick={() => setHelp(true)}>
            <HelpOutlineIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Extended FAB «Скачать» */}
      <StickyDownloadButton
        variant="extended"
        onClick={() => openDownload(true)}
        disabled={selected.size === 0}
      >
        <DownloadIcon sx={{ mr: 1 }} />
        <Typography variant="button">Скачать выбранные файлы</Typography>
      </StickyDownloadButton>o
    </>
  )
}
