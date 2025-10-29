import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Helper function to create slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  console.log("🧹 Cleaning existing data...");
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log("👤 Creating users...");
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "admin@jamde.com",
        name: "Admin User",
        password: bcrypt.hashSync("password123", 10),
        role: "ADMIN",
        image: "/images/image 1.jpg",
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: "customer1@jamde.com",
        name: "John Doe",
        password: bcrypt.hashSync("password123", 10),
        role: "CUSTOMER",
        image: "/images/image 2.jpg",
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: "customer2@jamde.com",
        name: "Jane Smith",
        password: bcrypt.hashSync("password123", 10),
        role: "CUSTOMER",
        image: "/images/image 3.jpg",
        emailVerified: new Date(),
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create categories with images
  console.log("📂 Creating categories...");
  const categoryData = [
    {
      name: "Fashion & Accessories",
      description: "Discover trendy fashion pieces and stylish accessories for every occasion.",
      image: "/images/image 4.jpg",
    },
    {
      name: "Home & Living",
      description: "Transform your living space with beautiful home decor and essentials.",
      image: "/images/image 5.jpg",
    },
    {
      name: "Art & Collectibles",
      description: "Unique artworks and collectible items for art enthusiasts and collectors.",
      image: "/images/image 6.jpg",
    },
    {
      name: "Crafts & Handmade Items",
      description: "Handcrafted treasures made with love and attention to detail.",
      image: "/images/image 7.jpg",
    },
    {
      name: "Custom & Made-to-Order",
      description: "Personalized items tailored to your specific needs and preferences.",
      image: "/images/image 8.jpg",
    },
  ];

  const categories = await Promise.all(
    categoryData.map((cat) =>
      prisma.category.create({
        data: {
          name: cat.name,
          slug: createSlug(cat.name),
          description: cat.description,
          image: cat.image,
        },
      })
    )
  );

  console.log(`✅ Created ${categories.length} categories`);

  // Create products (2 per category)
  console.log("🛍️ Creating products...");
  const productData = [
    // Fashion & Accessories
    {
      name: "Vintage Leather Handbag",
      description: "Beautifully crafted vintage-style leather handbag with adjustable strap. Perfect for everyday use or special occasions. Made from premium genuine leather with brass hardware.",
      price: 129.99,
      compareAtPrice: 179.99,
      sku: "FASH-001",
      stock: 25,
      images: ["/images/fashion 9.jpg", "/images/fashion 10.jpg"],
      featured: true,
      categoryIndex: 0,
    },
    {
      name: "Designer Sunglasses",
      description: "High-quality UV protection sunglasses with polarized lenses. Lightweight frame design with comfortable nose pads. Available in multiple colors.",
      price: 89.99,
      compareAtPrice: 129.99,
      sku: "FASH-002",
      stock: 40,
      images: ["/images/fashion 11.jpg"],
      featured: false,
      categoryIndex: 0,
    },
    // Home & Living
    {
      name: "Modern Ceramic Vase Set",
      description: "Elegant set of three ceramic vases in various sizes. Perfect for adding a touch of sophistication to any room. Minimalist design that complements any decor style.",
      price: 79.99,
      compareAtPrice: 99.99,
      sku: "HOME-001",
      stock: 30,
      images: ["/images/home 14.jpg", "/images/home 16.jpg"],
      featured: true,
      categoryIndex: 1,
    },
    {
      name: "Cozy Throw Blanket",
      description: "Ultra-soft acrylic blend throw blanket. Machine washable and available in multiple colors. Perfect for curling up on the couch or adding warmth to your bedroom.",
      price: 45.99,
      compareAtPrice: 65.99,
      sku: "HOME-002",
      stock: 50,
      images: ["/images/home 17.jpg"],
      featured: false,
      categoryIndex: 1,
    },
    // Art & Collectibles
    {
      name: "Original Abstract Canvas Art",
      description: "Hand-painted abstract artwork on high-quality canvas. Each piece is unique and signed by the artist. Ready to hang with included mounting hardware.",
      price: 349.99,
      compareAtPrice: 449.99,
      sku: "ART-001",
      stock: 5,
      images: ["/images/home 18.jpg"],
      featured: true,
      categoryIndex: 2,
    },
    {
      name: "Vintage Vinyl Record Collection",
      description: "Curated collection of classic vinyl records from the 60s and 70s. Includes iconic albums from various artists. Perfect for collectors and music enthusiasts.",
      price: 199.99,
      compareAtPrice: 249.99,
      sku: "ART-002",
      stock: 8,
      images: ["/images/fashion 12.jpg"],
      featured: false,
      categoryIndex: 2,
    },
    // Crafts & Handmade Items
    {
      name: "Handwoven Macramé Wall Hanging",
      description: "Beautifully handcrafted macramé wall hanging made with premium cotton cord. Adds bohemian flair to any space. Each piece is unique and made by skilled artisans.",
      price: 65.99,
      compareAtPrice: 85.99,
      sku: "CRAFT-001",
      stock: 15,
      images: ["/images/craft 1.jpg"],
      featured: true,
      categoryIndex: 3,
    },
    {
      name: "Artisan Soap Gift Set",
      description: "Luxurious set of handmade soaps in various scents. Made with natural ingredients including shea butter and essential oils. Perfect gift set or personal indulgence.",
      price: 34.99,
      compareAtPrice: 49.99,
      sku: "CRAFT-002",
      stock: 35,
      images: ["/images/craft 2.jpg"],
      featured: false,
      categoryIndex: 3,
    },
    // Custom & Made-to-Order
    {
      name: "Personalized Engraved Watch",
      description: "Elegant timepiece with custom engraving option. Choose from multiple styles and add personal message or initials. Premium movement with leather or metal strap options.",
      price: 159.99,
      compareAtPrice: 199.99,
      sku: "CUSTOM-001",
      stock: 12,
      images: ["/images/custom 13.jpg"],
      featured: true,
      categoryIndex: 4,
    },
    {
      name: "Custom Portrait Painting",
      description: "Commission a custom portrait painted from your photo. Available in various sizes and styles. Includes consultations with artist to ensure perfect results.",
      price: 299.99,
      compareAtPrice: 399.99,
      sku: "CUSTOM-002",
      stock: 3,
      images: ["/images/custom 15.jpg"],
      featured: false,
      categoryIndex: 4,
    },
  ];

  const products = await Promise.all(
    productData.map((prod) =>
      prisma.product.create({
        data: {
          name: prod.name,
          slug: createSlug(prod.name),
          description: prod.description,
          price: prod.price,
          compareAtPrice: prod.compareAtPrice,
          sku: prod.sku,
          stock: prod.stock,
          images: prod.images,
          featured: prod.featured,
          active: true,
          categoryId: categories[prod.categoryIndex].id,
        },
      })
    )
  );

  console.log(`✅ Created ${products.length} products`);

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

