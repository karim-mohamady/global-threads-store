import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Package,
  ShoppingCart,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { sellerApi } from "@/services/api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AnalyticsData {
  totalSales: number;
  totalOrders: number;
  totalViews: number;
  totalProducts: number;
  salesTrend: number;
  ordersTrend: number;
  salesByDay: { date: string; sales: number }[];
  topProducts: { name: string; sales: number; views: number }[];
  ordersByStatus: { status: string; count: number }[];
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--muted))"];

const SellerAnalytics = () => {
  const { language } = useLanguage();
  const [period, setPeriod] = useState("30");
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalSales: 0,
    totalOrders: 0,
    totalViews: 0,
    totalProducts: 0,
    salesTrend: 0,
    ordersTrend: 0,
    salesByDay: [],
    topProducts: [],
    ordersByStatus: [],
  });

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const response = await sellerApi.getStats();
      setAnalytics(response.data || generateMockData());
    } catch (error) {
      // Use mock data for demo
      setAnalytics(generateMockData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (): AnalyticsData => {
    const days = parseInt(period);
    const salesByDay = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      salesByDay.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        sales: Math.floor(Math.random() * 500) + 100,
      });
    }

    return {
      totalSales: 12500,
      totalOrders: 156,
      totalViews: 4520,
      totalProducts: 24,
      salesTrend: 12.5,
      ordersTrend: -3.2,
      salesByDay,
      topProducts: [
        { name: "Premium Jacket", sales: 45, views: 1200 },
        { name: "Classic T-Shirt", sales: 38, views: 980 },
        { name: "Slim Jeans", sales: 32, views: 850 },
        { name: "Leather Belt", sales: 28, views: 720 },
        { name: "Canvas Sneakers", sales: 22, views: 650 },
      ],
      ordersByStatus: [
        { status: "pending", count: 12 },
        { status: "processing", count: 25 },
        { status: "shipped", count: 45 },
        { status: "delivered", count: 74 },
      ],
    };
  };

  const StatCard = ({ title, value, icon: Icon, trend, trendLabel }: any) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {trend !== undefined && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
                {trend >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>{Math.abs(trend)}%</span>
                <span className="text-muted-foreground">{trendLabel}</span>
              </div>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            {language === "en" ? "Analytics" : "التحليلات"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === "en" ? "Track your store performance" : "تتبع أداء متجرك"}
          </p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">{language === "en" ? "Last 7 days" : "آخر 7 أيام"}</SelectItem>
            <SelectItem value="30">{language === "en" ? "Last 30 days" : "آخر 30 يوم"}</SelectItem>
            <SelectItem value="90">{language === "en" ? "Last 90 days" : "آخر 90 يوم"}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={language === "en" ? "Total Sales" : "إجمالي المبيعات"}
          value={`$${analytics.totalSales.toLocaleString()}`}
          icon={DollarSign}
          trend={analytics.salesTrend}
          trendLabel={language === "en" ? "vs last period" : "مقارنة بالفترة السابقة"}
        />
        <StatCard
          title={language === "en" ? "Total Orders" : "إجمالي الطلبات"}
          value={analytics.totalOrders}
          icon={ShoppingCart}
          trend={analytics.ordersTrend}
          trendLabel={language === "en" ? "vs last period" : "مقارنة بالفترة السابقة"}
        />
        <StatCard
          title={language === "en" ? "Product Views" : "مشاهدات المنتجات"}
          value={analytics.totalViews.toLocaleString()}
          icon={Eye}
        />
        <StatCard
          title={language === "en" ? "Active Products" : "المنتجات النشطة"}
          value={analytics.totalProducts}
          icon={Package}
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {language === "en" ? "Sales Over Time" : "المبيعات عبر الوقت"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.salesByDay}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>{language === "en" ? "Top Products" : "أفضل المنتجات"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="name" type="category" width={100} className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Orders by Status */}
        <Card>
          <CardHeader>
            <CardTitle>{language === "en" ? "Orders by Status" : "الطلبات حسب الحالة"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.ordersByStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ status, count }) => `${status}: ${count}`}
                  >
                    {analytics.ordersByStatus.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerAnalytics;
