import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Upload, X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { sellerApi, categoriesApi } from "@/services/api";

interface ProductVariant {
  id?: number;
  size: string;
  color: string;
  stock_quantity: number;
  price_adjustment: number;
  sku_suffix: string;
}

interface ProductFormData {
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  sku: string;
  price: string;
  discount_price: string;
  category_id: string;
  stock_quantity: string;
  minimum_stock: string;
  is_active: boolean;
  is_featured: boolean;
  images: string[];
  variants: ProductVariant[];
  meta_title: string;
  meta_description: string;
}

const SellerProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { toast } = useToast();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    name_en: "",
    name_ar: "",
    description_en: "",
    description_ar: "",
    sku: "",
    price: "",
    discount_price: "",
    category_id: "",
    stock_quantity: "",
    minimum_stock: "10",
    is_active: true,
    is_featured: false,
    images: [],
    variants: [],
    meta_title: "",
    meta_description: "",
  });

  useEffect(() => {
    loadCategories();
    if (isEditing) {
      loadProduct();
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const response = await categoriesApi.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Failed to load categories");
    }
  };

  const loadProduct = async () => {
    try {
      const response = await sellerApi.products.getOne(id!);
      const product = response.data;
      setFormData({
        name_en: product.translations?.en?.name || product.name || "",
        name_ar: product.translations?.ar?.name || "",
        description_en: product.translations?.en?.description || product.description || "",
        description_ar: product.translations?.ar?.description || "",
        sku: product.sku || "",
        price: String(product.price || ""),
        discount_price: String(product.discount_price || ""),
        category_id: String(product.category_id || ""),
        stock_quantity: String(product.stock_quantity || ""),
        minimum_stock: String(product.minimum_stock || "10"),
        is_active: product.is_active ?? true,
        is_featured: product.is_featured ?? false,
        images: product.images || [],
        variants: product.variants || [],
        meta_title: product.meta_title || "",
        meta_description: product.meta_description || "",
      });
    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Failed to load product" : "فشل في تحميل المنتج",
        variant: "destructive",
      });
      navigate("/seller/products");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        translations: {
          en: { name: formData.name_en, description: formData.description_en },
          ar: { name: formData.name_ar, description: formData.description_ar },
        },
        sku: formData.sku,
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        category_id: parseInt(formData.category_id),
        stock_quantity: parseInt(formData.stock_quantity),
        minimum_stock: parseInt(formData.minimum_stock),
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        images: formData.images,
        variants: formData.variants,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
      };

      if (isEditing) {
        await sellerApi.products.update(id!, payload);
        toast({
          title: language === "en" ? "Success" : "نجاح",
          description: language === "en" ? "Product updated successfully" : "تم تحديث المنتج بنجاح",
        });
      } else {
        await sellerApi.products.create(payload);
        toast({
          title: language === "en" ? "Success" : "نجاح",
          description: language === "en" ? "Product created successfully" : "تم إنشاء المنتج بنجاح",
        });
      }
      navigate("/seller/products");
    } catch (error: any) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: error.message || (language === "en" ? "Failed to save product" : "فشل في حفظ المنتج"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        { size: "", color: "", stock_quantity: 0, price_adjustment: 0, sku_suffix: "" },
      ],
    });
  };

  const removeVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    });
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setFormData({ ...formData, variants: updatedVariants });
  };

  const addImage = () => {
    const url = prompt(language === "en" ? "Enter image URL:" : "أدخل رابط الصورة:");
    if (url) {
      setFormData({ ...formData, images: [...formData.images, url] });
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/seller/products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            {isEditing
              ? language === "en" ? "Edit Product" : "تعديل المنتج"
              : language === "en" ? "Add New Product" : "إضافة منتج جديد"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === "en"
              ? "Fill in the product details below"
              : "املأ تفاصيل المنتج أدناه"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Basic Information" : "المعلومات الأساسية"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{language === "en" ? "Product Name (English)" : "اسم المنتج (إنجليزي)"}</Label>
                    <Input
                      value={formData.name_en}
                      onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{language === "en" ? "Product Name (Arabic)" : "اسم المنتج (عربي)"}</Label>
                    <Input
                      value={formData.name_ar}
                      onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{language === "en" ? "Description (English)" : "الوصف (إنجليزي)"}</Label>
                  <Textarea
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{language === "en" ? "Description (Arabic)" : "الوصف (عربي)"}</Label>
                  <Textarea
                    value={formData.description_ar}
                    onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                    rows={4}
                    dir="rtl"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{language === "en" ? "SKU" : "رمز المنتج"}</Label>
                    <Input
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{language === "en" ? "Category" : "الفئة"}</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === "en" ? "Select category" : "اختر الفئة"} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Pricing & Inventory" : "التسعير والمخزون"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{language === "en" ? "Price" : "السعر"}</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{language === "en" ? "Discount Price" : "سعر الخصم"}</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.discount_price}
                      onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{language === "en" ? "Stock Quantity" : "كمية المخزون"}</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{language === "en" ? "Minimum Stock Alert" : "تنبيه الحد الأدنى"}</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.minimum_stock}
                      onChange={(e) => setFormData({ ...formData, minimum_stock: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Variants */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {language === "en" ? "Product Variants" : "متغيرات المنتج"}
                  <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                    <Plus className="h-4 w-4 me-2" />
                    {language === "en" ? "Add Variant" : "إضافة متغير"}
                  </Button>
                </CardTitle>
                <CardDescription>
                  {language === "en"
                    ? "Add size, color variations for your product"
                    : "أضف متغيرات الحجم واللون لمنتجك"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.variants.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {language === "en" ? "No variants added" : "لم تتم إضافة متغيرات"}
                  </p>
                ) : (
                  formData.variants.map((variant, index) => (
                    <div key={index} className="grid grid-cols-5 gap-2 items-end p-4 border rounded-lg">
                      <div className="space-y-1">
                        <Label className="text-xs">{language === "en" ? "Size" : "الحجم"}</Label>
                        <Input
                          value={variant.size}
                          onChange={(e) => updateVariant(index, "size", e.target.value)}
                          placeholder="M, L, XL"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{language === "en" ? "Color" : "اللون"}</Label>
                        <Input
                          value={variant.color}
                          onChange={(e) => updateVariant(index, "color", e.target.value)}
                          placeholder="Black, White"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{language === "en" ? "Stock" : "المخزون"}</Label>
                        <Input
                          type="number"
                          min="0"
                          value={variant.stock_quantity}
                          onChange={(e) => updateVariant(index, "stock_quantity", parseInt(e.target.value))}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{language === "en" ? "Price +/-" : "تعديل السعر"}</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={variant.price_adjustment}
                          onChange={(e) => updateVariant(index, "price_adjustment", parseFloat(e.target.value))}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeVariant(index)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "SEO Settings" : "إعدادات السيو"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{language === "en" ? "Meta Title" : "عنوان السيو"}</Label>
                  <Input
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">{formData.meta_title.length}/60</p>
                </div>
                <div className="space-y-2">
                  <Label>{language === "en" ? "Meta Description" : "وصف السيو"}</Label>
                  <Textarea
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">{formData.meta_description.length}/160</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Status" : "الحالة"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>{language === "en" ? "Active" : "نشط"}</Label>
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>{language === "en" ? "Featured" : "مميز"}</Label>
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Product Images" : "صور المنتج"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Product ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" className="w-full" onClick={addImage}>
                  <Upload className="h-4 w-4 me-2" />
                  {language === "en" ? "Add Image" : "إضافة صورة"}
                </Button>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={loading} className="w-full">
                {loading
                  ? language === "en" ? "Saving..." : "جاري الحفظ..."
                  : isEditing
                    ? language === "en" ? "Update Product" : "تحديث المنتج"
                    : language === "en" ? "Create Product" : "إنشاء المنتج"}
              </Button>
              <Button type="button" variant="outline" asChild className="w-full">
                <Link to="/seller/products">
                  {language === "en" ? "Cancel" : "إلغاء"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SellerProductForm;
