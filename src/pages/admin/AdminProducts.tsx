import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { productsApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  images: string[];
  category?: { name: string };
}

const AdminProducts = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadProducts();
  }, [page, search]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await productsApi.getAll({
        page,
        per_page: 10,
        search: search || undefined,
      });
      setProducts(response.data || []);
      setTotalPages(response.meta?.last_page || 1);
    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Failed to load products" : "فشل تحميل المنتجات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(language === "en" ? "Delete this product?" : "حذف هذا المنتج؟")) {
      return;
    }

    try {
      await productsApi.delete(id);
      toast({
        title: language === "en" ? "Product deleted" : "تم حذف المنتج",
      });
      loadProducts();
    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Failed to delete product" : "فشل حذف المنتج",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            {language === "en" ? "Products" : "المنتجات"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === "en" ? "Manage your product catalog" : "إدارة كتالوج المنتجات"}
          </p>
        </div>
        <Button className="btn-gold">
          <Plus className="h-4 w-4 me-2" />
          {language === "en" ? "Add Product" : "إضافة منتج"}
        </Button>
      </div>

      <Card className="card-luxury">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === "en" ? "Search products..." : "بحث عن منتجات..."}
                className="ps-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              {language === "en" ? "Loading..." : "جاري التحميل..."}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {language === "en" ? "No products found" : "لا توجد منتجات"}
              </p>
              <Button className="btn-gold">
                <Plus className="h-4 w-4 me-2" />
                {language === "en" ? "Add your first product" : "أضف منتجك الأول"}
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === "en" ? "Product" : "المنتج"}</TableHead>
                      <TableHead>{language === "en" ? "Category" : "الفئة"}</TableHead>
                      <TableHead>{language === "en" ? "Price" : "السعر"}</TableHead>
                      <TableHead>{language === "en" ? "Stock" : "المخزون"}</TableHead>
                      <TableHead>{language === "en" ? "Status" : "الحالة"}</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center overflow-hidden">
                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="text-xs text-muted-foreground">IMG</span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-muted-foreground">{product.slug}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{product.category?.name || "-"}</TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell>
                          <Badge
                            variant={product.stock_quantity > 0 ? "secondary" : "destructive"}
                          >
                            {product.stock_quantity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.is_active ? "default" : "secondary"}>
                            {product.is_active
                              ? language === "en"
                                ? "Active"
                                : "نشط"
                              : language === "en"
                              ? "Inactive"
                              : "غير نشط"}
                          </Badge>
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
                                <Edit className="h-4 w-4 me-2" />
                                {language === "en" ? "Edit" : "تعديل"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(product.id)}
                              >
                                <Trash2 className="h-4 w-4 me-2" />
                                {language === "en" ? "Delete" : "حذف"}
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

export default AdminProducts;
