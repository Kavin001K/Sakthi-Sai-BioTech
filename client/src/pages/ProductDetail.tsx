import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ArrowLeft, CheckCircle, Leaf, Wind, Droplets, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import QuoteModal from "@/components/QuoteModal";
import AnimatedSection from "@/components/AnimatedSection";
import SEO from "@/components/SEO";
import { useState } from "react";

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

export default function ProductDetail() {
    const { t } = useTranslation();
    const [, params] = useRoute("/products/:id");
    const id = params?.id;
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

    const { data: product, isLoading, error } = useQuery<Product>({
        queryKey: [`/api/products/${id}`],
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 pb-12 bg-background">
                <div className="container mx-auto px-4">
                    <div className="animate-pulse space-y-8">
                        <div className="h-8 bg-muted rounded w-1/4"></div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="h-96 bg-muted rounded"></div>
                            <div className="space-y-4">
                                <div className="h-10 bg-muted rounded w-3/4"></div>
                                <div className="h-4 bg-muted rounded w-1/2"></div>
                                <div className="h-32 bg-muted rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen pt-24 pb-12 bg-background flex flex-col items-center justify-center text-center">
                <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                <Button asChild>
                    <Link href="/products">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Products
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <SEO
                title={`${product.name} - Sakthi Sai Biotech`}
                description={product.description}
                keywords={[
                    product.name,
                    product.category,
                    ...product.suitableCrops,
                    'organic agriculture',
                    'crop yield booster'
                ]}
                canonicalUrl={`https://sakthisaibiotech.com/products/${product.id}`}
                ogTitle={`${product.name} - Sakthi Sai Biotech`}
                ogDescription={product.description}
                ogImage={product.imageUrl}
                structuredData={{
                    "@context": "https://schema.org/",
                    "@type": "Product",
                    "name": product.name,
                    "image": product.imageUrl,
                    "description": product.description,
                    "brand": {
                        "@type": "Brand",
                        "name": "Sakthi Sai Biotech"
                    },
                    "offers": {
                        "@type": "Offer",
                        "url": `https://sakthisaibiotech.com/products/${product.id}`,
                        "priceCurrency": "INR",
                        "price": "0", // Price on request
                        "availability": "https://schema.org/InStock"
                    }
                }}
            />

            <div className="pt-24 pb-12">
                <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
                    <Button asChild variant="ghost" className="mb-8 hover:bg-muted">
                        <Link href="/products">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {t('product.backToCatalog', 'Back to Catalog')}
                        </Link>
                    </Button>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Image Section */}
                        <AnimatedSection animation="slide-right">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
                                <div className="aspect-square relative">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* Content Section */}
                        <AnimatedSection animation="slide-left">
                            <div>
                                <Badge variant="outline" className="mb-4 text-primary border-primary/50 text-sm font-medium capitalize">
                                    {t(`products.categories.${product.category}`, product.category)}
                                </Badge>

                                <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground bg-clip-text">
                                    {product.name}
                                </h1>

                                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                                    {product.description}
                                </p>

                                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                                    <Card className="bg-card/50 border-border/50">
                                        <CardContent className="p-4 flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                                <Wind className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">Suitable Crops</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {product.suitableCrops.join(", ")}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-card/50 border-border/50">
                                        <CardContent className="p-4 flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                                <Droplets className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">Packing Sizes</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {product.packingSizes.join(", ")}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {product.specifications && Object.keys(product.specifications).length > 0 && (
                                    <div className="mb-8 p-6 bg-muted/30 rounded-2xl border border-border/50">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <Leaf className="w-4 h-4 text-primary" />
                                            Specifications
                                        </h3>
                                        <div className="grid gap-3">
                                            {Object.entries(product.specifications).map(([key, value]) => (
                                                <div key={key} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                                                    <span className="text-muted-foreground font-medium">{key}</span>
                                                    <span className="font-semibold text-foreground">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                    <Button onClick={() => setIsQuoteModalOpen(true)} size="lg" className="flex-1 btn-primary text-lg h-14">
                                        <CheckCircle className="w-5 h-5 mr-3" />
                                        {t('cta.requestQuote', 'Request Quote')}
                                    </Button>
                                    <Button variant="outline" size="lg" className="flex-1 text-lg h-14" asChild>
                                        <Link href="/contact">
                                            Contact Sales
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </div>

            <QuoteModal
                isOpen={isQuoteModalOpen}
                onClose={() => setIsQuoteModalOpen(false)}
                initialProduct={product.name}
            />
        </div>
    );
}
