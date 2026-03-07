import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { LoginPage } from '@/pages/Login';
import { DashboardPage } from '@/pages/Dashboard';
import { DocumentsPage } from '@/pages/Documents';
import { PetitionsPage } from '@/pages/Petitions';
import { SearchPage } from '@/pages/Search';
import { DeadlinesPage } from '@/pages/Deadlines';
import { ChatPage } from '@/pages/Chat';
import { Spinner } from '@/components/Spinner';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Layout><DashboardPage /></Layout>
        </PrivateRoute>
      } />
      <Route path="/documents" element={
        <PrivateRoute>
          <Layout><DocumentsPage /></Layout>
        </PrivateRoute>
      } />
      <Route path="/petitions" element={
        <PrivateRoute>
          <Layout><PetitionsPage /></Layout>
        </PrivateRoute>
      } />
      <Route path="/search" element={
        <PrivateRoute>
          <Layout><SearchPage /></Layout>
        </PrivateRoute>
      } />
      <Route path="/deadlines" element={
        <PrivateRoute>
          <Layout><DeadlinesPage /></Layout>
        </PrivateRoute>
      } />
      <Route path="/chat" element={
        <PrivateRoute>
          <Layout><ChatPage /></Layout>
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HashRouter>
  );
}
