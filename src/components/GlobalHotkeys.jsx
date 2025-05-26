// src/components/GlobalHotkeys.jsx
import { useEffect } from 'react'
import useStore from '../store'

export default function GlobalHotkeys() {
  const {
    setHelp, setWelcome, openDownload,
    toggleDark, setViewMode
  } = useStore()

  useEffect(() => {
    const onKey = e => {
      if (e.ctrlKey||e.metaKey) return
      switch (e.key.toLowerCase()) {
        case 'u': document.getElementById('file-input')?.click(); break
        case 'h': setHelp(true); break
        case 'd': toggleDark(); break
        case 's': openDownload(true); break
        case 'e': window.dispatchEvent(new CustomEvent('editor-open')); break
        case 'g': setViewMode('grid'); break
        case 'l': setViewMode('list'); break
        case 'escape':
          setHelp(false)
          setWelcome(false)
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setHelp, setWelcome, openDownload, toggleDark, setViewMode])

  return null
}
