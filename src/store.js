// src/store.js
import { create } from 'zustand'
import { v4 as uuid } from 'uuid'

const useStore = create((set, get) => ({
  /* UI state */
  dark: false,
  helpOpen: false,
  welcomeOpen: true,
  downloadOpen: false,
  viewMode: 'grid',
  snackbar: null,

  /* data */
  items: [],
  selected: new Set(),

  /* download options */
  downloadOpts: {
    format: 'webp',
    quality: 100,
    aspect: 'original',
    includeOriginal: false,
    resetPerImage: false,
    previewToggle: true
  },

  /* reset-undo */
  lastResetAll: null,
  undoResetTimeout: null,

  /* actions */
  showSnackbar(snack) {
    set({ snackbar: snack })
    setTimeout(() => set({ snackbar: null }), 4000)
  },
  toggleDark() {
    set(state => ({ dark: !state.dark }))
  },
  setHelp(v) { set({ helpOpen: v }) },
  setWelcome(v) { set({ welcomeOpen: v }) },
  openDownload(v) { set({ downloadOpen: v }) },
  setViewMode(m) { set({ viewMode: m }) },

  /* selection */
  toggleSelect(id) {
    set(state => {
      const s = new Set(state.selected)
      s.has(id) ? s.delete(id) : s.add(id)
      return { selected: s }
    })
  },
  clearSelection() {
    set({ selected: new Set() })
  },
  selectAll() {
    set(state => ({ selected: new Set(state.items.map(i => i.id)) }))
  },

  /* items */
  addFiles(files) {
    const newItems = files.map(f => ({
      id: uuid(),
      name: f.name,
      customName: f.name,
      url: URL.createObjectURL(f),
      urlC: null,
      sizeO: f.size,
      formats: ['webp'],
      q: 100,
      previewOff: false
    }))
    set(state => ({
      items: [...state.items, ...newItems],
      selected: new Set([...state.selected, ...newItems.map(i => i.id)])
    }))
  },
  removeItem(id) {
    set(state => ({
      items: state.items.filter(i => i.id !== id),
      selected: new Set([...state.selected].filter(x => x !== id))
    }))
  },
  updateItem(id, patch) {
    set(state => ({
      items: state.items.map(i => i.id === id ? { ...i, ...patch } : i)
    }))
  },
  clearAll() {
    set({ items: [], selected: new Set() })
  },
  resetAllChanges() {
    set(state => ({
      lastResetAll: state.items.map(i => ({ ...i })),
      items: state.items.map(i => ({
        ...i,
        customName: i.name,
        urlC: null,
        formats: ['webp'],
        q: 100,
        previewOff: false
      }))
    }))
    const t = setTimeout(() => set({ lastResetAll: null, undoResetTimeout: null }), 5000)
    set({ undoResetTimeout: t })
  },
  undoReset() {
    const prev = get().lastResetAll
    if (prev) {
      clearTimeout(get().undoResetTimeout)
      set({ items: prev, lastResetAll: null, undoResetTimeout: null })
    }
  },

  /* download options */
  setDownloadOpt(key, val) {
    set(state => ({
      downloadOpts: { ...state.downloadOpts, [key]: val }
    }))
  }
}))

export default useStore
