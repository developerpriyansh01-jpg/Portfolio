import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#04041a]">
        <div className="w-8 h-8 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return children;
}
