import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Package,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { sellerApi } from "@/services/api";

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  discount_price?: number;
  stock_quantity: number;
  minimum_stock: number;
  is_active: boolean;
  is_approved: boolean;
  views_count: number;
  orders_count: number;
  images: string[];
  category?: { name: string };
  created_at: string;
}

const SellerProducts = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadProducts();
  }, [currentPage, statusFilter]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params: any = { page: currentPage, per_page: 10 };
      if (statusFilter !== "all") {
        if (statusFilter === "active") params.is_active = true;
        if (statusFilter === "inactive") params.is_active = false;
        if (statusFilter === "pending") params.is_approved = false;
        if (statusFilter === "low_stock") params.low_stock = true;
      }
      const response = await sellerApi.products.getAll(params);
      setProducts(response.data || []);
      setTotalPages(response.meta?.last_page || 1);
    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Failed to load products" : "فشل في تحميل المنتجات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;
    try {
      await sellerApi.products.delete(deleteProduct.id);
      toast({
        title: language === "en" ? "Success" : "نجاح",
        description: language === "en" ? "Product deleted" : "تم حذف المنتج",
      });
      loadProducts();
    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Failed to delete" : "فشل في الحذف",
        variant: "destructive",
      });
    } finally {
      setDeleteProduct(null);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (product: Product) => {
    if (product.stock_quantity === 0) {
      return { label: language === "en" ? "Out of Stock" : "نفذ", variant: "destructive" as const };
    }
    if (product.stock_quantity <= product.minimum_stock) {
      return { label: language === "en" ? "Low Stock" : "مخزون منخفض", variant: "secondary" as const };
    }
    return { label: language === "en" ? "In Stock" : "متوفر", variant: "default" as const };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            {language === "en" ? "My Products" : "منتجاتي"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === "en"
              ? "Manage your product listings"
              : "إدارة قوائم منتجاتك"}
          </p>
        </div>
        <Button asChild>
          <Link to="/seller/products/new">
            <Plus className="h-4 w-4 me-2" />
            {language === "en" ? "Add Product" : "إضافة منتج"}
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === "en" ? "Search products..." : "البحث عن منتجات..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={language === "en" ? "Filter by status" : "تصفية حسب الحالة"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === "en" ? "All Products" : "كل المنتجات"}</SelectItem>
                <SelectItem value="active">{language === "en" ? "Active" : "نشط"}</SelectItem>
                <SelectItem value="inactive">{language === "en" ? "Inactive" : "غير نشط"}</SelectItem>
                <SelectItem value="pending">{language === "en" ? "Pending Approval" : "بانتظار الموافقة"}</SelectItem>
                <SelectItem value="low_stock">{language === "en" ? "Low Stock" : "مخزون منخفض"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">
                {language === "en" ? "Loading..." : "جاري التحميل..."}
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">
                {language === "en" ? "No products found" : "لم يتم العثور على منتجات"}
              </h3>
              <p className="text-muted-foreground mt-1">
                {language === "en"
                  ? "Start by adding your first product"
                  : "ابدأ بإضافة منتجك الأول"}
              </p>
              <Button asChild className="mt-4">
                <Link to="/seller/products/new">
                  <Plus className="h-4 w-4 me-2" />
                  {language === "en" ? "Add Product" : "إضافة منتج"}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === "en" ? "Product" : "المنتج"}</TableHead>
                    <TableHead>{language === "en" ? "SKU" : "الرمز"}</TableHead>
                    <TableHead>{language === "en" ? "Price" : "السعر"}</TableHead>
                    <TableHead>{language === "en" ? "Stock" : "المخزون"}</TableHead>
                    <TableHead>{language === "en" ? "Status" : "الحالة"}</TableHead>
                    <TableHead>{language === "en" ? "Views" : "المشاهدات"}</TableHead>
                    <TableHead className="text-right">{language === "en" ? "Actions" : "إجراءات"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product);
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden">
                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium line-clamp-1">{product.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {product.category?.name || "—"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                        <TableCell>
                          {product.discount_price ? (
                            <div>
                              <span className="font-medium">${product.discount_price}</span>
                              <span className="text-sm text-muted-foreground line-through ms-2">
                                ${product.price}
                              </span>
                            </div>
                          ) : (
                            <span className="font-medium">${product.price}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{product.stock_quantity}</span>
                            <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {!product.is_approved && (
                              <Badge variant="secondary" className="w-fit">
                                <AlertTriangle className="h-3 w-3 me-1" />
                                {language === "en" ? "Pending" : "معلق"}
                              </Badge>
                            )}
                            {product.is_active ? (
                              <Badge variant="default" className="w-fit">
                                {language === "en" ? "Active" : "نشط"}
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="w-fit">
                                {language === "en" ? "Inactive" : "غير نشط"}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <span>{product.views_count || 0}</span>
                          </div>
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
                                <Link to={`/product/${product.id}`}>
                                  <Eye className="h-4 w-4 me-2" />
                                  {language === "en" ? "View" : "عرض"}
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/seller/products/${product.id}/edit`}>
                                  <Edit className="h-4 w-4 me-2" />
                                  {language === "en" ? "Edit" : "تعديل"}
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setDeleteProduct(product)}
                              >
                                <Trash2 className="h-4 w-4 me-2" />
                                {language === "en" ? "Delete" : "حذف"}
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

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "en" ? "Delete Product" : "حذف المنتج"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "en"
                ? `Are you sure you want to delete "${deleteProduct?.name}"? This action cannot be undone.`
                : `هل أنت متأكد من حذف "${deleteProduct?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === "en" ? "Cancel" : "إلغاء"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              {language === "en" ? "Delete" : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SellerProducts;