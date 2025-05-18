import React, { useMemo, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Snackbar, Alert } from '@mui/material';
import useStore from './store';
import makeTheme from './theme';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import GalleryGrid from './components/Gallery/GalleryGrid';
import EditorModal from './components/Editor/EditorModal';
import HelpModal from './components/HelpModal';
import DownloadModal from './components/DownloadModal';
import WelcomeOverlay from './components/WelcomeOverlay';

export default function AppContent() {
	const dark = useStore((s) => s.dark);
	const snackbar = useStore((s) => s.snackbar);
	const closeSnackbar = useStore((s) => s.closeSnackbar);
	const theme = useMemo(() => makeTheme(dark ? 'dark' : 'light'), [dark]);

	useEffect(() => {
		document.documentElement.classList.toggle('dark', dark);
	}, [dark]);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<div className='min-h-screen flex flex-col'>
				<WelcomeOverlay />
				<Header />

				<main className='flex-grow w-full px-6 sm:px-8 md:px-10 lg:px-14 xl:px-20 2xl:px-24 max-w-screen-xl mx-auto py-12'>
					<div className='bg-neutral-100 dark:bg-neutral-900 p-8 sm:p-10 md:p-12 rounded-lg shadow-lg ring-1 ring-neutral-200 dark:ring-neutral-700'>
						<GalleryGrid />
					</div>
				</main>

				<Footer />

				<EditorModal />
				<HelpModal />
				<DownloadModal />

				<Snackbar
					open={snackbar.open}
					autoHideDuration={3000}
					onClose={closeSnackbar}>
					<Alert
						severity={snackbar.severity}
						onClose={closeSnackbar}
						sx={{ width: '100%' }}>
						{snackbar.message}
					</Alert>
				</Snackbar>
			</div>
		</ThemeProvider>
	);
}
