import { useParams } from "react-router-dom";
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/products/ProductCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Heart, Minus, Plus, Star, Truck, RotateCcw, Shield } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const product = products.find((p) => p.id === id);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || null);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto py-16 text-center">
          <h1 className="text-2xl font-bold">{t("common.error")}</h1>
        </div>
      </Layout>
    );
  }

  const name = language === "ar" ? product.nameAr : product.name;
  const description = language === "ar" ? product.descriptionAr : product.description;
  const inWishlist = isInWishlist(product.id);

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      image: product.images[0],
      quantity,
      size: selectedSize,
      color: selectedColor?.name,
    });
    toast({
      title: t("common.success"),
      description: `${name} ${language === "ar" ? "أضيف للسلة" : "added to cart"}`,
    });
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      image: product.images[0],
    });
  };

  return (
    <>
      <Helmet>
        <title>{name} | LUXE</title>
        <meta name="description" content={description} />
      </Helmet>
      <Layout>
        <div className="container mx-auto py-8 md:py-12">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-sm overflow-hidden bg-secondary">
                <img
                  src={product.images[selectedImage]}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        "w-20 h-24 rounded-sm overflow-hidden border-2 transition-colors",
                        selectedImage === index ? "border-accent" : "border-transparent"
                      )}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  {product.brand}
                </p>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">{name}</h1>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < Math.floor(product.rating)
                            ? "fill-accent text-accent"
                            : "text-muted"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviewsCount} {t("products.reviews")})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">${product.price}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                      <span className="px-2 py-1 bg-destructive text-destructive-foreground text-xs rounded">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">{description}</p>

              {/* Colors */}
              {product.colors.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">
                    {t("products.color")}: {selectedColor && (language === "ar" ? selectedColor.nameAr : selectedColor.name)}
                  </h3>
                  <div className="flex gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "w-10 h-10 rounded-full border-2 transition-all",
                          selectedColor?.name === color.name
                            ? "border-accent scale-110"
                            : "border-border hover:border-muted-foreground"
                        )}
                        style={{ backgroundColor: color.hex }}
                        title={language === "ar" ? color.nameAr : color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              <div>
                <h3 className="font-medium mb-3">{t("products.size")}</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "px-4 py-2 border rounded-sm text-sm font-medium transition-colors",
                        selectedSize === size
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:border-foreground"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="font-medium mb-3">{t("products.quantity")}</h3>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="gold"
                  size="xl"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  {product.inStock ? t("products.addToCart") : t("products.outOfStock")}
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  onClick={handleToggleWishlist}
                  className={cn(inWishlist && "bg-accent/10 border-accent text-accent")}
                >
                  <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <Truck className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <p className="text-xs text-muted-foreground">
                    {language === "ar" ? "شحن مجاني" : "Free Shipping"}
                  </p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <p className="text-xs text-muted-foreground">
                    {language === "ar" ? "إرجاع سهل" : "Easy Returns"}
                  </p>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <p className="text-xs text-muted-foreground">
                    {language === "ar" ? "ضمان الجودة" : "Quality Guarantee"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 md:mt-24">
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">
                {t("products.relatedProducts")}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default ProductPage;
