// src/components/DownloadModal.jsx
import React, { useState, useEffect, useMemo } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  Stack,
  Tooltip,
  Badge,
  Chip,
  Avatar
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import DownloadIcon from '@mui/icons-material/Download'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import useStore from '../store'

export default function DownloadModal() {
  const theme = useTheme()

  const open = useStore(s => s.downloadOpen)
  const setDownload = useStore(s => s.openDownload)
  const items = useStore(s => s.items)
  const selected = useStore(s => s.selected)
  const showSnackbar = useStore(s => s.showSnackbar)
  const snackbar = useStore(s => s.snackbar)

  const close = () => setDownload(false)

  const tree = useMemo(
    () =>
      items
        .filter(i => selected.size === 0 || selected.has(i.id))
        .map(item => ({
          id: item.id,
          original: { name: item.customName, src: item.urlC || item.url },
          formats: item.formats.map(fmt => ({
            name: `${item.customName.replace(/\.[^/.]+$/, '')}.${fmt}`,
            src: item.urlC || item.url,
            checked: true
          })),
          checked: true
        })),
    [items, selected]
  )

  const [fileTree, setFileTree] = useState([])
  const [zipEnabled, setZipEnabled] = useState(false)
  const [origEnabled, setOrigEnabled] = useState(false)

  useEffect(() => {
    setFileTree(tree)
  }, [tree])

  const totalCount = useMemo(
    () =>
      fileTree.reduce(
        (sum, f) =>
          sum +
          (origEnabled && f.checked ? 1 : 0) +
          f.formats.filter(c => c.checked && f.checked).length,
        0
      ),
    [fileTree, origEnabled]
  )

  const handleSelectAll = () =>
    setFileTree(prev =>
      prev.map(f => ({
        ...f,
        checked: true,
        formats: f.formats.map(c => ({ ...c, checked: true }))
      }))
    )
  const handleDeselectAll = () =>
    setFileTree(prev =>
      prev.map(f => ({
        ...f,
        checked: false,
        formats: f.formats.map(c => ({ ...c, checked: false }))
      }))
    )
  const toggleFile = idx =>
    setFileTree(prev => {
      const copy = [...prev]
      copy[idx].checked = !copy[idx].checked
      return copy
    })
  const toggleFormat = (fi, ci) =>
    setFileTree(prev => {
      const copy = [...prev]
      if (!copy[fi].checked) copy[fi].checked = true
      copy[fi].formats[ci].checked = !copy[fi].formats[ci].checked
      return copy
    })
  const removeFile = idx =>
    setFileTree(prev => {
      const copy = [...prev]
      copy.splice(idx, 1)
      return copy
    })
  const handleResetAll = () => {
    handleSelectAll()
    setOrigEnabled(false)
    setZipEnabled(false)
  }

  const handleDownload = async () => {
    const files = []
    fileTree.forEach(f => {
      if (!f.checked) return
      if (origEnabled) files.push(f.original)
      f.formats
        .filter(c => c.checked)
        .forEach(c => files.push(c))
    })
    if (!files.length) {
      showSnackbar({ message: 'Нечего скачивать', severity: 'warning' })
      return
    }
    try {
      const zip = new JSZip()
      for (const f of files) {
        const blob = await fetch(f.src).then(r => r.blob())
        zip.file(f.name, blob)
      }
      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(content, 'shinobi.zip')
      showSnackbar({ message: 'Скачивание успешно', severity: 'success' })
      close()
    } catch {
      showSnackbar({ message: 'Ошибка при скачивании', severity: 'error' })
    }
  }

  return (
    <>
      <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
        <DialogTitle>
          Скачать файлы
          <IconButton onClick={close} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <FormControlLabel
              control={<Checkbox checked={zipEnabled} onChange={() => setZipEnabled(p => !p)} />}
              label="Скачать как ZIP"
            />
            <FormControlLabel
              control={<Checkbox checked={origEnabled} onChange={() => setOrigEnabled(p => !p)} />}
              label="Скачать оригинал"
            />
            <Button size="small" onClick={handleSelectAll}>Выделить все</Button>
            <Button size="small" onClick={handleDeselectAll}>Отменить выбор</Button>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {fileTree.map((file, fi) => (
            <Box key={file.id} mb={2}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1} flexWrap="wrap">
                <Checkbox checked={file.checked} onChange={() => toggleFile(fi)} />
                <Avatar src={file.original.src} sx={{ width: 48, height: 48 }} />
                <Typography sx={{ flexGrow: 1 }}>{file.original.name}</Typography>
                <Tooltip title="Удалить файл">
                  <IconButton size="small" onClick={() => removeFile(fi)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                {file.formats.map((fmt, ci) => (
                  <Chip
                    key={ci}
                    label={fmt.name.split('.').pop().toUpperCase()}
                    size="small"
                    clickable={file.checked}
                    disabled={!file.checked}
                    color={file.checked && fmt.checked ? 'primary' : 'default'}
                    variant={file.checked ? 'filled' : 'outlined'}
                    onClick={() => file.checked && toggleFormat(fi, ci)}
                    sx={{
                      // Когда файл не выбран, но формат отмечен – подсветим в оттенке action.selected
                      ...(!file.checked && fmt.checked && {
                        backgroundColor: theme.palette.action.selected,
                        color: theme.palette.text.primary
                      })
                    }}
                  />
                ))}
              </Stack>
            </Box>
          ))}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={handleResetAll}>
            Сбросить всё
          </Button>
          <Box flexGrow={1} />
          <Badge badgeContent={totalCount} color="primary">
            <Button variant="contained" startIcon={<DownloadIcon />} disabled={totalCount === 0} onClick={handleDownload}>
              Скачать
            </Button>
          </Badge>
        </DialogActions>
      </Dialog>

      <Snackbar open={Boolean(snackbar?.message)} autoHideDuration={4000} onClose={() => showSnackbar({ message: '', severity: 'info' })}>
        <Alert onClose={() => showSnackbar({ message: '', severity: 'info' })} severity={snackbar?.severity || 'info'}>
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </>
  )
}
