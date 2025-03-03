import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import * as Sentry from '@sentry/react';

Sentry.init({
    dsn: 'https://ce6b9517135aee57e3601e88fd34d838@o383246.ingest.us.sentry.io/4508807220822016',
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    enabled: !import.meta.env.DEV
});

createRoot(document.getElementById('root')).render(<App />);
