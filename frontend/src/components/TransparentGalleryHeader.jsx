import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  ButtonGroup,
  Button
} from '@mui/material'
import {
  SelectAll,
  ClearAll,
  DeleteForever,
  DeleteSweep,
  DeleteOutline,
  ViewModule,
  ViewList,
  Download
} from '@mui/icons-material'
import useStore from '../store'

export default function TransparentGalleryHeader() {
  const {
    items,
    selected,
    viewMode,
    selectAll,
    clearSel,
    clearAll,
    removeSelected,
    removeUnselected,
    openDownload,
    setView
  } = useStore(s => ({
    items            : s.items,
    selected         : s.selected,
    viewMode         : s.viewMode,
    selectAll        : s.selectAll,
    clearSel         : s.clearSel,
    clearAll         : s.clearAll,
    removeSelected   : s.removeSelected,
    removeUnselected : s.removeUnselected,
    openDownload     : s.openDownload,
    setView          : s.setView
  }))

  const allSelected  = selected.size === items.length && items.length !== 0
  const noneSelected = selected.size === 0

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        bgcolor: 'transparent',
        backdropFilter: 'blur(4px)',
        outline: 'none',      /* ← убираем рамку */
        border : 'none'       /* ← на всякий случай */
      }}
    >
      <Toolbar variant="dense" sx={{ minHeight: 48 }}>
        <Typography sx={{ flexGrow: 1 }}>Галерея</Typography>

        <Tooltip title="Выбрать всё">
          <IconButton onClick={selectAll} disabled={allSelected}>
            <SelectAll />
          </IconButton>
        </Tooltip>

        <Tooltip title="Снять выбор">
          <IconButton onClick={clearSel} disabled={noneSelected}>
            <ClearAll />
          </IconButton>
        </Tooltip>

        <ButtonGroup variant="outlined" color="error" sx={{ ml: 1 }}>
          <Tooltip title="Удалить всё">
            <IconButton onClick={clearAll} disabled={items.length === 0}>
              <DeleteForever />
            </IconButton>
          </Tooltip>

          <Tooltip title="Удалить выбранные">
            <span>
              <IconButton
                onClick={removeSelected}
                disabled={noneSelected}
              >
                <DeleteSweep />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Удалить не-выбранные">
            <span>
              <IconButton
                onClick={removeUnselected}
                disabled={allSelected || items.length === 0}
              >
                <DeleteOutline />
              </IconButton>
            </span>
          </Tooltip>
        </ButtonGroup>

        <Button
          variant="contained"
          size="medium"
          startIcon={<Download />}
          disabled={items.length === 0}
          onClick={() => openDownload(true)}
          sx={{ ml: 2 }}
        >
          Скачать
        </Button>

        <Tooltip title={viewMode === 'grid' ? 'Список' : 'Плитка'}>
          <IconButton
            onClick={() =>
              setView(viewMode === 'grid' ? 'list' : 'grid')
            }
            sx={{ ml: 1 }}
          >
            {viewMode === 'grid' ? <ViewList /> : <ViewModule />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  )
}
