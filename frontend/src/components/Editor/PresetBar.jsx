import React from 'react';
import { Select, MenuItem } from '@mui/material';
import presets from '../../utils/presets';

export default function PresetBar({ onApply }) {
	return (
		<Select
			onChange={(e) => onApply(presets.find((p) => p.id === e.target.value))}
			value=''>
			<MenuItem
				value=''
				disabled>
				Preset
			</MenuItem>
			{presets.map((p) => (
				<MenuItem
					key={p.id}
					value={p.id}>
					{p.label}
				</MenuItem>
			))}
		</Select>
	);
}
