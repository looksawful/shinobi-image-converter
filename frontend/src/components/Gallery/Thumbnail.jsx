import React, { useState } from 'react';
import { Box, IconButton, Tooltip, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Download as DownloadIcon, Edit as EditIcon, Close as CloseIcon } from '@mui/icons-material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import clsx from 'clsx';
import useStore from '../../store';

export default function Thumbnail({ item, selected }) {
	const { toggleSelect, openEditor, removeItem, updateSettings, downloadPhoto } = useStore();
	const [loaded, setLoaded] = useState(false);
	const stop = (e) => e.stopPropagation();

	const origKB = Math.round((item.sizeO ?? 0) / 1024);
	const newKB = item.sizeC != null ? Math.round(item.sizeC / 1024) : origKB;
	const displayName = item.customName || item.name || '';

	return (
		<Box
			className='relative flex flex-col group'
			sx={{
				width: '100%',
				transition: 'transform .2s',
				'&:hover': { transform: 'translateY(-4px)' },
			}}
			onClick={() => toggleSelect(item.id)}
			onDoubleClick={() => openEditor(item.id)}>
			<Box
				className={clsx('relative rounded-md overflow-hidden image-wrapper', selected ? 'ring-4 ring-indigo-500' : 'border border-neutral-200 dark:border-neutral-700')}
				sx={{ aspectRatio: '1 / 1' }}>
				{!loaded && <Box className='absolute inset-0 skeleton rounded-md' />}

				{/* blur overlay */}
				<Box
					component='div'
					sx={{
						position: 'absolute',
						inset: 0,
						bgcolor: 'rgba(0,0,0,0.3)',
						backdropFilter: 'blur(4px)',
						opacity: 0,
						transition: 'opacity .2s',
						zIndex: 5,
						'.group:hover &': { opacity: 1 },
					}}
				/>

				<LazyLoadImage
					src={item.urlC ?? item.url}
					afterLoad={() => setLoaded(true)}
					className='w-full h-full object-cover transition-transform duration-200'
					effect='opacity'
				/>

				{/* action icons */}
				<Box
					sx={{
						position: 'absolute',
						inset: 0,
						zIndex: 10,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 1,
						opacity: 0,
						transition: 'opacity .2s',
						'.group:hover &': { opacity: 1 },
					}}>
					<Tooltip
						title='Скачать'
						arrow>
						<IconButton
							onClick={(e) => {
								stop(e);
								downloadPhoto(item.id);
							}}>
							<DownloadIcon sx={{ color: '#fff' }} />
						</IconButton>
					</Tooltip>
					<Tooltip
						title='Редактировать'
						arrow>
						<IconButton
							onClick={(e) => {
								stop(e);
								openEditor(item.id);
							}}>
							<EditIcon sx={{ color: '#fff' }} />
						</IconButton>
					</Tooltip>
				</Box>

				{/* remove */}
				<IconButton
					size='small'
					onClick={(e) => {
						stop(e);
						removeItem(item.id);
					}}
					sx={{
						position: 'absolute',
						top: 4,
						right: 4,
						bgcolor: 'rgba(255,255,255,0.85)',
						boxShadow: 1,
						'&:hover': { bgcolor: 'rgba(255,255,255,1)' },
						zIndex: 20,
					}}>
					<CloseIcon fontSize='small' />
				</IconButton>
			</Box>

			<Box className='mt-2 space-y-1 text-center'>
				<Typography
					variant='caption'
					color='textSecondary'>
					{origKB} KB → {newKB} KB
				</Typography>

				<ToggleButtonGroup
					value={item.fmt}
					exclusive
					size='small'
					onChange={(_, val) => val && updateSettings(item.id, { fmt: val })}
					className='justify-center mx-auto'>
					<ToggleButton value='png'>PNG</ToggleButton>
					<ToggleButton value='jpeg'>JPEG</ToggleButton>
					<ToggleButton value='webp'>WebP</ToggleButton>
				</ToggleButtonGroup>

				<Typography
					variant='body2'
					noWrap
					sx={{ cursor: 'text', px: 1 }}>
					{displayName}
				</Typography>
			</Box>
		</Box>
	);
}
