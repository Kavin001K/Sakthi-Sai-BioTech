import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Globe, 
  Search, 
  Edit, 
  Save, 
  X, 
  Languages,
  Plus,
  Check
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface TranslationGroup {
  [key: string]: {
    [language: string]: string;
  };
}

export default function AdminLanguageManager() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState<Record<string, string>>({});

  // Fetch translations
  const { data: translations = {}, isLoading, error } = useQuery<TranslationGroup>({
    queryKey: ['/api/admin/translations'],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Update translation mutation
  const updateTranslationMutation = useMutation({
    mutationFn: async ({ key, language, value }: { key: string; language: string; value: string }) => {
      const response = await apiRequest('PUT', `/api/admin/translations/${key}/${language}`, { value });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/translations'] });
      // Also update the frontend translations
      i18n.reloadResources();
      toast({
        title: t('languages.success.title', 'Translation Updated'),
        description: t('languages.success.description', 'Translation has been successfully updated.'),
      });
    },
    onError: () => {
      toast({
        title: t('languages.error.title', 'Update Failed'),
        description: t('languages.error.description', 'Failed to update translation. Please try again.'),
        variant: "destructive",
      });
    },
  });

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'am', name: 'አማርኛ (Amharic)', flag: '🇪🇹' },
  ];

  // Filter translations based on search
  const filteredTranslations = Object.entries(translations).filter(([key, values]) => {
    if (searchQuery === '') return true;
    
    const searchLower = searchQuery.toLowerCase();
    return key.toLowerCase().includes(searchLower) ||
           Object.values(values).some(value => 
             value.toLowerCase().includes(searchLower)
           );
  });

  const handleEdit = (key: string) => {
    setEditingKey(key);
    setEditingValues(translations[key] || {});
  };

  const handleSave = async (key: string) => {
    try {
      // Save all languages for this key
      for (const [language, value] of Object.entries(editingValues)) {
        if (value !== translations[key]?.[language]) {
          await updateTranslationMutation.mutateAsync({ key, language, value });
        }
      }
      setEditingKey(null);
      setEditingValues({});
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditingValues({});
  };

  const handleValueChange = (language: string, value: string) => {
    setEditingValues(prev => ({
      ...prev,
      [language]: value
    }));
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <Languages className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">{t('languages.error.loadTitle', 'Failed to Load Languages')}</h2>
            <p className="text-muted-foreground">{t('languages.error.loadDescription', 'Please check your connection and try again.')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Languages className="w-8 h-8" />
                {t('languages.title', 'Language Manager')}
              </h1>
              <p className="text-muted-foreground mt-1">
                {t('languages.subtitle', 'Manage multilingual content across all languages')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {languages.map(lang => (
                <Badge 
                  key={lang.code} 
                  variant={i18n.language === lang.code ? "default" : "secondary"}
                  className="flex items-center gap-1"
                >
                  <span>{lang.flag}</span>
                  <span>{lang.code.toUpperCase()}</span>
                </Badge>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t('languages.search.placeholder', 'Search translations...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="language-search-input"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <Card>
            <CardContent className="p-8">
              <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-48 h-4 bg-muted animate-pulse rounded" />
                    <div className="flex-1 h-4 bg-muted animate-pulse rounded" />
                    <div className="flex-1 h-4 bg-muted animate-pulse rounded" />
                    <div className="flex-1 h-4 bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('languages.table.title', 'Translation Keys')}</span>
                <Badge variant="secondary">
                  {filteredTranslations.length} {t('languages.table.keys', 'keys')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-semibold min-w-[200px]">
                        {t('languages.table.key', 'Key')}
                      </th>
                      {languages.map(lang => (
                        <th key={lang.code} className="text-left p-4 font-semibold min-w-[250px]">
                          <div className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </div>
                        </th>
                      ))}
                      <th className="text-left p-4 font-semibold w-24">
                        {t('languages.table.actions', 'Actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTranslations.map(([key, values]) => (
                      <tr key={key} className="border-b border-border hover:bg-muted/30">
                        <td className="p-4">
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                            {key}
                          </code>
                        </td>
                        {languages.map(lang => (
                          <td key={lang.code} className="p-4">
                            {editingKey === key ? (
                              <Textarea
                                value={editingValues[lang.code] || ''}
                                onChange={(e) => handleValueChange(lang.code, e.target.value)}
                                placeholder={t('languages.table.placeholder', 'Enter translation...')}
                                className="min-h-[80px] text-sm"
                                data-testid={`translation-input-${key}-${lang.code}`}
                              />
                            ) : (
                              <div className="text-sm leading-relaxed">
                                {values[lang.code] ? (
                                  <span className="break-words">{values[lang.code]}</span>
                                ) : (
                                  <span className="text-muted-foreground italic">
                                    {t('languages.table.missing', 'Missing translation')}
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                        ))}
                        <td className="p-4">
                          {editingKey === key ? (
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleSave(key)}
                                disabled={updateTranslationMutation.isPending}
                                data-testid={`save-translation-${key}`}
                              >
                                {updateTranslationMutation.isPending ? (
                                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Save className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancel}
                                data-testid={`cancel-translation-${key}`}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(key)}
                              data-testid={`edit-translation-${key}`}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredTranslations.length === 0 && (
                <div className="text-center py-16">
                  <Languages className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">
                    {t('languages.table.empty.title', 'No translations found')}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('languages.table.empty.description', 'Try adjusting your search criteria or add new translation keys.')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              {t('languages.help.title', 'Translation Guidelines')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">{t('languages.help.keyFormat', 'Key Format')}</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {t('languages.help.keyDescription', 'Use dot notation for nested keys:')}
                </p>
                <code className="text-xs bg-muted px-2 py-1 rounded">hero.title</code>
                <code className="text-xs bg-muted px-2 py-1 rounded ml-2">nav.products</code>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">{t('languages.help.interpolation', 'Variable Interpolation')}</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {t('languages.help.interpolationDescription', 'Use double curly braces for variables:')}
                </p>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  Welcome, {'{{name}}'}
                </code>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-green-500" />
                <span>{t('languages.help.autoSync', 'Changes are automatically synchronized with the frontend')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
