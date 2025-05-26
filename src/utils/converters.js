import { saveAs } from 'file-saver';

export const compress = async (file, fmt, q) => {
	const img = await createImageBitmap(file);
	const canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;
	canvas.getContext('2d').drawImage(img, 0, 0);
	return new Promise((resolve) =>
		canvas.toBlob(
			(b) =>
				resolve({
					blob: b,
					size: b.size,
					url: URL.createObjectURL(b),
				}),
			`image/${fmt}`,
			q,
		),
	);
};

export const downloadSingle = async (src, name) => {
	let blob;
	if (src instanceof Blob) blob = src;
	else {
		const response = await fetch(src);
		blob = await response.blob();
	}
	saveAs(blob, name);
};

export const downloadZip = async (entries) => {
	const { default: JSZip } = await import('jszip');
	const zip = new JSZip();
	for (const { blob, name } of entries) {
		const data = blob instanceof Blob ? blob : await (await fetch(blob)).blob();
		zip.file(name, data);
	}
	const zBlob = await zip.generateAsync({ type: 'blob' });
	saveAs(zBlob, 'shinobi.zip');
};
