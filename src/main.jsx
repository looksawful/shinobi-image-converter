import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { loadAll } from './utils/db';
import useStore from './store';

loadAll().then((pairs) => {
	const mapped = pairs.map(([id, file]) => ({
		id,
		name: file.name,
		file,
		url: URL.createObjectURL(file),
		status: 'idle',
	}));
	if (mapped.length) useStore.setState({ items: mapped });
});

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
