import { useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Menu, X, Globe, Sun, Moon, Sprout, LogIn, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isUser, logout } = useAuth();

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.products'), href: '/products' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.resources'), href: '/resources' },
    { name: t('nav.exports'), href: '/exports' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
  ];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === i18n.language) || languages[0];
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 lg:space-x-3 group min-w-0">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
              <Sprout className="w-5 h-5 lg:w-6 lg:h-6 text-primary-foreground" />
            </div>
            <div className="truncate">
              <h1 className="text-lg lg:text-xl font-bold text-foreground leading-tight">
                {t('company.name', 'Sakthi Sai Biotech')}
              </h1>
              <p className="text-[10px] lg:text-xs text-muted-foreground">
                {t('company.since', 'Since 1999')}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-foreground hover:text-primary transition-colors font-medium relative",
                  location === item.href && "text-primary"
                )}
                data-testid={`nav-link-${item.href.replace('/', '') || 'home'}`}
              >
                {item.name}
                {location === item.href && (
                  <div className="absolute -bottom-6 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* User Profile/Login */}
            {isAuthenticated && isUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex items-center gap-2 border-primary/20 hover:border-primary hover:bg-primary/10 transition-all duration-300"
                    data-testid="user-profile-btn"
                  >
                    <User className="w-4 h-4" />
                    <span className="font-medium">{user?.email?.split('@')[0] || 'User'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    {t('nav.profile', 'Profile')}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <LogIn className="w-4 h-4 mr-2" />
                    {t('nav.orders', 'My Orders')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('nav.logout', 'Logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                {/* User Login Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocation('/login')}
                  className="hidden sm:flex items-center gap-2 border-primary/20 hover:border-primary hover:bg-primary/10 transition-all duration-300"
                  data-testid="user-login-btn"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="font-medium">{t('nav.login', 'Login')}</span>
                </Button>

                {/* Mobile User Login */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation('/login')}
                  className="sm:hidden w-9 h-9 p-0"
                  data-testid="mobile-user-login-btn"
                >
                  <User className="w-4 h-4" />
                </Button>
              </>
            )}

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2" data-testid="language-switcher">
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">{getCurrentLanguage().flag}</span>
                  <span className="text-sm font-medium hidden sm:inline">{getCurrentLanguage().code.toUpperCase()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={cn(
                      "cursor-pointer",
                      i18n.language === lang.code && "bg-muted"
                    )}
                    data-testid={`language-option-${lang.code}`}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0"
              data-testid="theme-toggle"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-9 h-9 p-0"
              data-testid="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && createPortal(
          <div className="fixed inset-0 z-[100] bg-background lg:hidden animate-in slide-in-from-top-10 duration-200 overflow-y-auto">
            <div className="container mx-auto px-4 py-6 h-full flex flex-col">
              <div className="flex justify-end mb-8">
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <nav className="flex flex-col space-y-6 items-center justify-center flex-1">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "text-2xl font-bold transition-colors hover:text-primary",
                      location === item.href ? "text-primary" : "text-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                {isAuthenticated && isUser ? (
                  <div className="w-full mt-4 space-y-2">
                    <div className="text-center text-sm text-muted-foreground">
                      {t('nav.welcome', 'Welcome')}, {user?.email?.split('@')[0] || 'User'}
                    </div>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        logout();
                      }}
                    >
                      <LogOut className="mr-2" />
                      {t('nav.logout', 'Logout')}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full mt-4"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setLocation('/login');
                    }}
                  >
                    <LogIn className="mr-2" />
                    {t('nav.login', 'Login')}
                  </Button>
                )}
                <div className="mt-4 flex gap-4">
                  <Button variant="outline" size="lg" className="w-full" onClick={() => toggleTheme()}>
                    {theme === 'dark' ? <Sun className="mr-2" /> : <Moon className="mr-2" />}
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </Button>
                </div>
              </nav>
            </div>
          </div>,
          document.body
        )}
      </div>
    </header>
  );
}
