import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { queryClient } from "./lib/queryClient";
import "./lib/i18n"; // Initialize i18n

// Import pages
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Resources from "@/pages/Resources";
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

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/resources" component={Resources} />
      <Route path="/exports" component={Exports} />
      
      {/* Admin routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/crm" component={AdminCRM} />
      <Route path="/admin/languages" component={AdminLanguageManager} />
      <Route path="/admin/products" component={AdminProductManager} />
      
      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
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
  );
}

export default App;
