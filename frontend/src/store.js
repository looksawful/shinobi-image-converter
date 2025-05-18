import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { saveFile, removeFile, clearDB, loadAll } from './utils/db';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { compress } from './utils/converters';

const useStore = create((set, get) => ({
	// state
	items: [],
	selected: new Set(),
	dark: false,
	helpOpen: false,
	downloadModalOpen: false,
	modalOpen: false,
	currentId: null,
	global: { fmt: 'jpeg', q: 0.8 },
	snackbar: { open: false, message: '', severity: 'info' },

	// per-item settings update
	updateSettings: (id, data) =>
		set(({ items }) => ({
			items: items.map((i) => (i.id === id ? { ...i, ...data } : i)),
		})),

	// download (with nested paths support)
	downloadPhoto: async (id) => {
		const it = get().items.find((i) => i.id === id);
		let blob = it.blob;
		if (!blob) {
			const { blob: b } = await compress(it.file, it.fmt, it.q);
			blob = b;
		}
		const name = it.customName || it.name;
		if (name.includes('/')) {
			const zip = new JSZip();
			zip.file(name, blob);
			const z = await zip.generateAsync({ type: 'blob' });
			saveAs(z, 'images.zip');
		} else {
			saveAs(blob, name);
		}
	},

	// add new files (persist to IndexedDB)
	addFiles: (files) => {
		const { fmt, q } = get().global;
		const mapped = files.map((f) => {
			const id = uuid();
			saveFile(id, f);
			return {
				id,
				file: f,
				url: URL.createObjectURL(f),
				sizeO: f.size,
				fmt,
				q,
				name: f.name,
				customName: f.name,
				sizeC: null,
				blob: null,
				urlC: null,
			};
		});
		set(({ items }) => ({
			items: [...items, ...mapped],
			snackbar: { open: true, message: 'Файлы загружены', severity: 'success' },
		}));
	},

	// update existing item (e.g. after crop/convert)
	updateItem: (id, data) =>
		set(({ items }) => ({
			items: items.map((i) => (i.id === id ? { ...i, ...data } : i)),
		})),

	// remove single file (and from IndexedDB)
	removeItem: (id) => {
		removeFile(id);
		set(({ items, selected }) => {
			const sel = new Set(selected);
			sel.delete(id);
			return {
				items: items.filter((i) => i.id !== id),
				selected: sel,
				snackbar: { open: true, message: 'Файл удалён', severity: 'info' },
			};
		});
	},

	// clear all files
	clearAll: () => {
		clearDB();
		set(() => ({
			items: [],
			selected: new Set(),
			snackbar: { open: true, message: 'Все файлы удалены', severity: 'info' },
		}));
	},

	// selection
	toggleSelect: (id) =>
		set(({ selected }) => {
			const sel = new Set(selected);
			selected.has(id) ? sel.delete(id) : sel.add(id);
			return { selected: sel };
		}),
	selectAll: () => set(({ items }) => ({ selected: new Set(items.map((i) => i.id)) })),
	clearSelection: () => set({ selected: new Set() }),

	// UI
	toggleDark: () => set(({ dark }) => ({ dark: !dark })),
	openEditor: (id) => set({ currentId: id, modalOpen: true }),
	closeEditor: () => set({ modalOpen: false }),
	openDownloadModal: () => set({ downloadModalOpen: true }),
	closeDownloadModal: () => set({ downloadModalOpen: false }),
	showSnackbar: ({ message, severity = 'info' }) => set(({ snackbar }) => ({ snackbar: { ...snackbar, open: true, message, severity } })),
	closeSnackbar: () => set(({ snackbar }) => ({ snackbar: { ...snackbar, open: false } })),

	// bulk convert
	convertSelected: async () => {
		const { items, selected, global, showSnackbar } = get();
		try {
			for (const id of selected) {
				const it = items.find((x) => x.id === id);
				const { blob, size } = await compress(it.file, global.fmt, global.q);
				get().updateItem(id, { blob, sizeC: size, urlC: URL.createObjectURL(blob) });
			}
			showSnackbar({ message: 'Конвертация завершена', severity: 'success' });
		} catch (e) {
			showSnackbar({ message: `Ошибка: ${e.message}`, severity: 'error' });
		}
	},
}));

// on startup, load persisted files
loadAll().then((pairs) => {
	const loaded = pairs.map(([id, f]) => ({
		id,
		file: f,
		url: URL.createObjectURL(f),
		sizeO: f.size,
		fmt: useStore.getState().global.fmt,
		q: useStore.getState().global.q,
		name: f.name,
		customName: f.name,
		sizeC: null,
		blob: null,
		urlC: null,
	}));
	if (loaded.length) {
		useStore.setState({ items: loaded });
	}
});

export default useStore;
