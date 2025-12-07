import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { authenticateToken, generateToken, authorizeRole, type AuthRequest } from "./middleware/auth";
import { insertLeadSchema, insertProductSchema, insertBlogPostSchema, insertInquirySchema } from "@shared/schema";
import { processChatbotQuery, generateProductSuggestions } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
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

  app.get("/api/auth/me", authenticateToken, (req: AuthRequest, res) => {
    res.json({ user: req.user });
  });

  // Public API routes
  app.get("/api/products", async (req, res) => {
    try {
      const category = req.query.category as string;
      const products = category
        ? await storage.getProductsByCategory(category)
        : await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
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

  app.get("/api/blog-posts", async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Get blog posts error:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog-posts/:slug", async (req, res) => {
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

  app.get("/api/export-markets", async (req, res) => {
    try {
      const markets = await storage.getActiveExportMarkets();
      res.json(markets);
    } catch (error) {
      console.error("Get export markets error:", error);
      res.status(500).json({ message: "Failed to fetch export markets" });
    }
  });

  app.get("/api/translations/:language", async (req, res) => {
    try {
      const translations = await storage.getTranslationsByLanguage(req.params.language);
      const translationMap = translations.reduce((acc, t) => {
        acc[t.key] = t.value;
        return acc;
      }, {} as Record<string, string>);
      res.json(translationMap);
    } catch (error) {
      console.error("Get translations error:", error);
      res.status(500).json({ message: "Failed to fetch translations" });
    }
  });

  // Contact and inquiry routes
  app.post("/api/inquiries", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);

      // Extract lead data from inquiry
      // Extract lead data from inquiry
      // Extract lead data from inquiry
      const leadData = {
        name: validatedData.data.name || '',
        email: validatedData.data.email || '',
        phone: validatedData.data.phone || '',
        company: validatedData.data.company || '',
        country: validatedData.data.country || '',
        productInterest: validatedData.data.productInterest || null,
        message: validatedData.data.message || '',
        source: 'website',
        utmSource: validatedData.data.utmSource || null,
        utmMedium: validatedData.data.utmMedium || null,
        utmCampaign: validatedData.data.utmCampaign || null,
      };

      // Create lead first
      const lead = await storage.createLead(leadData);

      // Create inquiry linked to lead
      const inquiry = await storage.createInquiry({
        ...validatedData,
        leadId: lead.id,
      });

      res.status(201).json({ inquiry, lead });
    } catch (error) {
      console.error("Create inquiry error:", error);
      res.status(400).json({ message: "Failed to create inquiry" });
    }
  });

  // Chatbot routes
  app.post("/api/chatbot/query", async (req, res) => {
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

  app.post("/api/chatbot/suggestions", async (req, res) => {
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

  // Protected admin routes
  app.get("/api/admin/dashboard/stats", authenticateToken, authorizeRole("admin", "marketing_manager"), async (req, res) => {
    try {
      const leads = await storage.getLeads();
      const products = await storage.getProducts();
      const inquiries = await storage.getInquiries();
      const exportMarkets = await storage.getExportMarkets();

      const stats = {
        totalInquiries: inquiries.length,
        activeLeads: leads.filter(l => ['new', 'contacted', 'quoted', 'negotiation'].includes(l.status || '')).length,
        totalProducts: products.length,
        exportCountries: exportMarkets.filter(m => m.isActive).length,
        leadsThisMonth: leads.filter(l => {
          const leadDate = new Date(l.createdAt!);
          const thisMonth = new Date();
          thisMonth.setDate(1);
          return leadDate >= thisMonth;
        }).length,
        pipeline: {
          new: leads.filter(l => l.status === 'new').length,
          contacted: leads.filter(l => l.status === 'contacted').length,
          quoted: leads.filter(l => l.status === 'quoted').length,
          negotiation: leads.filter(l => l.status === 'negotiation').length,
          converted: leads.filter(l => l.status === 'converted').length,
        }
      };

      res.json(stats);
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.get("/api/admin/leads", authenticateToken, authorizeRole("admin", "marketing_manager", "sales_team"), async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      console.error("Get leads error:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  app.put("/api/admin/leads/:id", authenticateToken, authorizeRole("admin", "marketing_manager", "sales_team"), async (req, res) => {
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

  app.get("/api/admin/products", authenticateToken, authorizeRole("admin", "marketing_manager"), async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Get admin products error:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post("/api/admin/products", authenticateToken, authorizeRole("admin", "marketing_manager"), async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Create product error:", error);
      res.status(400).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/admin/products/:id", authenticateToken, authorizeRole("admin", "marketing_manager"), async (req, res) => {
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

  app.get("/api/admin/translations", authenticateToken, authorizeRole("admin", "marketing_manager"), async (req, res) => {
    try {
      const translations = await storage.getTranslations();

      // Group by key for easier management
      const grouped = translations.reduce((acc, t) => {
        if (!acc[t.key]) {
          acc[t.key] = {};
        }
        acc[t.key][t.language] = t.value;
        return acc;
      }, {} as Record<string, Record<string, string>>);

      res.json(grouped);
    } catch (error) {
      console.error("Get admin translations error:", error);
      res.status(500).json({ message: "Failed to fetch translations" });
    }
  });

  app.put("/api/admin/translations/:key/:language", authenticateToken, authorizeRole("admin", "marketing_manager"), async (req, res) => {
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

  app.get("/api/admin/blog-posts", authenticateToken, authorizeRole("admin", "marketing_manager"), async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Get admin blog posts error:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.post("/api/admin/blog-posts", authenticateToken, authorizeRole("admin", "marketing_manager"), async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const postData = {
        ...validatedData,
        authorId: (req as AuthRequest).user!.id
      };

      const post = await storage.createBlogPost(postData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Create blog post error:", error);
      res.status(400).json({ message: "Failed to create blog post" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
