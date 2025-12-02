import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Helmet } from "react-helmet-async";

const CartPage = () => {
  const { language, t } = useLanguage();
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  const shippingCost = totalPrice >= 200 ? 0 : 15;
  const finalTotal = totalPrice + shippingCost;

  return (
    <>
      <Helmet>
        <title>{t("cart.title")} | LUXE</title>
      </Helmet>
      <Layout>
        <div className="container mx-auto py-8 md:py-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">{t("cart.title")}</h1>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground mb-6">{t("cart.empty")}</p>
              <Link to="/products">
                <Button variant="gold" size="lg">
                  {t("cart.continueShopping")}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="card-luxury rounded-sm p-4 flex gap-4"
                  >
                    <Link to={`/product/${item.id}`} className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={language === "ar" ? item.nameAr : item.name}
                        className="w-24 h-32 object-cover rounded-sm"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.id}`}>
                        <h3 className="font-medium hover:text-accent transition-colors">
                          {language === "ar" ? item.nameAr : item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.size && `${t("products.size")}: ${item.size}`}
                        {item.color && ` | ${t("products.color")}: ${item.color}`}
                      </p>
                      <p className="font-semibold mt-2">${item.price}</p>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="card-luxury rounded-sm p-6 sticky top-32">
                  <h2 className="font-display text-xl font-semibold mb-6">
                    {language === "ar" ? "ملخص الطلب" : "Order Summary"}
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("cart.shipping")}</span>
                      <span>{shippingCost === 0 ? (language === "ar" ? "مجاني" : "Free") : `$${shippingCost}`}</span>
                    </div>
                    {shippingCost > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {language === "ar" 
                          ? "أضف $" + (200 - totalPrice).toFixed(2) + " للشحن المجاني"
                          : "Add $" + (200 - totalPrice).toFixed(2) + " for free shipping"
                        }
                      </p>
                    )}
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>{t("cart.total")}</span>
                        <span>${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Link to="/checkout">
                    <Button variant="gold" size="lg" className="w-full">
                      {t("cart.checkout")}
                    </Button>
                  </Link>

                  <Link to="/products" className="block text-center mt-4">
                    <Button variant="ghost" className="text-sm">
                      {t("cart.continueShopping")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default CartPage;
