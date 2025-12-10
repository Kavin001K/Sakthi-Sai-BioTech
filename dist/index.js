// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import bcrypt from "bcrypt";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  users = /* @__PURE__ */ new Map();
  products = /* @__PURE__ */ new Map();
  leads = /* @__PURE__ */ new Map();
  blogPosts = /* @__PURE__ */ new Map();
  translations = /* @__PURE__ */ new Map();
  inquiries = /* @__PURE__ */ new Map();
  exportMarkets = /* @__PURE__ */ new Map();
  constructor() {
    this.initializeDefaultData();
  }
  initializeDefaultData() {
    const userId = randomUUID();
    this.users.set(userId, {
      id: userId,
      username: "Goutham",
      password: "$2b$10$S59k0buPzov5DVzFpUA.MezEBOxAFosAVVZmGKsj46orKx3Aw1nkW",
      // hashed "Goutham@123"
      role: "admin",
      email: "goutham@sakthisaibiotech.com",
      name: "Goutham",
      createdAt: /* @__PURE__ */ new Date()
    });
    this.initializeProducts();
    this.initializeExportMarkets();
    this.initializeBlogPosts();
    this.initializeTranslations();
  }
  initializeProducts() {
    const products2 = [
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
        isActive: true
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
        isActive: true
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
        isActive: true
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
        isActive: true
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
        isActive: true
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
        isActive: true
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
        isActive: true
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
        isActive: true
      }
    ];
    products2.forEach((product) => {
      const id = randomUUID();
      this.products.set(id, {
        id,
        ...product,
        specifications: product.specifications,
        createdAt: /* @__PURE__ */ new Date()
      });
    });
  }
  initializeExportMarkets() {
    const markets = [
      {
        country: "Ethiopia",
        countryCode: "ET",
        description: "Key market for agricultural inputs in East Africa. Growing demand for quality micronutrients and bio-fertilizers.",
        productCount: 45,
        shipmentFrequency: "Monthly",
        flagIcon: "\u{1F1EA}\u{1F1F9}",
        isActive: true
      },
      {
        country: "Indonesia",
        countryCode: "ID",
        description: "Major partner in Southeast Asia. Large-scale agricultural sector with high demand for advanced solutions.",
        productCount: 62,
        shipmentFrequency: "Bi-weekly",
        flagIcon: "\u{1F1EE}\u{1F1E9}",
        isActive: true
      },
      {
        country: "Kenya",
        countryCode: "KE",
        description: "Strategic hub for East African distribution. Rapidly growing agricultural technology adoption.",
        productCount: 38,
        shipmentFrequency: "Monthly",
        flagIcon: "\u{1F1F0}\u{1F1EA}",
        isActive: true
      },
      {
        country: "Philippines",
        countryCode: "PH",
        description: "Important market for rice and vegetable cultivation inputs. Strong demand for organic solutions.",
        productCount: 41,
        shipmentFrequency: "Monthly",
        flagIcon: "\u{1F1F5}\u{1F1ED}",
        isActive: true
      },
      {
        country: "Tanzania",
        countryCode: "TZ",
        description: "Emerging market with significant agricultural potential. Growing awareness of micronutrient benefits.",
        productCount: 35,
        shipmentFrequency: "Monthly",
        flagIcon: "\u{1F1F9}\u{1F1FF}",
        isActive: true
      },
      {
        country: "Vietnam",
        countryCode: "VN",
        description: "Advanced agricultural sector with high technology adoption. Premium product demand.",
        productCount: 55,
        shipmentFrequency: "Bi-weekly",
        flagIcon: "\u{1F1FB}\u{1F1F3}",
        isActive: true
      }
    ];
    markets.forEach((market) => {
      const id = randomUUID();
      this.exportMarkets.set(id, { id, ...market });
    });
  }
  initializeBlogPosts() {
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
        publishedAt: /* @__PURE__ */ new Date("2024-02-20"),
        metaTitle: "Cotton Farming Micronutrients: Zinc, Boron & Magnesium Guide",
        metaDescription: "Boost cotton yield and fiber quality. Learn how to prevent boll shedding and leaf reddening using Zinc, Boron, and Win-Choice organic tonic."
      },
      {
        title: "Complete Guide to Foliar Feeding",
        slug: "complete-guide-to-foliar-feeding",
        content: `
# Mastering the Art of Foliar Feeding

Foliar feeding\u2014applying liquid fertilizers directly to leaves\u2014is the fastest way to correct nutrient deficiencies. Unlike soil application, which depends on root health and soil pH, foliar absorption is rapid and efficient.

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
        publishedAt: /* @__PURE__ */ new Date("2024-02-15"),
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
        publishedAt: /* @__PURE__ */ new Date("2024-02-10"),
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
        category: "case-studies",
        // Fixed 'guides' -> 'case-studies' to match screenshot implied variety? Or keeping 'guides' is safer. Let's use 'guides' or 'case-studies'. Screenshot had 'Case Studies' in bottom row.
        imageUrl: "https://images.unsplash.com/photo-1536630807663-d3ac26c07577?auto=format&fit=crop&q=80",
        isPublished: true,
        publishedAt: /* @__PURE__ */ new Date("2024-02-01"),
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
        publishedAt: /* @__PURE__ */ new Date("2024-01-20"),
        metaTitle: "Liquid Fertilizer for Sugarcane: Boost Sugar Recovery",
        metaDescription: "Liquid vs Granular fertilizers for sugarcane. Learn how fertigation with Liquid Micro Mac and K-Max improves yield and sugar recovery."
      }
    ];
    posts.forEach((post) => {
      const id = randomUUID();
      this.blogPosts.set(id, {
        id,
        ...post,
        authorId: randomUUID(),
        // Placeholder as we don't track relation strictly in mem storage
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      });
    });
  }
  initializeTranslations() {
    const defaultTranslations = [
      // Hero section
      { key: "hero.title", language: "en", value: "Advanced Agricultural Solutions for Global Growth" },
      { key: "hero.title", language: "id", value: "Solusi Pertanian Canggih untuk Pertumbuhan Global" },
      { key: "hero.title", language: "am", value: "\u12E8\u120B\u1240 \u12E8\u130D\u1265\u122D\u1293 \u1218\u134D\u1275\u1204\u12CE\u127D \u1208\u12A0\u1208\u121D \u12A0\u1240\u134D \u12A5\u12F5\u1308\u1275" },
      { key: "hero.description", language: "en", value: "Premium micronutrients, bactericides, and growth promoters trusted by distributors worldwide. Quality manufacturing from Pollachi, Tamil Nadu." },
      { key: "hero.description", language: "id", value: "Mikronutrien premium, bakterisida, dan promotor pertumbuhan yang dipercaya oleh distributor di seluruh dunia. Manufaktur berkualitas dari Pollachi, Tamil Nadu." },
      { key: "hero.description", language: "am", value: "\u1260\u12D3\u1208\u121D \u12A0\u1240\u134D \u1270\u12A8\u134B\u134B\u12EE\u127D \u12E8\u121A\u1273\u1218\u1291 \u12A8\u134D\u1270\u129B \u1325\u122B\u1275 \u12EB\u120B\u1278\u12CD \u121B\u12ED\u12AD\u122E \u1295\u1325\u1228 \u1290\u1308\u122E\u127D\u1363 \u1263\u12AD\u1274\u122A\u12EB \u1308\u12F3\u12EE\u127D \u12A5\u1293 \u12E8\u12A5\u12F5\u1308\u1275 \u12A0\u1260\u1228\u1273\u127D\u1362 \u12A8\u1356\u120B\u127A\u1363 \u1273\u121A\u120D \u1293\u12F1 \u1325\u122B\u1275 \u12A0\u121D\u122B\u127D\u1362" },
      // Navigation
      { key: "nav.home", language: "en", value: "Home" },
      { key: "nav.home", language: "id", value: "Beranda" },
      { key: "nav.home", language: "am", value: "\u1264\u1275" },
      { key: "nav.products", language: "en", value: "Products" },
      { key: "nav.products", language: "id", value: "Produk" },
      { key: "nav.products", language: "am", value: "\u121D\u122D\u1276\u127D" },
      // CTAs
      { key: "cta.getQuote", language: "en", value: "Get a Quote" },
      { key: "cta.getQuote", language: "id", value: "Dapatkan Penawaran" },
      { key: "cta.getQuote", language: "am", value: "\u12CB\u130B \u12EB\u130D\u1299" },
      { key: "cta.viewProducts", language: "en", value: "View Products" },
      { key: "cta.viewProducts", language: "id", value: "Lihat Produk" },
      { key: "cta.viewProducts", language: "am", value: "\u121D\u122D\u1276\u127D\u1295 \u12ED\u1218\u120D\u12A8\u1271" }
    ];
    defaultTranslations.forEach((translation) => {
      const id = randomUUID();
      this.translations.set(id, {
        id,
        ...translation,
        updatedAt: /* @__PURE__ */ new Date()
      });
    });
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = {
      ...insertUser,
      id,
      role: insertUser.role || "user",
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, user);
    return user;
  }
  async updateUser(id, userUpdate) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const updatedUser = { ...user, ...userUpdate };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  // Product methods
  async getProducts() {
    return Array.from(this.products.values()).filter((p) => p.isActive);
  }
  async getProduct(id) {
    return this.products.get(id);
  }
  async getProductsByCategory(category) {
    return Array.from(this.products.values()).filter((p) => p.category === category && p.isActive);
  }
  async createProduct(insertProduct) {
    const id = randomUUID();
    const product = {
      ...insertProduct,
      id,
      description: insertProduct.description ?? null,
      specifications: insertProduct.specifications ?? null,
      imageUrl: insertProduct.imageUrl ?? null,
      suitableCrops: insertProduct.suitableCrops ?? null,
      packingSizes: insertProduct.packingSizes ?? null,
      isActive: insertProduct.isActive ?? true,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.products.set(id, product);
    return product;
  }
  async updateProduct(id, productUpdate) {
    const product = this.products.get(id);
    if (!product) return void 0;
    const updatedProduct = {
      ...product,
      ...productUpdate,
      description: productUpdate.description ?? product.description,
      imageUrl: productUpdate.imageUrl ?? product.imageUrl
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  async deleteProduct(id) {
    return this.products.delete(id);
  }
  // Lead methods
  async getLeads() {
    return Array.from(this.leads.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  async getLead(id) {
    return this.leads.get(id);
  }
  async getLeadsByStatus(status) {
    return Array.from(this.leads.values()).filter((lead) => lead.status === status);
  }
  async getLeadsByAssignee(userId) {
    return Array.from(this.leads.values()).filter((lead) => lead.assignedTo === userId);
  }
  async createLead(insertLead) {
    const id = randomUUID();
    const lead = {
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
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.leads.set(id, lead);
    return lead;
  }
  async updateLead(id, leadUpdate) {
    const lead = this.leads.get(id);
    if (!lead) return void 0;
    const updatedLead = {
      ...lead,
      ...leadUpdate,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.leads.set(id, updatedLead);
    return updatedLead;
  }
  // Blog methods
  async getBlogPosts() {
    return Array.from(this.blogPosts.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  async getPublishedBlogPosts() {
    return Array.from(this.blogPosts.values()).filter((post) => post.isPublished).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }
  async getBlogPost(id) {
    return this.blogPosts.get(id);
  }
  async getBlogPostBySlug(slug) {
    return Array.from(this.blogPosts.values()).find((post) => post.slug === slug);
  }
  async createBlogPost(insertPost) {
    const id = randomUUID();
    const post = {
      ...insertPost,
      id,
      imageUrl: insertPost.imageUrl ?? null,
      excerpt: insertPost.excerpt ?? null,
      metaDescription: insertPost.metaDescription ?? null,
      metaTitle: insertPost.metaTitle ?? null,
      isPublished: insertPost.isPublished ?? false,
      category: insertPost.category,
      // assuming category is required in insert schema? If optional -> ?? "uncategorized"
      publishedAt: insertPost.publishedAt ?? null,
      authorId: insertPost.authorId ?? null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.blogPosts.set(id, post);
    return post;
  }
  async updateBlogPost(id, postUpdate) {
    const post = this.blogPosts.get(id);
    if (!post) return void 0;
    const updatedPost = {
      ...post,
      ...postUpdate,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }
  async deleteBlogPost(id) {
    return this.blogPosts.delete(id);
  }
  // Translation methods
  async getTranslations() {
    return Array.from(this.translations.values());
  }
  async getTranslationsByLanguage(language) {
    return Array.from(this.translations.values()).filter((t) => t.language === language);
  }
  async createTranslation(insertTranslation) {
    const id = randomUUID();
    const translation = {
      ...insertTranslation,
      id,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.translations.set(id, translation);
    return translation;
  }
  async updateTranslation(key, language, value) {
    const translation = Array.from(this.translations.values()).find((t) => t.key === key && t.language === language);
    if (!translation) return void 0;
    const updatedTranslation = {
      ...translation,
      value,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.translations.set(translation.id, updatedTranslation);
    return updatedTranslation;
  }
  // Inquiry methods
  async getInquiries() {
    return Array.from(this.inquiries.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  async createInquiry(insertInquiry) {
    const id = randomUUID();
    const inquiry = {
      ...insertInquiry,
      id,
      leadId: insertInquiry.leadId ?? null,
      processed: insertInquiry.processed ?? false,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }
  async updateInquiry(id, processed) {
    const inquiry = this.inquiries.get(id);
    if (!inquiry) return void 0;
    const updatedInquiry = { ...inquiry, processed };
    this.inquiries.set(id, updatedInquiry);
    return updatedInquiry;
  }
  // Export market methods
  async getExportMarkets() {
    return Array.from(this.exportMarkets.values());
  }
  async getActiveExportMarkets() {
    return Array.from(this.exportMarkets.values()).filter((market) => market.isActive);
  }
  async createExportMarket(insertMarket) {
    const id = randomUUID();
    const market = {
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
  async updateExportMarket(id, marketUpdate) {
    const market = this.exportMarkets.get(id);
    if (!market) return void 0;
    const updatedMarket = { ...market, ...marketUpdate };
    this.exportMarkets.set(id, updatedMarket);
    return updatedMarket;
  }
};
var storage = new MemStorage();

// server/middleware/auth.ts
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || "fallback_secret_key";
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
}
async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await storage.getUser(decoded.id);
    if (!user) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
      name: user.name
    };
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
}
function authorizeRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
}

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  // admin, marketing_manager, sales_team, user
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  // micronutrients, bactericides, growth-promoters, bio-fertilizers
  description: text("description"),
  specifications: jsonb("specifications").$type(),
  imageUrl: text("image_url"),
  suitableCrops: text("suitable_crops").array(),
  packingSizes: text("packing_sizes").array(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company").notNull(),
  country: text("country").notNull(),
  productInterest: text("product_interest"),
  message: text("message"),
  source: text("source").default("website"),
  // website, whatsapp, referral
  status: text("status").default("new"),
  // new, contacted, quoted, negotiation, converted, closed
  assignedTo: varchar("assigned_to").references(() => users.id),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  score: integer("score").default(0),
  tags: text("tags").array(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  category: text("category").notNull(),
  // research, case-study, guide
  imageUrl: text("image_url"),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  authorId: varchar("author_id").references(() => users.id),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var translations = pgTable("translations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull(),
  language: text("language").notNull(),
  // en, id, am
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var inquiries = pgTable("inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  // contact_form, quote_request, product_inquiry
  data: jsonb("data").$type().notNull(),
  leadId: varchar("lead_id").references(() => leads.id),
  processed: boolean("processed").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var exportMarkets = pgTable("export_markets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  country: text("country").notNull(),
  countryCode: text("country_code").notNull(),
  description: text("description"),
  productCount: integer("product_count").default(0),
  shipmentFrequency: text("shipment_frequency"),
  isActive: boolean("is_active").default(true),
  flagIcon: text("flag_icon")
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true
});
var insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertTranslationSchema = createInsertSchema(translations).omit({
  id: true,
  updatedAt: true
});
var insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true
});
var insertExportMarketSchema = createInsertSchema(exportMarkets).omit({
  id: true
});

// server/services/openai.ts
import OpenAI from "openai";
var openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});
async function processChatbotQuery(query, context) {
  try {
    const systemPrompt = `You are AgriBot, an AI assistant for Sakthi Sai Biotech, a Tamil Nadu-based agricultural products manufacturer and exporter since 1999. 

Company Information:
- Location: Pollachi, Tamil Nadu, India
- Founded: 1999
- Products: Micronutrients, Bactericides, Growth Promoters, Bio-Fertilizers
- Export Markets: Ethiopia, Indonesia, and 50+ other countries
- Specialties: Premium agricultural solutions for crop health and yield improvement

Guidelines:
- Be helpful and professional
- Focus on agricultural solutions and company products
- Provide accurate information about crop health, farming practices
- If asked about specific products, mention our categories: micronutrients, bactericides, growth promoters, bio-fertilizers
- For business inquiries, suggest contacting our sales team
- Keep responses concise but informative
- If you don't know specific details, be honest and suggest contacting the company directly

Respond in JSON format with "response" and "confidence" (0-1) fields.`;
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      response: result.response || "I'm here to help with agricultural questions. Could you please rephrase your question?",
      confidence: Math.max(0, Math.min(1, result.confidence || 0.8))
    };
  } catch (error) {
    console.error("Chatbot query error:", error);
    return {
      response: "I'm experiencing technical difficulties. Please contact our support team directly for immediate assistance.",
      confidence: 0.5
    };
  }
}
async function generateProductSuggestions(query) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an agricultural expert. Based on the crop or farming issue mentioned, suggest relevant product categories from: micronutrients, bactericides, growth-promoters, bio-fertilizers. Respond with JSON array of suggestions."
        },
        {
          role: "user",
          content: query
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1024
    });
    const result = JSON.parse(response.choices[0].message.content || '{"suggestions": []}');
    return result.suggestions || [];
  } catch (error) {
    console.error("Product suggestion error:", error);
    return [];
  }
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = generateToken(user);
      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/auth/me", authenticateToken, (req, res) => {
    res.json({ user: req.user });
  });
  app2.get("/api/products", async (req, res) => {
    try {
      const category = req.query.category;
      const products2 = category ? await storage.getProductsByCategory(category) : await storage.getProducts();
      res.json(products2);
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Get product error:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  app2.get("/api/blog-posts", async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Get blog posts error:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });
  app2.get("/api/blog-posts/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post || !post.isPublished) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Get blog post error:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });
  app2.get("/api/export-markets", async (req, res) => {
    try {
      const markets = await storage.getActiveExportMarkets();
      res.json(markets);
    } catch (error) {
      console.error("Get export markets error:", error);
      res.status(500).json({ message: "Failed to fetch export markets" });
    }
  });
  app2.get("/api/translations/:language", async (req, res) => {
    try {
      const translations2 = await storage.getTranslationsByLanguage(req.params.language);
      const translationMap = translations2.reduce((acc, t) => {
        acc[t.key] = t.value;
        return acc;
      }, {});
      res.json(translationMap);
    } catch (error) {
      console.error("Get translations error:", error);
      res.status(500).json({ message: "Failed to fetch translations" });
    }
  });
  app2.get("/api/blog-posts", async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Get published blog posts error:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });
  app2.get("/api/blog-posts/slug/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Get blog post by slug error:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });
  app2.post("/api/inquiries", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const leadData = {
        name: validatedData.data.name || "",
        email: validatedData.data.email || "",
        phone: validatedData.data.phone || "",
        company: validatedData.data.company || "",
        country: validatedData.data.country || "",
        productInterest: validatedData.data.productInterest || null,
        message: validatedData.data.message || "",
        source: "website",
        utmSource: validatedData.data.utmSource || null,
        utmMedium: validatedData.data.utmMedium || null,
        utmCampaign: validatedData.data.utmCampaign || null
      };
      const lead = await storage.createLead(leadData);
      const inquiry = await storage.createInquiry({
        ...validatedData,
        leadId: lead.id
      });
      res.status(201).json({ inquiry, lead });
    } catch (error) {
      console.error("Create inquiry error:", error);
      res.status(400).json({ message: "Failed to create inquiry" });
    }
  });
  app2.post("/api/chatbot/query", async (req, res) => {
    try {
      const { query, context } = req.body;
      if (!query) {
        return res.status(400).json({ message: "Query is required" });
      }
      const response = await processChatbotQuery(query, context);
      res.json(response);
    } catch (error) {
      console.error("Chatbot query error:", error);
      res.status(500).json({ message: "Failed to process query" });
    }
  });
  app2.post("/api/chatbot/suggestions", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ message: "Query is required" });
      }
      const suggestions = await generateProductSuggestions(query);
      res.json({ suggestions });
    } catch (error) {
      console.error("Product suggestions error:", error);
      res.status(500).json({ message: "Failed to generate suggestions" });
    }
  });
  app2.get("/api/admin/dashboard/stats", authenticateToken, authorizeRole("admin", "marketing_manager"), async (req, res) => {
    try {
      const leads2 = await storage.getLeads();
      const products2 = await storage.getProducts();
      const inquiries2 = await storage.getInquiries();
      const exportMarkets2 = await storage.getExportMarkets();
      const stats = {
        totalInquiries: inquiries2.length,
        activeLeads: leads2.filter((l) => ["new", "contacted", "quoted", "negotiation"].includes(l.status || "")).length,
        totalProducts: products2.length,
        exportCountries: exportMarkets2.filter((m) => m.isActive).length,
        leadsThisMonth: leads2.filter((l) => {
          const leadDate = new Date(l.createdAt);
          const thisMonth = /* @__PURE__ */ new Date();
          thisMonth.setDate(1);
          return leadDate >= thisMonth;
        }).length,
        pipeline: {
          new: leads2.filter((l) => l.status === "new").length,
          contacted: leads2.filter((l) => l.status === "contacted").length,
          quoted: leads2.filter((l) => l.status === "quoted").length,
          negotiation: leads2.filter((l) => l.status === "negotiation").length,
          converted: leads2.filter((l) => l.status === "converted").length
        }
      };
      res.json(stats);
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });
  app2.get("/api/admin/leads", authenticateToken, authorizeRole("admin", "marketing_manager", "sales_team"), async (req, res) => {
    try {
      const leads2 = await storage.getLeads();
      res.json(leads2);
    } catch (error) {
      console.error("Get leads error:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });
  app2.put("/api/admin/leads/:id", authenticateToken, authorizeRole("admin", "marketing_manager", "sales_team"), async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedLead = await storage.updateLead(id, updateData);
      if (!updatedLead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      res.json(updatedLead);
    } catch (error) {
      console.error("Update lead error:", error);
      res.status(500).json({ message: "Failed to update lead" });
    }
  });
  app2.get("/api/admin/products", authenticateToken, authorizeRole("admin", "marketing_manager"), async (req, res) => {
    try {
      const products2 = await storage.getProducts();
      res.json(products2);
    } catch (error) {
      console.error("Get admin products error:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  app2.post("/api/admin/products", authenticateToken, authorizeRole("admin", "marketing_manager"), async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Create product error:", error);
      res.status(400).json({ message: "Failed to create product" });
    }
  });
  app2.put("/api/admin/products/:id", authenticateToken, authorizeRole("admin", "marketing_manager"), async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedProduct = await storage.updateProduct(id, updateData);
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(updatedProduct);
    } catch (error) {
      console.error("Update product error:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });
  app2.get("/api/admin/translations", authenticateToken, authorizeRole("admin", "marketing_manager"), async (req, res) => {
    try {
      const translations2 = await storage.getTranslations();
      const grouped = translations2.reduce((acc, t) => {
        if (!acc[t.key]) {
          acc[t.key] = {};
        }
        acc[t.key][t.language] = t.value;
        return acc;
      }, {});
      res.json(grouped);
    } catch (error) {
      console.error("Get admin translations error:", error);
      res.status(500).json({ message: "Failed to fetch translations" });
    }
  });
  app2.put("/api/admin/translations/:key/:language", authenticateToken, authorizeRole("admin", "marketing_manager"), async (req, res) => {
    try {
      const { key, language } = req.params;
      const { value } = req.body;
      if (!value) {
        return res.status(400).json({ message: "Value is required" });
      }
      const translation = await storage.updateTranslation(key, language, value);
      res.json(translation);
    } catch (error) {
      console.error("Update translation error:", error);
      res.status(500).json({ message: "Failed to update translation" });
    }
  });
  app2.get("/api/admin/blog-posts", authenticateToken, authorizeRole("admin", "marketing_manager"), async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Get admin blog posts error:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });
  app2.post("/api/admin/blog-posts", authenticateToken, authorizeRole("admin", "marketing_manager"), async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const postData = {
        ...validatedData,
        authorId: req.user.id
      };
      const post = await storage.createBlogPost(postData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Create blog post error:", error);
      res.status(400).json({ message: "Failed to create blog post" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  publicDir: path.resolve(import.meta.dirname, "client/public"),
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "3000", 10);
  server.listen(port, () => {
    log(`serving on port ${port}`);
  });
})();
