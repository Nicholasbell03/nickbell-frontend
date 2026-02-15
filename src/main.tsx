import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import './index.css';
import App from './App';
import { ChatProvider } from './context/ChatContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't refetch on window focus for a portfolio site
      refetchOnWindowFocus: false,
      // Retry failed requests once
      retry: 1,
      // Keep unused data in cache for 30 minutes
      gcTime: 30 * 60 * 1000,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ChatProvider>
          <App />
          <Toaster position="top-right" richColors />
        </ChatProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
