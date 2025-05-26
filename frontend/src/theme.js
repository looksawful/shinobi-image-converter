import { createTheme } from '@mui/material';

export default (mode) =>
	createTheme({
		breakpoints: {
			values: {
				xs: 0,
				sm: 640,
				md: 768,
				lg: 1024,
				xl: 1280,
			},
		},
		palette: {
			mode,
			primary: { main: '#38bdf8' },
			secondary: { main: '#f43f5e' },
		},
		components: {
			MuiTooltip: {
				styleOverrides: {
					tooltip: { fontSize: '0.75rem' },
				},
			},
			MuiIconButton: {
				styleOverrides: {
					root: { fontSize: '1.8rem', padding: 10 },
				},
			},
		},
	});
