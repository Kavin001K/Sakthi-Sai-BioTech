import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Sprout, Facebook, Linkedin, Twitter, Instagram, Mail, MapPin, Phone, Lock, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "framer-motion";
import MagneticButton from "@/components/MagneticButton";
import AnimatedSection from "@/components/AnimatedSection";

export default function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setEmail("");
    setIsSubscribing(false);
  };

  const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: t('nav.home', 'Home'), href: '/', action: handleScrollToTop },
    { name: t('nav.products', 'Products'), href: '/products' },
    { name: t('nav.about', 'About Us'), href: '/about' },
    { name: t('nav.exports', 'Exports'), href: '/exports' },
    { name: t('nav.contact', 'Contact'), href: '/contact' },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <AnimatedSection animation="fade-in-up">
      <footer className="glass-morphism mt-24 py-16 text-foreground">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="space-y-6">
              <Link href="/" onClick={handleScrollToTop} className="flex items-center space-x-3 group">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center ring-2 ring-primary/30 group-hover:ring-primary transition-all">
                  <Sprout className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t('company.name', 'Sakthi Sai Biotech')}</h3>
                  <p className="text-sm text-muted-foreground">{t('company.since', 'Since 1999')}</p>
                </div>
              </Link>
              <p className="text-muted-foreground leading-relaxed">
                {t('footer.company.description', 'Leading manufacturer and exporter of premium agricultural products.')}
              </p>
              <div className="flex space-x-2">
                {socialLinks.map((social, index) => (
                  <MagneticButton key={index}>
                    <a href={social.href} className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors" aria-label={social.label}>
                      <social.icon className="w-5 h-5 text-primary" />
                    </a>
                  </MagneticButton>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">{t('footer.quickLinks.title', 'Quick Links')}</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} onClick={link.action} className="text-muted-foreground hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">{t('footer.newsletter.title', 'Newsletter')}</h4>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                {t('footer.newsletter.description', 'Get updates on new products and insights.')}
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder={t('footer.newsletter.placeholder', 'Your email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-card/60 border-white/20 placeholder-muted-foreground focus:ring-primary"
                />
                <MagneticButton>
                  <Button type="submit" disabled={isSubscribing} className="w-full btn-primary">
                    {isSubscribing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Mail className="w-4 h-4 mr-2" />{t('footer.newsletter.subscribe', 'Subscribe')}</>}
                  </Button>
                </MagneticButton>
              </form>
            </div>

            <div className="space-y-4">
                <h4 className="text-lg font-bold">{t('contact.address.title', 'Our Location')}</h4>
                <div className="flex items-start space-x-3 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-sm leading-relaxed">
                    Sakthi Sai Biotech<br />
                    Pollachi, Tamil Nadu 642001, India
                  </p>
                </div>
                <div className="flex items-start space-x-3 text-muted-foreground">
                  <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-sm">+91 12345 67890</p>
                </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 mt-12 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {t('company.name', 'Sakthi Sai Biotech')}. {t('footer.rights', 'All rights reserved')}.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <Link href="/admin/login" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <Lock size={16} />
                {t('footer.adminLogin', 'Admin')}
              </Link>
              <MagneticButton>
                <a href="#" onClick={handleScrollToTop} className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors" aria-label="Scroll to top">
                  <ArrowUp className="w-5 h-5 text-primary" />
                </a>
              </MagneticButton>
            </div>
          </div>
        </div>
      </footer>
    </AnimatedSection>
  );
}