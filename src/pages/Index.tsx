import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromoBanner from "@/components/home/PromoBanner";
import NewArrivals from "@/components/home/NewArrivals";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { language } = useLanguage();

  return (
    <>
      <Helmet>
        <title>LUXE | {language === "ar" ? "أزياء فاخرة" : "Luxury Fashion"}</title>
        <meta 
          name="description" 
          content={language === "ar" 
            ? "اكتشف مجموعتنا المختارة من الأزياء الفاخرة للرجال والنساء - ملابس، أحذية وإكسسوارات"
            : "Discover our curated collection of luxury fashion for men and women - clothing, shoes, and accessories"
          } 
        />
      </Helmet>
      <Layout>
        <HeroSection />
        <CategoriesSection />
        <FeaturedProducts />
        <PromoBanner />
        <NewArrivals />
      </Layout>
    </>
  );
};

export default Index;
