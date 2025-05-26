module.exports = {
	content: ['./index.html', './src/**/*.{js,jsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				primary: '#38bdf8',
				accent: '#f43f5e',
			},
			boxShadow: {
				glow: '0 0 12px rgba(56,189,248,.6)',
			},
		},
	},
	screens: {
		sm: '640px',
		md: '768px',
		lg: '1024px',
		xl: '1280px',
		'2xl': '1536px',
	},
	plugins: [],
};
