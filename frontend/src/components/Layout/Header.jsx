import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Tooltip, Badge } from '@mui/material';
import { InfoOutlined, Brightness4, Upload, Download, Delete } from '@mui/icons-material';
import useStore from '../../store';

export default function Header() {
	const actions = useStore();
	const fileRef = React.useRef();

	return (
		<AppBar
			position='sticky'
			color='inherit'
			elevation={0}
			sx={{ overflow: 'visible', bgcolor: 'background.paper' }}>
			<Toolbar sx={{ minHeight: 72 }}>
				<Typography
					variant='h6'
					sx={{ flexGrow: 1 }}>
					Shinobi Image Converter
				</Typography>

				<input
					ref={fileRef}
					type='file'
					hidden
					multiple
					accept='image/*'
					onChange={(e) => actions.addFiles([...e.target.files])}
				/>

				<Tooltip
					title='Загрузить (U)'
					arrow>
					<IconButton
						color='inherit'
						onClick={() => fileRef.current.click()}>
						<Upload />
					</IconButton>
				</Tooltip>

				<Tooltip
					title='Очистить (Del)'
					arrow>
					<IconButton
						color='inherit'
						onClick={actions.clearAll}>
						<Delete />
					</IconButton>
				</Tooltip>

				<Tooltip
					title='Скачать (S)'
					arrow>
					<span>
						<IconButton
							color='inherit'
							disabled={!actions.selected.size}
							onClick={actions.openDownloadModal}>
							<Badge
								badgeContent={actions.selected.size}
								color='primary'>
								<Download />
							</Badge>
						</IconButton>
					</span>
				</Tooltip>

				<Tooltip
					title='Тема (D)'
					arrow>
					<IconButton
						color='inherit'
						onClick={actions.toggleDark}>
						<Brightness4 />
					</IconButton>
				</Tooltip>

				<Tooltip
					title='Справка (H)'
					arrow>
					<IconButton
						color='inherit'
						onClick={() => useStore.setState({ helpOpen: true })}>
						<InfoOutlined />
					</IconButton>
				</Tooltip>
			</Toolbar>
		</AppBar>
	);
}
