import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuoteModal from "./QuoteModal";

export default function FloatingCTA() {
  const { t } = useTranslation();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsQuoteModalOpen(true)}
          className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-4 rounded-full shadow-2xl font-semibold flex items-center space-x-2 floating-cta pulse-glow"
          data-testid="floating-cta-button"
        >
          <Send className="w-5 h-5" />
          <span className="hidden sm:inline">
            {t('cta.getQuote', 'Get Quote')}
          </span>
        </Button>
      </div>

      <QuoteModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
      />
    </>
  );
}
