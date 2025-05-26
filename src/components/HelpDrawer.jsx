import { Drawer, Box, Typography, IconButton } from '@mui/material';
import Close from '@mui/icons-material/Close';
import useStore from '../store';
function HelpDrawer() {
	const open = useStore((s) => s.helpOpen);
	return (
		<Drawer
			anchor='right'
			open={open}
			onClose={() => useStore.setState({ helpOpen: false })}>
			<Box sx={{ width: 320, p: 3 }}>
				<Box className='flex justify-between items-center mb-4'>
					<Typography variant='h6'>Справка</Typography>
					<IconButton onClick={() => useStore.setState({ helpOpen: false })}>
						<Close />
					</IconButton>
				</Box>
				<Typography
					variant='body2'
					paragraph>
					Загрузите изображения Drag & Drop или через диалог, выделяйте кликом, редактируйте двойным кликом, скачивайте выделенные кнопкой вверху.
				</Typography>
			</Box>
		</Drawer>
	);
}
export default HelpDrawer;
