import { CssBaseline, ThemeProvider } from '@mui/material'
import { useMemo } from 'react'
import useStore from './store'
import makeTheme from './theme'
import Header from './components/Header'
import WelcomeOverlay from './components/WelcomeOverlay'
import HelpDrawer from './components/HelpDrawer'
import UploadZone from './components/UploadZone'
import GalleryGrid from './components/GalleryGrid'
import ListView from './components/ListView'
import DownloadModal from './components/DownloadModal'
import EditorModal from './components/EditorModal'
import GlobalHotkeys from './components/GlobalHotkeys'
import Footer from './components/Footer'

export default function App() {
  const dark = useStore(s => s.dark)
  const view = useStore(s => s.viewMode)
  const theme = useMemo(() => makeTheme(dark ? 'dark' : 'light'), [dark])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <main style={{maxWidth:1440,margin:'0 auto',padding:'64px 48px',display:'flex',flexDirection:'column',gap:64}}>
  <UploadZone/>
  {view==='grid'?<GalleryGrid/>:<ListView/>}
</main>

      <Footer />
      <WelcomeOverlay />
      <HelpDrawer />
      <DownloadModal />
      <EditorModal />
      <GlobalHotkeys />
    </ThemeProvider>
  )
}
