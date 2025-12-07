import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { queryClient } from "./lib/queryClient";
import "./lib/i18n"; // Initialize i18n

// Import pages
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Resources from "@/pages/Resources";
import BlogPostDetail from "@/pages/BlogPostDetail";
import Exports from "@/pages/Exports";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminCRM from "@/pages/admin/CRM";
import AdminLanguageManager from "@/pages/admin/LanguageManager";
import AdminProductManager from "@/pages/admin/ProductManager";
import NotFound from "@/pages/not-found";

// Import shared components
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import ChatBot from "@/components/ChatBot";
import CustomCursor from "@/components/CustomCursor";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/resources" component={Resources} />
      <Route path="/resources/:slug" component={BlogPostDetail} />
      <Route path="/exports" component={Exports} />

      {/* Admin login (public) */}
      <Route path="/admin/login" component={AdminLogin} />

      {/* Protected admin routes */}
      <Route path="/admin/dashboard">
        {() => (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/crm">
        {() => (
          <ProtectedRoute>
            <AdminCRM />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/languages">
        {() => (
          <ProtectedRoute>
            <AdminLanguageManager />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/products">
        {() => (
          <ProtectedRoute>
            <AdminProductManager />
          </ProtectedRoute>
        )}
      </Route>

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  return (
    <>
      <ScrollToTop />
      <CustomCursor />
      <Navbar />
      <main className="min-h-screen pt-16 lg:pt-20">
        <Router />
      </main>
      <Footer />
      <FloatingCTA />
      <ChatBot />
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <AppContent />
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
