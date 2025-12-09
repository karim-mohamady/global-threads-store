<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Coupon;
use App\Models\Banner;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@globalthreads.com',
            'password' => Hash::make('password123'),
            'phone' => '+1234567890',
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
         User::create([
            'first_name' => 'karim',
            'last_name' => 'Developer',
            'email' => 'karimmohamadiy4@gmail.com',
            'password' => Hash::make('12345678'),
            'phone' => '+01017238942',
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create test customer
        User::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'customer@globalthreads.com',
            'password' => Hash::make('password123'),
            'phone' => '+1987654321',
            'role' => 'customer',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create categories
        $clothingCategory = Category::create([
            'slug' => 'clothing',
            'image_url' => 'https://via.placeholder.com/640x480?text=Clothing',
            'sort_order' => 1,
            'is_active' => true,
        ]);
        $clothingCategory->setTranslation('name', 'en', 'Clothing');
        $clothingCategory->setTranslation('name', 'ar', 'الملابس');
        $clothingCategory->setTranslation('description', 'en', 'Men and women clothing');
        $clothingCategory->setTranslation('description', 'ar', 'ملابس الرجال والنساء');
        $clothingCategory->save();

        $shoesCategory = Category::create([
            'slug' => 'shoes',
            'image_url' => 'https://via.placeholder.com/640x480?text=Shoes',
            'sort_order' => 2,
            'is_active' => true,
        ]);
        $shoesCategory->setTranslation('name', 'en', 'Shoes');
        $shoesCategory->setTranslation('name', 'ar', 'أحذية');
        $shoesCategory->setTranslation('description', 'en', 'Comfortable shoes for every occasion');
        $shoesCategory->setTranslation('description', 'ar', 'أحذية مريحة لكل المناسبات');
        $shoesCategory->save();

        $accessoriesCategory = Category::create([
            'slug' => 'accessories',
            'image_url' => 'https://via.placeholder.com/640x480?text=Accessories',
            'sort_order' => 3,
            'is_active' => true,
        ]);
        $accessoriesCategory->setTranslation('name', 'en', 'Accessories');
        $accessoriesCategory->setTranslation('name', 'ar', 'الملحقات');
        $accessoriesCategory->setTranslation('description', 'en', 'Bags, belts, and more');
        $accessoriesCategory->setTranslation('description', 'ar', 'حقائب وأحزمة والمزيد');
        $accessoriesCategory->save();

        // Create products
        $products = [
            [
                'category' => $clothingCategory,
                'sku' => 'TSH-001',
                'name_en' => 'Classic Cotton T-Shirt',
                'name_ar' => 'تيشيرت قطن كلاسيكي',
                'desc_en' => 'Comfortable 100% cotton t-shirt',
                'desc_ar' => 'تيشيرت قطن مريح 100%',
                'price' => 29.99,
                'stock' => 150,
            ],
            [
                'category' => $clothingCategory,
                'sku' => 'JNS-001',
                'name_en' => 'Blue Denim Jeans',
                'name_ar' => 'جينز أزرق',
                'desc_en' => 'Premium quality denim jeans',
                'desc_ar' => 'جينز عالي الجودة',
                'price' => 79.99,
                'stock' => 100,
            ],
            [
                'category' => $shoesCategory,
                'sku' => 'SNK-001',
                'name_en' => 'White Running Sneakers',
                'name_ar' => 'أحذية رياضية بيضاء',
                'desc_en' => 'Professional running shoes',
                'desc_ar' => 'أحذية جري احترافية',
                'price' => 119.99,
                'stock' => 80,
            ],
            [
                'category' => $shoesCategory,
                'sku' => 'BTN-001',
                'name_en' => 'Leather Boots',
                'name_ar' => 'أحذية جلدية',
                'desc_en' => 'Classic leather boots',
                'desc_ar' => 'أحذية جلدية كلاسيكية',
                'price' => 189.99,
                'stock' => 50,
            ],
            [
                'category' => $accessoriesCategory,
                'sku' => 'BAG-001',
                'name_en' => 'Black Leather Backpack',
                'name_ar' => 'حقيبة ظهر جلدية سوداء',
                'desc_en' => 'Stylish leather backpack',
                'desc_ar' => 'حقيبة ظهر جلدية أنيقة',
                'price' => 99.99,
                'stock' => 60,
            ],
        ];

        foreach ($products as $productData) {
            $product = Product::create([
                'category_id' => $productData['category']->id,
                'sku' => $productData['sku'],
                'price' => $productData['price'],
                'cost' => $productData['price'] * 0.5,
                'discount_price' => $productData['price'] * 0.8,
                'stock_quantity' => $productData['stock'],
                'minimum_stock' => 10,
                'image_url' => 'https://via.placeholder.com/640x480?text=' . urlencode($productData['sku']),
                'is_featured' => true,
                'is_active' => true,
            ]);

            $product->setTranslation('name', 'en', $productData['name_en']);
            $product->setTranslation('name', 'ar', $productData['name_ar']);
            $product->setTranslation('description', 'en', $productData['desc_en']);
            $product->setTranslation('description', 'ar', $productData['desc_ar']);
            $product->save();
        }

        // Create coupons
        Coupon::create([
            'code' => 'WELCOME10',
            'description' => 'Welcome discount',
            'discount_type' => 'percentage',
            'discount_value' => 10,
            'valid_from' => Carbon::now(),
            'valid_until' => Carbon::now()->addMonths(3),
            'is_active' => true,
        ]);

        Coupon::create([
            'code' => 'SUMMER20',
            'description' => 'Summer sale',
            'discount_type' => 'percentage',
            'discount_value' => 20,
            'minimum_purchase' => 100,
            'valid_from' => Carbon::now(),
            'valid_until' => Carbon::now()->addMonths(1),
            'is_active' => true,
        ]);

        // Create banners
        $banner = Banner::create([
            'image_url' => 'https://via.placeholder.com/1200x300?text=Summer+Sale',
            'link' => '/products',
            'position' => 'homepage',
            'sort_order' => 1,
            'is_active' => true,
        ]);
        $banner->setTranslation('title', 'en', 'Summer Sale');
        $banner->setTranslation('title', 'ar', 'تخفيض الصيف');
        $banner->setTranslation('description', 'en', 'Get up to 50% off on selected items');
        $banner->setTranslation('description', 'ar', 'احصل على خصم يصل إلى 50٪ على العناصر المختارة');
        $banner->save();
    }
}
