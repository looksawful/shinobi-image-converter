import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, Box, Stack, FormControl, InputLabel, Select, MenuItem, Slider, TextField, Button, Typography, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import useStore from '../../store';

export default function EditorModal() {
	const { modalOpen, currentId, items, updateSettings, closeEditor } = useStore();
	const item = items.find((i) => i.id === currentId);
	const cropperRef = useRef(null);

	const [fmt, setFmt] = useState('jpeg');
	const [quality, setQuality] = useState(0.8);
	const [name, setName] = useState('');
	const [coords, setCoords] = useState({ x: 0, y: 0, width: 0, height: 0 });
	const [previewEnabled, setPreviewEnabled] = useState(true);

	useEffect(() => {
		if (!modalOpen || !item) return;
		setFmt(item.fmt || 'jpeg');
		setQuality(typeof item.q === 'number' ? item.q : 0.8);
		setName(item.customName || item.name || '');
		setCoords({ x: 0, y: 0, width: 0, height: 0 });
		setPreviewEnabled(true);
		cropperRef.current = null;
	}, [modalOpen, item]);

	// live-preview and size update
	useEffect(() => {
		if (!modalOpen || !previewEnabled) return;
		const cropper = cropperRef.current;
		if (!cropper) return;
		const canvas = cropper.getCroppedCanvas();
		if (!canvas) return;
		canvas.toBlob(
			(blob) => {
				updateSettings(item.id, {
					blob,
					urlC: URL.createObjectURL(blob),
					sizeC: blob.size,
					fmt,
					q: quality,
				});
			},
			`image/${fmt}`,
			quality,
		);
	}, [modalOpen, previewEnabled, fmt, quality, item, updateSettings]);

	if (!item) return null;

	const handleInitialized = (inst) => {
		cropperRef.current = inst;
		const d = inst.getData();
		setCoords({
			x: Math.round(d.x),
			y: Math.round(d.y),
			width: Math.round(d.width),
			height: Math.round(d.height),
		});
	};

	const handleCrop = (e) => {
		const d = e.detail;
		setCoords({
			x: Math.round(d.x),
			y: Math.round(d.y),
			width: Math.round(d.width),
			height: Math.round(d.height),
		});
	};

	const handleCoordChange = (field) => (e) => {
		const val = Number(e.target.value) || 0;
		const next = { ...coords, [field]: val };
		setCoords(next);
		cropperRef.current?.setData(next);
	};

	// explicitly apply crop, format, quality, name
	const applyChanges = () => {
		const cropper = cropperRef.current;
		if (!cropper) return;
		const canvas = cropper.getCroppedCanvas();
		if (!canvas) return;
		canvas.toBlob(
			(blob) => {
				updateSettings(item.id, {
					blob,
					urlC: URL.createObjectURL(blob),
					sizeC: blob.size,
					fmt,
					q: quality,
					customName: name,
				});
			},
			`image/${fmt}`,
			quality,
		);
	};

	const applyAndClose = () => {
		applyChanges();
		closeEditor();
	};

	const src = previewEnabled && item.urlC ? item.urlC : item.url;

	return (
		<Dialog
			open={modalOpen}
			onClose={closeEditor}
			fullScreen>
			<DialogContent sx={{ p: 0, height: '100vh', overflow: 'hidden' }}>
				<Box sx={{ display: 'flex', height: '100%' }}>
					<Box sx={{ flex: '1 1 auto', position: 'relative', height: '100%' }}>
						<Cropper
							key={`${item.id}-${previewEnabled}`}
							src={src}
							style={{ width: '100%', height: '100%' }}
							viewMode={1}
							autoCropArea={0.95}
							background={false}
							responsive
							onInitialized={handleInitialized}
							crop={handleCrop}
						/>
						<IconButton
							onClick={() => setPreviewEnabled((p) => !p)}
							sx={{
								position: 'absolute',
								top: 8,
								left: 8,
								bgcolor: 'rgba(255,255,255,0.7)',
								'&:hover': { bgcolor: 'rgba(255,255,255,1)' },
							}}>
							{previewEnabled ? <VisibilityOff /> : <Visibility />}
						</IconButton>
					</Box>
					<Box
						component='aside'
						sx={{
							width: { xs: '100%', md: 360 },
							maxHeight: '100%',
							overflowY: 'auto',
							p: 3,
							bgcolor: 'background.paper',
							boxShadow: '-4px 0 8px rgba(0,0,0,0.1)',
						}}>
						<Stack spacing={2}>
							<FormControl
								fullWidth
								size='small'>
								<InputLabel>Формат</InputLabel>
								<Select
									value={fmt}
									label='Формат'
									onChange={(e) => setFmt(e.target.value || 'jpeg')}>
									<MenuItem value='png'>PNG</MenuItem>
									<MenuItem value='jpeg'>JPEG</MenuItem>
									<MenuItem value='webp'>WebP</MenuItem>
								</Select>
							</FormControl>
							<Typography>Качество: {Math.round(quality * 100)}%</Typography>
							<Slider
								value={typeof quality === 'number' ? quality : 0.8}
								min={0.1}
								max={1}
								step={0.01}
								onChange={(_, v) => setQuality(v ?? 0.8)}
							/>
							<Typography>Координаты и размер:</Typography>
							<Stack spacing={1}>
								<TextField
									label='X'
									size='small'
									value={coords.x}
									onChange={handleCoordChange('x')}
								/>
								<TextField
									label='Y'
									size='small'
									value={coords.y}
									onChange={handleCoordChange('y')}
								/>
								<TextField
									label='Ширина'
									size='small'
									value={coords.width}
									onChange={handleCoordChange('width')}
								/>
								<TextField
									label='Высота'
									size='small'
									value={coords.height}
									onChange={handleCoordChange('height')}
								/>
							</Stack>
							<TextField
								label='Название файла'
								size='small'
								fullWidth
								placeholder={item.name}
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
							<Button
								variant='outlined'
								onClick={applyChanges}
								fullWidth>
								Применить
							</Button>
							<Button
								variant='contained'
								onClick={applyAndClose}
								fullWidth>
								Применить и закрыть
							</Button>
						</Stack>
					</Box>
				</Box>
			</DialogContent>
		</Dialog>
	);
}
