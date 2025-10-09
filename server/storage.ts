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

    // Initialize default translations
    this.initializeTranslations();
  }

  private initializeProducts() {
    const products = [
      {
        name: "Premium Multi-Micronutrient Mix",
        category: "micronutrients",
        description: "Complete blend of essential micronutrients for enhanced crop vitality and yield",
        specifications: {
          "Active Ingredients": "Fe, Zn, Mn, Cu, B, Mo",
          "Formulation": "Chelated liquid",
          "pH": "6.5-7.5",
          "Solubility": "100% water soluble"
        },
        imageUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        suitableCrops: ["All Crops", "Vegetables", "Fruits"],
        packingSizes: ["1L", "5L", "20L"],
        isActive: true,
      },
      {
        name: "Spectrum Bio-Bactericide",
        category: "bactericides", 
        description: "Advanced bacterial control for comprehensive plant protection",
        specifications: {
          "Active Ingredient": "Bacillus subtilis",
          "CFU": "1 x 10^8 per ml",
          "Formulation": "Liquid suspension",
          "Storage": "Cool, dry place"
        },
        imageUrl: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        suitableCrops: ["Vegetables", "Fruits", "Cereals"],
        packingSizes: ["500ml", "1L", "5L"],
        isActive: true,
      },
      {
        name: "ProGrowth Max",
        category: "growth-promoters",
        description: "Organic growth stimulant for accelerated plant development",
        specifications: {
          "Active Compounds": "Amino acids, Humic acid, Seaweed extract",
          "Organic Content": "95%+",
          "Application": "Foliar spray or soil application",
          "Dilution": "1:200"
        },
        imageUrl: "https://images.unsplash.com/photo-1536147116438-62679a5e01f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        suitableCrops: ["Rice", "Wheat", "Cotton"],
        packingSizes: ["1L", "5L", "10L"],
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
        description: "Major partner since 2008, supplying premium micronutrients and growth promoters",
        productCount: 200,
        shipmentFrequency: "Monthly",
        isActive: true,
        flagIcon: "🇪🇹",
      },
      {
        country: "Indonesia", 
        countryCode: "ID",
        description: "Established market with strong demand for bio-fertilizers and bactericides",
        productCount: 150,
        shipmentFrequency: "Bi-weekly",
        isActive: true,
        flagIcon: "🇮🇩",
      }
    ];

    markets.forEach(market => {
      const id = randomUUID();
      this.exportMarkets.set(id, { id, ...market });
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
