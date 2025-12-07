import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import {
  Award,
  ChevronDown,
  CheckCircle,
  Box,
  Truck,
  Star,
  ArrowRight,
  Sprout,
  Shield,
  Leaf,
  Globe,
  TrendingUp,
  Users,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import QuoteModal from "@/components/QuoteModal";
import BackgroundVideo from "@/components/BackgroundVideo";
import AnimatedSection from "@/components/AnimatedSection";
import TiltCard from "@/components/TiltCard";
import CustomCursor from "@/components/CustomCursor";
import MagneticButton from "@/components/MagneticButton";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  suitableCrops: string[];
  packingSizes: string[];
}

interface ExportMarket {
  id: string;
  country: string;
  countryCode: string;
  description: string;
  productCount: number;
  shipmentFrequency: string;
  flagIcon: string;
}

import SEO from "@/components/SEO";

export default function Home() {
  const { t } = useTranslation();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products'],
    select: (data: Product[]) => data.slice(0, 6),
  });

  const { data: exportMarkets = [] } = useQuery<ExportMarket[]>({
    queryKey: ['/api/export-markets'],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = useMemo(() => [
    {
      id: 1,
      text: t('testimonials.ahmed.text', 'Sakthi Sai Biotech has been our trusted partner for 5 years. Their micronutrient products have significantly improved our farmers\' yields. The quality is consistent and their export support is exceptional.'),
      author: t('testimonials.ahmed.author', 'Ahmed Hassan'),
      role: t('testimonials.ahmed.role', 'Agricultural Distributor, Ethiopia'),
      rating: 5,
    },
    {
      id: 2,
      text: t('testimonials.budi.text', 'Outstanding bio-fertilizers that have transformed our crop production. Professional service and timely delivery across Indonesia.'),
      author: t('testimonials.budi.author', 'Budi Santoso'),
      role: t('testimonials.budi.role', 'Farm Cooperative Manager, Indonesia'),
      rating: 5,
    },
    {
      id: 3,
      text: t('testimonials.sarah.text', 'Premium quality products with excellent technical support. Their growth promoters have exceeded our expectations in field trials.'),
      author: t('testimonials.sarah.author', 'Dr. Sarah Kimani'),
      role: t('testimonials.sarah.role', 'Agricultural Research Institute, Kenya'),
      rating: 5,
    },
  ], [t]);

  const certifications = useMemo(() => [
    { icon: Shield, title: 'ISO 9001:2015', description: t('certifications.iso.description', 'Quality Management') },
    { icon: Leaf, title: t('certifications.organic.title', 'Organic Certified'), description: t('certifications.organic.description', 'Eco-Friendly Farming') },
    { icon: Target, title: t('certifications.quality.title', 'Quality Assured'), description: t('certifications.quality.description', 'Rigorous Testing') },
    { icon: Globe, title: t('certifications.export.title', 'Export Excellence'), description: t('certifications.export.description', 'Global Standards') },
  ], [t]);

  return (
    <div className="min-h-screen bg-background text-foreground aurora-bg">
      <SEO
        title="Home"
        description="Leading manufacturer of organic agricultural inputs, bio-fertilizers, and plant growth promoters in Pollachi, Coimbatore. Sustainable farming solutions for better yield."
        keywords={[
          'bio-fertilizers',
          'organic farming',
          'Pollachi',
          'Coimbatore',
          'Sakthi Sai Biotech',
          'plant growth promoters',
          'micronutrients',
          'humic acid',
          'seaweed extract',
          'organic pesticides'
        ]}
        canonicalUrl="https://sakthisaibiotech.com/"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://sakthisaibiotech.com/#organization",
              "name": "Sakthi Sai Biotech",
              "url": "https://sakthisaibiotech.com/",
              "logo": "https://sakthisaibiotech.com/logo.svg",
              "sameAs": [
                "https://www.facebook.com/sakthisaibiotech",
                "https://twitter.com/sakthisaibiotech",
                "https://www.linkedin.com/company/sakthisaibiotech"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91 98946 97707",
                "contactType": "customer service",
                "areaServed": ["IN", "ET", "ID", "ZA", "GH", "KE"],
                "availableLanguage": ["en", "ta"]
              }
            },
            {
              "@type": "WebSite",
              "@id": "https://sakthisaibiotech.com/#website",
              "url": "https://sakthisaibiotech.com/",
              "name": "Sakthi Sai Biotech",
              "description": "Leading manufacturer of organic agricultural inputs, bio-fertilizers, and plant growth promoters.",
              "publisher": {
                "@id": "https://sakthisaibiotech.com/#organization"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://sakthisaibiotech.com/resources?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            },
            {
              "@type": "LocalBusiness",
              "parentOrganization": {
                "@id": "https://sakthisaibiotech.com/#organization"
              },
              "name": "Sakthi Sai Biotech",
              "image": "https://sakthisaibiotech.com/logo.svg",
              "telephone": "+91 98946 97707",
              "email": "contact@sakthisaibiotech.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Pollachi Main Road",
                "addressLocality": "Pollachi",
                "addressRegion": "Tamil Nadu",
                "postalCode": "642001",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "10.6609",
                "longitude": "77.0048"
              },
              "url": "https://sakthisaibiotech.com",
              "priceRange": "$$"
            }
          ]
        }}
      />
      <CustomCursor />
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <BackgroundVideo src="/Bg.mp4" overlayOpacity={0.7} />
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          <div className="max-w-4xl opacity-0 animate-[fadeIn_1s_ease-out_0.5s_forwards]">
            <Badge className="glass-morphism px-4 py-2 mb-6 text-sm font-semibold border-0">
              <Award className="w-4 h-4 mr-2 text-primary" />
              {t('hero.badge', 'Trusted Since 1999 | Exporting to 50+ Countries')}
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-6 leading-tight shadow-text-strong">
              {t('hero.title', 'Advanced Agricultural Solutions')}
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed max-w-3xl">
              {t('hero.description', 'Premium micronutrients, bactericides, and growth promoters trusted by distributors worldwide.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <MagneticButton>
                <Button onClick={() => setIsQuoteModalOpen(true)} size="lg" className="btn-primary">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {t('cta.getQuote', 'Get a Quote')}
                </Button>
              </MagneticButton>
              <MagneticButton>
                <Button asChild variant="outline" size="lg" className="glass-morphism border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50">
                  <Link href="/products">
                    <Box className="w-5 h-5 mr-2" />
                    {t('cta.viewProducts', 'View Products')}
                  </Link>
                </Button>
              </MagneticButton>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
          <ChevronDown className="w-8 h-8 text-white/70" />
        </div>
      </section>

      <section className="py-24 bg-transparent relative">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative">
          <AnimatedSection animation="fade-in-up" className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-green-400 to-secondary bg-clip-text text-transparent">
              {t('trust.title', 'Trusted by Industry Leaders')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('trust.subtitle', 'Our commitment to quality is backed by international certifications and a global reputation for excellence.')}
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {certifications.map((cert, index) => (
              <AnimatedSection key={index} animation="fade-in-up" delay={index * 100}>
                <div className="glass-morphism rounded-2xl p-6 h-full text-center group">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center ring-2 ring-primary/30 group-hover:ring-primary transition-all duration-300">
                    <cert.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{cert.title}</h3>
                  <p className="text-sm text-muted-foreground">{cert.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-transparent relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          <AnimatedSection animation="fade-in-up" className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-green-400 to-secondary bg-clip-text text-transparent leading-tight">
              {t('products.featured.title', 'Featured Products')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('products.featured.subtitle', 'A selection of our most popular and effective agricultural solutions.')}
            </p>
          </AnimatedSection>
          {productsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="glass-morphism rounded-2xl animate-pulse h-96" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <AnimatedSection key={product.id} animation="fade-in-up" delay={index * 100}>
                  <TiltCard maxTilt={3}>
                    <Card className="glass-morphism h-full group overflow-hidden">
                      <div className="relative w-full h-56 overflow-hidden">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      </div>
                      <CardContent className="p-6 flex flex-col flex-grow">
                        <Badge variant="secondary" className="mb-3 capitalize self-start">
                          {t(`products.categories.${product.category}`, product.category)}
                        </Badge>
                        <h3 className="text-2xl font-bold mb-3 flex-grow group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-5 line-clamp-3">
                          {product.description}
                        </p>
                        <div className="mt-auto">
                          <MagneticButton>
                            <Button onClick={() => setIsQuoteModalOpen(true)} className="w-full btn-primary">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              {t('cta.requestQuote', 'Request Quote')}
                            </Button>
                          </MagneticButton>
                        </div>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </AnimatedSection>
              ))}
            </div>
          )}
          <div className="text-center mt-16">
            <MagneticButton>
              <Button asChild size="lg" className="btn-secondary">
                <Link href="/products">
                  {t('cta.viewAllProducts', 'View Complete Catalog')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </MagneticButton>
          </div>
        </div>
      </section>

      <section className="py-24 bg-transparent relative">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative">
          <AnimatedSection animation="fade-in-up" className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              {t('testimonials.title', 'What Our Partners Say')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('testimonials.subtitle', 'Global distributors trust our products and service.')}
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fade-in-up" delay={200}>
            <div className="max-w-4xl mx-auto">
              <div className="glass-morphism rounded-2xl p-8 lg:p-12 relative">
                <div className="absolute top-8 left-8 text-8xl text-primary/10 select-none -z-1">
                  <span>&ldquo;</span>
                </div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="flex items-center mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-6 h-6 ${i < testimonials[activeTestimonial].rating ? 'text-accent fill-accent' : 'text-muted-foreground/30'}`} />
                    ))}
                  </div>
                  <p className="text-xl lg:text-2xl text-foreground mb-8 leading-relaxed italic min-h-[6rem]">
                    {testimonials[activeTestimonial].text}
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center ring-2 ring-primary/30">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-left">
                        {testimonials[activeTestimonial].author}
                      </h4>
                      <p className="text-muted-foreground text-left">
                        {testimonials[activeTestimonial].role}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center space-x-2 mt-8">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeTestimonial ? 'bg-primary w-8' : 'bg-muted hover:bg-muted-foreground/50'}`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24 bg-transparent relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          <AnimatedSection animation="fade-in-up" className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              {t('exports.title', 'Our Global Presence')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('exports.subtitle', 'Serving agricultural communities across continents with reliable and effective solutions.')}
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {exportMarkets.slice(0, 3).map((market, index) => (
              <AnimatedSection key={market.id} animation="fade-in-up" delay={index * 150}>
                <div className="glass-morphism rounded-2xl p-6 h-full group">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 ring-2 ring-primary/30">
                      <span className="text-4xl">{market.flagIcon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{market.country}</h3>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {market.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <Box className="w-4 h-4 text-primary mr-2" />
                          <span className="font-semibold">{market.productCount}+</span>
                          <span className="text-muted-foreground ml-1.5">Products</span>
                        </div>
                        <div className="flex items-center">
                          <Truck className="w-4 h-4 text-primary mr-2" />
                          <span className="font-semibold">{market.shipmentFrequency}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <div className="text-center">
            <MagneticButton>
              <Button asChild size="lg" variant="outline" className="glass-morphism border-2 border-white/30 hover:bg-white/10 hover:border-white/50">
                <Link href="/exports">
                  {t('cta.viewAllMarkets', 'Explore All Markets')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </MagneticButton>
          </div>
        </div>
      </section>

      <section className="py-24 bg-transparent">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 lg:p-12 text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <AnimatedSection animation="fade-in-up" className="text-center relative z-10">
              <Sprout className="w-12 h-12 text-white/90 mx-auto mb-6" />
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                {t('cta.section.title', 'Ready to Grow With Us?')}
              </h2>
              <p className="text-xl text-white/80 mb-8 leading-relaxed max-w-3xl mx-auto">
                {t('cta.section.description', 'Partner with a leader in agricultural innovation. Get expert consultation and competitive pricing for your market.')}
              </p>
              <MagneticButton>
                <Button onClick={() => setIsQuoteModalOpen(true)} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground scale-105 shadow-lg hover:shadow-xl">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {t('cta.getQuote', 'Get a Quote')}
                </Button>
              </MagneticButton>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </div>
  );
}
