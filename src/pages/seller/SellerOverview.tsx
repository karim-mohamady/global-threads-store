import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Eye,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { sellerApi } from "@/services/api";

interface SellerStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalViews: number;
  pendingOrders: number;
  lowStockProducts: number;
}

interface RecentOrder {
  id: number;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

const SellerOverview = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [stats, setStats] = useState<SellerStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalViews: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        sellerApi.getStats(),
        sellerApi.orders.getAll({ per_page: 5 }),
      ]);
      setStats(statsRes.data);
      setRecentOrders(ordersRes.data || []);
    } catch (error) {
      console.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: language === "en" ? "Total Products" : "إجمالي المنتجات",
      value: stats.totalProducts,
      icon: Package,
      trend: "+5",
      trendUp: true,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: language === "en" ? "Total Orders" : "إجمالي الطلبات",
      value: stats.totalOrders,
      icon: ShoppingCart,
      trend: "+12",
      trendUp: true,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: language === "en" ? "Total Revenue" : "إجمالي الإيرادات",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: "+23%",
      trendUp: true,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: language === "en" ? "Product Views" : "مشاهدات المنتجات",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      trend: "+18%",
      trendUp: true,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      pending: { variant: "secondary", label: language === "en" ? "Pending" : "قيد الانتظار" },
      confirmed: { variant: "default", label: language === "en" ? "Confirmed" : "مؤكد" },
      shipped: { variant: "outline", label: language === "en" ? "Shipped" : "تم الشحن" },
      delivered: { variant: "default", label: language === "en" ? "Delivered" : "تم التسليم" },
      cancelled: { variant: "destructive", label: language === "en" ? "Cancelled" : "ملغي" },
    };
    return statusMap[status] || { variant: "secondary" as const, label: status };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            {language === "en" ? "Welcome back" : "مرحباً بعودتك"}, {user?.first_name}!
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === "en"
              ? "Here's what's happening with your store today"
              : "إليك ما يحدث في متجرك اليوم"}
          </p>
        </div>
        <Button asChild>
          <Link to="/seller/products/new">
            <Plus className="h-4 w-4 me-2" />
            {language === "en" ? "Add Product" : "إضافة منتج"}
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="card-luxury hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={cn(stat.bgColor, "p-2 rounded-lg")}>
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stat.value}
              </div>
              <div className="flex items-center mt-1">
                {stat.trendUp ? (
                  <TrendingUp className="h-3 w-3 text-green-500 me-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive me-1" />
                )}
                <span
                  className={`text-xs ${
                    stat.trendUp ? "text-green-500" : "text-destructive"
                  }`}
                >
                  {stat.trend}
                </span>
                <span className="text-xs text-muted-foreground ms-1">
                  {language === "en" ? "this month" : "هذا الشهر"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts */}
      {(stats.pendingOrders > 0 || stats.lowStockProducts > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.pendingOrders > 0 && (
            <Card className="border-amber-500/50 bg-amber-500/5">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="font-medium">
                      {stats.pendingOrders} {language === "en" ? "pending orders" : "طلبات معلقة"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === "en" ? "Require your attention" : "تحتاج انتباهك"}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/seller/orders?status=pending">
                    {language === "en" ? "View" : "عرض"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
          {stats.lowStockProducts > 0 && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="font-medium">
                      {stats.lowStockProducts} {language === "en" ? "low stock items" : "منتجات منخفضة المخزون"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === "en" ? "Need restocking" : "تحتاج إعادة تخزين"}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/seller/products?filter=low_stock">
                    {language === "en" ? "View" : "عرض"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Recent Orders */}
      <Card className="card-luxury">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>
              {language === "en" ? "Recent Orders" : "الطلبات الأخيرة"}
            </CardTitle>
            <CardDescription>
              {language === "en"
                ? "Your latest customer orders"
                : "أحدث طلبات عملائك"}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/seller/orders">
              {language === "en" ? "View All" : "عرض الكل"}
              <ArrowRight className="h-4 w-4 ms-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              {language === "en" ? "Loading..." : "جاري التحميل..."}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {language === "en" ? "No orders yet" : "لا توجد طلبات بعد"}
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => {
                const status = getStatusBadge(order.status);
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">#{order.order_number}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {order.customer_name}
                      </p>
                    </div>
                    <div className="text-right mx-4">
                      <p className="font-medium">${order.total_amount}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="card-luxury">
        <CardHeader>
          <CardTitle>
            {language === "en" ? "Quick Actions" : "إجراءات سريعة"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/seller/products/new">
              <Card className="p-4 text-center hover:bg-primary/5 hover:border-primary/50 transition-colors cursor-pointer h-full">
                <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">
                  {language === "en" ? "Add Product" : "إضافة منتج"}
                </p>
              </Card>
            </Link>
            <Link to="/seller/orders">
              <Card className="p-4 text-center hover:bg-primary/5 hover:border-primary/50 transition-colors cursor-pointer h-full">
                <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">
                  {language === "en" ? "View Orders" : "عرض الطلبات"}
                </p>
              </Card>
            </Link>
            <Link to="/seller/analytics">
              <Card className="p-4 text-center hover:bg-primary/5 hover:border-primary/50 transition-colors cursor-pointer h-full">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">
                  {language === "en" ? "Analytics" : "التحليلات"}
                </p>
              </Card>
            </Link>
            <Link to="/seller/payouts">
              <Card className="p-4 text-center hover:bg-primary/5 hover:border-primary/50 transition-colors cursor-pointer h-full">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">
                  {language === "en" ? "Payouts" : "المدفوعات"}
                </p>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function for className merging
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default SellerOverview;