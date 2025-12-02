import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { categories } from "@/data/products";
import { ArrowRight, ArrowLeft } from "lucide-react";

const CategoriesSection = () => {
  const { language, t, dir } = useLanguage();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            {t("categories.title")}
          </h2>
          <div className="w-16 h-0.5 bg-accent mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="group relative aspect-[3/4] rounded-sm overflow-hidden animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={category.image}
                alt={language === "ar" ? category.nameAr : category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-6 text-primary-foreground">
                <h3 className="font-display text-xl md:text-2xl font-semibold mb-2">
                  {language === "ar" ? category.nameAr : category.name}
                </h3>
                <span className="inline-flex items-center text-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  {t("categories.viewAll")}
                  <Arrow className="h-4 w-4 ms-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
