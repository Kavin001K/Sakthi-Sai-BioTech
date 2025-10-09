import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Sprout, Facebook, Linkedin, Twitter, Instagram, Mail, MapPin, Phone, Clock, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    
    // TODO: Integrate with Mailchimp API
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    setEmail("");
    setIsSubscribing(false);
    // Show success message
  };

  const quickLinks = [
    { name: t('nav.home', 'Home'), href: '/' },
    { name: t('nav.products', 'Products'), href: '/products' },
    { name: t('nav.about', 'About Us'), href: '/about' },
    { name: t('nav.exports', 'Export Markets'), href: '/exports' },
    { name: t('nav.resources', 'Resources'), href: '/resources' },
    { name: t('nav.contact', 'Contact'), href: '/contact' },
  ];

  const productCategories = [
    { name: t('products.micronutrients', 'Micronutrients'), href: '/products?category=micronutrients' },
    { name: t('products.bactericides', 'Bactericides'), href: '/products?category=bactericides' },
    { name: t('products.growth-promoters', 'Growth Promoters'), href: '/products?category=growth-promoters' },
    { name: t('products.bio-fertilizers', 'Bio-Fertilizers'), href: '/products?category=bio-fertilizers' },
    { name: t('products.plant-tonics', 'Plant Tonics'), href: '/products?category=plant-tonics' },
    { name: t('products.view-all', 'View All Products'), href: '/products' },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Sprout className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{t('company.name', 'Sakthi Sai Biotech')}</h3>
                <p className="text-sm opacity-70">{t('company.since', 'Since 1999')}</p>
              </div>
            </div>
            <p className="opacity-80 leading-relaxed">
              {t('footer.company.description', 'Leading manufacturer and exporter of premium agricultural products serving global markets.')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-background/10 hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
                  aria-label={social.label}
                  data-testid={`social-link-${social.label.toLowerCase()}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">
              {t('footer.quickLinks.title', 'Quick Links')}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="opacity-80 hover:opacity-100 hover:text-primary transition-all"
                    data-testid={`footer-link-${link.href.replace('/', '') || 'home'}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-lg font-bold mb-6">
              {t('footer.products.title', 'Products')}
            </h4>
            <ul className="space-y-3">
              {productCategories.map((product) => (
                <li key={product.href}>
                  <Link 
                    href={product.href}
                    className="opacity-80 hover:opacity-100 hover:text-primary transition-all"
                    data-testid={`footer-product-link-${product.href.split('=')[1] || 'all'}`}
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-6">
              {t('footer.newsletter.title', 'Newsletter')}
            </h4>
            <p className="opacity-80 mb-4 text-sm leading-relaxed">
              {t('footer.newsletter.description', 'Subscribe to get updates on new products and market insights')}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder={t('footer.newsletter.placeholder', 'Your email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/10 border-background/20 text-background placeholder-background/50 focus:ring-primary"
                data-testid="newsletter-email-input"
              />
              <Button 
                type="submit" 
                disabled={isSubscribing}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                data-testid="newsletter-submit-button"
              >
                {isSubscribing ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    {t('footer.newsletter.subscribe', 'Subscribe')}
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="border-t border-background/20 pt-8 pb-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-semibold mb-2">{t('contact.address.title', 'Address')}</h5>
                <p className="text-sm opacity-80 leading-relaxed">
                  Sakthi Sai Biotech<br />
                  Pollachi, Tamil Nadu 642001<br />
                  India
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-semibold mb-2">{t('contact.email.title', 'Email')}</h5>
                <p className="text-sm opacity-80">info@sakthisaibiotech.com</p>
                <p className="text-sm opacity-80">export@sakthisaibiotech.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-semibold mb-2">{t('contact.hours.title', 'Business Hours')}</h5>
                <p className="text-sm opacity-80">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                <p className="text-sm opacity-80">Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col items-center md:items-start space-y-2">
              <p className="opacity-70 text-sm">
                © 2025 {t('company.name', 'Sakthi Sai Biotech')}. {t('footer.rights', 'All rights reserved')}.
              </p>
              <p className="opacity-50 text-xs">
                {t('footer.lastUpdated', 'Portal updated: October 2025')}
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex space-x-6 text-sm">
                <Link href="/privacy" className="opacity-70 hover:opacity-100 hover:text-primary transition-all">
                  {t('footer.privacy', 'Privacy Policy')}
                </Link>
                <Link href="/terms" className="opacity-70 hover:opacity-100 hover:text-primary transition-all">
                  {t('footer.terms', 'Terms of Service')}
                </Link>
                <Link href="/sitemap" className="opacity-70 hover:opacity-100 hover:text-primary transition-all">
                  {t('footer.sitemap', 'Sitemap')}
                </Link>
              </div>

              {/* Admin Login Button with Animation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Link href="/admin/login">
                  <Button
                    className="bg-[#0288D1] hover:bg-[#F57C00] text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
                    data-testid="admin-login-button"
                  >
                    <Lock size={16} />
                    {t('footer.adminLogin', 'Admin Login')}
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
