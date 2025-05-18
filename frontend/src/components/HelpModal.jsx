import { Dialog, DialogTitle, DialogContent, IconButton, Typography } from '@mui/material';
import Close from '@mui/icons-material/Close';
import useStore from '../store';

export default function HelpModal() {
	const open = useStore((s) => s.helpOpen);
	const close = () => useStore.setState({ helpOpen: false });
	return (
		<Dialog
			open={open}
			onClose={close}
			fullWidth
			maxWidth='sm'>
			<DialogTitle>
				Справка
				<IconButton
					onClick={close}
					sx={{ position: 'absolute', right: 8, top: 8 }}>
					<Close />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<Typography paragraph>Загрузите файлы, выделите их кликом, двойным кликом откройте редактор, затем скачивайте.</Typography>
			</DialogContent>
		</Dialog>
	);
}
