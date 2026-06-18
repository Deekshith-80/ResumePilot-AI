import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { store } from './app/store';
import AppRoutes from './routes/AppRoutes';
import './styles.css';

const initialTheme = localStorage.getItem('appTheme') || 'system';
const initialResolvedTheme =
  initialTheme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : initialTheme;

document.documentElement.dataset.theme = initialResolvedTheme;
document.documentElement.style.colorScheme = initialResolvedTheme;

const ThemeSync = () => {
  const theme = useSelector((state) => state.settings.theme);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const resolvedTheme = theme === 'system' ? (media.matches ? 'dark' : 'light') : theme;

    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
    document.documentElement.dataset.themePreference = theme;
  }, [theme]);

  return null;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeSync />
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
