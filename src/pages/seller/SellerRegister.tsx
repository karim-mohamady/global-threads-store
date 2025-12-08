import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Store,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  ArrowRight,
  ArrowLeft,
  Check,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Layout from "@/components/layout/Layout";
import { sellerApi } from "@/services/api";

const sellerSchema = z.object({
  store_name: z.string().min(2, "Store name must be at least 2 characters"),
  store_description: z.string().min(20, "Description must be at least 20 characters"),
  business_type: z.string().min(1, "Business type is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  phone: z.string().min(8, "Valid phone number is required"),
  tax_id: z.string().optional(),
  bank_name: z.string().min(2, "Bank name is required"),
  bank_account: z.string().min(5, "Bank account number is required"),
  terms_accepted: z.boolean().refine(val => val === true, "You must accept the terms"),
});

type SellerFormData = z.infer<typeof sellerSchema>;

const SellerRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, isSeller } = useAuth();
  const { language } = useLanguage();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm<SellerFormData>({
    resolver: zodResolver(sellerSchema),
    defaultValues: {
      terms_accepted: false,
    },
  });

  // Redirect if already a seller
  if (isSeller) {
    return <Navigate to="/seller" replace />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth?redirect=/seller/register" replace />;
  }

  const steps = [
    { number: 1, title: language === "en" ? "Store Info" : "معلومات المتجر", icon: Store },
    { number: 2, title: language === "en" ? "Address" : "العنوان", icon: MapPin },
    { number: 3, title: language === "en" ? "Payment" : "الدفع", icon: Building },
    { number: 4, title: language === "en" ? "Review" : "المراجعة", icon: FileText },
  ];

  const nextStep = async () => {
    let fieldsToValidate: (keyof SellerFormData)[] = [];
    
    if (step === 1) {
      fieldsToValidate = ["store_name", "store_description", "business_type"];
    } else if (step === 2) {
      fieldsToValidate = ["address", "city", "country", "phone"];
    } else if (step === 3) {
      fieldsToValidate = ["bank_name", "bank_account"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const onSubmit = async (data: SellerFormData) => {
    setIsSubmitting(true);
    try {
      const { terms_accepted, ...rest } = data;
      await sellerApi.register({
        store_name: rest.store_name,
        store_description: rest.store_description,
        business_type: rest.business_type,
        address: rest.address,
        city: rest.city,
        country: rest.country,
        phone: rest.phone,
        tax_id: rest.tax_id,
        bank_name: rest.bank_name,
        bank_account: rest.bank_account,
      });
      toast({
        title: language === "en" ? "Application Submitted!" : "تم تقديم الطلب!",
        description: language === "en"
          ? "Your seller application is under review. We'll notify you soon."
          : "طلب البائع الخاص بك قيد المراجعة. سنبلغك قريباً.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: error.message || (language === "en" ? "Failed to submit application" : "فشل في تقديم الطلب"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formData = watch();

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold">
              {language === "en" ? "Become a Seller" : "كن بائعاً"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {language === "en"
                ? "Start selling your products to millions of customers"
                : "ابدأ ببيع منتجاتك لملايين العملاء"}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between">
              {steps.map((s, index) => (
                <div key={s.number} className="flex flex-col items-center flex-1">
                  <div className="flex items-center w-full">
                    {index > 0 && (
                      <div
                        className={`flex-1 h-1 ${
                          step > s.number - 1 ? "bg-primary" : "bg-secondary"
                        }`}
                      />
                    )}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                        step >= s.number
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-secondary bg-background"
                      }`}
                    >
                      {step > s.number ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <s.icon className="h-5 w-5" />
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-1 ${
                          step > s.number ? "bg-primary" : "bg-secondary"
                        }`}
                      />
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 ${
                      step >= s.number ? "text-primary font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 && (language === "en" ? "Store Information" : "معلومات المتجر")}
                {step === 2 && (language === "en" ? "Business Address" : "عنوان العمل")}
                {step === 3 && (language === "en" ? "Payment Details" : "تفاصيل الدفع")}
                {step === 4 && (language === "en" ? "Review & Submit" : "المراجعة والتقديم")}
              </CardTitle>
              <CardDescription>
                {step === 1 && (language === "en" ? "Tell us about your store" : "أخبرنا عن متجرك")}
                {step === 2 && (language === "en" ? "Where is your business located?" : "أين يقع عملك؟")}
                {step === 3 && (language === "en" ? "How should we pay you?" : "كيف يجب أن ندفع لك؟")}
                {step === 4 && (language === "en" ? "Review your information and submit" : "راجع معلوماتك وقدم")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Step 1: Store Info */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="store_name">
                        {language === "en" ? "Store Name" : "اسم المتجر"}
                      </Label>
                      <Input
                        id="store_name"
                        placeholder={language === "en" ? "My Awesome Store" : "متجري الرائع"}
                        {...register("store_name")}
                      />
                      {errors.store_name && (
                        <p className="text-sm text-destructive">{errors.store_name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="store_description">
                        {language === "en" ? "Store Description" : "وصف المتجر"}
                      </Label>
                      <Textarea
                        id="store_description"
                        placeholder={language === "en" ? "Describe what you sell..." : "صف ما تبيعه..."}
                        rows={4}
                        {...register("store_description")}
                      />
                      {errors.store_description && (
                        <p className="text-sm text-destructive">{errors.store_description.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business_type">
                        {language === "en" ? "Business Type" : "نوع العمل"}
                      </Label>
                      <select
                        id="business_type"
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        {...register("business_type")}
                      >
                        <option value="">{language === "en" ? "Select type" : "اختر النوع"}</option>
                        <option value="individual">{language === "en" ? "Individual" : "فردي"}</option>
                        <option value="company">{language === "en" ? "Company" : "شركة"}</option>
                        <option value="brand">{language === "en" ? "Brand" : "علامة تجارية"}</option>
                      </select>
                      {errors.business_type && (
                        <p className="text-sm text-destructive">{errors.business_type.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Address */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">
                        {language === "en" ? "Street Address" : "عنوان الشارع"}
                      </Label>
                      <Input
                        id="address"
                        placeholder={language === "en" ? "123 Business St" : "123 شارع الأعمال"}
                        {...register("address")}
                      />
                      {errors.address && (
                        <p className="text-sm text-destructive">{errors.address.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">
                          {language === "en" ? "City" : "المدينة"}
                        </Label>
                        <Input
                          id="city"
                          placeholder={language === "en" ? "New York" : "القاهرة"}
                          {...register("city")}
                        />
                        {errors.city && (
                          <p className="text-sm text-destructive">{errors.city.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">
                          {language === "en" ? "Country" : "الدولة"}
                        </Label>
                        <Input
                          id="country"
                          placeholder={language === "en" ? "USA" : "مصر"}
                          {...register("country")}
                        />
                        {errors.country && (
                          <p className="text-sm text-destructive">{errors.country.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        {language === "en" ? "Business Phone" : "هاتف العمل"}
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 234 567 8900"
                        {...register("phone")}
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tax_id">
                        {language === "en" ? "Tax ID (Optional)" : "الرقم الضريبي (اختياري)"}
                      </Label>
                      <Input
                        id="tax_id"
                        placeholder={language === "en" ? "Tax identification number" : "رقم التعريف الضريبي"}
                        {...register("tax_id")}
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Payment */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bank_name">
                        {language === "en" ? "Bank Name" : "اسم البنك"}
                      </Label>
                      <Input
                        id="bank_name"
                        placeholder={language === "en" ? "Bank of America" : "البنك الأهلي"}
                        {...register("bank_name")}
                      />
                      {errors.bank_name && (
                        <p className="text-sm text-destructive">{errors.bank_name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bank_account">
                        {language === "en" ? "Bank Account Number" : "رقم الحساب البنكي"}
                      </Label>
                      <Input
                        id="bank_account"
                        placeholder="IBAN or Account Number"
                        {...register("bank_account")}
                      />
                      {errors.bank_account && (
                        <p className="text-sm text-destructive">{errors.bank_account.message}</p>
                      )}
                    </div>

                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        {language === "en"
                          ? "Your payment information is secure and will only be used for payouts."
                          : "معلومات الدفع الخاصة بك آمنة وستستخدم فقط للمدفوعات."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 4: Review */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-secondary/30 rounded-lg">
                        <h4 className="font-medium mb-2">
                          {language === "en" ? "Store Information" : "معلومات المتجر"}
                        </h4>
                        <p><strong>{language === "en" ? "Name:" : "الاسم:"}</strong> {formData.store_name}</p>
                        <p><strong>{language === "en" ? "Type:" : "النوع:"}</strong> {formData.business_type}</p>
                        <p className="text-sm text-muted-foreground mt-2">{formData.store_description}</p>
                      </div>

                      <div className="p-4 bg-secondary/30 rounded-lg">
                        <h4 className="font-medium mb-2">
                          {language === "en" ? "Business Address" : "عنوان العمل"}
                        </h4>
                        <p>{formData.address}</p>
                        <p>{formData.city}, {formData.country}</p>
                        <p>{formData.phone}</p>
                      </div>

                      <div className="p-4 bg-secondary/30 rounded-lg">
                        <h4 className="font-medium mb-2">
                          {language === "en" ? "Payment Details" : "تفاصيل الدفع"}
                        </h4>
                        <p><strong>{language === "en" ? "Bank:" : "البنك:"}</strong> {formData.bank_name}</p>
                        <p><strong>{language === "en" ? "Account:" : "الحساب:"}</strong> {formData.bank_account}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="terms_accepted"
                        {...register("terms_accepted")}
                      />
                      <Label htmlFor="terms_accepted" className="text-sm leading-relaxed">
                        {language === "en"
                          ? "I agree to the Seller Terms of Service and understand the commission structure."
                          : "أوافق على شروط خدمة البائع وأفهم هيكل العمولات."}
                      </Label>
                    </div>
                    {errors.terms_accepted && (
                      <p className="text-sm text-destructive">{errors.terms_accepted.message}</p>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  {step > 1 ? (
                    <Button type="button" variant="outline" onClick={prevStep}>
                      <ArrowLeft className="h-4 w-4 me-2" />
                      {language === "en" ? "Previous" : "السابق"}
                    </Button>
                  ) : (
                    <Button type="button" variant="outline" asChild>
                      <Link to="/">
                        {language === "en" ? "Cancel" : "إلغاء"}
                      </Link>
                    </Button>
                  )}

                  {step < 4 ? (
                    <Button type="button" onClick={nextStep}>
                      {language === "en" ? "Next" : "التالي"}
                      <ArrowRight className="h-4 w-4 ms-2" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting
                        ? (language === "en" ? "Submitting..." : "جاري التقديم...")
                        : (language === "en" ? "Submit Application" : "تقديم الطلب")}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <Store className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium">
                {language === "en" ? "Your Own Store" : "متجرك الخاص"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === "en"
                  ? "Custom storefront with your branding"
                  : "واجهة متجر مخصصة بعلامتك التجارية"}
              </p>
            </Card>
            <Card className="p-4 text-center">
              <User className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium">
                {language === "en" ? "Millions of Customers" : "ملايين العملاء"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === "en"
                  ? "Access to our growing customer base"
                  : "الوصول إلى قاعدة عملائنا المتنامية"}
              </p>
            </Card>
            <Card className="p-4 text-center">
              <Building className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium">
                {language === "en" ? "Easy Payouts" : "مدفوعات سهلة"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === "en"
                  ? "Fast and secure payment processing"
                  : "معالجة دفع سريعة وآمنة"}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SellerRegister;