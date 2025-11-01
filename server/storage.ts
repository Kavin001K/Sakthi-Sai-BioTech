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
        name: "Zinc Sulphate Heptahydrate",
        category: "micronutrients",
        description: "High-quality zinc supplement for crops. Corrects zinc deficiency and improves crop yield. Essential for enzyme systems and protein synthesis in plants.",
        imageUrl: "/one.jpeg",
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
        imageUrl: "/two.jpeg",
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
        imageUrl: "/three.jpeg",
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
        imageUrl: "/four.jpeg",
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
        imageUrl: "/five.jpeg",
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
        imageUrl: "/six.jpeg",
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
        imageUrl: "/seven.jpeg",
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
        imageUrl: "/one.jpeg",
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
        imageUrl: "/two.jpeg",
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
        imageUrl: "/three.jpeg",
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
        imageUrl: "/four.jpeg",
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
        imageUrl: "/five.jpeg",
        suitableCrops: ["All crops", "Stress conditions"],
        packingSizes: ["250ml", "500ml", "1L"],
        specifications: {
          "Amino Acids": "25-30%",
          "Protein": "40-45%",
          "Form": "Liquid"
        },
        isActive: true,
      }
    ];

    products.forEach(product => {
      const id = randomUUID();
      this.products.set(id, {
        id,
        ...product,
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

    posts.forEach(post => {
      const id = randomUUID();
      this.blogPosts.set(id, {
        id,
        ...post,
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
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, productUpdate: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productUpdate };
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
    const market: ExportMarket = { ...insertMarket, id };
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