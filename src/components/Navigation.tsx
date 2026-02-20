import { useState, useEffect } from 'react';
import { Menu, X, User, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    onNavigate('home');
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'Software', page: 'software' },
    { label: 'About', page: 'about' },
    { label: 'Portfolio', page: 'portfolio' },
    { label: 'Blog', page: 'blog' },
    { label: 'Contact', page: 'home', hash: '#contact' },
  ];

  const isHomePage = currentPage === 'home';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || !isHomePage
          ? 'bg-[#05060B]/90 backdrop-blur-lg border-b border-[rgba(244,246,255,0.08)]'
          : 'bg-transparent'
      }`}
    >
      <div className="rv-container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-lg">RV</span>
            </div>
            <span className="hidden sm:block text-[#F4F6FF] font-semibold text-lg tracking-tight">
              DEVELOPERS
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  if (link.hash && isHomePage) {
                    document.querySelector(link.hash)?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    onNavigate(link.page);
                  }
                }}
                className={`text-sm font-medium transition-colors hover:text-[#4F46E5] ${
                  currentPage === link.page ? 'text-[#4F46E5]' : 'text-[#A7ACB8]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B0E16] border border-[rgba(244,246,255,0.08)] text-[#F4F6FF] hover:border-[#4F46E5] transition-colors">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm">{user?.fullName.split(' ')[0]}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-[#0B0E16] border-[rgba(244,246,255,0.08)]">
                  <DropdownMenuItem
                    onClick={() => onNavigate('dashboard')}
                    className="text-[#F4F6FF] hover:bg-[rgba(79,70,229,0.1)] cursor-pointer"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem
                      onClick={() => onNavigate('admin')}
                      className="text-[#F4F6FF] hover:bg-[rgba(79,70,229,0.1)] cursor-pointer"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-[rgba(244,246,255,0.08)]" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-400 hover:bg-red-500/10 cursor-pointer"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <button
                  onClick={() => onNavigate('login')}
                  className="text-sm text-[#A7ACB8] hover:text-[#F4F6FF] transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="rv-btn-primary text-sm"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#F4F6FF]"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-[#05060B]/98 backdrop-blur-lg z-40">
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  if (link.hash && isHomePage) {
                    document.querySelector(link.hash)?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    onNavigate(link.page);
                  }
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left text-lg font-medium py-3 border-b border-[rgba(244,246,255,0.08)] ${
                  currentPage === link.page ? 'text-[#4F46E5]' : 'text-[#A7ACB8]'
                }`}
              >
                {link.label}
              </button>
            ))}
            {!isAuthenticated && (
              <div className="flex flex-col gap-3 mt-4">
                <button
                  onClick={() => {
                    onNavigate('login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="rv-btn-secondary w-full"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onNavigate('register');
                    setIsMobileMenuOpen(false);
                  }}
                  className="rv-btn-primary w-full"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
