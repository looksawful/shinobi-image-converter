// src/App.jsx
import React from 'react'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import useStore from './store'

import GlobalHotkeys   from './components/GlobalHotkeys'
import WelcomeOverlay  from './components/WelcomeOverlay'
import Header          from './components/Header'
import UploadZone      from './components/UploadZone'
import EditorModal     from './components/EditorModal'
import DownloadModal   from './components/DownloadModal'
import HelpDrawer      from './components/HelpDrawer'
import GalleryGrid     from './components/GalleryGrid'
import ListView        from './components/ListView'
import Footer          from './components/Footer'

export default function App() {
  const dark = useStore(s => s.dark)
  const view = useStore(s => s.viewMode)

  const theme = createTheme({ palette: { mode: dark ? 'dark' : 'light' } })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalHotkeys />
      <WelcomeOverlay />
      <Header />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <UploadZone />
        <div style={{ marginTop: 32 }}>
          {view === 'grid' ? <GalleryGrid /> : <ListView />}
        </div>
      </main>

      <EditorModal />
      <DownloadModal />
      <HelpDrawer />
      <Footer />
    </ThemeProvider>
  )
}
