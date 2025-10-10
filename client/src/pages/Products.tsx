import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Search, CheckCircle, Box, ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuoteModal from "@/components/QuoteModal";
import AnimatedSection from "@/components/AnimatedSection";

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

  // Fetch products
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const categories = useMemo(() => [
    { id: 'all', name: t('products.categories.all', 'All Products'), icon: '📦' },
    { id: 'micronutrients', name: t('products.categories.micronutrients', 'Micronutrients'), icon: '🧪' },
    { id: 'bactericides', name: t('products.categories.bactericides', 'Bactericides'), icon: '🛡️' },
    { id: 'growth-promoters', name: t('products.categories.growth-promoters', 'Growth Promoters'), icon: '🌱' },
    { id: 'bio-fertilizers', name: t('products.categories.bio-fertilizers', 'Bio-Fertilizers'), icon: '🌿' },
  ], [t]);

  // Filter products based on category and search - memoized for performance
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
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <div className="text-destructive mb-4">
              <Box className="w-12 h-12 mx-auto mb-2" />
            </div>
            <h2 className="text-xl font-bold mb-2">{t('products.error.title', 'Failed to Load Products')}</h2>
            <p className="text-muted-foreground">{t('products.error.description', 'Please try refreshing the page or contact support.')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-luxury-gradient-1">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          <AnimatedSection animation="fade-in-up" className="text-center mb-12">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-2">
              <Leaf className="w-4 h-4 mr-2" />
              <span className="font-semibold">{t('products.hero.badge', 'Premium Agricultural Solutions')}</span>
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-green-600 to-secondary bg-clip-text text-transparent">
              {t('products.hero.title', 'Our Product Range')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('products.hero.description', 'Comprehensive agricultural solutions designed for optimal crop health and yield enhancement. Trusted by distributors in over 50 countries worldwide.')}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-background border-b border-border sticky top-0 z-30 backdrop-blur-md bg-background/95">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
              <Input
                type="text"
                placeholder={t('products.search.placeholder', 'Search products...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="products-search-input"
              />
            </div>

            {/* Category Filters */}
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full lg:w-auto">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="text-xs sm:text-sm py-2"
                    data-testid={`category-filter-${category.id}`}
                  >
                    <span className="mr-1 sm:mr-2">{category.icon}</span>
                    <span className="hidden sm:inline">{category.name}</span>
                    <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          {/* Results Counter */}
          <div className="mb-8">
            <p className="text-muted-foreground font-medium">
              {isLoading
                ? t('products.loading', 'Loading products...')
                : t('products.results', '{{count}} products found', { count: filteredProducts.length })
              }
            </p>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {Array.from({ length: 9 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="w-full h-48 bg-muted" />
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-2 w-20" />
                    <div className="h-6 bg-muted rounded mb-3 w-full" />
                    <div className="h-16 bg-muted rounded mb-4" />
                    <div className="h-10 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <AnimatedSection animation="zoom-in">
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  {t('products.noResults.title', 'No Products Found')}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {t('products.noResults.description', 'Try adjusting your search criteria or browse all categories to find what you\'re looking for.')}
                </p>
                <Button
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}
                  variant="outline"
                  className="hover:scale-105 transition-transform"
                  data-testid="clear-filters-button"
                >
                  {t('products.noResults.clearFilters', 'Clear Filters')}
                </Button>
              </div>
            </AnimatedSection>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="opacity-0 animate-[fadeInScale_0.6s_ease-out_forwards]"
                  style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
                >
                  <Card className="card-hover overflow-hidden border border-border h-full group">
                    <div className="relative w-full h-48 overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        data-testid={`product-image-${product.id}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary inline-block">
                          ✓ Premium Quality
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <Badge
                        variant="secondary"
                        className="mb-3 capitalize"
                        data-testid={`product-category-${product.id}`}
                      >
                        <span className="mr-1">{getCategoryIcon(product.category)}</span>
                        {t(`products.categories.${product.category}`, product.category)}
                      </Badge>

                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors" data-testid={`product-name-${product.id}`}>
                        {product.name}
                      </h3>

                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3" data-testid={`product-description-${product.id}`}>
                        {product.description}
                      </p>

                      {/* Product Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-start text-sm">
                          <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground text-xs">
                            <strong className="text-foreground">{t('products.suitableFor', 'Suitable for')}:</strong> {product.suitableCrops.slice(0, 3).join(', ')}
                            {product.suitableCrops.length > 3 && ` +${product.suitableCrops.length - 3} more`}
                          </span>
                        </div>
                        <div className="flex items-start text-sm">
                          <Box className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground text-xs">
                            <strong className="text-foreground">{t('products.packingSizes', 'Packing')}:</strong> {product.packingSizes.slice(0, 3).join(', ')}
                          </span>
                        </div>
                      </div>

                      {/* Specifications Preview */}
                      {product.specifications && Object.keys(product.specifications).length > 0 && (
                        <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-primary/10">
                          <h4 className="text-xs font-semibold mb-2 text-primary">{t('products.keySpecs', 'Key Specifications')}</h4>
                          <div className="space-y-1">
                            {Object.entries(product.specifications).slice(0, 2).map(([key, value]) => (
                              <div key={key} className="flex justify-between text-xs">
                                <span className="text-muted-foreground">{key}:</span>
                                <span className="font-medium">{value}</span>
                              </div>
                            ))}
                            {Object.keys(product.specifications).length > 2 && (
                              <p className="text-xs text-primary/70 font-medium pt-1">
                                +{Object.keys(product.specifications).length - 2} more...
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          onClick={() => setIsQuoteModalOpen(true)}
                          className="flex-1 btn-primary"
                          data-testid={`product-quote-button-${product.id}`}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {t('cta.requestQuote', 'Request Quote')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="px-3 hover:bg-primary hover:text-primary-foreground transition-colors"
                          title={t('products.viewDetails', 'View Details')}
                          data-testid={`product-details-button-${product.id}`}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <AnimatedSection animation="fade-in-up">
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <Card className="bg-gradient-to-r from-primary via-green-600 to-secondary text-white overflow-hidden relative">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

              <CardContent className="p-8 lg:p-12 text-center relative z-10">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  {t('products.cta.title', 'Can\'t Find What You\'re Looking For?')}
                </h2>
                <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
                  {t('products.cta.description', 'Our experts can help you find the perfect agricultural solution for your specific needs. Get personalized recommendations and competitive pricing.')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => setIsQuoteModalOpen(true)}
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                    data-testid="products-cta-quote-button"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {t('cta.getCustomQuote', 'Get Custom Quote')}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white/10 hover:bg-white/20 border-white/50 text-white backdrop-blur-sm hover:scale-105 transition-transform"
                    data-testid="products-cta-contact-button"
                  >
                    {t('cta.contactExpert', 'Contact Expert')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </AnimatedSection>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </div>
  );
}
