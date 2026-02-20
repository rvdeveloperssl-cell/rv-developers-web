import { useState, useEffect } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import HeroSection from '@/sections/HeroSection';
import CapabilitiesSection from '@/sections/CapabilitiesSection';
import SecuritySection from '@/sections/SecuritySection';
import FeaturedWorkSection from '@/sections/FeaturedWorkSection';
import ProcessSection from '@/sections/ProcessSection';
import TechStackSection from '@/sections/TechStackSection';
import IndustriesSection from '@/sections/IndustriesSection';
import CollaborationSection from '@/sections/CollaborationSection';
import InsightsSection from '@/sections/InsightsSection';
import NewsletterSection from '@/sections/NewsletterSection';
import FAQSection from '@/sections/FAQSection';
import ContactSection from '@/sections/ContactSection';
import FooterSection from '@/sections/FooterSection';
import SoftwareCatalog from '@/pages/SoftwareCatalog';
import SoftwareDetail from '@/pages/SoftwareDetail';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Checkout from '@/pages/Checkout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminSoftware from '@/pages/admin/AdminSoftware';
import AdminClients from '@/pages/admin/AdminClients';
import AdminLicenses from '@/pages/admin/AdminLicenses';
import AdminPayments from '@/pages/admin/AdminPayments';
import AdminReports from '@/pages/admin/AdminReports';
import About from '@/pages/About';
import Portfolio from '@/pages/Portfolio';
import Blog from '@/pages/Blog';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'home';
      const [page, ...params] = hash.split('?');
      setCurrentPage(page);
      
      const paramsObj: Record<string, string> = {};
      if (params.length > 0) {
        const searchParams = new URLSearchParams(params.join('?'));
        searchParams.forEach((value, key) => {
          paramsObj[key] = value;
        });
      }
      setPageParams(paramsObj);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: string, params?: Record<string, string>) => {
    let url = `#${page}`;
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }
    window.location.hash = url;
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <HeroSection onNavigate={navigateTo} />
            <CapabilitiesSection />
            <SecuritySection />
            <FeaturedWorkSection />
            <ProcessSection />
            <TechStackSection />
            <IndustriesSection />
            <CollaborationSection />
            <InsightsSection />
            <NewsletterSection />
            <FAQSection />
            <ContactSection />
            <FooterSection />
          </>
        );
      case 'software':
        return <SoftwareCatalog onNavigate={navigateTo} />;
      case 'software-detail':
        return <SoftwareDetail softwareId={pageParams.id} onNavigate={navigateTo} />;
      case 'login':
        return <Login onNavigate={navigateTo} />;
      case 'register':
        return <Register onNavigate={navigateTo} />;
      case 'dashboard':
        return <Dashboard onNavigate={navigateTo} />;
      case 'checkout':
        return <Checkout softwareId={pageParams.id} onNavigate={navigateTo} />;
      case 'about':
        return <About onNavigate={navigateTo} />;
      case 'portfolio':
        return <Portfolio onNavigate={navigateTo} />;
      case 'blog':
        return <Blog onNavigate={navigateTo} />;
      case 'admin':
        return <AdminDashboard onNavigate={navigateTo} />;
      case 'admin-software':
        return <AdminSoftware onNavigate={navigateTo} />;
      case 'admin-clients':
        return <AdminClients onNavigate={navigateTo} />;
      case 'admin-licenses':
        return <AdminLicenses onNavigate={navigateTo} />;
      case 'admin-payments':
        return <AdminPayments onNavigate={navigateTo} />;
      case 'admin-reports':
        return <AdminReports onNavigate={navigateTo} />;
      default:
        return (
          <>
            <HeroSection onNavigate={navigateTo} />
            <CapabilitiesSection />
            <SecuritySection />
            <FeaturedWorkSection />
            <ProcessSection />
            <TechStackSection />
            <IndustriesSection />
            <CollaborationSection />
            <InsightsSection />
            <NewsletterSection />
            <FAQSection />
            <ContactSection />
            <FooterSection />
          </>
        );
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#05060B] text-[#F4F6FF]">
        <div className="rv-noise-overlay" />
        <Navigation currentPage={currentPage} onNavigate={navigateTo} />
        <main className="relative">
          {renderPage()}
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
