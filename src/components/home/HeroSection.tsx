import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, ArrowLeft } from "lucide-react";

const HeroSection = () => {
  const { language, t, dir } = useLanguage();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <section className="relative min-h-[85vh] hero-gradient flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center md:text-start animate-fade-up">
            <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-xs uppercase tracking-widest font-medium rounded-full mb-6">
              {t("hero.newCollection")}
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              {t("hero.title")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto md:mx-0 mb-8">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/category/women">
                <Button variant="hero" size="xl" className="group">
                  {language === "ar" ? "تسوقي الآن" : "Shop Women"}
                  <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </Button>
              </Link>
              <Link to="/category/men">
                <Button variant="hero-outline" size="xl" className="group">
                  {language === "ar" ? "تسوق الآن" : "Shop Men"}
                  <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Images */}
          <div className="relative hidden md:block">
            <div className="relative animate-fade-up stagger-2">
              <div className="aspect-[3/4] rounded-sm overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800"
                  alt="Fashion"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-12 -start-12 w-2/3 aspect-[4/3] rounded-sm overflow-hidden shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"
                  alt="Fashion"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-8 -end-8 w-32 h-32 border-2 border-accent/30 rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 -end-4 w-16 h-16 bg-accent/20 rounded-full blur-xl" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 start-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
        <div className="w-6 h-10 border-2 border-foreground/20 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-foreground/40 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
