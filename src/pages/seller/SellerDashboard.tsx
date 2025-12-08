import { useEffect, useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Store,
  MessageSquare,
  Bell,
  Wallet,
  Settings,
  ChevronLeft,
  Menu,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const SellerDashboard = () => {
  const { isAuthenticated, isSeller, isLoading, user } = useAuth();
  const { language } = useLanguage();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(3);
  const [unreadNotifications, setUnreadNotifications] = useState(5);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!isSeller) {
    return <Navigate to="/seller/register" replace />;
  }

  const navItems = [
    {
      href: "/seller",
      label: language === "en" ? "Dashboard" : "لوحة التحكم",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/seller/products",
      label: language === "en" ? "My Products" : "منتجاتي",
      icon: Package,
    },
    {
      href: "/seller/orders",
      label: language === "en" ? "Orders" : "الطلبات",
      icon: ShoppingCart,
    },
    {
      href: "/seller/analytics",
      label: language === "en" ? "Analytics" : "التحليلات",
      icon: BarChart3,
    },
    {
      href: "/seller/store",
      label: language === "en" ? "My Store" : "متجري",
      icon: Store,
    },
    {
      href: "/seller/messages",
      label: language === "en" ? "Messages" : "الرسائل",
      icon: MessageSquare,
      badge: unreadMessages,
    },
    {
      href: "/seller/notifications",
      label: language === "en" ? "Notifications" : "الإشعارات",
      icon: Bell,
      badge: unreadNotifications,
    },
    {
      href: "/seller/payouts",
      label: language === "en" ? "Payouts" : "المدفوعات",
      icon: Wallet,
    },
    {
      href: "/seller/settings",
      label: language === "en" ? "Settings" : "الإعدادات",
      icon: Settings,
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
            {language === "en" ? "Seller Panel" : "لوحة البائع"}
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
            "fixed lg:sticky top-0 left-0 z-40 h-screen bg-card border-e border-border transition-all duration-300 overflow-y-auto",
            sidebarOpen ? "w-64" : "w-0 lg:w-20",
            "lg:translate-x-0",
            !sidebarOpen && "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="flex flex-col h-full p-4">
            {/* Logo & Profile */}
            <div className="flex items-center justify-between mb-6">
              {sidebarOpen && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {language === "en" ? "Seller Account" : "حساب بائع"}
                    </p>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex flex-shrink-0"
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
                const isActive = item.exact
                  ? location.pathname === item.href
                  : location.pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                    onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {item.badge && item.badge > 0 && (
                          <Badge
                            variant="destructive"
                            className="h-5 min-w-5 flex items-center justify-center text-xs"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                    {!sidebarOpen && item.badge && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive rounded-full text-[10px] text-white flex items-center justify-center">
                        {item.badge > 9 ? "9+" : item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* View Store */}
            <div className="pt-4 border-t border-border space-y-2">
              <Button
                asChild
                variant="outline"
                className={cn("w-full", !sidebarOpen && "px-2")}
              >
                <Link to={`/store/${user?.id}`}>
                  <Store className="h-4 w-4 me-2" />
                  {sidebarOpen && (language === "en" ? "View My Store" : "عرض متجري")}
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className={cn("w-full", !sidebarOpen && "px-2")}
              >
                <Link to="/">
                  <ChevronLeft className="h-4 w-4 me-2" />
                  {sidebarOpen && (language === "en" ? "Back to Shop" : "العودة للمتجر")}
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

export default SellerDashboard;