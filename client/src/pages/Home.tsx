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

export default function Home() {
  const { t } = useTranslation();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Fetch featured products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products'],
    select: (data: Product[]) => data.slice(0, 6), // Featured products
  });

  // Fetch export markets
  const { data: exportMarkets = [] } = useQuery<ExportMarket[]>({
    queryKey: ['/api/export-markets'],
  });

  // Auto-rotate testimonials
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

  const companyStats = useMemo(() => [
    {
      icon: TrendingUp,
      value: '25+',
      label: t('stats.experience', 'Years Experience'),
      color: 'text-primary',
    },
    {
      icon: Globe,
      value: '50+',
      label: t('stats.countries', 'Export Countries'),
      color: 'text-secondary',
    },
    {
      icon: Box,
      value: '200+',
      label: t('stats.products', 'Products'),
      color: 'text-accent',
    },
    {
      icon: Users,
      value: '5000+',
      label: t('stats.clients', 'Happy Clients'),
      color: 'text-primary',
    },
  ], [t]);

  const certifications = useMemo(() => [
    {
      icon: Shield,
      title: 'ISO 9001:2015',
      description: t('certifications.iso.description', 'Quality Management System'),
    },
    {
      icon: Leaf,
      title: t('certifications.organic.title', 'Organic Certified'),
      description: t('certifications.organic.description', 'Organic farming approved'),
    },
    {
      icon: Target,
      title: t('certifications.quality.title', 'Quality Assured'),
      description: t('certifications.quality.description', 'Rigorous quality control'),
    },
    {
      icon: Globe,
      title: t('certifications.export.title', 'Export Excellence'),
      description: t('certifications.export.description', 'International standards'),
    },
  ], [t]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Video */}
        <BackgroundVideo src="/Bg.mp4" overlayOpacity={0.5} />

        {/* Content */}
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          <div className="max-w-4xl opacity-0 animate-[fadeIn_0.8s_ease-out_0.2s_forwards]">
            <Badge className="bg-accent/20 text-accent-foreground border-accent/30 mb-6 text-sm font-medium">
              <Award className="w-4 h-4 mr-2" />
              {t('hero.badge', 'Trusted Since 1999 | Exporting to 50+ Countries')}
            </Badge>

            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-balance">
              {t('hero.title', 'Advanced Agricultural Solutions for Global Growth')}
            </h1>

            <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-3xl">
              {t('hero.description', 'Premium micronutrients, bactericides, and growth promoters trusted by distributors worldwide. Quality manufacturing from Pollachi, Tamil Nadu.')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                onClick={() => setIsQuoteModalOpen(true)}
                className="btn-primary group"
                data-testid="hero-get-quote-button"
              >
                <CheckCircle className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                {t('cta.getQuote', 'Get a Quote')}
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-8 py-6 rounded-xl font-semibold text-lg border-2 border-white/30 hover:border-white/50 transition-all"
                data-testid="hero-view-products-button"
              >
                <Link href="/products">
                  <Box className="w-5 h-5 mr-2" />
                  {t('cta.viewProducts', 'View Products')}
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl">
              {companyStats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/70" />
        </div>
      </section>

      {/* Trust Indicators & Certifications */}
      <section className="py-20 bg-luxury-gradient-1 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          <AnimatedSection animation="fade-in-up" className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-2">
              Industry Recognition
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-green-600 to-secondary bg-clip-text text-transparent">
              {t('trust.title', 'Trusted by Industry Leaders')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('trust.subtitle', 'Certified and recognized globally for excellence in agricultural solutions')}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="opacity-0 animate-[fadeInScale_0.6s_ease-out_forwards]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <TiltCard maxTilt={5}>
                  <Card className="card-hover border-2 border-primary/10 h-full glass-morphism group">
                    <CardContent className="p-6 md:p-8 text-center">
                      <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                        <cert.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                      </div>
                      <h3 className="font-bold text-base md:text-lg mb-2">{cert.title}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{cert.description}</p>
                    </CardContent>
                  </Card>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Premium background decorations */}
        <div className="absolute inset-0 bg-dot-pattern opacity-30"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl transform -translate-y-1/2"></div>
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-bl from-secondary/20 to-transparent rounded-full blur-3xl transform -translate-y-1/2"></div>

        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          <AnimatedSection animation="fade-in-up" className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-primary to-secondary text-white border-0 px-4 py-2">
              Premium Solutions
            </Badge>
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-green-600 to-secondary bg-clip-text text-transparent leading-tight">
              {t('products.featured.title', 'Featured Products')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('products.featured.subtitle', 'Premium agricultural solutions for optimal crop health and yield')}
            </p>
          </AnimatedSection>

          {productsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="w-full h-48 bg-muted" />
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-6 bg-muted rounded mb-3" />
                    <div className="h-16 bg-muted rounded mb-4" />
                    <div className="h-10 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="opacity-0 animate-[fadeInScale_0.6s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <TiltCard maxTilt={3}>
                    <Card className="card-hover overflow-hidden border-2 border-primary/10 h-full shadow-lg hover:shadow-2xl transition-shadow duration-500 group">
                      <div className="w-full h-56 overflow-hidden relative">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                          data-testid={`product-image-${product.id}`}
                        />
                        {/* Premium gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                      </div>
                      <CardContent className="p-6">
                        <Badge
                          variant="secondary"
                          className="mb-3 capitalize"
                          data-testid={`product-category-${product.id}`}
                        >
                          {t(`products.categories.${product.category}`, product.category)}
                        </Badge>
                        <h3 className="text-xl font-bold mb-2" data-testid={`product-name-${product.id}`}>
                          {product.name}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3" data-testid={`product-description-${product.id}`}>
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mb-4 text-sm">
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-primary mr-1" />
                            <span className="text-muted-foreground">
                              {product.suitableCrops.slice(0, 2).join(', ')}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Box className="w-4 h-4 text-primary mr-1" />
                            <span className="text-muted-foreground">
                              {product.packingSizes.slice(0, 2).join(', ')}
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => setIsQuoteModalOpen(true)}
                          className="w-full btn-primary"
                          data-testid={`product-quote-button-${product.id}`}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {t('cta.requestQuote', 'Request Quote')}
                        </Button>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="px-8 hover:scale-105 transition-transform">
              <Link href="/products">
                {t('cta.viewAllProducts', 'View Complete Catalog')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 bg-muted/30 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          <AnimatedSection animation="fade-in" className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              {t('testimonials.title', 'What Our Partners Say')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('testimonials.subtitle', 'Trusted by distributors worldwide')}
            </p>
          </AnimatedSection>

          <AnimatedSection animation="scale-fade" delay={200}>
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-2xl border-primary/10 backdrop-blur-sm bg-card/95">
                <CardContent className="p-8 lg:p-12 relative">
                  <div className="absolute top-8 left-8 text-6xl text-primary/20 select-none">
                    <span>"</span>
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center mb-6">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 ${
                            i < testimonials[activeTestimonial].rating
                              ? 'text-accent fill-accent'
                              : 'text-muted'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-xl lg:text-2xl text-foreground mb-8 leading-relaxed italic min-h-[6rem] transition-opacity duration-300">
                      {testimonials[activeTestimonial].text}
                    </p>

                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">
                          {testimonials[activeTestimonial].author}
                        </h4>
                        <p className="text-muted-foreground">
                          {testimonials[activeTestimonial].role}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Carousel Indicators */}
                  <div className="flex justify-center space-x-2 mt-8">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveTestimonial(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === activeTestimonial ? 'bg-primary w-8' : 'bg-muted hover:bg-muted-foreground/30'
                        }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                        data-testid={`testimonial-indicator-${index}`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Export Markets Overview */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          <AnimatedSection animation="fade-in-up" className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              {t('exports.title', 'Global Presence')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('exports.subtitle', 'Serving agricultural communities across continents')}
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {exportMarkets.slice(0, 3).map((market, index) => (
              <div
                key={market.id}
                className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <Card className="card-hover border-primary/20 h-full hover:border-primary/40 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl">{market.flagIcon}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{market.country}</h3>
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          {market.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center">
                            <Box className="w-4 h-4 text-primary mr-1" />
                            <span className="font-semibold">{market.productCount}+</span>
                            <span className="text-muted-foreground ml-1">Products</span>
                          </div>
                          <div className="flex items-center">
                            <Truck className="w-4 h-4 text-primary mr-1" />
                            <span className="font-semibold">{market.shipmentFrequency}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button asChild variant="outline" size="lg" className="px-8 hover:scale-105 transition-transform">
              <Link href="/exports">
                {t('cta.viewAllMarkets', 'View All Export Markets')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 hero-gradient relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-hero-pattern opacity-30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 max-w-7xl text-center relative z-10">
          <AnimatedSection animation="zoom-in">
            <div className="max-w-3xl mx-auto">
              <Sprout className="w-16 h-16 text-white/90 mx-auto mb-6" />
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                {t('cta.section.title', 'Ready to Transform Your Agricultural Business?')}
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                {t('cta.section.description', 'Join thousands of distributors worldwide who trust our premium agricultural solutions. Get expert consultation and competitive pricing for your market.')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setIsQuoteModalOpen(true)}
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                  data-testid="cta-get-quote-button"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {t('cta.getQuote', 'Get a Quote')}
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 px-8 py-6 text-lg font-semibold backdrop-blur-md rounded-xl transition-all hover:scale-105"
                  data-testid="cta-contact-us-button"
                >
                  <Link href="/contact">
                    {t('cta.contactUs', 'Contact Us')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </div>
  );
}
