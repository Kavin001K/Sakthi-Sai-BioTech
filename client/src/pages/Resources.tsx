import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  Calendar, 
  User, 
  ArrowRight, 
  BookOpen, 
  FileText, 
  Award,
  Download,
  ExternalLink,
  Filter,
  Clock,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  imageUrl: string;
  isPublished: boolean;
  publishedAt: string;
  authorId: string;
  metaTitle: string;
  metaDescription: string;
}

export default function Resources() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch blog posts
  const { data: blogPosts = [], isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
  });

  const categories = [
    { id: 'all', name: t('resources.categories.all', 'All Resources'), icon: BookOpen },
    { id: 'research', name: t('resources.categories.research', 'Research'), icon: Award },
    { id: 'case-study', name: t('resources.categories.case-study', 'Case Studies'), icon: FileText },
    { id: 'guide', name: t('resources.categories.guide', 'Guides'), icon: BookOpen },
  ];

  // Filter blog posts based on category and search
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch && post.isPublished;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'research': return 'bg-primary text-primary-foreground';
      case 'case-study': return 'bg-secondary text-secondary-foreground';
      case 'guide': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Mock data for additional resources
  const additionalResources = [
    {
      title: t('resources.additional.catalog.title', 'Complete Product Catalog'),
      description: t('resources.additional.catalog.description', 'Download our comprehensive product catalog with specifications and applications.'),
      type: 'PDF',
      size: '12 MB',
      icon: Download,
    },
    {
      title: t('resources.additional.application.title', 'Application Guide'),
      description: t('resources.additional.application.description', 'Step-by-step application guidelines for optimal results.'),
      type: 'PDF',
      size: '8 MB',
      icon: FileText,
    },
    {
      title: t('resources.additional.certification.title', 'Certifications & Quality'),
      description: t('resources.additional.certification.description', 'View our quality certifications and compliance documents.'),
      type: 'PDF',
      size: '5 MB',
      icon: Award,
    },
  ];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <div className="text-destructive mb-4">
              <BookOpen className="w-12 h-12 mx-auto mb-2" />
            </div>
            <h2 className="text-xl font-bold mb-2">{t('resources.error.title', 'Failed to Load Resources')}</h2>
            <p className="text-muted-foreground">{t('resources.error.description', 'Please try refreshing the page or contact support.')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <Badge className="bg-primary/10 text-primary border-primary/30 mb-6">
              <BookOpen className="w-4 h-4 mr-2" />
              {t('resources.hero.badge', 'Knowledge Center')}
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              {t('resources.hero.title', 'Resources & Insights')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('resources.hero.description', 'Expert knowledge, research findings, and practical guides to help you maximize agricultural productivity and make informed decisions.')}
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder={t('resources.search.placeholder', 'Search resources...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="resources-search-input"
              />
            </div>

            {/* Category Filters */}
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full lg:w-auto">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="text-sm"
                    data-testid={`resource-category-${category.id}`}
                  >
                    <category.icon className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t('resources.featured.title', 'Featured Resources')}
            </h2>
            <p className="text-muted-foreground">
              {t('resources.featured.subtitle', 'Essential downloads and guides for agricultural success')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {additionalResources.map((resource, index) => (
              <Card key={index} className="card-hover border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <resource.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                        {resource.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {resource.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{resource.size}</span>
                        </div>
                        <Button size="sm" variant="outline" data-testid={`download-resource-${index}`}>
                          <Download className="w-4 h-4 mr-2" />
                          {t('cta.download', 'Download')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {t('resources.blog.title', 'Latest Articles')}
              </h2>
              <p className="text-muted-foreground">
                {isLoading 
                  ? t('resources.loading', 'Loading articles...')
                  : t('resources.results', '{{count}} articles found', { count: filteredPosts.length })
                }
              </p>
            </div>
          </div>

          {isLoading ? (
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
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {t('resources.noResults.title', 'No Articles Found')}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {t('resources.noResults.description', 'Try adjusting your search criteria or browse all categories to find what you\'re looking for.')}
              </p>
              <Button 
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                variant="outline"
                data-testid="clear-filters-button"
              >
                {t('resources.noResults.clearFilters', 'Clear Filters')}
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="card-hover overflow-hidden border border-border group">
                  <div className="relative w-full h-48 overflow-hidden">
                    <img
                      src={post.imageUrl || 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500'}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      data-testid={`blog-post-image-${post.id}`}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge className={getCategoryColor(post.category)}>
                        <Tag className="w-3 h-3 mr-1" />
                        {t(`resources.categories.${post.category}`, post.category)}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span data-testid={`blog-post-date-${post.id}`}>
                          {formatDate(post.publishedAt)}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 line-clamp-2" data-testid={`blog-post-title-${post.id}`}>
                      {post.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3" data-testid={`blog-post-excerpt-${post.id}`}>
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{t('blog.readTime', '5 min read')}</span>
                      </div>
                      
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/80"
                        data-testid={`blog-post-read-more-${post.id}`}
                      >
                        <Link href={`/resources/${post.slug}`}>
                          {t('cta.readMore', 'Read More')}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
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
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="text-center text-white">
            <BookOpen className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">
              {t('resources.cta.title', 'Stay Updated with Latest Insights')}
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              {t('resources.cta.description', 'Subscribe to our newsletter for the latest research findings, application guides, and industry insights delivered to your inbox.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input
                type="email"
                placeholder={t('newsletter.placeholder', 'Enter your email')}
                className="bg-white/20 border-white/30 text-white placeholder-white/70"
              />
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                {t('cta.subscribe', 'Subscribe')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
