import { Suspense, lazy, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import { AuthProvider } from './context/AuthContext';
import AuthGuard from './components/shared/AuthGuard';
import LoadingScreen from './components/shared/LoadingScreen';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Admin pages
const LoginPage = lazy(() => import('./pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const ProfileManagePage = lazy(() => import('./pages/admin/ProfileManagePage'));
const SkillsManagePage = lazy(() => import('./pages/admin/SkillsManagePage'));
const ProjectsManagePage = lazy(() => import('./pages/admin/ProjectsManagePage'));
const MessagesPage = lazy(() => import('./pages/admin/MessagesPage'));
const ReviewsManagePage = lazy(() => import('./pages/admin/ReviewsManagePage'));
const HireRequestsPage = lazy(() => import('./pages/admin/HireRequestsPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const ActivityLogsPage = lazy(() => import('./pages/admin/ActivityLogsPage'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#04041a]">
    <div className="w-8 h-8 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin" />
  </div>
);

function App() {
  const [showLoading, setShowLoading] = useState(true);
  const handleLoadComplete = useCallback(() => setShowLoading(false), []);

  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <AnimatePresence>
            {showLoading && <LoadingScreen key="loading" onComplete={handleLoadComplete} />}
          </AnimatePresence>

          {!showLoading && (
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<HomePage />} />
                </Route>

                {/* Admin Login (public) */}
                <Route path="/admin/login" element={<LoginPage />} />

                {/* Admin Routes (protected) */}
                <Route
                  path="/admin"
                  element={
                    <AuthGuard>
                      <AdminLayout />
                    </AuthGuard>
                  }
                >
                  <Route index element={<DashboardPage />} />
                  <Route path="profile" element={<ProfileManagePage />} />
                  <Route path="skills" element={<SkillsManagePage />} />
                  <Route path="services" element={<Suspense fallback={<PageLoader />}><div className="p-8 text-white text-center"><h2 className="text-2xl font-bold">Services Management</h2><p className="text-slate-400 mt-2">Coming soon — use API directly for now</p></div></Suspense>} />
                  <Route path="projects" element={<ProjectsManagePage />} />
                  <Route path="experience" element={<Suspense fallback={<PageLoader />}><div className="p-8 text-white text-center"><h2 className="text-2xl font-bold">Experience Management</h2><p className="text-slate-400 mt-2">Coming soon — use API directly for now</p></div></Suspense>} />
                  <Route path="certificates" element={<Suspense fallback={<PageLoader />}><div className="p-8 text-white text-center"><h2 className="text-2xl font-bold">Certificates Management</h2><p className="text-slate-400 mt-2">Coming soon — use API directly for now</p></div></Suspense>} />
                  <Route path="reviews" element={<ReviewsManagePage />} />
                  <Route path="messages" element={<MessagesPage />} />
                  <Route path="hire-requests" element={<HireRequestsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="logs" element={<ActivityLogsPage />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          )}

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0a0a2e',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#f1f5f9',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#04041a' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#04041a' } },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
