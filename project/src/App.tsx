import { useEffect, lazy, Suspense, useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import { auth } from './lib/firebase'; // Import auth directly for sign out

// Loading component for Suspense fallback
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-indigo-500"></div>
      <span className="ml-3 text-gray-600">Loading...</span>
    </div>
  );
}

// Immediate load primary components
const HomePage = lazy(() => import('./pages/Home').then(module => {
  // Preload other critical components after home loads
  import('./pages/SignIn');
  import('./pages/BusinessDirectory');
  return module;
}));

// Priority lazy loaded components
const SignupPage = lazy(() => import('./pages/Signup'));
const SignInPage = lazy(() => import('./pages/SignIn'));
const BusinessDirectoryPage = lazy(() => import('./pages/BusinessDirectory'));

// Secondary components - loaded with standard lazy when needed
const ProfilePage = lazy(() => import('./pages/Profile'));
const EventsPage = lazy(() => import('./pages/Events'));
const CreateEventPage = lazy(() => import('./pages/CreateEvent'));
const ChatsPage = lazy(() => import('./pages/Chats'));
const NotificationsPage = lazy(() => import('./pages/Notifications'));
const ForSalePage = lazy(() => import('./pages/ForSale'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const CreateBusinessPage = lazy(() => import('./pages/CreateBusiness'));
const CreateItemPage = lazy(() => import('./pages/CreateItem'));
const AdminToolsPage = lazy(() => import('./pages/AdminTools'));

// Admin Pages (will be defined later)
const AdminDashboardPage = lazy(() => import('./pages/admin/Dashboard'));
const AdminUsersPage = lazy(() => import('./pages/admin/Users'));
const AdminBusinessListingsPage = lazy(() => import('./pages/admin/BusinessListings'));
const AdminAnalyticsPage = lazy(() => import('./pages/admin/Analytics'));
const AdminRevenuePage = lazy(() => import('./pages/admin/Revenue'));
const AdminSystemHealthPage = lazy(() => import('./pages/admin/SystemHealth'));
const AdminSettingsPage = lazy(() => import('./pages/admin/Settings'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Check if user is logged in and has admin role
  if (!user) {
    return <Navigate to="/signin" />;
  }

  return <>{children}</>;
}

export default function App() {
  const { user, loading } = useAuth();
  const [appReady, setAppReady] = useState(false);

  // Optimize initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      // Mark the app as ready after a small delay
      // This allows the initial auth check to complete
      setAppReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Sign out the test user if they're automatically logged in
  useEffect(() => {
    const signOutAutoLogin = async () => {
      // Check if user is the test user
      if (user && user.email === "test@example.com") {
        console.log("Signing out test user to prevent auto-login");
        try {
          await auth.signOut();
        } catch (error) {
          console.error("Error signing out test user:", error);
        }
      }
    };

    if (!loading && user) {
      signOutAutoLogin();
    }
  }, [user, loading]);

  // MOVED FROM GLOBAL SCOPE: Preload components in the background
  useEffect(() => {
    // Start preloading secondary components after 2 seconds
    const timer = setTimeout(() => {
      const preload = () => {
        // Preload remaining critical pages based on user navigation patterns
        import('./pages/Profile');
        import('./pages/Events');
      };
      // Use requestIdleCallback if available, otherwise setTimeout
      if ('requestIdleCallback' in window) {
        // @ts-ignore
        window.requestIdleCallback(preload);
      } else {
        setTimeout(preload, 200);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Show a simple loading indicator until the app is ready
  if (!appReady || loading) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<Layout><Outlet /></Layout>}>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SignInPage />} />
          
          {/* Protected User Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-business"
            element={
              <ProtectedRoute>
                <CreateBusinessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-item"
            element={
              <ProtectedRoute>
                <CreateItemPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-event"
            element={
              <ProtectedRoute>
                <CreateEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business-directory"
            element={
              <ProtectedRoute>
                <BusinessDirectoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <EventsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chats"
            element={
              <ProtectedRoute>
                <ChatsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/for-sale"
            element={
              <ProtectedRoute>
                <ForSalePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminToolsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminLayout><Outlet /></AdminLayout>}>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/business-listings"
            element={
              <AdminRoute>
                <AdminBusinessListingsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AdminRoute>
                <AdminAnalyticsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/revenue"
            element={
              <AdminRoute>
                <AdminRevenuePage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/system-health"
            element={
              <AdminRoute>
                <AdminSystemHealthPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminRoute>
                <AdminSettingsPage />
              </AdminRoute>
            }
          />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}