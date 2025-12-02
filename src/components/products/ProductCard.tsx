import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Product } from "@/data/products";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { language, t } = useLanguage();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const name = language === "ar" ? product.nameAr : product.name;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      image: product.images[0],
      quantity: 1,
      size: product.sizes[0],
      color: product.colors[0]?.name,
    });
    toast({
      title: t("common.success"),
      description: `${name} ${language === "ar" ? "أضيف للسلة" : "added to cart"}`,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      image: product.images[0],
    });
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="card-luxury rounded-sm overflow-hidden">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
          <img
            src={product.images[0]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-3 start-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="px-2 py-1 bg-accent text-accent-foreground text-[10px] uppercase tracking-wider font-medium">
                {language === "ar" ? "جديد" : "New"}
              </span>
            )}
            {product.isOnSale && product.originalPrice && (
              <span className="px-2 py-1 bg-destructive text-destructive-foreground text-[10px] uppercase tracking-wider font-medium">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% {language === "ar" ? "خصم" : "Off"}
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 end-3 flex flex-col gap-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <Button
              variant="secondary"
              size="icon"
              className={cn(
                "h-9 w-9 rounded-full shadow-md",
                inWishlist && "bg-accent text-accent-foreground"
              )}
              onClick={handleToggleWishlist}
            >
              <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
            </Button>
          </div>

          {/* Add to Cart */}
          <div className="absolute bottom-0 inset-x-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button
              variant="default"
              className="w-full"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingBag className="h-4 w-4 me-2" />
              {product.inStock ? t("products.addToCart") : t("products.outOfStock")}
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {product.brand}
          </p>
          <h3 className="font-medium text-sm leading-tight line-clamp-2 mb-2 group-hover:text-accent transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {/* Colors */}
          {product.colors.length > 1 && (
            <div className="flex gap-1 mt-2">
              {product.colors.map((color) => (
                <span
                  key={color.name}
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: color.hex }}
                  title={language === "ar" ? color.nameAr : color.name}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
