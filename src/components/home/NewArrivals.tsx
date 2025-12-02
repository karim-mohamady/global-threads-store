import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { products } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";
import { ArrowRight, ArrowLeft } from "lucide-react";

const NewArrivals = () => {
  const { t, dir } = useLanguage();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const newProducts = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {t("products.newArrivals")}
            </h2>
            <div className="w-16 h-0.5 bg-accent" />
          </div>
          <Link to="/new-arrivals">
            <Button variant="ghost" className="group">
              {t("categories.viewAll")}
              <Arrow className="h-4 w-4 ms-2 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {newProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
