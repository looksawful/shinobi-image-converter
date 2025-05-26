import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Button, Typography } from '@mui/material';
import { Download } from '@mui/icons-material';
import useStore from '../store';
import { downloadSingle, downloadZip } from '../utils/converters';

export default function DownloadModal() {
	const open = useStore((s) => s.downloadModalOpen);
	const close = () => useStore.setState({ downloadModalOpen: false });
	const { items, selected, global } = useStore();
	const list = items.filter((i) => selected.has(i.id));

	return (
		<Dialog
			open={open}
			onClose={close}
			fullWidth
			maxWidth='sm'>
			<DialogTitle>Скачать выделенные</DialogTitle>
			<DialogContent>
				{list.length ? (
					<>
						<List>
							{list.map((i) => (
								<ListItem
									key={i.id}
									secondaryAction={
										<IconButton onClick={() => downloadSingle(i.blob ?? i.url, i.name, `image/${global.fmt}`, global.q)}>
											<Download />
										</IconButton>
									}>
									<ListItemAvatar>
										<Avatar src={i.urlC ?? i.url} />
									</ListItemAvatar>
									<ListItemText
										primary={i.name}
										secondary={`${(i.sizeO / 1024).toFixed(1)} KB → ${i.sizeC ? (i.sizeC / 1024).toFixed(1) + ' KB' : '—'}`}
									/>
								</ListItem>
							))}
						</List>
						<Button
							fullWidth
							variant='contained'
							onClick={() =>
								downloadZip(
									list.map((i) => ({ blob: i.blob ?? i.file, name: i.name })),
									global.fmt,
									global.q,
								)
							}>
							Скачать все ZIP
						</Button>
					</>
				) : (
					<Typography>Нет выделенных файлов</Typography>
				)}
			</DialogContent>
		</Dialog>
	);
}
