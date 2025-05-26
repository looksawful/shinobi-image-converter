import React, { useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Masonry from '@mui/lab/Masonry';
import { Box, Typography } from '@mui/material';
import useStore from '../../store';
import Thumbnail from './Thumbnail';

export default function GalleryGrid() {
	const { items, addFiles, selected } = useStore();
	const fileInput = useRef();
	const onDrop = (files) => addFiles(files);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		noClick: true,
		noKeyboard: true,
	});
	const openDialog = () => fileInput.current.click();

	return (
		<Box
			{...getRootProps()}
			className='relative select-none'>
			<input {...getInputProps()} />
			<input
				ref={fileInput}
				type='file'
				accept='image/*'
				multiple
				hidden
				onChange={(e) => addFiles([...e.target.files])}
			/>

			<Box
				onClick={openDialog}
				className='
          border-2 border-dashed border-neutral-300 dark:border-neutral-600
          rounded-lg p-6 mb-12 text-center text-neutral-500
          hover:bg-primary/10 dark:hover:bg-primary/20
          hover:border-primary hover:shadow-glow
          cursor-pointer transition duration-300
        '>
				<Typography className='text-sm'>Кликните или перетащите изображения сюда</Typography>
			</Box>

			{isDragActive && (
				<Box className='absolute inset-0 bg-black/40 z-10 flex items-center justify-center'>
					<Typography
						variant='h6'
						color='white'>
						Отпустите файлы
					</Typography>
				</Box>
			)}

			{items.length > 0 && (
				<Masonry
					columns={{ xs: 2, sm: 3, md: 4 }}
					spacing={2}
					className='mt-12'>
					{items.map((item) => (
						<Thumbnail
							key={item.id}
							item={item}
							selected={selected.has(item.id)}
						/>
					))}
				</Masonry>
			)}
		</Box>
	);
}
