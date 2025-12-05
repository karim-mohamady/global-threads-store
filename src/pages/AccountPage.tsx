import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { User, Package, Heart, MapPin, Settings, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ordersApi } from "@/services/api";
import Layout from "@/components/layout/Layout";

interface Order {
  id: number;
  order_number: string;
  status: string;
  total_amount: string;
  created_at: string;
  items: any[];
}

const AccountPage = () => {
  const { user, isAuthenticated, isLoading, logout, isAdmin } = useAuth();
  const { t, language } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  const loadOrders = async () => {
    try {
      const response = await ordersApi.getAll();
      setOrders(response.data || []);
    } catch (error) {
      console.error("Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/10 text-green-600";
      case "shipped":
        return "bg-blue-500/10 text-blue-600";
      case "processing":
        return "bg-yellow-500/10 text-yellow-600";
      case "cancelled":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 md:h-20 md:w-20">
                <AvatarFallback className="bg-accent text-accent-foreground text-xl">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold">
                  {user?.first_name} {user?.last_name}
                </h1>
                <p className="text-muted-foreground">{user?.email}</p>
                {isAdmin && (
                  <Badge variant="secondary" className="mt-1">
                    {language === "en" ? "Admin" : "مسؤول"}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {isAdmin && (
                <Button asChild variant="outline">
                  <Link to="/admin">
                    <Settings className="h-4 w-4 me-2" />
                    {language === "en" ? "Admin Panel" : "لوحة التحكم"}
                  </Link>
                </Button>
              )}
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4 me-2" />
                {t("nav.logout")}
              </Button>
            </div>
          </div>

          {/* Content */}
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="w-full md:w-auto mb-6">
              <TabsTrigger value="orders" className="flex-1 md:flex-none">
                <Package className="h-4 w-4 me-2" />
                {t("account.orders")}
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex-1 md:flex-none">
                <Heart className="h-4 w-4 me-2" />
                {t("account.wishlist")}
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1 md:flex-none">
                <User className="h-4 w-4 me-2" />
                {t("account.settings")}
              </TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card className="card-luxury">
                <CardHeader>
                  <CardTitle>{t("account.orderHistory")}</CardTitle>
                  <CardDescription>
                    {language === "en"
                      ? "View and track your orders"
                      : "عرض وتتبع طلباتك"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingOrders ? (
                    <p className="text-center py-8 text-muted-foreground">
                      {t("common.loading")}
                    </p>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">{t("account.noOrders")}</p>
                      <Button asChild>
                        <Link to="/products">{t("cart.continueShopping")}</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                        >
                          <div>
                            <p className="font-medium">#{order.order_number}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString(
                                language === "ar" ? "ar-EG" : "en-US"
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                            <span className="font-semibold">
                              ${order.total_amount}
                            </span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist">
              <Card className="card-luxury">
                <CardHeader>
                  <CardTitle>{t("account.wishlist")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Button asChild>
                      <Link to="/wishlist">
                        {language === "en" ? "View Wishlist" : "عرض المفضلة"}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card className="card-luxury">
                <CardHeader>
                  <CardTitle>{t("account.settings")}</CardTitle>
                  <CardDescription>
                    {language === "en"
                      ? "Manage your account settings"
                      : "إدارة إعدادات حسابك"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <div>
                        <p className="font-medium">{t("checkout.firstName")}</p>
                        <p className="text-muted-foreground">{user?.first_name}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <div>
                        <p className="font-medium">{t("checkout.lastName")}</p>
                        <p className="text-muted-foreground">{user?.last_name}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <div>
                        <p className="font-medium">{t("checkout.email")}</p>
                        <p className="text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <div>
                        <p className="font-medium">{t("checkout.phone")}</p>
                        <p className="text-muted-foreground">
                          {user?.phone || (language === "en" ? "Not set" : "غير محدد")}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AccountPage;
