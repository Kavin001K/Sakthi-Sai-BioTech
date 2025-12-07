import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: string;
}

export default function QuoteModal({ isOpen, onClose, initialProduct }: QuoteModalProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    country: "",
    productInterest: "",
    message: initialProduct ? `Inquiry about: ${initialProduct}` : "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get UTM parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      const inquiryData = {
        type: "quote_request",
        data: {
          ...formData,
          utmSource: urlParams.get('utm_source'),
          utmMedium: urlParams.get('utm_medium'),
          utmCampaign: urlParams.get('utm_campaign'),
        }
      };

      await apiRequest('POST', '/api/inquiries', inquiryData);

      toast({
        title: t('quote.success.title', 'Quote Request Submitted'),
        description: t('quote.success.description', 'Thank you! Our expert will contact you soon.'),
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        country: "",
        productInterest: "",
        message: "",
      });

      onClose();
    } catch (error) {
      toast({
        title: t('quote.error.title', 'Submission Failed'),
        description: t('quote.error.description', 'Please try again or contact us directly.'),
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
    { value: "other", label: "Other" },
  ];

  const productCategories = [
    { value: "micronutrients", label: t('products.micronutrients', 'Micronutrients') },
    { value: "bactericides", label: t('products.bactericides', 'Bactericides') },
    { value: "growth-promoters", label: t('products.growth-promoters', 'Growth Promoters') },
    { value: "bio-fertilizers", label: t('products.bio-fertilizers', 'Bio-Fertilizers') },
    { value: "multiple", label: t('products.multiple', 'Multiple Products') },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-accent" />
            {t('quote.title', 'Request a Quote')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="name">
                {t('form.name', 'Full Name')} *
              </label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={t('form.namePlaceholder', 'John Doe')}
                data-testid="quote-form-name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="email">
                {t('form.email', 'Email Address')} *
              </label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder={t('form.emailPlaceholder', 'john@example.com')}
                data-testid="quote-form-email"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="company">
                {t('form.company', 'Company Name')} *
              </label>
              <Input
                id="company"
                type="text"
                required
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder={t('form.companyPlaceholder', 'Company Ltd')}
                data-testid="quote-form-company"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="phone">
                {t('form.phone', 'Phone Number')} *
              </label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder={t('form.phonePlaceholder', '+1 234 567 890')}
                data-testid="quote-form-phone"
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
                <SelectTrigger data-testid="quote-form-country">
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
                {t('form.productInterest', 'Product Category')}
              </label>
              <Select
                value={formData.productInterest}
                onValueChange={(value) => handleInputChange('productInterest', value)}
              >
                <SelectTrigger data-testid="quote-form-product">
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
            <label className="block text-sm font-medium mb-2" htmlFor="message">
              {t('form.message', 'Message')}
            </label>
            <Textarea
              id="message"
              rows={3}
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder={t('form.messagePlaceholder', 'Brief message about your requirements')}
              data-testid="quote-form-message"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-4 rounded-lg font-semibold text-lg"
            data-testid="quote-form-submit"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
                {t('form.submitting', 'Submitting...')}
              </div>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                {t('cta.submitQuote', 'Submit Request')}
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
