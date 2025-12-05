import { useEffect, useState } from "react";
import { Search, Eye, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { ordersApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: number;
  order_number: string;
  user?: { first_name: string; last_name: string; email: string };
  status: string;
  payment_status: string;
  total_amount: string;
  items_count?: number;
  created_at: string;
}

const AdminOrders = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadOrders();
  }, [page]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersApi.getAll({ page, per_page: 10 });
      setOrders(response.data || []);
      setTotalPages(response.meta?.last_page || 1);
    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Failed to load orders" : "فشل تحميل الطلبات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "shipped":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "processing":
      case "confirmed":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "paid":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "failed":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">
          {language === "en" ? "Orders" : "الطلبات"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === "en" ? "Manage customer orders" : "إدارة طلبات العملاء"}
        </p>
      </div>

      <Card className="card-luxury">
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={language === "en" ? "Search orders..." : "بحث عن طلبات..."}
              className="ps-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              {language === "en" ? "Loading..." : "جاري التحميل..."}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {language === "en" ? "No orders yet" : "لا توجد طلبات بعد"}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === "en" ? "Order" : "الطلب"}</TableHead>
                      <TableHead>{language === "en" ? "Customer" : "العميل"}</TableHead>
                      <TableHead>{language === "en" ? "Status" : "الحالة"}</TableHead>
                      <TableHead>{language === "en" ? "Payment" : "الدفع"}</TableHead>
                      <TableHead>{language === "en" ? "Total" : "الإجمالي"}</TableHead>
                      <TableHead>{language === "en" ? "Date" : "التاريخ"}</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <span className="font-medium">#{order.order_number}</span>
                        </TableCell>
                        <TableCell>
                          {order.user ? (
                            <div>
                              <p className="font-medium">
                                {order.user.first_name} {order.user.last_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {order.user.email}
                              </p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)} variant="outline">
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getPaymentStatusColor(order.payment_status)}
                            variant="outline"
                          >
                            {order.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">${order.total_amount}</TableCell>
                        <TableCell>
                          {new Date(order.created_at).toLocaleDateString(
                            language === "ar" ? "ar-EG" : "en-US"
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 me-2" />
                                {language === "en" ? "View Details" : "عرض التفاصيل"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    {language === "en" ? "Previous" : "السابق"}
                  </Button>
                  <span className="flex items-center px-3 text-sm">
                    {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    {language === "en" ? "Next" : "التالي"}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;
