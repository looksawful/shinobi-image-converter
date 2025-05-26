import React, { useState } from 'react';
import { Box, Typography, Avatar, Tooltip, Menu, MenuItem } from '@mui/material';

export default function Footer() {
	const [anchor, setAnchor] = useState(null);

	return (
		<Box className='text-center py-6 text-sm opacity-70 relative'>
			<Typography>© 2025 @lookaswful</Typography>

			<Tooltip
				title='Контакты'
				arrow>
				<Avatar
					src='/avatar-placeholder.svg'
					sx={{ width: 36, height: 36, position: 'absolute', right: 16, bottom: 8, cursor: 'pointer' }}
					onClick={(e) => setAnchor(e.currentTarget)}
				/>
			</Tooltip>

			<Menu
				anchorEl={anchor}
				open={Boolean(anchor)}
				onClose={() => setAnchor(null)}>
				<MenuItem
					component='a'
					href='https://github.com/lookaswful'>
					GitHub
				</MenuItem>
				<MenuItem
					component='a'
					href='https://t.me/lookaswful'>
					Telegram
				</MenuItem>
				<MenuItem
					component='a'
					href='https://lookaswful.com'>
					Website
				</MenuItem>
			</Menu>
		</Box>
	);
}
