import { db } from "../db";
import { products, blogPosts, exportMarkets, users } from "../shared/schema";
import bcrypt from "bcrypt";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await db.insert(users).values({
      username: "admin",
      password: hashedPassword,
      email: "admin@sakthisai.com",
      name: "Admin User",
      role: "admin",
    }).onConflictDoNothing();

    console.log("✅ Admin user created");

    // Seed Products
    const sampleProducts = [
      {
        name: "Zinc Sulphate Heptahydrate",
        category: "micronutrients",
        description: "High-quality zinc supplement for crops. Corrects zinc deficiency and improves crop yield. Essential for enzyme systems and protein synthesis in plants.",
        imageUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800",
        suitableCrops: ["Rice", "Wheat", "Maize", "Cotton", "Sugarcane", "Vegetables"],
        packingSizes: ["1 kg", "5 kg", "25 kg", "50 kg"],
        specifications: {
          "Zinc Content": "21% minimum",
          "Sulphur": "10-11%",
          "Form": "Crystalline powder",
          "Solubility": "High water solubility"
        },
        isActive: true,
      },
      {
        name: "Ferrous Sulphate",
        category: "micronutrients",
        description: "Premium iron supplement preventing chlorosis. Enhances photosynthesis and improves fruit quality. Critical for chlorophyll formation.",
        imageUrl: "https://images.unsplash.com/photo-1592501558881-bbf35bc7e3f2?w=800",
        suitableCrops: ["Citrus", "Apple", "Grapes", "Rice", "Vegetables", "Ornamentals"],
        packingSizes: ["1 kg", "5 kg", "25 kg", "50 kg"],
        specifications: {
          "Iron Content": "19% minimum",
          "Form": "Crystalline granules",
          "pH": "3.5-4.5",
          "Purity": "98%+"
        },
        isActive: true,
      },
      {
        name: "Manganese Sulphate",
        category: "micronutrients",
        description: "Essential manganese supplement for enzyme activation. Promotes healthy growth and disease resistance.",
        imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
        suitableCrops: ["Cereals", "Legumes", "Fruits", "Vegetables", "Oil seeds"],
        packingSizes: ["1 kg", "5 kg", "25 kg"],
        specifications: {
          "Manganese Content": "30% minimum",
          "Form": "Powder/Granules",
          "Solubility": "Readily soluble"
        },
        isActive: true,
      },
      {
        name: "Copper Sulphate",
        category: "micronutrients",
        description: "High-grade copper supplement with fungicidal properties. Enhances lignin formation and improves crop immunity.",
        imageUrl: "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=800",
        suitableCrops: ["Wheat", "Rice", "Fruits", "Vegetables", "Plantation crops"],
        packingSizes: ["500g", "1 kg", "5 kg", "25 kg"],
        specifications: {
          "Copper Content": "24-25%",
          "Form": "Blue crystals",
          "Grade": "Technical/Agricultural"
        },
        isActive: true,
      },
      {
        name: "Boron Fertilizer",
        category: "micronutrients",
        description: "Premium boron supplement for reproductive growth. Essential for flowering, fruiting, and seed development.",
        imageUrl: "https://images.unsplash.com/photo-1592894672532-28a683f33a89?w=800",
        suitableCrops: ["Cotton", "Groundnut", "Sunflower", "Fruits", "Vegetables"],
        packingSizes: ["500g", "1 kg", "5 kg"],
        specifications: {
          "Boron Content": "10.5-11%",
          "Form": "Powder",
          "Solubility": "High"
        },
        isActive: true,
      },
      {
        name: "Magnesium Sulphate",
        category: "micronutrients",
        description: "Epsom salt for magnesium supplementation. Boosts chlorophyll production and enzyme activation.",
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
        suitableCrops: ["All crops", "Vegetables", "Fruits", "Ornamentals"],
        packingSizes: ["1 kg", "5 kg", "25 kg", "50 kg"],
        specifications: {
          "Magnesium": "9.8% minimum",
          "Sulphur": "12-13%",
          "Form": "Crystals/Powder"
        },
        isActive: true,
      },
      {
        name: "NPK Complex with Micronutrients",
        category: "bio-fertilizers",
        description: "Balanced NPK with essential micronutrients. Complete nutrition for all growth stages.",
        imageUrl: "https://images.unsplash.com/photo-1628689469838-524a4a973b8e?w=800",
        suitableCrops: ["All crops", "Field crops", "Horticulture"],
        packingSizes: ["1 kg", "10 kg", "25 kg", "50 kg"],
        specifications: {
          "NPK": "19:19:19",
          "Micronutrients": "Zn, Fe, Mn, Cu, B",
          "Form": "Water soluble"
        },
        isActive: true,
      },
      {
        name: "Calcium Nitrate",
        category: "micronutrients",
        description: "Premium calcium and nitrogen source. Prevents blossom end rot and improves fruit quality.",
        imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800",
        suitableCrops: ["Tomato", "Pepper", "Fruits", "Greenhouse crops"],
        packingSizes: ["1 kg", "5 kg", "25 kg"],
        specifications: {
          "Nitrogen": "15.5%",
          "Calcium": "19%",
          "Solubility": "100%"
        },
        isActive: true,
      },
      {
        name: "Azotobacter Bio-fertilizer",
        category: "bio-fertilizers",
        description: "Nitrogen-fixing bacteria for sustainable agriculture. Reduces chemical fertilizer dependency.",
        imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
        suitableCrops: ["Rice", "Wheat", "Maize", "Vegetables", "Cotton"],
        packingSizes: ["250g", "500g", "1 kg"],
        specifications: {
          "CFU": "10^8 cells/ml",
          "Carrier": "Liquid/Powder",
          "Shelf life": "12 months"
        },
        isActive: true,
      },
      {
        name: "Humic Acid Granules",
        category: "growth-promoters",
        description: "Organic growth promoter improving nutrient uptake. Enhances soil fertility and root development.",
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
        suitableCrops: ["All crops", "Vegetables", "Fruits"],
        packingSizes: ["1 kg", "5 kg", "25 kg"],
        specifications: {
          "Humic Acid": "60% minimum",
          "Form": "Granular/Powder",
          "Organic Matter": "85%+"
        },
        isActive: true,
      },
      {
        name: "Seaweed Extract",
        category: "growth-promoters",
        description: "Natural plant growth stimulant. Rich in cytokinins, auxins, and micronutrients.",
        imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
        suitableCrops: ["All crops", "Vegetables", "Fruits", "Ornamentals"],
        packingSizes: ["250ml", "500ml", "1L", "5L"],
        specifications: {
          "Seaweed Extract": "40%",
          "Form": "Liquid concentrate",
          "pH": "8-10"
        },
        isActive: true,
      },
      {
        name: "Amino Acid Complex",
        category: "growth-promoters",
        description: "Free amino acids for stress recovery. Improves plant metabolism and yield quality.",
        imageUrl: "https://images.unsplash.com/photo-1628689469838-524a4a973b8e?w=800",
        suitableCrops: ["All crops", "Stress conditions"],
        packingSizes: ["250ml", "500ml", "1L"],
        specifications: {
          "Amino Acids": "25-30%",
          "Protein": "40-45%",
          "Form": "Liquid"
        },
        isActive: true,
      },
    ];

    await db.insert(products).values(sampleProducts).onConflictDoNothing();
    console.log("✅ Products seeded");

    // Seed Blog Posts
    const sampleBlogPosts = [
      {
        title: "Micronutrient Management in Modern Agriculture",
        slug: "micronutrient-management-modern-agriculture",
        content: "Comprehensive guide on managing micronutrients for optimal crop health...",
        excerpt: "Learn about the critical role of micronutrients in plant health and discover best practices for micronutrient management in modern agricultural systems.",
        category: "guide",
        imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200",
        isPublished: true,
        publishedAt: new Date("2024-01-15"),
        metaTitle: "Complete Guide to Micronutrient Management",
        metaDescription: "Essential guide for farmers and agronomists on micronutrient management"
      },
      {
        title: "Zinc Deficiency: Symptoms and Solutions",
        slug: "zinc-deficiency-symptoms-solutions",
        content: "Understanding zinc deficiency in crops and effective correction strategies...",
        excerpt: "Identify zinc deficiency symptoms early and implement proven solutions to restore crop health and maximize yields.",
        category: "research",
        imageUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200",
        isPublished: true,
        publishedAt: new Date("2024-01-20"),
        metaTitle: "Zinc Deficiency in Crops: Complete Guide",
        metaDescription: "Research-based guide on zinc deficiency symptoms and correction"
      },
      {
        title: "Success Story: 40% Yield Increase in Rice Cultivation",
        slug: "rice-cultivation-yield-increase-case-study",
        content: "How proper micronutrient application led to dramatic yield improvements...",
        excerpt: "A detailed case study showing how strategic micronutrient application helped farmers achieve 40% higher rice yields.",
        category: "case-study",
        imageUrl: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=1200",
        isPublished: true,
        publishedAt: new Date("2024-02-01"),
        metaTitle: "Rice Farming Success: 40% Yield Increase",
        metaDescription: "Real-world case study of micronutrient impact on rice yields"
      },
      {
        title: "Bio-fertilizers: The Future of Sustainable Agriculture",
        slug: "bio-fertilizers-sustainable-agriculture",
        content: "Exploring the role of bio-fertilizers in sustainable farming practices...",
        excerpt: "Discover how bio-fertilizers are revolutionizing agriculture by reducing chemical inputs while maintaining high yields.",
        category: "research",
        imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200",
        isPublished: true,
        publishedAt: new Date("2024-02-10"),
        metaTitle: "Bio-fertilizers and Sustainable Farming",
        metaDescription: "Research on bio-fertilizers in modern sustainable agriculture"
      },
      {
        title: "Complete Guide to Foliar Feeding",
        slug: "complete-guide-foliar-feeding",
        content: "Best practices for foliar application of nutrients...",
        excerpt: "Master the art of foliar feeding with this comprehensive guide covering timing, dosage, and application techniques.",
        category: "guide",
        imageUrl: "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=1200",
        isPublished: true,
        publishedAt: new Date("2024-02-15"),
        metaTitle: "Foliar Feeding: Complete Application Guide",
        metaDescription: "Comprehensive guide to foliar nutrient application"
      },
      {
        title: "Cotton Farming: Micronutrient Requirements",
        slug: "cotton-farming-micronutrient-requirements",
        content: "Specific micronutrient needs of cotton crops throughout growth stages...",
        excerpt: "Understand the unique micronutrient requirements of cotton and optimize your fertilization program for maximum fiber quality.",
        category: "guide",
        imageUrl: "https://images.unsplash.com/photo-1591511991047-62d5a67fdecd?w=1200",
        isPublished: true,
        publishedAt: new Date("2024-02-20"),
        metaTitle: "Cotton Micronutrient Management Guide",
        metaDescription: "Essential micronutrients for cotton farming success"
      },
    ];

    await db.insert(blogPosts).values(sampleBlogPosts).onConflictDoNothing();
    console.log("✅ Blog posts seeded");

    // Seed Export Markets
    const sampleMarkets = [
      {
        country: "Ethiopia",
        countryCode: "ET",
        description: "Key market for agricultural inputs in East Africa. Growing demand for quality micronutrients and bio-fertilizers.",
        productCount: 45,
        shipmentFrequency: "Monthly",
        flagIcon: "🇪🇹",
        isActive: true,
      },
      {
        country: "Indonesia",
        countryCode: "ID",
        description: "Major partner in Southeast Asia. Large-scale agricultural sector with high demand for advanced solutions.",
        productCount: 62,
        shipmentFrequency: "Bi-weekly",
        flagIcon: "🇮🇩",
        isActive: true,
      },
      {
        country: "Kenya",
        countryCode: "KE",
        description: "Strategic hub for East African distribution. Rapidly growing agricultural technology adoption.",
        productCount: 38,
        shipmentFrequency: "Monthly",
        flagIcon: "🇰🇪",
        isActive: true,
      },
      {
        country: "Philippines",
        countryCode: "PH",
        description: "Important market for rice and vegetable cultivation inputs. Strong demand for organic solutions.",
        productCount: 41,
        shipmentFrequency: "Monthly",
        flagIcon: "🇵🇭",
        isActive: true,
      },
      {
        country: "Tanzania",
        countryCode: "TZ",
        description: "Emerging market with significant agricultural potential. Growing awareness of micronutrient benefits.",
        productCount: 35,
        shipmentFrequency: "Monthly",
        flagIcon: "🇹🇿",
        isActive: true,
      },
      {
        country: "Vietnam",
        countryCode: "VN",
        description: "Advanced agricultural sector with high technology adoption. Premium product demand.",
        productCount: 55,
        shipmentFrequency: "Bi-weekly",
        flagIcon: "🇻🇳",
        isActive: true,
      },
    ];

    await db.insert(exportMarkets).values(sampleMarkets).onConflictDoNothing();
    console.log("✅ Export markets seeded");

    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => {
      console.log("✨ Seed completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to seed:", error);
      process.exit(1);
    });
}

export { seed };
