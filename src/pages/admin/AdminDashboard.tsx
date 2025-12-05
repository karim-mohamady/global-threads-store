import { useEffect, useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Tag,
  Image,
  Settings,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const AdminDashboard = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const { language } = useLanguage();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  const navItems = [
    {
      href: "/admin",
      label: language === "en" ? "Dashboard" : "لوحة التحكم",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/products",
      label: language === "en" ? "Products" : "المنتجات",
      icon: Package,
    },
    {
      href: "/admin/orders",
      label: language === "en" ? "Orders" : "الطلبات",
      icon: ShoppingCart,
    },
    {
      href: "/admin/users",
      label: language === "en" ? "Users" : "المستخدمين",
      icon: Users,
    },
    {
      href: "/admin/categories",
      label: language === "en" ? "Categories" : "الفئات",
      icon: Tag,
    },
    {
      href: "/admin/banners",
      label: language === "en" ? "Banners" : "البانرات",
      icon: Image,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-background border-b border-border p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-display font-bold">
            {language === "en" ? "Admin Panel" : "لوحة التحكم"}
          </h1>
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ChevronLeft className="h-4 w-4 me-1" />
              {language === "en" ? "Store" : "المتجر"}
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:sticky top-0 left-0 z-40 h-screen bg-card border-e border-border transition-all duration-300",
            sidebarOpen ? "w-64" : "w-0 lg:w-20",
            "lg:translate-x-0",
            !sidebarOpen && "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="flex flex-col h-full p-4">
            {/* Logo */}
            <div className="flex items-center justify-between mb-8">
              {sidebarOpen && (
                <Link to="/" className="font-display text-xl font-bold">
                  LUXE
                </Link>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <ChevronLeft
                  className={cn(
                    "h-4 w-4 transition-transform",
                    !sidebarOpen && "rotate-180"
                  )}
                />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="space-y-1 flex-1">
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.href ||
                  (item.href !== "/admin" &&
                    location.pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                    onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </nav>

            {/* Back to Store */}
            <div className="pt-4 border-t border-border">
              <Button
                asChild
                variant="outline"
                className={cn("w-full", !sidebarOpen && "px-2")}
              >
                <Link to="/">
                  <ChevronLeft className="h-4 w-4 me-2" />
                  {sidebarOpen && (language === "en" ? "Back to Store" : "العودة للمتجر")}
                </Link>
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
