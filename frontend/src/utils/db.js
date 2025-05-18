import { set, get, del, update, keys } from 'idb-keyval';

export const saveFile = (id, file) => set(id, file);
export const removeFile = (id) => del(id);
export const loadAll = () => keys().then((all) => Promise.all(all.map((k) => get(k).then((v) => [k, v]))));
export const clearDB = () => keys().then((all) => Promise.all(all.map((k) => del(k))));
