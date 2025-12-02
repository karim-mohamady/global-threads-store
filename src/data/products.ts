export interface Product {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: "men" | "women" | "shoes" | "accessories";
  subcategory: string;
  brand: string;
  sizes: string[];
  colors: { name: string; nameAr: string; hex: string }[];
  inStock: boolean;
  isNew: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  rating: number;
  reviewsCount: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Classic Wool Blazer",
    nameAr: "بليزر صوف كلاسيكي",
    description: "Timeless tailored blazer crafted from premium Italian wool. Perfect for formal occasions or elevating your everyday style.",
    descriptionAr: "بليزر أنيق مصنوع من الصوف الإيطالي الفاخر. مثالي للمناسبات الرسمية أو لإضفاء لمسة أناقة على إطلالتك اليومية.",
    price: 450,
    originalPrice: 550,
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"
    ],
    category: "men",
    subcategory: "blazers",
    brand: "LUXE",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Navy", nameAr: "كحلي", hex: "#1a2744" },
      { name: "Charcoal", nameAr: "فحمي", hex: "#36454F" }
    ],
    inStock: true,
    isNew: false,
    isFeatured: true,
    isBestSeller: true,
    isOnSale: true,
    rating: 4.8,
    reviewsCount: 124
  },
  {
    id: "2",
    name: "Silk Evening Dress",
    nameAr: "فستان سهرة حرير",
    description: "Elegant floor-length silk dress with a flattering silhouette. Features delicate beading and a sophisticated neckline.",
    descriptionAr: "فستان حرير أنيق طويل بقصة رائعة. يتميز بخرز دقيق وقصة رقبة راقية.",
    price: 890,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800"
    ],
    category: "women",
    subcategory: "dresses",
    brand: "LUXE",
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Champagne", nameAr: "شامبين", hex: "#F7E7CE" },
      { name: "Black", nameAr: "أسود", hex: "#000000" }
    ],
    inStock: true,
    isNew: true,
    isFeatured: true,
    isBestSeller: false,
    isOnSale: false,
    rating: 4.9,
    reviewsCount: 89
  },
  {
    id: "3",
    name: "Italian Leather Oxfords",
    nameAr: "حذاء أوكسفورد جلد إيطالي",
    description: "Handcrafted leather oxfords with Goodyear welt construction. A timeless investment piece for the discerning gentleman.",
    descriptionAr: "حذاء جلدي مصنوع يدوياً بتقنية Goodyear welt. قطعة استثمارية خالدة للرجل الأنيق.",
    price: 385,
    images: [
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800",
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800"
    ],
    category: "shoes",
    subcategory: "formal",
    brand: "LUXE",
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: [
      { name: "Brown", nameAr: "بني", hex: "#654321" },
      { name: "Black", nameAr: "أسود", hex: "#000000" }
    ],
    inStock: true,
    isNew: false,
    isFeatured: true,
    isBestSeller: true,
    isOnSale: false,
    rating: 4.7,
    reviewsCount: 203
  },
  {
    id: "4",
    name: "Designer Leather Handbag",
    nameAr: "حقيبة يد جلدية فاخرة",
    description: "Luxurious structured handbag in premium calfskin leather. Features gold-tone hardware and suede interior lining.",
    descriptionAr: "حقيبة يد فاخرة من جلد العجل الفاخر. تتميز بإكسسوارات ذهبية وبطانة داخلية من الجلد السويدي.",
    price: 1250,
    originalPrice: 1500,
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800"
    ],
    category: "accessories",
    subcategory: "bags",
    brand: "LUXE",
    sizes: ["One Size"],
    colors: [
      { name: "Tan", nameAr: "بيج", hex: "#D2B48C" },
      { name: "Black", nameAr: "أسود", hex: "#000000" }
    ],
    inStock: true,
    isNew: true,
    isFeatured: true,
    isBestSeller: false,
    isOnSale: true,
    rating: 4.9,
    reviewsCount: 67
  },
  {
    id: "5",
    name: "Cashmere Turtleneck",
    nameAr: "بلوفر كشمير برقبة عالية",
    description: "Ultra-soft pure cashmere turtleneck sweater. Lightweight yet warm, perfect for layering.",
    descriptionAr: "بلوفر كشمير نقي فائق النعومة. خفيف الوزن ودافئ، مثالي للتنسيق.",
    price: 320,
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800"
    ],
    category: "women",
    subcategory: "knitwear",
    brand: "LUXE",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Cream", nameAr: "كريمي", hex: "#FFFDD0" },
      { name: "Camel", nameAr: "جملي", hex: "#C19A6B" },
      { name: "Gray", nameAr: "رمادي", hex: "#808080" }
    ],
    inStock: true,
    isNew: false,
    isFeatured: false,
    isBestSeller: true,
    isOnSale: false,
    rating: 4.6,
    reviewsCount: 156
  },
  {
    id: "6",
    name: "Tailored Cotton Shirt",
    nameAr: "قميص قطن مفصل",
    description: "Impeccably tailored shirt in Egyptian cotton. Features mother-of-pearl buttons and French cuffs.",
    descriptionAr: "قميص مفصل بشكل متقن من القطن المصري. يتميز بأزرار من عرق اللؤلؤ وأكمام فرنسية.",
    price: 185,
    images: [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800"
    ],
    category: "men",
    subcategory: "shirts",
    brand: "LUXE",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", nameAr: "أبيض", hex: "#FFFFFF" },
      { name: "Light Blue", nameAr: "أزرق فاتح", hex: "#ADD8E6" }
    ],
    inStock: true,
    isNew: true,
    isFeatured: false,
    isBestSeller: false,
    isOnSale: false,
    rating: 4.5,
    reviewsCount: 98
  },
  {
    id: "7",
    name: "Suede Stiletto Heels",
    nameAr: "كعب عالي سويدي",
    description: "Elegant suede pumps with a sleek pointed toe and 10cm stiletto heel. Italian craftsmanship at its finest.",
    descriptionAr: "حذاء سويدي أنيق بمقدمة مدببة وكعب 10 سم. حرفية إيطالية في أفضل صورها.",
    price: 425,
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800"
    ],
    category: "shoes",
    subcategory: "heels",
    brand: "LUXE",
    sizes: ["36", "37", "38", "39", "40"],
    colors: [
      { name: "Red", nameAr: "أحمر", hex: "#8B0000" },
      { name: "Nude", nameAr: "نود", hex: "#E3BC9A" }
    ],
    inStock: true,
    isNew: false,
    isFeatured: true,
    isBestSeller: false,
    isOnSale: false,
    rating: 4.8,
    reviewsCount: 112
  },
  {
    id: "8",
    name: "Gold Chain Necklace",
    nameAr: "سلسلة ذهبية",
    description: "18k gold-plated chain necklace with minimalist design. Perfect for everyday elegance.",
    descriptionAr: "سلسلة مطلية بالذهب عيار 18 بتصميم بسيط. مثالية للأناقة اليومية.",
    price: 145,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800"
    ],
    category: "accessories",
    subcategory: "jewelry",
    brand: "LUXE",
    sizes: ["One Size"],
    colors: [
      { name: "Gold", nameAr: "ذهبي", hex: "#FFD700" }
    ],
    inStock: true,
    isNew: true,
    isFeatured: false,
    isBestSeller: true,
    isOnSale: false,
    rating: 4.7,
    reviewsCount: 234
  }
];

export const categories = [
  { id: "men", name: "Men", nameAr: "رجال", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800" },
  { id: "women", name: "Women", nameAr: "نساء", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800" },
  { id: "shoes", name: "Shoes", nameAr: "أحذية", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800" },
  { id: "accessories", name: "Accessories", nameAr: "إكسسوارات", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800" }
];

export const brands = ["LUXE", "Prada", "Gucci", "Versace", "Armani"];
