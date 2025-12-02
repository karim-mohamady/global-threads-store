import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter */}
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto py-12">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-display text-2xl mb-2">{t("footer.newsletter")}</h3>
            <p className="text-primary-foreground/70 text-sm mb-6">
              {t("hero.subtitle")}
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={t("footer.emailPlaceholder")}
                className="flex-1 px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-sm text-sm placeholder:text-primary-foreground/50 focus:outline-none focus:border-accent"
              />
              <Button variant="gold" className="px-8">
                {t("footer.subscribe")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="font-display text-2xl font-bold tracking-wider">
              LUXE
            </Link>
            <p className="mt-4 text-sm text-primary-foreground/70 leading-relaxed">
              Curating timeless elegance since 2024. Premium fashion for the discerning individual.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-medium mb-4 tracking-wider text-sm uppercase">Shop</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><Link to="/category/men" className="hover:text-accent transition-colors">{t("nav.men")}</Link></li>
              <li><Link to="/category/women" className="hover:text-accent transition-colors">{t("nav.women")}</Link></li>
              <li><Link to="/category/shoes" className="hover:text-accent transition-colors">{t("nav.shoes")}</Link></li>
              <li><Link to="/category/accessories" className="hover:text-accent transition-colors">{t("nav.accessories")}</Link></li>
              <li><Link to="/new-arrivals" className="hover:text-accent transition-colors">{t("nav.newArrivals")}</Link></li>
              <li><Link to="/sale" className="hover:text-accent transition-colors">{t("nav.sale")}</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-medium mb-4 tracking-wider text-sm uppercase">Help</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><Link to="/contact" className="hover:text-accent transition-colors">{t("footer.contact")}</Link></li>
              <li><Link to="/shipping" className="hover:text-accent transition-colors">{t("footer.shipping")}</Link></li>
              <li><Link to="/returns" className="hover:text-accent transition-colors">{t("footer.returns")}</Link></li>
              <li><Link to="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-medium mb-4 tracking-wider text-sm uppercase">Legal</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><Link to="/privacy" className="hover:text-accent transition-colors">{t("footer.privacy")}</Link></li>
              <li><Link to="/terms" className="hover:text-accent transition-colors">{t("footer.terms")}</Link></li>
              <li><Link to="/about" className="hover:text-accent transition-colors">{t("footer.about")}</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto py-6">
          <p className="text-center text-xs text-primary-foreground/50">
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
