import React, { useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Home, User, LogOut, Menu, X as XIcon, Plus, Heart } from 'lucide-react';
import UserNotifications from './UserNotifications';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/properties', label: 'Properties' },
  { path: '/ai-hub', label: 'AI Hub' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const scrolled = useTransform(scrollY, [0, 1], [0, 1]);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initials avatar
  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <>
      {/* Skip-to-main-content — keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-primary focus:text-primary-foreground focus:font-semibold focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm"
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0"
            onClick={closeMobileMenu}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Home className="w-5 h-5" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-foreground">
              Aavasa
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  text-sm font-medium transition-colors
                  ${isActive(link.path)
                    ? 'text-primary font-semibold'
                    : 'text-foreground-soft hover:text-primary'}
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <UserNotifications />
                <Link
                  to="/add-property"
                  className="text-sm font-semibold flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover hover:shadow-md transition-colors active:scale-[0.97]"
                >
                  <Plus className="w-3.5 h-3.5" /> List Property
                </Link>

                {/* User avatar dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen((v) => !v)}
                    aria-expanded={isUserMenuOpen}
                    aria-label="User menu"
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-lg hover:bg-muted transition-colors border border-transparent hover:border-border active:scale-[0.97]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center shrink-0">
                      {initials}
                    </div>
                    <span className="text-sm font-semibold text-foreground-soft max-w-[110px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <User className="w-4 h-4 text-foreground-soft ml-1" aria-hidden="true" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-xl shadow-lg py-2 z-50 animate-in fade-in zoom-in duration-200">
                      <div className="px-4 py-2.5 border-b border-muted mb-1">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          Signed in as
                        </p>
                        <p className="text-sm font-semibold text-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                      {[
                        { to: '/dashboard', label: 'Dashboard' },
                        { to: '/saved-properties', label: 'Saved Properties' },
                        { to: '/my-listings', label: 'My Listings' },
                      ].map(({ to, label }) => (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setIsUserMenuOpen(false)}
                          className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg mx-1 transition-colors ${
                            isActive(to)
                              ? 'text-primary font-semibold bg-muted'
                              : 'text-foreground-soft hover:text-primary hover:bg-muted'
                          }`}
                        >
                          {label}
                        </Link>
                      ))}
                      <div className="border-t border-muted mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left text-foreground-soft hover:text-destructive hover:bg-destructive/5 transition-colors mx-1 rounded-lg"
                          style={{ width: 'calc(100% - 8px)' }}
                        >
                          <LogOut className="w-4 h-4" aria-hidden="true" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="text-sm font-medium text-foreground-soft hover:text-primary transition-colors px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-semibold px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover transition-colors active:scale-[0.97]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border text-foreground-soft hover:bg-muted hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <XIcon className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <>
            <button
              type="button"
              aria-label="Close navigation menu"
              className="md:hidden fixed inset-0 top-16 z-30 bg-foreground/20"
              onClick={closeMobileMenu}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden absolute top-16 left-0 w-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-border bg-background py-4 px-4 z-40 shadow-lg"
            >
              <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-3 text-base font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-primary font-semibold bg-muted'
                      : 'text-foreground-soft hover:text-primary hover:bg-muted/50'
                  }`}
                  onClick={closeMobileMenu}
                >
                  <Home className="w-4 h-4" aria-hidden="true" />
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-muted mt-3 pt-3 flex flex-col gap-1">
                {isAuthenticated && user ? (
                  <>
                    <p className="px-4 text-[11px] text-muted-foreground uppercase tracking-wider mb-1">
                      Signed in as
                    </p>
                    <div className="flex items-center justify-between px-4 py-2">
                      <span className="text-sm font-medium text-foreground-soft">Notifications</span>
                      <UserNotifications />
                    </div>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-3 text-base font-medium text-foreground-soft hover:text-primary transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <User className="w-4 h-4" aria-hidden="true" /> Dashboard
                    </Link>
                    <Link
                      to="/saved-properties"
                      className="flex items-center gap-2 px-4 py-3 text-base font-medium text-foreground-soft hover:text-primary transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <Heart className="w-4 h-4" aria-hidden="true" /> Saved Properties
                    </Link>
                    <Link
                      to="/my-listings"
                      className="flex items-center gap-2 px-4 py-3 text-base font-medium text-foreground-soft hover:text-primary transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <Home className="w-4 h-4" aria-hidden="true" /> My Listings
                    </Link>
                    <Link
                      to="/add-property"
                      className="mt-2 flex items-center justify-center gap-1.5 text-sm font-semibold px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover transition-colors text-center"
                      onClick={closeMobileMenu}
                    >
                      <Plus className="w-4 h-4" /> List Property
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-3 text-base font-medium text-left text-foreground-soft hover:text-destructive transition-colors"
                    >
                      <LogOut className="w-4 h-4" aria-hidden="true" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signin"
                      className="px-4 py-3 text-base font-medium text-foreground-soft hover:text-primary transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <User className="w-4 h-4" aria-hidden="true" /> Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="mt-2 flex items-center justify-center gap-1.5 text-sm font-semibold px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover transition-colors text-center"
                      onClick={closeMobileMenu}
                    >
                      <User className="w-4 h-4" /> Sign Up
                    </Link>
                  </>
                )}
              </div>
              </div>
            </motion.div>
          </>
        )}
      </motion.nav>
    </>
  );
};

export default Navbar;
