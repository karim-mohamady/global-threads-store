import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, MoreVertical, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { categoriesApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  parent?: { name: string };
  children_count?: number;
  products_count?: number;
}

const AdminCategories = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await categoriesApi.getAll({ with_children: true });
      setCategories(response.data || []);
    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Failed to load categories" : "فشل تحميل الفئات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(language === "en" ? "Delete this category?" : "حذف هذه الفئة؟")) {
      return;
    }

    try {
      await categoriesApi.delete(id);
      toast({
        title: language === "en" ? "Category deleted" : "تم حذف الفئة",
      });
      loadCategories();
    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Failed to delete category" : "فشل حذف الفئة",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            {language === "en" ? "Categories" : "الفئات"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === "en" ? "Organize your products" : "تنظيم منتجاتك"}
          </p>
        </div>
        <Button className="btn-gold">
          <Plus className="h-4 w-4 me-2" />
          {language === "en" ? "Add Category" : "إضافة فئة"}
        </Button>
      </div>

      <Card className="card-luxury">
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              {language === "en" ? "Loading..." : "جاري التحميل..."}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                {language === "en" ? "No categories yet" : "لا توجد فئات بعد"}
              </p>
              <Button className="btn-gold">
                <Plus className="h-4 w-4 me-2" />
                {language === "en" ? "Create first category" : "إنشاء أول فئة"}
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === "en" ? "Name" : "الاسم"}</TableHead>
                    <TableHead>{language === "en" ? "Slug" : "المعرف"}</TableHead>
                    <TableHead>{language === "en" ? "Parent" : "الأب"}</TableHead>
                    <TableHead>{language === "en" ? "Products" : "المنتجات"}</TableHead>
                    <TableHead>{language === "en" ? "Status" : "الحالة"}</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                      <TableCell>{category.parent?.name || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{category.products_count || 0}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={category.is_active ? "default" : "secondary"}>
                          {category.is_active
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
                              onClick={() => handleDelete(category.id)}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCategories;
