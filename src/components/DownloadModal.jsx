// frontend/src/components/DownloadModal.jsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Button, Typography, Stack } from '@mui/material';
import { Download } from '@mui/icons-material';
import useStore from '../store';
import { downloadSingle, downloadZip, compress } from '../utils/converters';

export default function DownloadModal() {
	const open = useStore((s) => s.downloadModalOpen);
	const close = () => useStore.setState({ downloadModalOpen: false });
	const { items, selected, global } = useStore.getState();
	const targets = selected.size ? items.filter((i) => selected.has(i.id)) : items;

	const handleDownloadAllFormats = async () => {
		const formats = ['png', 'jpeg', 'webp'];
		const entries = [];
		for (const i of targets) {
			for (const fmt of formats) {
				const q = i.q ?? global.q;
				const { blob } = await compress(i.file, fmt, q);
				const base = (i.customName || i.name).replace(/\.[^/.]+$/, '');
				entries.push({ blob, name: `${base}.${fmt}` });
			}
		}
		downloadZip(entries);
	};

	return (
		<Dialog
			open={open}
			onClose={close}
			fullWidth
			maxWidth='sm'>
			<DialogTitle>Скачать</DialogTitle>
			<DialogContent>
				{targets.length ? (
					<>
						<List>
							{targets.map((i) => {
								const name = i.customName || i.name;
								return (
									<ListItem
										key={i.id}
										secondaryAction={
											<IconButton
												onClick={async () => {
													const fmt = i.fmt;
													const q = i.q ?? global.q;
													const { blob } = await compress(i.file, fmt, q);
													downloadSingle(blob, `${name.replace(/\.[^/.]+$/, '')}.${fmt}`);
												}}>
												<Download />
											</IconButton>
										}>
										<ListItemAvatar>
											<Avatar src={i.urlC ?? i.url} />
										</ListItemAvatar>
										<ListItemText
											primary={name}
											secondary={`${((i.sizeO ?? 0) / 1024).toFixed(1)} KB → ${((i.sizeC ?? i.sizeO ?? 0) / 1024).toFixed(1)} KB`}
										/>
									</ListItem>
								);
							})}
						</List>
						<Stack
							spacing={1}
							mt={2}>
							<Button
								variant='contained'
								fullWidth
								onClick={async () => {
									const arr = [];
									for (const i of targets) {
										const fmt = i.fmt;
										const q = i.q ?? global.q;
										const { blob } = await compress(i.file, fmt, q);
										arr.push({
											blob,
											name: `${(i.customName || i.name).replace(/\.[^/.]+$/, '')}.${fmt}`,
										});
									}
									downloadZip(arr);
								}}>
								Скачать ZIP
							</Button>
							<Button
								variant='outlined'
								fullWidth
								onClick={handleDownloadAllFormats}>
								Скачать в трёх форматах
							</Button>
						</Stack>
					</>
				) : (
					<Typography>Нет файлов для скачивания</Typography>
				)}
			</DialogContent>
		</Dialog>
	);
}
