import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Coffee, Menu, X, LogOut, Home, History, Settings, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 animate-slide-down">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary hover:opacity-80 transition-opacity">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Coffee className="h-5 w-5" />
            </div>
            <span className="hidden sm:inline">Coffee Guardian</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>{t("home")}</span>
            </Link>
            <Link
              to="/upload"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>{t("upload")}</span>
            </Link>
            <Link
              to="/history"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <History className="h-4 w-4" />
              <span>{t("history")}</span>
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "rw" : "en")}
              className="border border-gray-200"
            >
              <Globe className="h-4 w-4" />
              <span className="ml-1 text-xs font-semibold uppercase">{language === "en" ? "RW" : "EN"}</span>
            </Button>

            {!isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")} className="hidden sm:inline-flex">
                  {t("signIn") || "Sign in"}
                </Button>
                <Button onClick={() => navigate("/signup")} className="hidden sm:inline-flex">
                  {t("signUp") || "Sign up"}
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 animate-slide-down">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/" className="cursor-pointer">
                      <Home className="mr-2 h-4 w-4" />
                      <span>{t("home")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/upload" className="cursor-pointer">
                      <span>{t("upload")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/history" className="cursor-pointer">
                      <History className="mr-2 h-4 w-4" />
                      <span>{t("history")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("logout") || "Logout"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-slide-down">
            <Link
              to="/"
              className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium transition-colors"
            >
              {t("home")}
            </Link>
            <Link
              to="/upload"
              className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium transition-colors"
            >
              {t("upload")}
            </Link>
            <Link
              to="/history"
              className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium transition-colors"
            >
              {t("history")}
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium transition-colors"
            >
              Settings
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
