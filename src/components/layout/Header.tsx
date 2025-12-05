import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, Heart, User, Menu, X, Globe, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/category/men", label: t("nav.men") },
    { href: "/category/women", label: t("nav.women") },
    { href: "/category/shoes", label: t("nav.shoes") },
    { href: "/category/accessories", label: t("nav.accessories") },
    { href: "/new-arrivals", label: t("nav.newArrivals") },
    { href: "/sale", label: t("nav.sale") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2 text-center text-xs tracking-wider">
        {language === "en" 
          ? "Free shipping on orders over $200 | Returns within 30 days"
          : "شحن مجاني للطلبات فوق 200 دولار | إرجاع خلال 30 يوم"
        }
      </div>

      <div className="container mx-auto">
        {/* Main header */}
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo */}
          <Link to="/" className="font-display text-2xl md:text-3xl font-bold tracking-wider">
            LUXE
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium tracking-wide hover:text-accent transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Language Switcher */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="hidden sm:flex items-center gap-1 text-xs"
            >
              <Globe className="h-4 w-4" />
              {language === "en" ? "العربية" : "English"}
            </Button>

            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Account */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden sm:flex">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user?.first_name} {user?.last_name}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/account">{t("nav.account")}</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        {language === "en" ? "Admin Panel" : "لوحة التحكم"}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="h-4 w-4 me-2" />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  {t("nav.login")}
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className={cn(
          "overflow-hidden transition-all duration-300",
          searchOpen ? "max-h-16 py-3" : "max-h-0"
        )}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("nav.search") + "..."}
              className="w-full pl-10 pr-4 py-2 bg-secondary border-none rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          mobileMenuOpen ? "max-h-screen py-4" : "max-h-0"
        )}>
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="py-2 text-sm font-medium tracking-wide hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Auth Links */}
            {isAuthenticated ? (
              <>
                <Link
                  to="/account"
                  className="py-2 text-sm font-medium tracking-wide hover:text-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.account")}
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="py-2 text-sm font-medium tracking-wide hover:text-accent transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {language === "en" ? "Admin Panel" : "لوحة التحكم"}
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 text-sm font-medium tracking-wide text-destructive text-start"
                >
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="py-2 text-sm font-medium tracking-wide hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.login")} / {t("nav.register")}
              </Link>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="justify-start mt-2"
            >
              <Globe className="h-4 w-4 me-2" />
              {language === "en" ? "العربية" : "English"}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
