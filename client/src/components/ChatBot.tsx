import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MessageCircle, Send, Bot, User, X, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatBot() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: t('chatbot.welcome', 'Hello! I\'m AgriBot, your agricultural assistant. How can I help you with our products today?'),
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await apiRequest('POST', '/api/chatbot/query', {
        query: content,
        context: 'agricultural_products'
      });

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t('chatbot.error', 'I\'m experiencing technical difficulties. Please contact our support team directly for immediate assistance.'),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const quickQuestions = [
    t('chatbot.quick.micronutrients', 'Tell me about micronutrients'),
    t('chatbot.quick.bactericides', 'What bactericides do you offer?'),
    t('chatbot.quick.export', 'Do you export to my country?'),
    t('chatbot.quick.pricing', 'How can I get pricing information?'),
  ];

  return (
    <>
      {/* Chat Widget */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-96 h-[500px] flex flex-col shadow-2xl border-2 border-primary/20">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold">AgriBot Assistant</h4>
                <p className="text-xs opacity-80">{t('chatbot.status', 'Online now')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 p-0 hover:bg-white/20"
                data-testid="chatbot-close"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-accent text-accent-foreground' 
                    : 'bg-primary/10 text-primary'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted text-foreground'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground text-center mb-3">
                  {t('chatbot.quickQuestions', 'Quick questions:')}
                </p>
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(question)}
                    className="w-full text-left text-sm p-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                    data-testid={`chatbot-quick-question-${index}`}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={t('chatbot.placeholder', 'Type your question...')}
                disabled={isTyping}
                className="flex-1"
                data-testid="chatbot-input"
              />
              <Button 
                type="submit" 
                disabled={isTyping || !inputMessage.trim()}
                size="sm"
                className="bg-primary hover:bg-primary/90"
                data-testid="chatbot-send"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}

      {/* Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40 group">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-br from-primary via-green-600 to-primary text-primary-foreground w-14 h-14 rounded-full shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-110 hover:rotate-12 relative overflow-hidden"
          data-testid="chatbot-toggle"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

          {isOpen ? (
            <X className="w-6 h-6 relative z-10" />
          ) : (
            <MessageCircle className="w-6 h-6 relative z-10 animate-bounce-slow" />
          )}
        </Button>

        {/* Pulsing ring */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full border-2 border-primary animate-pulse-ring"></div>
        )}

        {/* Glow effect */}
        <div className="absolute inset-0 -z-10 rounded-full bg-primary opacity-50 blur-xl group-hover:opacity-75 transition-opacity"></div>
      </div>
    </>
  );
}
