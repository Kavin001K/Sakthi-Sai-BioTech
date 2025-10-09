import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, CheckCircle, Box, ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuoteModal from "@/components/QuoteModal";

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

  const categories = [
    { id: 'all', name: t('products.categories.all', 'All Products'), color: 'bg-primary' },
    { id: 'micronutrients', name: t('products.categories.micronutrients', 'Micronutrients'), color: 'bg-green-600' },
    { id: 'bactericides', name: t('products.categories.bactericides', 'Bactericides'), color: 'bg-blue-600' },
    { id: 'growth-promoters', name: t('products.categories.growth-promoters', 'Growth Promoters'), color: 'bg-purple-600' },
    { id: 'bio-fertilizers', name: t('products.categories.bio-fertilizers', 'Bio-Fertilizers'), color: 'bg-emerald-600' },
  ];

  // Filter products based on category and search
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.suitableCrops.some(crop => crop.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch && product.isActive;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'micronutrients': return '🧪';
      case 'bactericides': return '🛡️';
      case 'growth-promoters': return '🌱';
      case 'bio-fertilizers': return '🌿';
      default: return '📦';
    }
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
      <section className="relative py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-mesh-gradient">
          <div className="absolute inset-0 bg-dot-pattern opacity-40" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm text-primary px-4 py-2 rounded-full mb-6 animate-bounce-in border border-primary/20">
              <Leaf className="w-5 h-5 animate-pulse-slow" />
              <span className="font-semibold">{t('products.hero.badge', 'Premium Agricultural Solutions')}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in">
              {t('products.hero.title', 'Our Product Range')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-up">
              {t('products.hero.description', 'Comprehensive agricultural solutions designed for optimal crop health and yield enhancement. Trusted by distributors in over 50 countries worldwide.')}
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
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
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="text-sm"
                    data-testid={`category-filter-${category.id}`}
                  >
                    <span className="mr-2">{getCategoryIcon(category.id)}</span>
                    <span className="hidden sm:inline">{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          {/* Results Counter */}
          <div className="mb-8">
            <p className="text-muted-foreground">
              {isLoading 
                ? t('products.loading', 'Loading products...')
                : t('products.results', '{{count}} products found', { count: filteredProducts.length })
              }
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 9 }).map((_, index) => (
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
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
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
                data-testid="clear-filters-button"
              >
                {t('products.noResults.clearFilters', 'Clear Filters')}
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className="card-hover overflow-hidden border border-border group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative w-full h-48 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
                      data-testid={`product-image-${product.id}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex gap-2">
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary">
                          ✓ Premium Quality
                        </div>
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
                    
                    <h3 className="text-xl font-bold mb-2" data-testid={`product-name-${product.id}`}>
                      {product.name}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3" data-testid={`product-description-${product.id}`}>
                      {product.description}
                    </p>

                    {/* Product Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                        <span className="text-muted-foreground">
                          <strong>{t('products.suitableFor', 'Suitable for')}:</strong> {product.suitableCrops.join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Box className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                        <span className="text-muted-foreground">
                          <strong>{t('products.packingSizes', 'Packing')}:</strong> {product.packingSizes.join(', ')}
                        </span>
                      </div>
                    </div>

                    {/* Specifications Preview */}
                    {product.specifications && Object.keys(product.specifications).length > 0 && (
                      <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                        <h4 className="text-sm font-semibold mb-2">{t('products.keySpecs', 'Key Specifications')}</h4>
                        <div className="space-y-1">
                          {Object.entries(product.specifications).slice(0, 2).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-xs">
                              <span className="text-muted-foreground">{key}:</span>
                              <span className="font-medium">{value}</span>
                            </div>
                          ))}
                          {Object.keys(product.specifications).length > 2 && (
                            <p className="text-xs text-muted-foreground">
                              +{Object.keys(product.specifications).length - 2} more specifications
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={() => setIsQuoteModalOpen(true)}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                        data-testid={`product-quote-button-${product.id}`}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {t('cta.requestQuote', 'Request Quote')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-3"
                        title={t('products.viewDetails', 'View Details')}
                        data-testid={`product-details-button-${product.id}`}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <Card className="bg-gradient-to-r from-primary to-secondary text-white">
            <CardContent className="p-8 lg:p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                {t('products.cta.title', 'Can\'t Find What You\'re Looking For?')}
              </h2>
              <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
                {t('products.cta.description', 'Our experts can help you find the perfect agricultural solution for your specific needs. Get personalized recommendations and competitive pricing.')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setIsQuoteModalOpen(true)}
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  data-testid="products-cta-quote-button"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {t('cta.getCustomQuote', 'Get Custom Quote')}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 border-white/50 text-white backdrop-blur-sm"
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

      {/* Quote Modal */}
      <QuoteModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
      />
    </div>
  );
}
