
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Calendar, User, ArrowLeft, Tag, Share2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import AnimatedSection from "@/components/AnimatedSection";
import ReactMarkdown from "react-markdown";

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

export default function BlogPostDetail() {
    const { slug } = useParams();
    const { t } = useTranslation();

    const { data: post, isLoading } = useQuery<BlogPost>({
        queryKey: [`/api/blog-posts/slug/${slug}`],
        enabled: !!slug,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
                <Button asChild>
                    <Link href="/resources">Back to Resources</Link>
                </Button>
            </div>
        );
    }

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": post.imageUrl,
        "author": {
            "@type": "Organization",
            "name": "Sakthi Sai Biotech"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Sakthi Sai Biotech",
            "logo": {
                "@type": "ImageObject",
                "url": "https://sakthisaibiotech.com/logo.svg"
            }
        },
        "datePublished": post.publishedAt,
        "description": post.excerpt
    };

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title={post.metaTitle || post.title}
                description={post.metaDescription || post.excerpt}
                ogTitle={post.title}
                ogDescription={post.excerpt}
                ogImage={post.imageUrl}
                ogUrl={`https://sakthisaibiotech.com/resources/${post.slug}`}
                structuredData={structuredData}
            />

            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[400px]">
                <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 py-12">
                    <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
                        <Link href="/resources">
                            <Button variant="ghost" size="sm" className="mb-6 hover:bg-white/10 text-foreground">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Resources
                            </Button>
                        </Link>

                        <Badge className="mb-4 bg-primary text-primary-foreground">
                            {t(`resources.categories.${post.category}`, post.category)}
                        </Badge>

                        <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className="flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                Sakthi Sai Biotech Team
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 lg:px-8 max-w-4xl py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <AnimatedSection animation="fade-in-up">
                            <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-img:rounded-xl">
                                <ReactMarkdown>{post.content}</ReactMarkdown>
                            </article>
                        </AnimatedSection>

                        {/* Share and Tags */}
                        <div className="mt-12 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center space-x-2">
                                <Tag className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Tags:</span>
                                <Badge variant="outline">Agriculture</Badge>
                                <Badge variant="outline">Organic</Badge>
                                <Badge variant="outline">{post.category}</Badge>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" onClick={() => window.print()}>
                                    <Printer className="w-4 h-4 mr-2" />
                                    Print
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: post.title,
                                            text: post.excerpt,
                                            url: window.location.href,
                                        });
                                    }
                                }}>
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="sticky top-24">
                            <div className="bg-muted/30 rounded-xl p-6 border border-border">
                                <h3 className="text-lg font-bold mb-4">Table of Contents</h3>
                                <nav className="space-y-2 text-sm text-muted-foreground">
                                    <p>1. Introduction</p>
                                    <p>2. Key Benefits</p>
                                    <p>3. Application Methods</p>
                                    <p>4. Conclusion</p>
                                </nav>
                            </div>

                            <div className="mt-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20">
                                <h3 className="text-lg font-bold mb-2">Need Expert Advice?</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Get personalized recommendations for your crops from our agricultural experts.
                                </p>
                                <Button className="w-full btn-primary">
                                    Get Free Consultation
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
