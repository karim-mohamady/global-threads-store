import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, MoreVertical, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { bannersApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  image_url: string;
  link_url?: string;
  position: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
}

const AdminBanners = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const response = await bannersApi.getAll();
      setBanners(response.data || []);
    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Failed to load banners" : "فشل تحميل البانرات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            {language === "en" ? "Banners" : "البانرات"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === "en" ? "Manage promotional banners" : "إدارة البانرات الترويجية"}
          </p>
        </div>
        <Button className="btn-gold">
          <Plus className="h-4 w-4 me-2" />
          {language === "en" ? "Add Banner" : "إضافة بانر"}
        </Button>
      </div>

      <Card className="card-luxury">
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              {language === "en" ? "Loading..." : "جاري التحميل..."}
            </div>
          ) : banners.length === 0 ? (
            <div className="text-center py-12">
              <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                {language === "en" ? "No banners yet" : "لا توجد بانرات بعد"}
              </p>
              <Button className="btn-gold">
                <Plus className="h-4 w-4 me-2" />
                {language === "en" ? "Create first banner" : "إنشاء أول بانر"}
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === "en" ? "Banner" : "البانر"}</TableHead>
                    <TableHead>{language === "en" ? "Position" : "الموضع"}</TableHead>
                    <TableHead>{language === "en" ? "Status" : "الحالة"}</TableHead>
                    <TableHead>{language === "en" ? "Dates" : "التواريخ"}</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banners.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-20 rounded bg-secondary flex items-center justify-center overflow-hidden">
                            {banner.image_url ? (
                              <img
                                src={banner.image_url}
                                alt={banner.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Image className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{banner.title}</p>
                            {banner.subtitle && (
                              <p className="text-xs text-muted-foreground">
                                {banner.subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{banner.position}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={banner.is_active ? "default" : "secondary"}>
                          {banner.is_active
                            ? language === "en"
                              ? "Active"
                              : "نشط"
                            : language === "en"
                            ? "Inactive"
                            : "غير نشط"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {banner.start_date
                          ? new Date(banner.start_date).toLocaleDateString(
                              language === "ar" ? "ar-EG" : "en-US"
                            )
                          : "-"}
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
                            <DropdownMenuItem className="text-destructive">
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

export default AdminBanners;
