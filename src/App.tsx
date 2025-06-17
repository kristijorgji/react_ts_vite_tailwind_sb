import './App.css';

import { BrowserRouter } from 'react-router-dom';

import { ThemeProvider } from '@/c/contexts/Theme/ThemeProvider.tsx';
import AppRouter from '@/core/routing/AppRouter.tsx';

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <AppRouter />
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
