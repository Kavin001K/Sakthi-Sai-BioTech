import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Search, CheckCircle, Box, ArrowRight, Leaf, Wind, Zap, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuoteModal from "@/components/QuoteModal";
import AnimatedSection from "@/components/AnimatedSection";
import TiltCard from "@/components/TiltCard";
import SEO from "@/components/SEO";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  specifications: Record<string, string>;
  imageUrl: string;
  suitableCrops: string[];
  packingSizes: string[];
  isActive: boolean;
}

export default function Products() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Fetch products and select only the first 7
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    select: (data) => data.slice(0, 7),
  });

  const categories = useMemo(() => [
    { id: 'all', name: t('products.categories.all', 'All Products'), icon: '📦' },
    { id: 'plant-growth-promotor', name: t('products.categories.plant-growth-promotor', 'Plant Growth Promotor'), icon: '🌱' },
    { id: 'bactericide-fungicide', name: t('products.categories.bactericide-fungicide', 'Bactericide Fungicide'), icon: '🛡️' },
    { id: 'micronutrients', name: t('products.categories.micronutrients', 'Micronutrients'), icon: '🧪' },
    { id: 'liquid-fertilizer', name: t('products.categories.liquid-fertilizer', 'Liquid Fertilizer'), icon: '💧' },
    { id: 'pesticides', name: t('products.categories.pesticides', 'Pesticides'), icon: '🦟' },
  ], [t]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const matchesSearch = searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.suitableCrops.some(crop => crop.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch && product.isActive;
    });
  }, [products, activeCategory, searchQuery]);

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : '📦';
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Card className="max-w-md w-full mx-4 bg-card border-destructive/50 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="text-destructive mb-4">
              <Box className="w-16 h-16 mx-auto mb-4 animate-bounce" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{t('products.error.title', 'Failed to Load Products')}</h2>
            <p className="text-muted-foreground">{t('products.error.description', 'Please try refreshing the page or contact support.')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Our Products - Agricultural Solutions"
        description="Explore our range of bio-fertilizers, bio-pesticides, plant growth promoters, and organic agricultural products designed for maximum yield."
        keywords={[
          'agricultural products',
          'bio-fertilizers',
          'organic pesticides',
          'plant growth promoters',
          'micronutrients market',
          'sustainable farming',
          'Sakthi Sai Biotech products',
          'crop protection',
          'soil health',
          'organic farming solutions',
          'agricultural inputs',
          'bio-stimulants',
          'liquid fertilizers',
          'pesticides for crops',
          'plant nutrition'
        ]}
        canonicalUrl="https://sakthisaibiotech.com/products"
        ogTitle="Agricultural Products Catalog - Sakthi Sai Biotech"
        ogDescription="Explore our range of bio-fertilizers, bio-pesticides, plant growth promoters, and organic agricultural products."
        ogUrl="https://sakthisaibiotech.com/products"
        ogImage="https://sakthisaibiotech.com/images/product-preview.png"
        twitterImage="https://sakthisaibiotech.com/images/product-preview.png"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Product Catalog - Sakthi Sai Biotech",
          "description": "Explore our curated selection of high-performance agricultural products, engineered for maximum yield and sustainability.",
          "url": "https://sakthisaibiotech.com/products",
          "publisher": {
            "@type": "Organization",
            "name": "Sakthi Sai Biotech",
            "logo": {
              "@type": "ImageObject",
              "url": "https://sakthisaibiotech.com/logo.png"
            }
          }
        }}
      />
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-b from-background to-transparent">
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent" />
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          <AnimatedSection animation="fade-in-up" className="text-center">
            <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-semibold border-primary/50 text-primary">
              <Leaf className="w-4 h-4 mr-2" />
              {t('products.hero.badge', 'Premium Agricultural Solutions')}
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
              {t('products.hero.title', 'Product Catalog')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('products.hero.description', 'Explore our curated selection of high-performance agricultural products, engineered for maximum yield and sustainability.')}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-6 bg-background/80 backdrop-blur-lg border-y border-border/50 sticky top-0 z-30">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder={t('products.search.placeholder', 'Search products...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-full bg-card border-border/60 focus:ring-primary/50 focus:border-primary"
              />
            </div>
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full lg:w-auto">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto bg-card p-2 rounded-full">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="text-sm rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="mb-8">
            <p className="text-muted-foreground font-medium">
              {isLoading
                ? t('products.loading', 'Loading products...')
                : t('products.results', 'Showing {{count}} featured products', { count: filteredProducts.length })
              }
            </p>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 7 }).map((_, index) => (
                <Card key={index} className="bg-card border-border/50 animate-pulse">
                  <div className="w-full h-56 bg-muted-foreground/20" />
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted-foreground/20 rounded w-1/3 mb-3" />
                    <div className="h-6 bg-muted-foreground/20 rounded w-full mb-4" />
                    <div className="h-20 bg-muted-foreground/20 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <AnimatedSection animation="zoom-in" className="text-center py-20">
              <div className="w-24 h-24 bg-card border border-border/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-3xl font-bold mb-4">{t('products.noResults.title', 'No Products Found')}</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {t('products.noResults.description', 'Your search returned no results. Try a different query or clear the filters.')}
              </p>
              <Button onClick={() => { setActiveCategory('all'); setSearchQuery(''); }} variant="outline">
                {t('products.noResults.clearFilters', 'Clear Filters')}
              </Button>
            </AnimatedSection>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <AnimatedSection key={product.id} animation="fade-in-up" delay={index * 100}>
                  <TiltCard maxTilt={3}>
                    <Card className="bg-card border-border/50 h-full group overflow-hidden shadow-lg hover:shadow-primary/20 hover:border-primary/80 transition-all duration-300">
                      <div className="relative w-full h-56 overflow-hidden">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      </div>
                      <CardContent className="p-6 flex flex-col flex-grow">
                        <Badge variant="secondary" className="mb-3 capitalize self-start">
                          <span className="mr-1.5">{getCategoryIcon(product.category)}</span>
                          {t(`products.categories.${product.category}`, product.category)}
                        </Badge>
                        <h3 className="text-2xl font-bold mb-3 flex-grow group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-5 line-clamp-3">
                          {product.description}
                        </p>

                        <div className="space-y-3 mb-6 text-sm">
                          <div className="flex items-center">
                            <Wind className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                            <span className="text-muted-foreground">
                              <strong className="text-foreground font-semibold">Crops:</strong> {product.suitableCrops.slice(0, 2).join(', ')}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Droplets className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                            <span className="text-muted-foreground">
                              <strong className="text-foreground font-semibold">Packing:</strong> {product.packingSizes.slice(0, 2).join(', ')}
                            </span>
                          </div>
                        </div>

                        <div className="mt-auto flex gap-3">
                          <Button onClick={() => setIsQuoteModalOpen(true)} className="flex-1 btn-primary">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {t('cta.requestQuote', 'Request Quote')}
                          </Button>
                          <Link href={`/products/${product.id}`}>
                            <Button variant="outline" size="icon" className="border-border/70 hover:bg-primary hover:text-primary-foreground">
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <AnimatedSection animation="fade-in-up">
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
            <div className="bg-card border border-border/50 rounded-2xl p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />
              <div className="text-center relative z-10">
                <h2 className="text-4xl font-bold mb-4">
                  {t('products.cta.title', 'Need a Custom Solution?')}
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                  {t('products.cta.description', 'Our team of agricultural experts is ready to assist you with custom formulations and bulk orders. Let us help you achieve your goals.')}
                </p>
                <Button onClick={() => setIsQuoteModalOpen(true)} size="lg" className="btn-primary">
                  <Zap className="w-5 h-5 mr-2" />
                  {t('cta.getCustomQuote', 'Get a Custom Quote')}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </div>
  );
}