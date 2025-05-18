import React from 'react';
import { Stack, Select, MenuItem, Slider, IconButton } from '@mui/material';
import { Undo, Redo } from '@mui/icons-material';
import useStore from '../../store';

export default function Toolbar({ applyPreset, undo, redo }) {
	const { format, quality, setFormat, setQuality } = useStore();
	return (
		<Stack
			direction='row'
			spacing={2}>
			<Select
				value={format}
				onChange={(e) => setFormat(e.target.value)}>
				<MenuItem value='png'>PNG</MenuItem>
				<MenuItem value='jpeg'>JPEG</MenuItem>
				<MenuItem value='webp'>WebP</MenuItem>
			</Select>
			<Slider
				value={quality}
				min={0}
				max={1}
				step={0.01}
				size='small'
				sx={{ width: 120 }}
				onChange={(_, v) => setQuality(v)}
			/>
			<IconButton onClick={undo}>
				<Undo />
			</IconButton>
			<IconButton onClick={redo}>
				<Redo />
			</IconButton>
			{applyPreset}
		</Stack>
	);
}
