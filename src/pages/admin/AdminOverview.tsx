import { useEffect, useState } from "react";
import { Package, Users, ShoppingCart, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { productsApi, ordersApi, adminApi } from "@/services/api";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  revenue: number;
}

const AdminOverview = () => {
  const { language } = useLanguage();
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        productsApi.getAll({ per_page: 1 }),
        ordersApi.getAll({ per_page: 1 }),
        adminApi.users.getAll({ per_page: 1 }),
      ]);

      setStats({
        totalProducts: productsRes.meta?.total || 0,
        totalOrders: ordersRes.meta?.total || 0,
        totalUsers: usersRes.meta?.total || 0,
        revenue: 0, // Calculate from orders if available
      });
    } catch (error) {
      console.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: language === "en" ? "Total Products" : "إجمالي المنتجات",
      value: stats.totalProducts,
      icon: Package,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: language === "en" ? "Total Orders" : "إجمالي الطلبات",
      value: stats.totalOrders,
      icon: ShoppingCart,
      trend: "+8%",
      trendUp: true,
    },
    {
      title: language === "en" ? "Total Users" : "إجمالي المستخدمين",
      value: stats.totalUsers,
      icon: Users,
      trend: "+15%",
      trendUp: true,
    },
    {
      title: language === "en" ? "Revenue" : "الإيرادات",
      value: `$${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      trend: "+23%",
      trendUp: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">
          {language === "en" ? "Dashboard Overview" : "نظرة عامة"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === "en"
            ? "Welcome to your admin dashboard"
            : "مرحباً بك في لوحة التحكم"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="card-luxury">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
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
                  {language === "en" ? "from last month" : "من الشهر الماضي"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="card-luxury">
        <CardHeader>
          <CardTitle>
            {language === "en" ? "Quick Actions" : "إجراءات سريعة"}
          </CardTitle>
          <CardDescription>
            {language === "en"
              ? "Common administrative tasks"
              : "مهام إدارية شائعة"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center hover:bg-secondary/50 transition-colors cursor-pointer">
              <Package className="h-8 w-8 mx-auto mb-2 text-accent" />
              <p className="text-sm font-medium">
                {language === "en" ? "Add Product" : "إضافة منتج"}
              </p>
            </Card>
            <Card className="p-4 text-center hover:bg-secondary/50 transition-colors cursor-pointer">
              <Users className="h-8 w-8 mx-auto mb-2 text-accent" />
              <p className="text-sm font-medium">
                {language === "en" ? "Manage Users" : "إدارة المستخدمين"}
              </p>
            </Card>
            <Card className="p-4 text-center hover:bg-secondary/50 transition-colors cursor-pointer">
              <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-accent" />
              <p className="text-sm font-medium">
                {language === "en" ? "View Orders" : "عرض الطلبات"}
              </p>
            </Card>
            <Card className="p-4 text-center hover:bg-secondary/50 transition-colors cursor-pointer">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-accent" />
              <p className="text-sm font-medium">
                {language === "en" ? "Reports" : "التقارير"}
              </p>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
