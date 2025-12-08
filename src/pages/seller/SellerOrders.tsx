import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MoreHorizontal,
  Download,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { sellerApi } from "@/services/api";

interface Order {
  id: number;
  order_number: string;
  customer: {
    id: number;
    name: string;
    email: string;
  };
  items: {
    id: number;
    product_name: string;
    quantity: number;
    price: number;
  }[];
  total_amount: number;
  status: string;
  payment_status: string;
  shipping_address: {
    street_address: string;
    city: string;
    country: string;
  };
  created_at: string;
}

const SellerOrders = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadOrders();
  }, [currentPage, statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params: any = { page: currentPage, per_page: 10 };
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      const response = await sellerApi.orders.getAll(params);
      setOrders(response.data || []);
      setTotalPages(response.meta?.last_page || 1);
    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Failed to load orders" : "فشل في تحميل الطلبات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    try {
      await sellerApi.orders.updateStatus(selectedOrder.id, newStatus);
      toast({
        title: language === "en" ? "Success" : "نجاح",
        description: language === "en" ? "Order status updated" : "تم تحديث حالة الطلب",
      });
      loadOrders();
      setSelectedOrder(null);
      setNewStatus("");
    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Failed to update status" : "فشل في تحديث الحالة",
        variant: "destructive",
      });
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <Package className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      pending: { variant: "secondary", label: language === "en" ? "Pending" : "قيد الانتظار" },
      confirmed: { variant: "default", label: language === "en" ? "Confirmed" : "مؤكد" },
      processing: { variant: "default", label: language === "en" ? "Processing" : "قيد المعالجة" },
      shipped: { variant: "outline", label: language === "en" ? "Shipped" : "تم الشحن" },
      delivered: { variant: "default", label: language === "en" ? "Delivered" : "تم التسليم" },
      cancelled: { variant: "destructive", label: language === "en" ? "Cancelled" : "ملغي" },
    };
    return statusMap[status] || { variant: "secondary" as const, label: status };
  };

  const getPaymentBadge = (status: string) => {
    const statusMap: Record<string, { variant: "default" | "secondary" | "destructive"; label: string }> = {
      pending: { variant: "secondary", label: language === "en" ? "Pending" : "معلق" },
      completed: { variant: "default", label: language === "en" ? "Paid" : "مدفوع" },
      failed: { variant: "destructive", label: language === "en" ? "Failed" : "فشل" },
      refunded: { variant: "secondary", label: language === "en" ? "Refunded" : "مسترد" },
    };
    return statusMap[status] || { variant: "secondary" as const, label: status };
  };

  const statusTabs = [
    { value: "all", label: language === "en" ? "All" : "الكل" },
    { value: "pending", label: language === "en" ? "Pending" : "معلق" },
    { value: "confirmed", label: language === "en" ? "Confirmed" : "مؤكد" },
    { value: "shipped", label: language === "en" ? "Shipped" : "شُحن" },
    { value: "delivered", label: language === "en" ? "Delivered" : "تم التسليم" },
    { value: "cancelled", label: language === "en" ? "Cancelled" : "ملغي" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">
          {language === "en" ? "Orders" : "الطلبات"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === "en"
            ? "Manage orders from your customers"
            : "إدارة طلبات عملائك"}
        </p>
      </div>

      {/* Status Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="flex-wrap h-auto gap-2 p-1">
          {statusTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="text-sm">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={language === "en" ? "Search by order number or customer..." : "البحث برقم الطلب أو العميل..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">
                {language === "en" ? "Loading..." : "جاري التحميل..."}
              </p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">
                {language === "en" ? "No orders found" : "لم يتم العثور على طلبات"}
              </h3>
              <p className="text-muted-foreground mt-1">
                {language === "en"
                  ? "Orders from customers will appear here"
                  : "ستظهر طلبات العملاء هنا"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === "en" ? "Order" : "الطلب"}</TableHead>
                    <TableHead>{language === "en" ? "Customer" : "العميل"}</TableHead>
                    <TableHead>{language === "en" ? "Items" : "العناصر"}</TableHead>
                    <TableHead>{language === "en" ? "Total" : "الإجمالي"}</TableHead>
                    <TableHead>{language === "en" ? "Status" : "الحالة"}</TableHead>
                    <TableHead>{language === "en" ? "Payment" : "الدفع"}</TableHead>
                    <TableHead>{language === "en" ? "Date" : "التاريخ"}</TableHead>
                    <TableHead className="text-right">{language === "en" ? "Actions" : "إجراءات"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const status = getStatusBadge(order.status);
                    const payment = getPaymentBadge(order.payment_status);
                    return (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className="font-medium">#{order.order_number}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customer.name}</p>
                            <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {order.items.length} {language === "en" ? "items" : "عناصر"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">${order.total_amount}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={payment.variant}>{payment.label}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/seller/orders/${order.id}`}>
                                  <Eye className="h-4 w-4 me-2" />
                                  {language === "en" ? "View Details" : "عرض التفاصيل"}
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setNewStatus(order.status);
                                }}
                              >
                                <CheckCircle className="h-4 w-4 me-2" />
                                {language === "en" ? "Update Status" : "تحديث الحالة"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <MessageSquare className="h-4 w-4 me-2" />
                                {language === "en" ? "Contact Customer" : "التواصل مع العميل"}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 me-2" />
                                {language === "en" ? "Download Invoice" : "تحميل الفاتورة"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            {language === "en" ? "Previous" : "السابق"}
          </Button>
          <span className="flex items-center px-4 text-sm">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            {language === "en" ? "Next" : "التالي"}
          </Button>
        </div>
      )}

      {/* Update Status Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === "en" ? "Update Order Status" : "تحديث حالة الطلب"}
            </DialogTitle>
            <DialogDescription>
              {language === "en"
                ? `Update status for order #${selectedOrder?.order_number}`
                : `تحديث حالة الطلب رقم #${selectedOrder?.order_number}`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder={language === "en" ? "Select status" : "اختر الحالة"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confirmed">{language === "en" ? "Confirmed" : "مؤكد"}</SelectItem>
                <SelectItem value="processing">{language === "en" ? "Processing" : "قيد المعالجة"}</SelectItem>
                <SelectItem value="shipped">{language === "en" ? "Shipped" : "تم الشحن"}</SelectItem>
                <SelectItem value="delivered">{language === "en" ? "Delivered" : "تم التسليم"}</SelectItem>
                <SelectItem value="cancelled">{language === "en" ? "Cancelled" : "ملغي"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>
              {language === "en" ? "Cancel" : "إلغاء"}
            </Button>
            <Button onClick={handleUpdateStatus}>
              {language === "en" ? "Update" : "تحديث"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellerOrders;