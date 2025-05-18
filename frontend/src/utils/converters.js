import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const compress = async (file, fmt, q) => {
	const img = await createImageBitmap(file);
	const canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;
	canvas.getContext('2d').drawImage(img, 0, 0);
	return new Promise((r) =>
		canvas.toBlob(
			(b) =>
				r({
					blob: b,
					size: b.size,
					url: URL.createObjectURL(b),
				}),
			`image/${fmt}`,
			q,
		),
	);
};

export const downloadSingle = async (src, name, type, q) => {
	let blob;
	if (src instanceof Blob) blob = src;
	else {
		const r = await fetch(src);
		blob = await r.blob();
	}
	saveAs(blob, name);
};

export const downloadZip = async (arr, fmt, q) => {
	const zip = new JSZip();
	for (const { blob, name } of arr) {
		const data = blob instanceof Blob ? blob : await (await fetch(blob)).blob();
		zip.file(name, data);
	}
	const z = await zip.generateAsync({ type: 'blob' });
	saveAs(z, 'shinobi.zip');
};
