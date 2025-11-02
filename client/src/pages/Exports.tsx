import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { 
  Globe, 
  MapPin, 
  Truck, 
  FileText, 
  CreditCard, 
  Headphones,
  Ship,
  Package,
  CheckCircle,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import QuoteModal from "@/components/QuoteModal";
import { useState } from "react";
import SEO from "@/components/SEO";

interface ExportMarket {
  id: string;
  country: string;
  countryCode: string;
  description: string;
  productCount: number;
  shipmentFrequency: string;
  isActive: boolean;
  flagIcon: string;
}

export default function Exports() {
  const { t } = useTranslation();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Fetch export markets
  const { data: exportMarkets = [], isLoading, error } = useQuery<ExportMarket[]>({
    queryKey: ['/api/export-markets'],
  });

  const exportServices = [
    {
      icon: Ship,
      title: t('exports.services.logistics.title', 'Global Logistics'),
      description: t('exports.services.logistics.description', 'Reliable shipping to all major ports worldwide with tracking and insurance'),
      color: 'text-primary',
    },
    {
      icon: FileText,
      title: t('exports.services.documentation.title', 'Complete Documentation'),
      description: t('exports.services.documentation.description', 'Full export compliance support including certificates and permits'),
      color: 'text-secondary',
    },
    {
      icon: CreditCard,
      title: t('exports.services.payment.title', 'Flexible Payment Options'),
      description: t('exports.services.payment.description', 'Multiple payment terms including L/C, T/T, and trade finance solutions'),
      color: 'text-accent',
    },
    {
      icon: Headphones,
      title: t('exports.services.support.title', '24/7 Export Support'),
      description: t('exports.services.support.description', 'Dedicated export team available for immediate assistance'),
      color: 'text-primary',
    },
  ];

  const exportProcess = [
    {
      step: 1,
      title: t('exports.process.inquiry.title', 'Initial Inquiry'),
      description: t('exports.process.inquiry.description', 'Submit your requirements and receive detailed product information and pricing'),
      icon: Package,
    },
    {
      step: 2,
      title: t('exports.process.quotation.title', 'Quotation & Terms'),
      description: t('exports.process.quotation.description', 'Receive comprehensive quotation with shipping terms and delivery schedule'),
      icon: FileText,
    },
    {
      step: 3,
      title: t('exports.process.order.title', 'Order Confirmation'),
      description: t('exports.process.order.description', 'Confirm order details, payment terms, and documentation requirements'),
      icon: CheckCircle,
    },
    {
      step: 4,
      title: t('exports.process.production.title', 'Production & Quality'),
      description: t('exports.process.production.description', 'Manufacturing with quality control and testing as per international standards'),
      icon: TrendingUp,
    },
    {
      step: 5,
      title: t('exports.process.shipping.title', 'Shipping & Delivery'),
      description: t('exports.process.shipping.description', 'Professional packaging, documentation, and shipment with tracking information'),
      icon: Truck,
    },
  ];

  const shippingTerms = [
    {
      term: 'FOB',
      title: t('exports.terms.fob.title', 'Free on Board'),
      description: t('exports.terms.fob.description', 'Goods delivered to port, buyer handles international shipping'),
    },
    {
      term: 'CIF',
      title: t('exports.terms.cif.title', 'Cost, Insurance, Freight'),
      description: t('exports.terms.cif.description', 'Price includes cost, insurance, and freight to destination port'),
    },
    {
      term: 'DDP',
      title: t('exports.terms.ddp.title', 'Delivered Duty Paid'),
      description: t('exports.terms.ddp.description', 'Complete door-to-door service including all duties and taxes'),
    },
  ];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <div className="text-destructive mb-4">
              <Globe className="w-12 h-12 mx-auto mb-2" />
            </div>
            <h2 className="text-xl font-bold mb-2">{t('exports.error.title', 'Failed to Load Export Markets')}</h2>
            <p className="text-muted-foreground">{t('exports.error.description', 'Please try refreshing the page or contact support.')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEO
        title="Exports"
        description="Information on our international exports of high-quality bio-agricultural products. Learn about our global partners and export capabilities."
        ogTitle="Exports - Sakthi Sai Biotech"
        ogDescription="Information on our international exports of high-quality bio-agricultural products."
        ogUrl="https://sakthisaibiotech.com/exports"
        ogImage="https://sakthisaibiotech.com/images/exports-preview.png"
        twitterImage="https://sakthisaibiotech.com/images/exports-preview.png"
      />
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <Badge className="bg-primary/10 text-primary border-primary/30 mb-6">
              <Globe className="w-4 h-4 mr-2" />
              {t('exports.hero.badge', 'Global Reach')}
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              {t('exports.hero.title', 'Global Export Markets')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('exports.hero.description', 'Serving agricultural communities across continents with premium products and reliable export services since 1999.')}
            </p>
          </div>

          {/* Global Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">{t('exports.stats.countries', 'Countries')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">25+</div>
              <div className="text-muted-foreground">{t('exports.stats.years', 'Years Experience')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">200+</div>
              <div className="text-muted-foreground">{t('exports.stats.products', 'Products')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">{t('exports.stats.shipments', 'Shipments/Year')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* World Map Placeholder */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t('exports.map.title', 'Our Global Presence')}
            </h2>
            <p className="text-muted-foreground">
              {t('exports.map.subtitle', 'Interactive map showing export routes and market presence')}
            </p>
          </div>

          <Card className="shadow-2xl border-primary/10">
            <CardContent className="p-8">
              <div className="aspect-video bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Globe className="w-20 h-20 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{t('exports.map.interactive', 'Interactive World Map')}</h3>
                  <p className="text-muted-foreground">
                    {t('exports.map.description', 'Comprehensive visualization of export routes and market distribution')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Key Export Markets */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t('exports.markets.title', 'Key Export Markets')}
            </h2>
            <p className="text-muted-foreground">
              {t('exports.markets.subtitle', 'Our established presence in major agricultural markets')}
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-16 bg-muted rounded mb-4" />
                    <div className="h-6 bg-muted rounded mb-2" />
                    <div className="h-16 bg-muted rounded mb-4" />
                    <div className="h-8 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {exportMarkets.slice(0, 6).map((market) => (
                <Card key={market.id} className="card-hover border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-4xl">{market.flagIcon}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2" data-testid={`market-country-${market.id}`}>
                          {market.country}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed" data-testid={`market-description-${market.id}`}>
                          {market.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center">
                            <Package className="w-4 h-4 text-primary mr-1" />
                            <span className="font-semibold">{market.productCount}+</span>
                            <span className="text-muted-foreground ml-1">{t('exports.markets.products', 'Products')}</span>
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
              ))}
            </div>
          )}

          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              {t('exports.markets.more', 'And many more markets across Africa, Asia, and beyond...')}
            </p>
            <Button
              onClick={() => setIsQuoteModalOpen(true)}
              size="lg"
              className="bg-primary hover:bg-primary/90"
              data-testid="explore-markets-button"
            >
              {t('cta.exploreMarkets', 'Explore Your Market')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Export Services */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t('exports.services.title', 'Our Export Services')}
            </h2>
            <p className="text-muted-foreground">
              {t('exports.services.subtitle', 'Comprehensive support for international trade')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {exportServices.map((service, index) => (
              <Card key={index} className="text-center card-hover">
                <CardContent className="p-8">
                  <service.icon className={`w-12 h-12 mx-auto mb-4 ${service.color}`} />
                  <h3 className="text-lg font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Export Process */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              {t('exports.process.title', 'Export Process')}
            </h2>
            <p className="text-muted-foreground">
              {t('exports.process.subtitle', 'Streamlined process from inquiry to delivery')}
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Process Timeline */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />
            
            <div className="grid lg:grid-cols-5 gap-8">
              {exportProcess.map((step, index) => (
                <div key={index} className="relative">
                  <Card className="card-hover">
                    <CardContent className="p-6 text-center">
                      {/* Step Number */}
                      <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg relative z-10">
                        {step.step}
                      </div>
                      
                      {/* Step Icon */}
                      <step.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                      
                      <h3 className="font-semibold mb-3">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                  
                  {/* Arrow for mobile */}
                  {index < exportProcess.length - 1 && (
                    <div className="lg:hidden flex justify-center my-4">
                      <ArrowRight className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Terms */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t('exports.terms.title', 'Flexible Shipping Terms')}
            </h2>
            <p className="text-muted-foreground">
              {t('exports.terms.subtitle', 'Choose the terms that work best for your business')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {shippingTerms.map((term, index) => (
              <Card key={index} className="card-hover border-primary/20">
                <CardContent className="p-8 text-center">
                  <Badge className="bg-primary text-primary-foreground text-lg px-4 py-2 mb-4">
                    {term.term}
                  </Badge>
                  <h3 className="text-xl font-semibold mb-3">{term.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{term.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
            <CardContent className="p-8 lg:p-12 text-center">
              <Globe className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">
                {t('exports.cta.title', 'Ready to Expand Your Market?')}
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                {t('exports.cta.description', 'Join our global network of distributors and bring premium agricultural solutions to your market. Our export experts are ready to support your success.')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setIsQuoteModalOpen(true)}
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 text-lg font-semibold"
                  data-testid="exports-cta-quote-button"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {t('cta.getExportQuote', 'Get Export Quote')}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 border-white/50 text-white backdrop-blur-sm px-8 py-4 text-lg font-semibold"
                  data-testid="exports-cta-contact-button"
                >
                  {t('cta.contactExportTeam', 'Contact Export Team')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
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
