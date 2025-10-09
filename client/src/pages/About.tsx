import { useTranslation } from "react-i18next";
import { Users, MapPin, Award, TrendingUp, Globe, Target, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function About() {
  const { t } = useTranslation();

  const timelineEvents = [
    {
      year: '1999',
      title: t('timeline.1999.title', 'Company Founded'),
      description: t('timeline.1999.description', 'Started operations in Pollachi with a vision to revolutionize agricultural inputs'),
      position: 'right',
    },
    {
      year: '2005',
      title: t('timeline.2005.title', 'Product Innovation'),
      description: t('timeline.2005.description', 'Developed first range of bio-enhanced micronutrient formulations'),
      position: 'left',
    },
    {
      year: '2008',
      title: t('timeline.2008.title', 'International Expansion'),
      description: t('timeline.2008.description', 'Began exporting to Ethiopia and Indonesia markets'),
      position: 'right',
    },
    {
      year: '2012',
      title: t('timeline.2012.title', 'Research Partnership'),
      description: t('timeline.2012.description', 'Established collaborations with agricultural universities for product development'),
      position: 'left',
    },
    {
      year: '2015',
      title: t('timeline.2015.title', 'ISO Certification'),
      description: t('timeline.2015.description', 'Achieved ISO 9001:2015 certification for quality management systems'),
      position: 'right',
    },
    {
      year: '2020',
      title: t('timeline.2020.title', 'Digital Transformation'),
      description: t('timeline.2020.description', 'Launched digital platforms for better customer engagement and support'),
      position: 'left',
    },
    {
      year: '2024',
      title: t('timeline.2024.title', 'Global Presence'),
      description: t('timeline.2024.description', 'Expanded to 50+ countries with comprehensive product portfolio'),
      position: 'right',
    },
  ];

  const leadership = [
    {
      name: 'Mathivanan Gowthamvignesh',
      role: t('leadership.ceo.role', 'CEO & Founder'),
      bio: t('leadership.ceo.bio', 'Visionary leader with 25+ years in agricultural innovation and international trade'),
      image: null, // No image provided - using icon instead
    },
    {
      name: 'Dr. Rajesh Kumar',
      role: t('leadership.cso.role', 'Chief Scientific Officer'),
      bio: t('leadership.cso.bio', 'PhD in Agricultural Chemistry, leading our R&D initiatives and product development'),
      image: null,
    },
    {
      name: 'Priya Sharma',
      role: t('leadership.cto.role', 'Head of International Trade'),
      bio: t('leadership.cto.bio', 'Expert in global agricultural markets and export logistics with 15+ years experience'),
      image: null,
    },
  ];

  const achievements = [
    {
      icon: Globe,
      title: t('achievements.global.title', '50+ Countries'),
      description: t('achievements.global.description', 'Global export presence across multiple continents'),
      color: 'text-primary',
    },
    {
      icon: Award,
      title: t('achievements.quality.title', 'ISO Certified'),
      description: t('achievements.quality.description', 'Quality management system certification'),
      color: 'text-secondary',
    },
    {
      icon: TrendingUp,
      title: t('achievements.growth.title', '25+ Years'),
      description: t('achievements.growth.description', 'Consistent growth and innovation in agriculture'),
      color: 'text-accent',
    },
    {
      icon: Users,
      title: t('achievements.clients.title', '5000+ Clients'),
      description: t('achievements.clients.description', 'Trusted by distributors and farmers worldwide'),
      color: 'text-primary',
    },
  ];

  const values = [
    {
      icon: Target,
      title: t('values.quality.title', 'Quality Excellence'),
      description: t('values.quality.description', 'Commitment to highest quality standards in all our products and services'),
    },
    {
      icon: Globe,
      title: t('values.innovation.title', 'Innovation'),
      description: t('values.innovation.description', 'Continuous research and development to create cutting-edge agricultural solutions'),
    },
    {
      icon: CheckCircle,
      title: t('values.sustainability.title', 'Sustainability'),
      description: t('values.sustainability.description', 'Environmentally responsible practices for sustainable agriculture'),
    },
    {
      icon: Users,
      title: t('values.partnership.title', 'Partnership'),
      description: t('values.partnership.description', 'Building long-term relationships with customers and stakeholders'),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-animated opacity-20" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />

        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 backdrop-blur-sm text-primary border-primary/30 mb-6 animate-bounce-in">
              <Award className="w-4 h-4 mr-2 animate-pulse-slow" />
              {t('about.hero.badge', 'Since 1999 - Agricultural Innovation')}
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in">
              {t('about.hero.title', 'Growing Together Since 1999')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-slide-up">
              {t('about.hero.description', 'From our roots in Pollachi, Tamil Nadu – India\'s agricultural heartland – we\'ve grown into a trusted name in agricultural solutions, serving distributors across 50+ countries.')}
            </p>
          </div>
        </div>

        {/* Decorative floating elements */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </section>

      {/* Company Story */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl font-bold mb-6">
                {t('about.story.title', 'Our Story')}
              </h2>
              <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                <p>
                  {t('about.story.paragraph1', 'Founded in 1999 in the fertile lands of Pollachi, Tamil Nadu, Sakthi Sai Biotech began with a simple yet powerful vision: to revolutionize agricultural productivity through innovative, science-based solutions.')}
                </p>
                <p>
                  {t('about.story.paragraph2', 'Over the years, we have grown from a local manufacturer to an internationally recognized brand, combining traditional agricultural wisdom with modern biotechnology to create products that truly make a difference in crop health and farmer prosperity.')}
                </p>
                <p>
                  {t('about.story.paragraph3', 'Today, our commitment to quality, innovation, and farmer success has made us a preferred partner for distributors across the globe, with our products enhancing agricultural productivity in over 50 countries.')}
                </p>
              </div>
              <div className="mt-8">
                <Button asChild size="lg">
                  <Link href="/contact">
                    {t('cta.learnMore', 'Learn More About Us')}
                    <CheckCircle className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                  alt="Sakthi Sai Biotech Facility"
                  className="w-full h-full object-cover"
                  data-testid="about-company-image"
                />
              </div>
              <Card className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground shadow-xl">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold mb-1">5000+</div>
                  <div className="text-sm opacity-90">{t('stats.clients', 'Happy Clients')}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center card-hover">
                <CardContent className="p-8">
                  <achievement.icon className={`w-12 h-12 mx-auto mb-4 ${achievement.color}`} />
                  <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
                  <p className="text-muted-foreground text-sm">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {t('timeline.title', 'Our Journey')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('timeline.subtitle', 'Milestones that shaped our growth and innovation')}
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20 hidden lg:block" />

            <div className="space-y-16">
              {timelineEvents.map((event, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    event.position === 'right' ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } flex-col lg:gap-16 animate-fade-in`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Year Badge */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 lg:flex hidden items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-full font-bold text-lg z-10 shadow-lg animate-scale-in" style={{ animationDelay: `${index * 0.2 + 0.1}s` }}>
                    {event.year}
                  </div>

                  {/* Content */}
                  <Card className={`w-full lg:w-5/12 card-hover relative overflow-hidden ${
                    event.position === 'right' ? 'lg:ml-8' : 'lg:mr-8'
                  }`}>
                    {/* Animated border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <CardContent className="p-6 relative z-10">
                      <div className="lg:hidden mb-4">
                        <Badge className="bg-primary text-primary-foreground animate-pulse-slow">{event.year}</Badge>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Clock className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Spacer for opposite side */}
                  <div className="hidden lg:block w-5/12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {t('leadership.title', 'Our Leadership')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('leadership.subtitle', 'Experienced leaders driving innovation and growth')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {leadership.map((leader, index) => (
              <Card key={index} className="card-hover overflow-hidden">
                <div className="w-full h-64 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <Users className="w-20 h-20 text-primary/50" />
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2" data-testid={`leader-name-${index}`}>
                    {leader.name}
                  </h3>
                  <p className="text-primary font-semibold mb-3" data-testid={`leader-role-${index}`}>
                    {leader.role}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`leader-bio-${index}`}>
                    {leader.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {t('values.title', 'Our Values')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('values.subtitle', 'The principles that guide our mission and vision')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="card-hover text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Contact CTA */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <Card className="bg-gradient-to-r from-primary to-secondary text-white overflow-hidden">
            <CardContent className="p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">
                    {t('location.title', 'Visit Our Headquarters')}
                  </h2>
                  <p className="text-white/90 text-lg mb-6 leading-relaxed">
                    {t('location.description', 'Located in the heart of Tamil Nadu\'s agricultural region, our facilities combine traditional knowledge with modern technology.')}
                  </p>
                  <div className="flex items-start space-x-3 mb-6">
                    <MapPin className="w-6 h-6 text-white/90 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-semibold">Sakthi Sai Biotech</p>
                      <p className="text-white/90">Pollachi, Tamil Nadu 642001</p>
                      <p className="text-white/90">India</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 mb-8">
                    <Clock className="w-6 h-6 text-white/90" />
                    <div>
                      <p className="text-white/90">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                      <p className="text-white/90">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
                <div className="text-center lg:text-right">
                  <Button
                    asChild
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 text-lg font-semibold"
                  >
                    <Link href="/contact">
                      {t('cta.getInTouch', 'Get in Touch')}
                      <CheckCircle className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
