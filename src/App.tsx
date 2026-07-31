import './App.css';

import type { ReactElement } from 'react';

import { BrowserRouter } from 'react-router-dom';

import { ThemeProvider } from '@/c/contexts/Theme/ThemeProvider.tsx';
import AppRouter from '@/core/routing/AppRouter.tsx';

function App(): ReactElement {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <AppRouter />
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
