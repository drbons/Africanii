import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import App from './App';
import './globals.css';

// Dynamically import PostProvider to defer non-critical initialization
const PostProvider = React.lazy(() => import('@/hooks/usePostContext').then(module => ({
  default: module.PostProvider
})));

// Error handler
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Global error caught:', error);
      setHasError(true);
      setError(error.error);

      // Update debug message
      const debugEl = document.getElementById('debug-message');
      if (debugEl) {
        debugEl.textContent = `Error: ${error.message}\n\nStack: ${error.error?.stack || 'No stack available'}`;
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div style={{ 
        padding: '20px', 
        margin: '20px', 
        border: '1px solid red',
        borderRadius: '5px',
        backgroundColor: '#ffeeee'
      }}>
        <h2>Something went wrong!</h2>
        <p>{error?.message || 'Unknown error'}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            padding: '8px 16px',
            background: '#1a73e8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reload Page
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

// Function to defer non-critical operations
const deferOperation = (callback: () => void, delay = 100) => {
  setTimeout(() => {
    // Use requestIdleCallback if available, otherwise use setTimeout
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      // @ts-ignore - TypeScript doesn't have types for requestIdleCallback
      window.requestIdleCallback(callback);
    } else {
      setTimeout(callback, 50);
    }
  }, delay);
};

try {
  console.log('Main.tsx: Initializing React application...');
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  console.log('Main.tsx: Creating React root...');
  const root = ReactDOM.createRoot(rootElement);
  
  console.log('Main.tsx: Rendering application...');
  
  // Create a minimal initial application shell for faster first paint
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <AuthProvider>
            <React.Suspense fallback={null}>
              <PostProvider>
                <App />
              </PostProvider>
            </React.Suspense>
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
  
  console.log('Main.tsx: Render call completed');
  
  // Defer non-critical initialization
  deferOperation(() => {
    // Prefetch additional resources after initial render
    import('./hooks/usePostContext');
  });
  
  // Update debug message
  const debugEl = document.getElementById('debug-message');
  if (debugEl) {
    debugEl.textContent = 'Application initialized. If you see this message, React has started but may be encountering routing issues.';
  }
} catch (error) {
  console.error('Fatal error during initialization:', error);
  
  // Update debug message
  const debugEl = document.getElementById('debug-message');
  if (debugEl) {
    debugEl.textContent = `Fatal initialization error: ${error instanceof Error ? error.message : String(error)}`;
  }
}