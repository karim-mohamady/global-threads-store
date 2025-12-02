import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const PromoBanner = () => {
  const { language, t } = useLanguage();

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto">
        <div className="relative overflow-hidden rounded-sm bg-primary text-primary-foreground">
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600"
              alt="Promo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 px-6 md:px-16 py-16 md:py-24">
            <div className="max-w-xl">
              <span className="inline-block px-4 py-1.5 bg-accent text-accent-foreground text-xs uppercase tracking-widest font-medium rounded-full mb-6">
                {language === "ar" ? "عرض حصري" : "Exclusive Offer"}
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {language === "ar" 
                  ? "خصم 30% على المجموعة الجديدة" 
                  : "30% Off New Collection"
                }
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                {language === "ar"
                  ? "استخدم الكود LUXE30 عند الدفع. العرض ساري حتى نهاية الشهر."
                  : "Use code LUXE30 at checkout. Offer valid until end of month."
                }
              </p>
              <Link to="/sale">
                <Button variant="gold" size="xl">
                  {t("hero.shopNow")}
                </Button>
              </Link>
            </div>
          </div>
          {/* Decorative */}
          <div className="absolute top-0 end-0 w-1/3 h-full opacity-30 hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-s from-accent/50 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
