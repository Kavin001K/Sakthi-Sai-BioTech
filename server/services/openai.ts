import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatbotResponse {
  response: string;
  confidence: number;
}

export async function processChatbotQuery(query: string, context?: string): Promise<ChatbotResponse> {
  try {
    const systemPrompt = `You are AgriBot, an AI assistant for Sakthi Sai Biotech, a Tamil Nadu-based agricultural products manufacturer and exporter since 1999. 

Company Information:
- Location: Pollachi, Tamil Nadu, India
- Founded: 1999
- Products: Micronutrients, Bactericides, Growth Promoters, Bio-Fertilizers
- Export Markets: Ethiopia, Indonesia, and 50+ other countries
- Specialties: Premium agricultural solutions for crop health and yield improvement

Guidelines:
- Be helpful and professional
- Focus on agricultural solutions and company products
- Provide accurate information about crop health, farming practices
- If asked about specific products, mention our categories: micronutrients, bactericides, growth promoters, bio-fertilizers
- For business inquiries, suggest contacting our sales team
- Keep responses concise but informative
- If you don't know specific details, be honest and suggest contacting the company directly

Respond in JSON format with "response" and "confidence" (0-1) fields.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      response: result.response || "I'm here to help with agricultural questions. Could you please rephrase your question?",
      confidence: Math.max(0, Math.min(1, result.confidence || 0.8))
    };
  } catch (error) {
    console.error('Chatbot query error:', error);
    return {
      response: "I'm experiencing technical difficulties. Please contact our support team directly for immediate assistance.",
      confidence: 0.5
    };
  }
}

export async function generateProductSuggestions(query: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5", 
      messages: [
        {
          role: "system",
          content: "You are an agricultural expert. Based on the crop or farming issue mentioned, suggest relevant product categories from: micronutrients, bactericides, growth-promoters, bio-fertilizers. Respond with JSON array of suggestions."
        },
        {
          role: "user", 
          content: query
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1024,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"suggestions": []}');
    return result.suggestions || [];
  } catch (error) {
    console.error('Product suggestion error:', error);
    return [];
  }
}
