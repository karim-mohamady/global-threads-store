import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { toast } from "@/hooks/use-toast";
import { products } from "@/data/products";

const WishlistPage = () => {
  const { language, t } = useLanguage();
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (wishlistItem: typeof items[0]) => {
    const product = products.find(p => p.id === wishlistItem.id);
    addItem({
      id: wishlistItem.id,
      name: wishlistItem.name,
      nameAr: wishlistItem.nameAr,
      price: wishlistItem.price,
      image: wishlistItem.image,
      quantity: 1,
      size: product?.sizes[0],
      color: product?.colors[0]?.name,
    });
    toast({
      title: t("common.success"),
      description: language === "ar" ? "أضيف للسلة" : "Added to cart",
    });
  };

  return (
    <>
      <Helmet>
        <title>{t("account.wishlist")} | LUXE</title>
      </Helmet>
      <Layout>
        <div className="container mx-auto py-8 md:py-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">
            {t("account.wishlist")}
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground mb-6">
                {language === "ar" ? "قائمة المفضلة فارغة" : "Your wishlist is empty"}
              </p>
              <Link to="/products">
                <Button variant="gold" size="lg">
                  {language === "ar" ? "تصفح المنتجات" : "Browse Products"}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {items.map((item) => (
                <div key={item.id} className="card-luxury rounded-sm overflow-hidden group">
                  <Link to={`/product/${item.id}`} className="block">
                    <div className="relative aspect-[3/4] bg-secondary">
                      <img
                        src={item.image}
                        alt={language === "ar" ? item.nameAr : item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link to={`/product/${item.id}`}>
                      <h3 className="font-medium text-sm line-clamp-2 hover:text-accent transition-colors">
                        {language === "ar" ? item.nameAr : item.name}
                      </h3>
                    </Link>
                    <p className="font-semibold mt-2">${item.price}</p>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleAddToCart(item)}
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default WishlistPage;
