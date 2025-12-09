import { useState, useEffect } from "react";
import { Store, Upload, Save } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { sellerApi } from "@/services/api";

interface StoreData {
  store_name: string;
  store_description: string;
  store_logo: string;
  store_banner: string;
  business_type: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  social_facebook: string;
  social_instagram: string;
  social_twitter: string;
  return_policy: string;
  shipping_policy: string;
}

const SellerStore = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<StoreData>({
    store_name: "",
    store_description: "",
    store_logo: "",
    store_banner: "",
    business_type: "",
    address: "",
    city: "",
    country: "",
    phone: "",
    email: "",
    website: "",
    social_facebook: "",
    social_instagram: "",
    social_twitter: "",
    return_policy: "",
    shipping_policy: "",
  });

  useEffect(() => {
    loadStore();
  }, []);

  const loadStore = async () => {
    try {
      const response = await sellerApi.store.get();
      if (response.data) {
        setFormData({ ...formData, ...response.data });
      }
    } catch (error) {
      // Mock data for demo
      setFormData({
        ...formData,
        store_name: "My Fashion Store",
        store_description: "Premium quality fashion products",
        business_type: "individual",
        city: "New York",
        country: "USA",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await sellerApi.store.update(formData);
      toast({
        title: language === "en" ? "Success" : "نجاح",
        description: language === "en" ? "Store settings saved" : "تم حفظ إعدادات المتجر",
      });
    } catch (error: any) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const setImageUrl = (field: "store_logo" | "store_banner") => {
    const url = prompt(language === "en" ? "Enter image URL:" : "أدخل رابط الصورة:");
    if (url) {
      setFormData({ ...formData, [field]: url });
    }
  };

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
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">
          {language === "en" ? "My Store" : "متجري"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === "en" ? "Customize your store profile" : "خصص ملف متجرك"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Store Information" : "معلومات المتجر"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{language === "en" ? "Store Name" : "اسم المتجر"}</Label>
                  <Input
                    value={formData.store_name}
                    onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{language === "en" ? "Description" : "الوصف"}</Label>
                  <Textarea
                    value={formData.store_description}
                    onChange={(e) => setFormData({ ...formData, store_description: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{language === "en" ? "Business Type" : "نوع العمل"}</Label>
                  <Select
                    value={formData.business_type}
                    onValueChange={(value) => setFormData({ ...formData, business_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === "en" ? "Select type" : "اختر النوع"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">{language === "en" ? "Individual" : "فرد"}</SelectItem>
                      <SelectItem value="company">{language === "en" ? "Company" : "شركة"}</SelectItem>
                      <SelectItem value="brand">{language === "en" ? "Brand" : "علامة تجارية"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Contact Information" : "معلومات الاتصال"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{language === "en" ? "Phone" : "الهاتف"}</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{language === "en" ? "Email" : "البريد الإلكتروني"}</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{language === "en" ? "Address" : "العنوان"}</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{language === "en" ? "City" : "المدينة"}</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{language === "en" ? "Country" : "الدولة"}</Label>
                    <Input
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{language === "en" ? "Website" : "الموقع الإلكتروني"}</Label>
                  <Input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Social Media" : "وسائل التواصل"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Facebook</Label>
                  <Input
                    value={formData.social_facebook}
                    onChange={(e) => setFormData({ ...formData, social_facebook: e.target.value })}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Instagram</Label>
                  <Input
                    value={formData.social_instagram}
                    onChange={(e) => setFormData({ ...formData, social_instagram: e.target.value })}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Twitter</Label>
                  <Input
                    value={formData.social_twitter}
                    onChange={(e) => setFormData({ ...formData, social_twitter: e.target.value })}
                    placeholder="https://twitter.com/..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Policies */}
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Store Policies" : "سياسات المتجر"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{language === "en" ? "Return Policy" : "سياسة الإرجاع"}</Label>
                  <Textarea
                    value={formData.return_policy}
                    onChange={(e) => setFormData({ ...formData, return_policy: e.target.value })}
                    rows={4}
                    placeholder={language === "en" ? "Describe your return policy..." : "صف سياسة الإرجاع الخاصة بك..."}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{language === "en" ? "Shipping Policy" : "سياسة الشحن"}</Label>
                  <Textarea
                    value={formData.shipping_policy}
                    onChange={(e) => setFormData({ ...formData, shipping_policy: e.target.value })}
                    rows={4}
                    placeholder={language === "en" ? "Describe your shipping policy..." : "صف سياسة الشحن الخاصة بك..."}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Logo */}
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Store Logo" : "شعار المتجر"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-square bg-secondary rounded-lg overflow-hidden flex items-center justify-center">
                  {formData.store_logo ? (
                    <img
                      src={formData.store_logo}
                      alt="Store logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Store className="h-16 w-16 text-muted-foreground" />
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setImageUrl("store_logo")}
                >
                  <Upload className="h-4 w-4 me-2" />
                  {language === "en" ? "Upload Logo" : "رفع الشعار"}
                </Button>
              </CardContent>
            </Card>

            {/* Banner */}
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Store Banner" : "بانر المتجر"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-secondary rounded-lg overflow-hidden flex items-center justify-center">
                  {formData.store_banner ? (
                    <img
                      src={formData.store_banner}
                      alt="Store banner"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Store className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setImageUrl("store_banner")}
                >
                  <Upload className="h-4 w-4 me-2" />
                  {language === "en" ? "Upload Banner" : "رفع البانر"}
                </Button>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button type="submit" className="w-full" disabled={saving}>
              <Save className="h-4 w-4 me-2" />
              {saving
                ? language === "en" ? "Saving..." : "جاري الحفظ..."
                : language === "en" ? "Save Changes" : "حفظ التغييرات"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SellerStore;
