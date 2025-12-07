import {
  type User,
  type InsertUser,
  type Product,
  type InsertProduct,
  type Lead,
  type InsertLead,
  type BlogPost,
  type InsertBlogPost,
  type Translation,
  type InsertTranslation,
  type Inquiry,
  type InsertInquiry,
  type ExportMarket,
  type InsertExportMarket
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Leads
  getLeads(): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | undefined>;
  getLeadsByStatus(status: string): Promise<Lead[]>;
  getLeadsByAssignee(userId: string): Promise<Lead[]>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: string, lead: Partial<InsertLead>): Promise<Lead | undefined>;

  // Blog Posts
  getBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;

  // Translations
  getTranslations(): Promise<Translation[]>;
  getTranslationsByLanguage(language: string): Promise<Translation[]>;
  createTranslation(translation: InsertTranslation): Promise<Translation>;
  updateTranslation(key: string, language: string, value: string): Promise<Translation | undefined>;

  // Inquiries
  getInquiries(): Promise<Inquiry[]>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  updateInquiry(id: string, processed: boolean): Promise<Inquiry | undefined>;

  // Export Markets
  getExportMarkets(): Promise<ExportMarket[]>;
  getActiveExportMarkets(): Promise<ExportMarket[]>;
  createExportMarket(market: InsertExportMarket): Promise<ExportMarket>;
  updateExportMarket(id: string, market: Partial<InsertExportMarket>): Promise<ExportMarket | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private products: Map<string, Product> = new Map();
  private leads: Map<string, Lead> = new Map();
  private blogPosts: Map<string, BlogPost> = new Map();
  private translations: Map<string, Translation> = new Map();
  private inquiries: Map<string, Inquiry> = new Map();
  private exportMarkets: Map<string, ExportMarket> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default admin user
    const adminId = randomUUID();
    this.users.set(adminId, {
      id: adminId,
      username: "admin",
      password: "$2b$10$rKpw/9tTOcVHdxhc93E/PeqJiAsdtcYaz.L8GVS4KyUnQGnk5G8S6", // hashed "admin123"
      role: "admin",
      email: "admin@sakthisaibiotech.com",
      name: "Administrator",
      createdAt: new Date(),
    });

    // Initialize sample products
    this.initializeProducts();

    // Initialize export markets
    this.initializeExportMarkets();

    // Initialize blog posts
    this.initializeBlogPosts();

    // Initialize default translations
    this.initializeTranslations();
  }

  private initializeProducts() {
    const products = [
      {
        name: "Win-Choice",
        category: "plant-growth-promotor",
        description: "An amazing organic plant tonic designed to boost plant vitality and yield. It promotes healthy growth naturally and acts as an effective tonic for various crops.",
        imageUrl: "/Win-choke.jpeg",
        suitableCrops: ["Chilli", "Cotton", "Vegetables"],
        packingSizes: ["100 ml", "250 ml"],
        specifications: {
          "Benefits": "Boosts Plant Vitality",
          "Form": "Liquid",
          "Type": "Organic Tonic"
        },
        isActive: true,
      },
      {
        name: "Micro Mac Coconut Special",
        category: "micronutrients",
        description: "A specialized micronutrient formula approved by the Govt. of Tamil Nadu. It is fortified with essential minerals specifically designed to maximize coconut yield and quality.",
        imageUrl: "/Micro Max 2.jpeg",
        suitableCrops: ["Coconut"],
        packingSizes: ["25 kg"],
        specifications: {
          "Approval": "Govt. of Tamil Nadu Approved",
          "Form": "Granules",
          "Benefit": "Maximizes Yield and Quality"
        },
        isActive: true,
      },
      {
        name: "Excl Power",
        category: "micronutrients",
        description: "A premium plant protector that safeguards crops against environmental stress and pests. It rapidly corrects deficiencies and stimulates vigorous, healthy growth.",
        imageUrl: "/Excl Power.jpeg",
        suitableCrops: ["Cotton", "Chilli"],
        packingSizes: ["250 ml", "500 ml", "1 L"],
        specifications: {
          "Form": "Liquid",
          "Action": "Stress & Pest Protection",
          "Result": "Vigorous Growth"
        },
        isActive: true,
      },
      {
        name: "Cyto Max",
        category: "plant-growth-promotor",
        description: "A high-performance bio-stimulant that enhances metabolic processes, improves flowering, and increases overall crop productivity and quality.",
        imageUrl: "/Cito max.jpeg",
        suitableCrops: ["Paddy", "Vegetables", "Banana", "Flowers"],
        packingSizes: ["8 kg"],
        specifications: {
          "Type": "Bio-stimulant",
          "Form": "Granules",
          "Benefits": "Enhances Flowering & Productivity"
        },
        isActive: true,
      },
      {
        name: "Bactowin - 2000",
        category: "bactericide-fungicide",
        description: "Imparts strong resistance against diseases like Canker. It is easily dissolved in water and provides broad-spectrum protection for a wide variety of crops.",
        imageUrl: "/Bactowin.jpeg",
        suitableCrops: ["Cotton", "Citrus", "Paddy", "Chillies", "Tomato", "Onion"],
        packingSizes: ["25 g"],
        specifications: {
          "Target Disease": "Canker & others",
          "Solubility": "Water Soluble",
          "Protection": "Broad-spectrum"
        },
        isActive: true,
      },
      {
        name: "Micro Mac (Liquid)",
        category: "micronutrients",
        description: "A comprehensive liquid micronutrient mixture that corrects zinc, iron, and manganese deficiencies, ensuring balanced plant nutrition and lush foliage.",
        imageUrl: "/Micro mac.png",
        suitableCrops: ["Paddy", "Flowers", "Chillies", "Vegetables"],
        packingSizes: ["500 ml", "1 L"],
        specifications: {
          "Deficiencies Corrected": "Zinc, Iron, Manganese",
          "Form": "Liquid",
          "Benefit": "Balanced Nutrition"
        },
        isActive: true,
      },
      {
        name: "Humic Power",
        category: "liquid-fertilizer",
        description: "A natural plant booster enriched with 16% Humic Acid and 4% Fulvic Acid. It significantly improves soil structure, root development, and nutrient absorption.",
        imageUrl: "/Humic Pow.jpeg",
        suitableCrops: ["Paddy", "Banana", "Chillies", "Cotton"],
        packingSizes: ["500 ml", "1 L"],
        specifications: {
          "Composition": "16% Humic Acid, 4% Fulvic Acid",
          "Form": "Liquid",
          "Benefits": "Improves Soil Structure"
        },
        isActive: true,
      },
      {
        name: "K-Max",
        category: "pesticides",
        description: "Premium water-soluble Potassium Sulphate (00:00:50). It is essential for improving fruit quality, weight, sugar content, and overall shelf life.",
        imageUrl: "/K- Max.jpeg",
        suitableCrops: ["Maize", "Tubers", "Flowering Plants"],
        packingSizes: ["250 ml", "500 ml"],
        specifications: {
          "Composition": "Potassium Sulphate (00:00:50)",
          "Form": "Water Soluble Powder",
          "Benefits": "Improves Quality & Shelf Life"
        },
        isActive: true,
      },
    ];

    products.forEach(product => {
      const id = randomUUID();
      this.products.set(id, {
        id,
        ...product,
        specifications: (product.specifications as unknown) as Record<string, string>,
        createdAt: new Date(),
      });
    });
  }

  private initializeExportMarkets() {
    const markets = [
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

    markets.forEach(market => {
      const id = randomUUID();
      this.exportMarkets.set(id, { id, ...market });
    });
  }

  private initializeBlogPosts() {
    const posts = [
      {
        title: "Cotton Farming: Micronutrient Requirements",
        slug: "cotton-farming-micronutrient-requirements",
        content: `
# Optimizing Cotton Quality and Yield with Micronutrients

Cotton is one of the most commercially important crops, but it is also nutrient-demanding. To achieve high fiber quality (staple length and strength) and prevent boll shedding, a balanced nutritional program is essential.

## Critical Micronutrients for Cotton

While NPK (Nitrogen, Phosphorus, Potassium) provides the base, specific micronutrients play a pivotal role in cotton physiology:

1.  **Magnesium (Mg)**: Essential for chlorophyll production. Magnesium deficiency leads to reddening of leaves (leaf reddening), a common issue in Bt Cotton.
2.  **Zinc (Zn)**: Crucial for hormone (auxin) production, which regulates internode length and growth.
3.  **Boron (B)**: The key to reproductive success. Boron deficiency is the primary cause of flower drop and poor boll setting.

## The Sakthi Sai Solution

### 1. Soil Application
Start with a strong foundation by applying **Micro Mac (Cotton Special)** during the basal dressing. This ensures a slow release of zinc and iron throughout the vegetative phase.

### 2. Foliar Correction with Win-Choice
**Win-Choice** is our flagship organic plant tonic. When applied during the squaring and flowering stages (45-65 days), it:
*   Reduces flower and boll dropping significantly.
*   Enhances photosynthetic activity.
*   Increases boll weight by 15-20%.

> **Field Tip**: Combine Win-Choice (250ml/acre) with a soluble Boron spray during the peak flowering stage for maximum retention.

## Managing Leaf Reddening
Leaf reddening is a physiological disorder often confused with pest attacks. It is primarily caused by Magnesium deficiency and low night temperatures. A foliar spray of **Magnesium Sulphate + Win-Choice** can correct this within 7 days, restoring green vitality to the crop.
        `,
        excerpt: "Understand the unique micronutrient requirements of cotton. Learn how Magnesium, Zinc, and Boron can prevent boll shedding and optimize fiber quality.",
        category: "guides",
        imageUrl: "/cotton-farming-generated.png",
        isPublished: true,
        publishedAt: new Date("2024-02-20"),
        metaTitle: "Cotton Farming Micronutrients: Zinc, Boron & Magnesium Guide",
        metaDescription: "Boost cotton yield and fiber quality. Learn how to prevent boll shedding and leaf reddening using Zinc, Boron, and Win-Choice organic tonic."
      },
      {
        title: "Complete Guide to Foliar Feeding",
        slug: "complete-guide-to-foliar-feeding",
        content: `
# Mastering the Art of Foliar Feeding

Foliar feeding—applying liquid fertilizers directly to leaves—is the fastest way to correct nutrient deficiencies. Unlike soil application, which depends on root health and soil pH, foliar absorption is rapid and efficient.

## Why Foliar Feeding?
*   **Speed**: Nutrients are absorbed within hours.
*   **Efficiency**: Over 90% utilization rate compared to 30-50% for soil fertilizers.
*   **Stress Recovery**: Helps crops bounce back quickly from drought or pest stress.

## Best Practices for Application

### 1. Timing is Everything
The stomata (leaf pores) are most open during cool conditions.
*   **Best Time**: Early morning (6 AM - 9 AM) or late evening (after 4 PM).
*   **Avoid**: High Noon. Heat causes stomata to close, reducing absorption and risking leaf burn.

### 2. The Right Nozzle
Use a distinct "mist" setting. Fine droplets cover more surface area and adhere better to the leaf surface than large drops which roll off.

### 3. Stick to the Underside
Most stomata are located on the *underside* of the leaf. Direct your spray nozzle upwards to coat the bottom of the foliage for maximum uptake.

## Recommended Products
For micronutrient correction, our **Liquid Micro Mac** is formulated specifically for foliar uptake, containing chelated minerals that penetrate the waxy leaf cuticle easily.
        `,
        excerpt: "Master the art of foliar feeding with this comprehensive guide covering timing, dosage, and application techniques for maximum nutrient absorption.",
        category: "guides",
        imageUrl: "/micronutrients.png",
        isPublished: true,
        publishedAt: new Date("2024-02-15"),
        metaTitle: "Foliar Feeding Guide: Best Time & Techniques for Spraying",
        metaDescription: "Learn how to apply foliar fertilizers effectively. Expert tips on spray timing, nozzle selection, and maximizing nutrient absorption through leaves."
      },
      {
        title: "Bio-fertilizers: The Future of Sustainable Agriculture",
        slug: "bio-fertilizers-sustainable-agriculture",
        content: `
# The Shift to Biological Agriculture

As soil health degrades globally due to excessive chemical use, **Bio-fertilizers** are emerging not just as an alternative, but as a necessity for sustainable agriculture.

## What Are Bio-fertilizers?
Bio-fertilizers are preparations containing living cells of latent strains of nitrogen-fixing, phosphate-solubilizing, or cellulolytic microorganisms. They accelerate microbial processes in the soil, augmenting the availability of nutrients that can be easily assimilated by plants.

## Key Benefits

### 1. Soil Structure Improvement
Products like **Humic Power** (rich in Humic and Fulvic acids) improve the soil's physical structure, increasing water holding capacity and aeration. This creates the perfect environment for beneficial microbes to thrive.

### 2. Cost Effectiveness
Bio-fertilizers reduce the need for synthetic NPK by 25-30%. Over time, they restore the soil's natural fertility cycle, lowering input costs significantly.

### 3. Disease Resistance
Healthy soil microbiomes suppress soil-borne pathogens naturally. Using bio-inputs creates a "suppressive soil" where harmful fungi cannot easily establish.

## Sakthi Sai's Commitment
We manufacture ISO 9001:2015 certified biological inputs. Our **Cyto Max** bio-stimulant acts as a bridge, helping farmers transition from chemical-heavy dependency to a balanced, sustainable model without sacrificing yield.
        `,
        excerpt: "Discover how bio-fertilizers are revolutionizing agriculture by reducing chemical inputs while maintaining high yields and improving soil health.",
        category: "research",
        imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80",
        isPublished: true,
        publishedAt: new Date("2024-02-10"),
        metaTitle: "Bio-fertilizers vs Chemical Fertilizers: Sustainable Future",
        metaDescription: "Why bio-fertilizers are the future of farming. Explore the benefits of soil health, cost reduction, and sustainable yield with organic inputs."
      },
      {
        title: "Paddy Cultivation: Maximizing Tillering & Yield",
        slug: "maximizing-paddy-rice-yields",
        content: `
# Boosting Rice Yields Organically

Rice (Paddy) is the staple food for over half the world's population. For farmers in Tamil Nadu and Andhra Pradesh, maximizing the number of productive tillers is the key to a bumper harvest.

## The Role of Zinc (Zn) inside Paddy
Rice is highly sensitive to Zinc deficiency, widely known as "Khaira disease".
*   **Symptoms**: Rusty brown spots on leaves, stunted growth, and uneven maturation.
*   **Solution**: Application of **Micro Mac (Paddy Special)** which contains 21% Zinc along with Iron and Sulphur.

## Controlling Bacterial Leaf Blight (BLB)
BLB is a major threat during the monsoon season.
**Bactowin-2000** is our specialized bactericide.
*   **Dosage**: 25g per 60 liters of water.
*   **Application**: Prophylactic spray at the nursery stage and active tillering stage keeps BLB at bay.

## Growth Promotion
To increase the grain filling percentage (reducing chaffy grains), apply **Win-Choice** at the panicle initiation stage. This ensures that photosynthates are effectively moved from the leaf to the grain, resulting in heavy, solid grains.
        `,
        excerpt: "Expert strategies for Paddy farmers. Learn how to control BLB with Bactowin-2000 and increase tillering using Zinc and organic growth promoters.",
        category: "case-studies", // Fixed 'guides' -> 'case-studies' to match screenshot implied variety? Or keeping 'guides' is safer. Let's use 'guides' or 'case-studies'. Screenshot had 'Case Studies' in bottom row.
        imageUrl: "https://images.unsplash.com/photo-1536630807663-d3ac26c07577?auto=format&fit=crop&q=80",
        isPublished: true,
        publishedAt: new Date("2024-02-01"),
        metaTitle: "Paddy Yield Tips: Zinc, BLB Control & Tillering Guide",
        metaDescription: "Maximize your paddy harvest. Tips on controlling Bacterial Leaf Blight, correcting Zinc deficiency, and using Win-Choice for better grain filling."
      },
      {
        title: "Liquid vs. Granular: Improving Efficiency for Sugarcane",
        slug: "liquid-vs-granular-fertilizers-sugarcane",
        content: `
# Fertigation: The Game Changer for Sugarcane

Sugarcane is a long-duration crop that requires consistent nutrition. Traditional granular application is labor-intensive and often results in nutrient leaching or fixation.

## The Liquid Advantage
With the rise of drip irrigation, **Liquid Fertilizers** have become the gold standard.
1.  **Zero Wastage**: Nutrients are delivered directly to the root zone.
2.  **Labor Saving**: No need for manual spreading; apply via venturi.
3.  **Frequency**: You can feed the crop weekly in small doses ("spoon-feeding"), which is far superior to monthly bulk dumping.

## Sakthi Sai's Liquid Range
Our **Liquid Micro Mac** is designed to be 100% water-soluble and clog-free.
*   **Iron (Fe)**: Corrects chlorosis (yellowing) in young cane.
*   **Potassium (K)**: Application of **K-Max** (Liquid Potash) in the final 3 months boosts sugar recovery significantly.

> "Switching to liquid Micro Mac increased our sugar recovery rate by 1.2%," reports a partner mill in Erode.
        `,
        excerpt: "Why modern sugarcane farmers are switching to liquid fertilizers. Benefits of fertigation for sugar recovery and labor reduction.",
        category: "research",
        imageUrl: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80",
        isPublished: true,
        publishedAt: new Date("2024-01-20"),
        metaTitle: "Liquid Fertilizer for Sugarcane: Boost Sugar Recovery",
        metaDescription: "Liquid vs Granular fertilizers for sugarcane. Learn how fertigation with Liquid Micro Mac and K-Max improves yield and sugar recovery."
      }
    ];

    posts.forEach(post => {
      const id = randomUUID();
      this.blogPosts.set(id, {
        id,
        ...post,
        authorId: randomUUID(), // Placeholder as we don't track relation strictly in mem storage
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  }

  private initializeTranslations() {
    const defaultTranslations = [
      // Hero section
      { key: "hero.title", language: "en", value: "Advanced Agricultural Solutions for Global Growth" },
      { key: "hero.title", language: "id", value: "Solusi Pertanian Canggih untuk Pertumbuhan Global" },
      { key: "hero.title", language: "am", value: "የላቀ የግብርና መፍትሄዎች ለአለም አቀፍ እድገት" },

      { key: "hero.description", language: "en", value: "Premium micronutrients, bactericides, and growth promoters trusted by distributors worldwide. Quality manufacturing from Pollachi, Tamil Nadu." },
      { key: "hero.description", language: "id", value: "Mikronutrien premium, bakterisida, dan promotor pertumbuhan yang dipercaya oleh distributor di seluruh dunia. Manufaktur berkualitas dari Pollachi, Tamil Nadu." },
      { key: "hero.description", language: "am", value: "በዓለም አቀፍ ተከፋፋዮች የሚታመኑ ከፍተኛ ጥራት ያላቸው ማይክሮ ንጥረ ነገሮች፣ ባክቴሪያ ገዳዮች እና የእድገት አበረታች። ከፖላቺ፣ ታሚል ናዱ ጥራት አምራች።" },

      // Navigation
      { key: "nav.home", language: "en", value: "Home" },
      { key: "nav.home", language: "id", value: "Beranda" },
      { key: "nav.home", language: "am", value: "ቤት" },

      { key: "nav.products", language: "en", value: "Products" },
      { key: "nav.products", language: "id", value: "Produk" },
      { key: "nav.products", language: "am", value: "ምርቶች" },

      // CTAs
      { key: "cta.getQuote", language: "en", value: "Get a Quote" },
      { key: "cta.getQuote", language: "id", value: "Dapatkan Penawaran" },
      { key: "cta.getQuote", language: "am", value: "ዋጋ ያግኙ" },

      { key: "cta.viewProducts", language: "en", value: "View Products" },
      { key: "cta.viewProducts", language: "id", value: "Lihat Produk" },
      { key: "cta.viewProducts", language: "am", value: "ምርቶችን ይመልከቱ" },
    ];

    defaultTranslations.forEach(translation => {
      const id = randomUUID();
      this.translations.set(id, {
        id,
        ...translation,
        updatedAt: new Date(),
      });
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role || "user",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, userUpdate: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...userUpdate };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isActive);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.category === category && p.isActive);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...insertProduct,
      id,
      description: insertProduct.description ?? null,
      specifications: insertProduct.specifications ?? null,
      imageUrl: insertProduct.imageUrl ?? null,
      suitableCrops: insertProduct.suitableCrops ?? null,
      packingSizes: insertProduct.packingSizes ?? null,
      isActive: insertProduct.isActive ?? true,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, productUpdate: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = {
      ...product,
      ...productUpdate,
      description: productUpdate.description ?? product.description,
      imageUrl: productUpdate.imageUrl ?? product.imageUrl,
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Lead methods
  async getLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values()).sort((a, b) =>
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getLead(id: string): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async getLeadsByStatus(status: string): Promise<Lead[]> {
    return Array.from(this.leads.values()).filter(lead => lead.status === status);
  }

  async getLeadsByAssignee(userId: string): Promise<Lead[]> {
    return Array.from(this.leads.values()).filter(lead => lead.assignedTo === userId);
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const lead: Lead = {
      ...insertLead,
      id,
      message: insertLead.message ?? null,
      status: insertLead.status ?? "new",
      phone: insertLead.phone ?? null,
      productInterest: insertLead.productInterest ?? null,
      source: insertLead.source ?? "website",
      score: insertLead.score ?? null,
      notes: insertLead.notes ?? null,
      assignedTo: insertLead.assignedTo ?? null,
      utmSource: insertLead.utmSource ?? null,
      utmMedium: insertLead.utmMedium ?? null,
      utmCampaign: insertLead.utmCampaign ?? null,
      tags: insertLead.tags ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.leads.set(id, lead);
    return lead;
  }

  async updateLead(id: string, leadUpdate: Partial<InsertLead>): Promise<Lead | undefined> {
    const lead = this.leads.get(id);
    if (!lead) return undefined;

    const updatedLead = {
      ...lead,
      ...leadUpdate,
      updatedAt: new Date()
    };
    this.leads.set(id, updatedLead);
    return updatedLead;
  }

  // Blog methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort((a, b) =>
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.isPublished)
      .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime());
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const post: BlogPost = {
      ...insertPost,
      id,
      imageUrl: insertPost.imageUrl ?? null,
      excerpt: insertPost.excerpt ?? null,
      metaDescription: insertPost.metaDescription ?? null,
      metaTitle: insertPost.metaTitle ?? null,
      isPublished: insertPost.isPublished ?? false,
      category: insertPost.category, // assuming category is required in insert schema? If optional -> ?? "uncategorized"
      publishedAt: insertPost.publishedAt ?? null,
      authorId: insertPost.authorId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, post);
    return post;
  }

  async updateBlogPost(id: string, postUpdate: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;

    const updatedPost = {
      ...post,
      ...postUpdate,
      updatedAt: new Date()
    };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  // Translation methods
  async getTranslations(): Promise<Translation[]> {
    return Array.from(this.translations.values());
  }

  async getTranslationsByLanguage(language: string): Promise<Translation[]> {
    return Array.from(this.translations.values()).filter(t => t.language === language);
  }

  async createTranslation(insertTranslation: InsertTranslation): Promise<Translation> {
    const id = randomUUID();
    const translation: Translation = {
      ...insertTranslation,
      id,
      updatedAt: new Date(),
    };
    this.translations.set(id, translation);
    return translation;
  }

  async updateTranslation(key: string, language: string, value: string): Promise<Translation | undefined> {
    const translation = Array.from(this.translations.values())
      .find(t => t.key === key && t.language === language);

    if (!translation) return undefined;

    const updatedTranslation = {
      ...translation,
      value,
      updatedAt: new Date()
    };
    this.translations.set(translation.id, updatedTranslation);
    return updatedTranslation;
  }

  // Inquiry methods
  async getInquiries(): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values()).sort((a, b) =>
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = randomUUID();
    const inquiry: Inquiry = {
      ...insertInquiry,
      id,
      leadId: insertInquiry.leadId ?? null,
      processed: insertInquiry.processed ?? false,
      createdAt: new Date(),
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }

  async updateInquiry(id: string, processed: boolean): Promise<Inquiry | undefined> {
    const inquiry = this.inquiries.get(id);
    if (!inquiry) return undefined;

    const updatedInquiry = { ...inquiry, processed };
    this.inquiries.set(id, updatedInquiry);
    return updatedInquiry;
  }

  // Export market methods
  async getExportMarkets(): Promise<ExportMarket[]> {
    return Array.from(this.exportMarkets.values());
  }

  async getActiveExportMarkets(): Promise<ExportMarket[]> {
    return Array.from(this.exportMarkets.values()).filter(market => market.isActive);
  }

  async createExportMarket(insertMarket: InsertExportMarket): Promise<ExportMarket> {
    const id = randomUUID();
    const market: ExportMarket = {
      ...insertMarket,
      id,
      description: insertMarket.description || null,
      productCount: insertMarket.productCount || 0,
      shipmentFrequency: insertMarket.shipmentFrequency || null,
      flagIcon: insertMarket.flagIcon || null,
      isActive: insertMarket.isActive ?? true
    };
    this.exportMarkets.set(id, market);
    return market;
  }

  async updateExportMarket(id: string, marketUpdate: Partial<InsertExportMarket>): Promise<ExportMarket | undefined> {
    const market = this.exportMarkets.get(id);
    if (!market) return undefined;

    const updatedMarket = { ...market, ...marketUpdate };
    this.exportMarkets.set(id, updatedMarket);
    return updatedMarket;
  }
}

export const storage = new MemStorage();