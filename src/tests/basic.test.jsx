import { render, screen } from '@testing-library/react';
import App from '../App.jsx';

test('upload zone renders', () => {
	render(<App />);
	expect(screen.getByText(/перетащите/i)).toBeInTheDocument();
});
