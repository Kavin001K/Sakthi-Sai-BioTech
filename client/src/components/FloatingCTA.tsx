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
      <div className="fixed bottom-6 left-6 z-40 group">
        <Button
          onClick={() => setIsQuoteModalOpen(true)}
          className="bg-gradient-to-r from-accent via-orange-500 to-accent bg-[length:200%_100%] hover:bg-right text-accent-foreground px-6 py-4 rounded-full shadow-2xl hover:shadow-accent/50 font-semibold flex items-center space-x-2 transition-all duration-500 hover:scale-105 hover:-translate-y-1"
          data-testid="floating-cta-button"
        >
          <Send className="w-5 h-5 transition-transform group-hover:rotate-45 group-hover:scale-110" />
          <span className="hidden sm:inline">
            {t('cta.getQuote', 'Get Quote')}
          </span>
        </Button>
        {/* Glow effect */}
        <div className="absolute inset-0 -z-10 rounded-full bg-accent opacity-50 blur-xl group-hover:opacity-75 transition-opacity"></div>
      </div>

      <QuoteModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
      />
    </>
  );
}
