import React, { useEffect, useState } from 'react';
import { Box, Typography, Slide } from '@mui/material';

export default function WelcomeOverlay() {
	const [open, setOpen] = useState(true);
	useEffect(() => {
		const t = setTimeout(() => setOpen(false), 6000);
		return () => clearTimeout(t);
	}, []);
	return (
		<Slide
			direction='up'
			in={open}
			mountOnEnter
			unmountOnExit>
			<Box className='fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 text-white text-center py-4 shadow-md'>
				<Typography variant='h6'>Добро пожаловать в Shinobi Image Converter</Typography>
				<Typography
					variant='body2'
					className='mt-1 text-neutral-400'>
					Загрузите (U) → выделите → редактируйте (E) → скачайте (S)
				</Typography>
			</Box>
		</Slide>
	);
}
