import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'

const base = {
  dark: false,
  helpOpen: false,
  welcomeOpen: true,
  downloadOpen: false,
  modalOpen: false,
  currentId: null,
  viewMode: 'grid',
  snackbar: null,
  items: [],
  selected: new Set(),
  downloadOpts: { zip: false, includeOriginal: false },
  tasks: []
}

const api = (set, get) => ({
  toggleDark() {
    set(s => ({ dark: !s.dark }))
  },
  setHelp(v) {
    set({ helpOpen: v })
  },
  setWelcome(v) {
    set({ welcomeOpen: v })
  },
  openDownload(v) {
    set({ downloadOpen: v })
  },
  openEditor(id) {
    set({ modalOpen: true, currentId: id })
  },
  closeEditor() {
    set({ modalOpen: false, currentId: null })
  },
  setViewMode(m) {
    set({ viewMode: m })
  },
  setDownloadOpt(k, v) {
    set(s => ({ downloadOpts: { ...s.downloadOpts, [k]: v } }))
  },
  showSnackbar(sn) {
    set({ snackbar: sn })
    setTimeout(() => set({ snackbar: null }), 4000)
  },

  /* 1. Selection actions */
  toggleSelect(id) {
    set(s => {
      const sel = new Set(s.selected)
      sel.has(id) ? sel.delete(id) : sel.add(id)
      return { selected: sel }
    })
  },
  selectAll() {
    set(s => ({ selected: new Set(s.items.map(i => i.id)) }))
  },
  clearSelection() {
    set({ selected: new Set() })
  },

  /* 2. Item actions */
  addFiles(files) {
    const list = files.map(f => ({
      id: uuid(),
      name: f.name,
      customName: f.name.replace(/\.[^.]+$/, ''),
      url: URL.createObjectURL(f),
      urlC: null,
      sizeO: f.size,
      formats: ['webp'],
      q: 100,
      previewOff: false
    }))
    set(s => ({
      items: [...s.items, ...list],
      selected: new Set([...s.selected, ...list.map(i => i.id)])
    }))
  },
  removeItem(id) {
    set(s => ({
      items: s.items.filter(i => i.id !== id),
      selected: new Set([...s.selected].filter(x => x !== id))
    }))
  },
  updateItem(id, patch) {
    set(s => ({
      items: s.items.map(i => (i.id === id ? { ...i, ...patch } : i))
    }))
  },

  /* 3. Bulk delete actions */
  clearAll() {
    set({ items: [], selected: new Set() })
  },
  removeSelected() {
    set(s => {
      const kept = s.items.filter(i => !s.selected.has(i.id))
      return { items: kept, selected: new Set() }
    })
  },
  removeUnselected() {
    set(s => {
      const kept = s.items.filter(i => s.selected.has(i.id))
      return { items: kept, selected: new Set(kept.map(i => i.id)) }
    })
  },

  /* 4. Tasks for progress center */
  addTask(label) {
    const id = uuid()
    set(s => ({ tasks: [...s.tasks, { id, label, value: 0, speed: 0 }] }))
    return id
  },
  updateTask(id, value, speed) {
    set(s => ({
      tasks: s.tasks.map(t =>
        t.id === id ? { ...t, value, speed } : t
      )
    }))
  },
  finishTask(id) {
    set(s => ({ tasks: s.tasks.filter(t => t.id !== id) }))
  }
})

export default create(
  persist(
    (...a) => ({ ...base, ...api(...a) }),
    {
      name: 'shinobi-storage',
      version: 3,
      storage: createJSONStorage(() => localStorage),
      partialize: s => {
        let arr
        if (s.selected instanceof Set) arr = [...s.selected]
        else if (Array.isArray(s.selected)) arr = s.selected
        else if (s.selected && typeof s.selected === 'object')
          arr = Object.values(s.selected)
        else arr = []
        return { ...s, selected: arr }
      },
      merge: (persisted, current) => {
        if (persisted?.selected && !(persisted.selected instanceof Set)) {
          persisted.selected = Array.isArray(persisted.selected)
            ? new Set(persisted.selected)
            : new Set(Object.values(persisted.selected))
        }
        return { ...current, ...persisted }
      }
    }
  )
)
