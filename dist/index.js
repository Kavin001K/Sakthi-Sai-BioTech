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
    const adminId = randomUUID();
    this.users.set(adminId, {
      id: adminId,
      username: "admin",
      password: "$2b$10$rKpw/9tTOcVHdxhc93E/PeqJiAsdtcYaz.L8GVS4KyUnQGnk5G8S6",
      // hashed "admin123"
      role: "admin",
      email: "admin@sakthisaibiotech.com",
      name: "Administrator",
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
        isActive: true
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
        isActive: true
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
        isActive: true
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
        isActive: true
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
        isActive: true
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
        isActive: true
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
        isActive: true
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
        isActive: true
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
        isActive: true
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
        isActive: true
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
        isActive: true
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
        isActive: true
      }
    ];
    products2.forEach((product) => {
      const id = randomUUID();
      this.products.set(id, {
        id,
        ...product,
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
        title: "Micronutrient Management in Modern Agriculture",
        slug: "micronutrient-management-modern-agriculture",
        content: "Comprehensive guide on managing micronutrients for optimal crop health...",
        excerpt: "Learn about the critical role of micronutrients in plant health and discover best practices for micronutrient management in modern agricultural systems.",
        category: "guide",
        imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200",
        isPublished: true,
        publishedAt: /* @__PURE__ */ new Date("2024-01-15"),
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
        publishedAt: /* @__PURE__ */ new Date("2024-01-20"),
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
        publishedAt: /* @__PURE__ */ new Date("2024-02-01"),
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
        publishedAt: /* @__PURE__ */ new Date("2024-02-10"),
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
        publishedAt: /* @__PURE__ */ new Date("2024-02-15"),
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
        publishedAt: /* @__PURE__ */ new Date("2024-02-20"),
        metaTitle: "Cotton Micronutrient Management Guide",
        metaDescription: "Essential micronutrients for cotton farming success"
      }
    ];
    posts.forEach((post) => {
      const id = randomUUID();
      this.blogPosts.set(id, {
        id,
        ...post,
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
      createdAt: /* @__PURE__ */ new Date()
    };
    this.products.set(id, product);
    return product;
  }
  async updateProduct(id, productUpdate) {
    const product = this.products.get(id);
    if (!product) return void 0;
    const updatedProduct = { ...product, ...productUpdate };
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
    const market = { ...insertMarket, id };
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
