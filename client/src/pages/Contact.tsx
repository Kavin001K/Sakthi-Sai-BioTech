import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Mail, Phone, Clock, MessageCircle, CheckCircle, Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Contact() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    country: "",
    productInterest: "",
    message: "",
    acceptPrivacy: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptPrivacy) {
      toast({
        title: t('contact.error.privacy.title', 'Privacy Policy Required'),
        description: t('contact.error.privacy.description', 'Please accept the privacy policy to continue.'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get UTM parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      const inquiryData = {
        type: "contact_form",
        data: {
          ...formData,
          utmSource: urlParams.get('utm_source'),
          utmMedium: urlParams.get('utm_medium'),
          utmCampaign: urlParams.get('utm_campaign'),
        }
      };

      await apiRequest('POST', '/api/inquiries', inquiryData);

      toast({
        title: t('contact.success.title', 'Message Sent Successfully'),
        description: t('contact.success.description', 'Thank you for your inquiry. We will contact you within 24 hours.'),
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        country: "",
        productInterest: "",
        message: "",
        acceptPrivacy: false,
      });

    } catch (error) {
      toast({
        title: t('contact.error.title', 'Failed to Send Message'),
        description: t('contact.error.description', 'Please try again or contact us directly via phone or email.'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const countries = [
    { value: "ET", label: "Ethiopia" },
    { value: "ID", label: "Indonesia" },
    { value: "IN", label: "India" },
    { value: "KE", label: "Kenya" },
    { value: "TZ", label: "Tanzania" },
    { value: "UG", label: "Uganda" },
    { value: "ZA", label: "South Africa" },
    { value: "NG", label: "Nigeria" },
    { value: "GH", label: "Ghana" },
    { value: "other", label: "Other" },
  ];

  const productCategories = [
    { value: "micronutrients", label: t('products.micronutrients', 'Micronutrients') },
    { value: "bactericides", label: t('products.bactericides', 'Bactericides') },
    { value: "growth-promoters", label: t('products.growth-promoters', 'Growth Promoters') },
    { value: "bio-fertilizers", label: t('products.bio-fertilizers', 'Bio-Fertilizers') },
    { value: "multiple", label: t('products.multiple', 'Multiple Products') },
    { value: "consultation", label: t('products.consultation', 'Technical Consultation') },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
          <div className="absolute inset-0 bg-mesh-gradient opacity-50" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          <div className="text-center">
            <Badge className="bg-primary/10 backdrop-blur-sm text-primary border-primary/30 mb-6 animate-bounce-in">
              <MessageCircle className="w-4 h-4 mr-2 animate-pulse-slow" />
              {t('contact.hero.badge', 'Let\'s Connect')}
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in">
              {t('contact.hero.title', 'Get in Touch')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-up">
              {t('contact.hero.description', 'Ready to transform your agricultural business? Our experts are here to help you find the perfect solutions for your market.')}
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-24 h-24 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-xl card-hover animate-slide-in-left">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Send className="w-6 h-6 text-primary" />
                  </div>
                  <span>{t('contact.form.title', 'Send us a message')}</span>
                </CardTitle>
                <p className="text-muted-foreground">
                  {t('contact.form.subtitle', 'Fill out the form below and we\'ll get back to you as soon as possible.')}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        {t('form.name', 'Your Name')} *
                      </label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder={t('form.namePlaceholder', 'John Doe')}
                        data-testid="contact-form-name"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium mb-2">
                        {t('form.company', 'Company Name')} *
                      </label>
                      <Input
                        id="company"
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder={t('form.companyPlaceholder', 'Company Ltd')}
                        data-testid="contact-form-company"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        {t('form.email', 'Email Address')} *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder={t('form.emailPlaceholder', 'john@example.com')}
                        data-testid="contact-form-email"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        {t('form.phone', 'Phone Number')} *
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder={t('form.phonePlaceholder', '+1 234 567 890')}
                        data-testid="contact-form-phone"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('form.country', 'Country')} *
                      </label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) => handleInputChange('country', value)}
                        required
                      >
                        <SelectTrigger data-testid="contact-form-country">
                          <SelectValue placeholder={t('form.countryPlaceholder', 'Select Country')} />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.value} value={country.value}>
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('form.productInterest', 'Product Interest')}
                      </label>
                      <Select
                        value={formData.productInterest}
                        onValueChange={(value) => handleInputChange('productInterest', value)}
                      >
                        <SelectTrigger data-testid="contact-form-product">
                          <SelectValue placeholder={t('form.productPlaceholder', 'Select Category')} />
                        </SelectTrigger>
                        <SelectContent>
                          {productCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      {t('form.message', 'Message')} *
                    </label>
                    <Textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder={t('form.messagePlaceholder', 'Tell us about your requirements, target markets, and how we can help your business grow...')}
                      data-testid="contact-form-message"
                    />
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="privacy"
                      checked={formData.acceptPrivacy}
                      onCheckedChange={(checked) => handleInputChange('acceptPrivacy', checked as boolean)}
                      data-testid="contact-form-privacy"
                    />
                    <label htmlFor="privacy" className="text-sm text-muted-foreground leading-relaxed">
                      {t('form.privacy', 'I agree to the privacy policy and terms of service. I consent to being contacted about agricultural products and business opportunities.')} *
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-lg font-semibold text-lg"
                    data-testid="contact-form-submit"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        {t('form.sending', 'Sending...')}
                      </div>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        {t('cta.sendMessage', 'Send Message')}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8 animate-slide-in-right">
              {/* Google Maps */}
              <Card className="overflow-hidden card-hover">
                <div className="w-full h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-dot-pattern opacity-20" />
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-primary mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">{t('contact.map.title', 'Google Maps Integration')}</p>
                    <p className="text-sm text-muted-foreground">{t('contact.map.subtitle', 'Pollachi, Tamil Nadu')}</p>
                  </div>
                </div>
              </Card>

              {/* Contact Details */}
              <Card>
                <CardContent className="p-8 space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">{t('contact.address.title', 'Address')}</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        Sakthi Sai Biotech<br />
                        Pollachi, Tamil Nadu 642001<br />
                        India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">{t('contact.email.title', 'Email')}</h4>
                      <p className="text-muted-foreground">
                        <a href="mailto:info@sakthisaibiotech.com" className="hover:text-secondary transition-colors">
                          info@sakthisaibiotech.com
                        </a>
                      </p>
                      <p className="text-muted-foreground">
                        <a href="mailto:export@sakthisaibiotech.com" className="hover:text-secondary transition-colors">
                          export@sakthisaibiotech.com
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">{t('contact.phone.title', 'Phone')}</h4>
                      <p className="text-muted-foreground">+91 XXXX XXXXXX</p>
                      <p className="text-muted-foreground">+91 XXXX XXXXXX</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">{t('contact.hours.title', 'Business Hours')}</h4>
                      <p className="text-muted-foreground">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                      <p className="text-muted-foreground">Sunday: Closed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* WhatsApp Contact */}
              <Card className="bg-green-500 text-white">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-lg mb-1">
                      {t('contact.whatsapp.title', 'Instant Support')}
                    </h4>
                    <p className="text-sm opacity-90">
                      {t('contact.whatsapp.subtitle', 'Chat with us on WhatsApp for immediate assistance')}
                    </p>
                  </div>
                  <Button className="bg-white text-green-500 hover:bg-white/90 font-semibold">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {t('cta.chatNow', 'Chat Now')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t('contact.faq.title', 'Frequently Asked Questions')}
            </h2>
            <p className="text-muted-foreground">
              {t('contact.faq.subtitle', 'Quick answers to common questions')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">
                  {t('contact.faq.shipping.question', 'What are your shipping terms for international orders?')}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t('contact.faq.shipping.answer', 'We offer flexible shipping terms including FOB, CIF, and DDP depending on your requirements. Shipping times vary by destination but typically range from 2-6 weeks.')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">
                  {t('contact.faq.minimum.question', 'What is the minimum order quantity?')}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t('contact.faq.minimum.answer', 'Minimum order quantities vary by product. Contact us for specific MOQ information and volume discounts available for bulk orders.')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">
                  {t('contact.faq.certifications.question', 'Do you provide certificates and documentation?')}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t('contact.faq.certifications.answer', 'Yes, we provide complete documentation including certificates of analysis, phytosanitary certificates, and all required export documentation.')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">
                  {t('contact.faq.samples.question', 'Can I request product samples?')}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t('contact.faq.samples.answer', 'Yes, we provide samples for qualified distributors and bulk buyers. Sample requests are processed within 3-5 business days.')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
