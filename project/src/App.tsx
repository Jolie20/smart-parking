import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth.tsx';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import UserDashboard from './components/dashboards/UserDashboard';
import ManagerDashboard from './components/dashboards/ManagerDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Route } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleLoginClick = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleSignupClick = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  if (!user) {
    return (
      <>
        <LandingPage 
          onLoginClick={handleLoginClick}
          onSignupClick={handleSignupClick}
        />
        <LoginPage 
          isOpen={showAuthModal}
          onClose={handleCloseModal}
          initialMode={authMode}
        />
        {/* manager dashboard */}
        <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
          <Route path="/manager-dashboard" Element={<ManagerDashboard />} />
        </Route>


      </>
    );
  }

  // Render appropriate dashboard based on user role
  switch (user.role) {
    case 'user':
      return <UserDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <UserDashboard />;
  }
};

function App() {
  return (
    <AuthProvider>
      <AppContent />  
    </AuthProvider>
  );
}

export default App;