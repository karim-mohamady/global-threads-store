import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Helmet } from "react-helmet-async";
import { toast } from "@/hooks/use-toast";
import { CreditCard, Banknote } from "lucide-react";

const CheckoutPage = () => {
  const { language, t } = useLanguage();
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);

  const shippingCost = totalPrice >= 200 ? 0 : 15;
  const finalTotal = totalPrice + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    clearCart();
    toast({
      title: t("common.success"),
      description: language === "ar" ? "تم تأكيد طلبك بنجاح" : "Your order has been confirmed",
    });
    navigate("/");
    setLoading(false);
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{t("checkout.title")} | LUXE</title>
      </Helmet>
      <Layout>
        <div className="container mx-auto py-8 md:py-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">{t("checkout.title")}</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Shipping & Payment */}
              <div className="lg:col-span-2 space-y-8">
                {/* Shipping Address */}
                <div className="card-luxury rounded-sm p-6">
                  <h2 className="font-display text-xl font-semibold mb-6">
                    {t("checkout.shippingAddress")}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">{t("checkout.firstName")}</Label>
                      <Input id="firstName" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">{t("checkout.lastName")}</Label>
                      <Input id="lastName" required className="mt-1" />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="email">{t("checkout.email")}</Label>
                      <Input id="email" type="email" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="phone">{t("checkout.phone")}</Label>
                      <Input id="phone" type="tel" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="city">{t("checkout.city")}</Label>
                      <Input id="city" required className="mt-1" />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">{t("checkout.address")}</Label>
                      <Input id="address" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="country">{t("checkout.country")}</Label>
                      <Input id="country" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">{t("checkout.postalCode")}</Label>
                      <Input id="postalCode" required className="mt-1" />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="card-luxury rounded-sm p-6">
                  <h2 className="font-display text-xl font-semibold mb-6">
                    {t("checkout.paymentMethod")}
                  </h2>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse p-4 border rounded-sm hover:border-accent transition-colors cursor-pointer">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Banknote className="h-5 w-5 text-accent" />
                        {t("checkout.cashOnDelivery")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse p-4 border rounded-sm hover:border-accent transition-colors cursor-pointer mt-3">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5 text-accent" />
                        {t("checkout.creditCard")}
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-1" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" className="mt-1" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="card-luxury rounded-sm p-6 sticky top-32">
                  <h2 className="font-display text-xl font-semibold mb-6">
                    {t("checkout.orderSummary")}
                  </h2>

                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={language === "ar" ? item.nameAr : item.name}
                          className="w-16 h-20 object-cover rounded-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">
                            {language === "ar" ? item.nameAr : item.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t("products.quantity")}: {item.quantity}
                          </p>
                          <p className="text-sm font-semibold">${item.price * item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 border-t border-border pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("cart.shipping")}</span>
                      <span>{shippingCost === 0 ? (language === "ar" ? "مجاني" : "Free") : `$${shippingCost}`}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-3 border-t border-border">
                      <span>{t("cart.total")}</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    className="w-full mt-6"
                    disabled={loading}
                  >
                    {loading 
                      ? (language === "ar" ? "جاري المعالجة..." : "Processing...") 
                      : t("checkout.placeOrder")
                    }
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default CheckoutPage;
