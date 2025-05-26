// src/components/TransparentGalleryHeader.jsx
import React, { useState, useEffect } from 'react'
import { AppBar, Toolbar, Typography, IconButton, Tooltip } from '@mui/material'
import { SelectAll, ClearAll, RestartAlt, ViewModule, ViewList, Download, Replay } from '@mui/icons-material'
import useStore from '../store'

export default function TransparentGalleryHeader() {
  const {
    selectAll,
    clearSelection,
    resetAllChanges,
    lastResetAll,
    undoReset,
    selected,
    openDownload,
    viewMode,
    setViewMode
  } = useStore()

  // countdown in seconds
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    let timer
    if (lastResetAll) {
      setSeconds(5)
      timer = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      setSeconds(0)
    }
    return () => clearInterval(timer)
  }, [lastResetAll])

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ bgcolor: 'transparent', backdropFilter: 'blur(4px)' }}
    >
      <Toolbar variant="dense" sx={{ minHeight: 48 }}>
        <Typography sx={{ flexGrow: 1 }}>Галерея</Typography>

        <Tooltip title="Выбрать всё">
          <IconButton onClick={selectAll}><SelectAll /></IconButton>
        </Tooltip>

        <Tooltip title="Снять выделение">
          <IconButton onClick={clearSelection}><ClearAll /></IconButton>
        </Tooltip>

        <Tooltip title="Сбросить все настройки">
          <IconButton onClick={resetAllChanges}><RestartAlt /></IconButton>
        </Tooltip>

        {lastResetAll && (
          <Tooltip title="Отменить сброс">
            <IconButton onClick={undoReset} sx={{ ml: 1 }}>
              <Replay />
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                 {seconds} сек.
              </Typography>
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Скачать">
          <span>
            <IconButton
              disabled={!selected.size}
              onClick={() => openDownload(true)}
            >
              <Download />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title={viewMode === 'grid' ? 'Список' : 'Плитка'}>
          <IconButton onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? <ViewList /> : <ViewModule />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  )
}
