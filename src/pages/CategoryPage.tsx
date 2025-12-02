import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/products/ProductCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { products, brands } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { SlidersHorizontal, X } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { cn } from "@/lib/utils";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const { language, t } = useLanguage();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");

  const categoryNames: Record<string, { en: string; ar: string }> = {
    men: { en: "Men's Collection", ar: "مجموعة الرجال" },
    women: { en: "Women's Collection", ar: "مجموعة النساء" },
    shoes: { en: "Shoes", ar: "الأحذية" },
    accessories: { en: "Accessories", ar: "الإكسسوارات" },
  };

  const categoryTitle = category ? categoryNames[category] || { en: "Products", ar: "المنتجات" } : { en: "All Products", ar: "جميع المنتجات" };

  const filteredProducts = useMemo(() => {
    let result = products;

    if (category) {
      result = result.filter((p) => p.category === category);
    }

    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    switch (sortBy) {
      case "price-low":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result = [...result].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        result = [...result].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [category, priceRange, selectedBrands, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 2000]);
    setSelectedBrands([]);
  };

  return (
    <>
      <Helmet>
        <title>{language === "ar" ? categoryTitle.ar : categoryTitle.en} | LUXE</title>
        <meta 
          name="description" 
          content={language === "ar" 
            ? `تسوق ${categoryTitle.ar} من لوكس - أزياء فاخرة بأفضل الأسعار`
            : `Shop ${categoryTitle.en} at LUXE - luxury fashion at the best prices`
          } 
        />
      </Helmet>
      <Layout>
        <div className="container mx-auto py-8 md:py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              {language === "ar" ? categoryTitle.ar : categoryTitle.en}
            </h1>
            <p className="text-muted-foreground">
              {t("products.showingResults").replace("{count}", filteredProducts.length.toString())}
            </p>
          </div>

          <div className="flex gap-8">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-32">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold">{t("products.filterBy")}</h2>
                  {(selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 2000) && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      {t("products.clearFilters")}
                    </Button>
                  )}
                </div>

                {/* Price Range */}
                <div className="mb-8">
                  <h3 className="font-medium mb-4">{t("products.price")}</h3>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={2000}
                    step={50}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>

                {/* Brands */}
                <div className="mb-8">
                  <h3 className="font-medium mb-4">{t("products.brand")}</h3>
                  <div className="space-y-3">
                    {brands.map((brand) => (
                      <label key={brand} className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => toggleBrand(brand)}
                        />
                        <span className="text-sm">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <Button
                  variant="outline"
                  className="lg:hidden"
                  onClick={() => setFiltersOpen(true)}
                >
                  <SlidersHorizontal className="h-4 w-4 me-2" />
                  {t("products.filterBy")}
                </Button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-secondary border-none rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="featured">{t("products.sortBy")}: Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="animate-fade-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">{t("products.noProducts")}</p>
                  <Button variant="outline" className="mt-4" onClick={clearFilters}>
                    {t("products.clearFilters")}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Filters Sheet */}
          <div
            className={cn(
              "fixed inset-0 z-50 lg:hidden transition-opacity duration-300",
              filtersOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <div className="absolute inset-0 bg-foreground/50" onClick={() => setFiltersOpen(false)} />
            <div
              className={cn(
                "absolute top-0 start-0 h-full w-80 max-w-full bg-background p-6 overflow-y-auto transition-transform duration-300",
                filtersOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg">{t("products.filterBy")}</h2>
                <Button variant="ghost" size="icon" onClick={() => setFiltersOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="font-medium mb-4">{t("products.price")}</h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={2000}
                  step={50}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Brands */}
              <div className="mb-8">
                <h3 className="font-medium mb-4">{t("products.brand")}</h3>
                <div className="space-y-3">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={() => toggleBrand(brand)}
                      />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={clearFilters}>
                  {t("products.clearFilters")}
                </Button>
                <Button className="flex-1" onClick={() => setFiltersOpen(false)}>
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default CategoryPage;
