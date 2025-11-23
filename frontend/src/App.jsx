// App.jsx
import React, { useState, Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import LoginModal from './components/auth/LoginModal';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy load components for better performance
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const QRGenerator = lazy(() => import('./components/qr/QRGenerator'));
const Analytics = lazy(() => import('./components/dashboard/Analytics'));
const QRList = lazy(() => import('./components/dashboard/QRList'));
const PricingModal = lazy(() => import('./components/pricing/PricingModal'));
const Billing = lazy(() => import('./pages/Billing'));
const SignupModal = lazy(() => import('./components/auth/SignupModal'));
const NotFound = lazy(() => import('./pages/NotFound'));

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);

  const switchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const switchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  const closeAuthModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top when changing pages
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onGetStarted={() => setShowLoginModal(true)} />;
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return <Profile />;
      case 'qr-codes':
        return <QRList />;
      case 'analytics':
        return <Analytics />;
      case 'billing':
        return <Billing />;
      case 'generator':
        return <QRGenerator />;
      case 'pricing':
        setShowPricingModal(true);
        return <Home onGetStarted={() => setShowLoginModal(true)} />;
      default:
        return <NotFound />;
    }
  };

  return (
    <DarkModeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
          <ErrorBoundary fallback="A header error occurred.">
            <Header 
              onAuthClick={() => setShowLoginModal(true)} 
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </ErrorBoundary>
          
          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <ErrorBoundary fallback="A page error occurred.">
                <Suspense fallback={<LoadingSpinner text="Loading..." />}>
                  {renderCurrentPage()}
                </Suspense>
              </ErrorBoundary>
            </div>
          </main>
          
          <Footer />
          
          {/* Modals */}
          <Suspense fallback={null}>
            <LoginModal 
              isOpen={showLoginModal} 
              onClose={closeAuthModals}
              onSwitchToSignup={switchToSignup}
              onForgotPassword={() => {
                // Handle forgot password
                console.log('Forgot password clicked');
              }}
            />
            
            <SignupModal 
              isOpen={showSignupModal} 
              onClose={closeAuthModals}
              onSwitchToLogin={switchToLogin}
            />
            
            <PricingModal 
              isOpen={showPricingModal}
              onClose={() => setShowPricingModal(false)}
            />
          </Suspense>
        </div>
      </AuthProvider>
    </DarkModeProvider>
  );
};

export default App;