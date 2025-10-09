import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Save,
  X,
  Upload,
  Eye,
  EyeOff
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string | null;
  specifications: Record<string, string> | null;
  imageUrl: string | null;
  suitableCrops: string[];
  packingSizes: string[];
  isActive: boolean;
  createdAt: string;
}

// Form validation schema
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  suitableCrops: z.array(z.string()).min(1, "At least one suitable crop is required"),
  packingSizes: z.array(z.string()).min(1, "At least one packing size is required"),
  isActive: z.boolean().default(true),
  specifications: z.record(z.string()).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AdminProductManager() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");

  // Fetch products
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/admin/products'],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Form setup
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      imageUrl: "",
      suitableCrops: [],
      packingSizes: [],
      isActive: true,
      specifications: {},
    },
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const response = await apiRequest('POST', '/api/admin/products', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] }); // Public products
      toast({
        title: t('products.success.created', 'Product Created'),
        description: t('products.success.createdDesc', 'Product has been successfully created.'),
      });
      handleCloseDialog();
    },
    onError: () => {
      toast({
        title: t('products.error.create', 'Creation Failed'),
        description: t('products.error.createDesc', 'Failed to create product. Please try again.'),
        variant: "destructive",
      });
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductFormData }) => {
      const response = await apiRequest('PUT', `/api/admin/products/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: t('products.success.updated', 'Product Updated'),
        description: t('products.success.updatedDesc', 'Product has been successfully updated.'),
      });
      handleCloseDialog();
    },
    onError: () => {
      toast({
        title: t('products.error.update', 'Update Failed'),
        description: t('products.error.updateDesc', 'Failed to update product. Please try again.'),
        variant: "destructive",
      });
    },
  });

  const categories = [
    { value: 'micronutrients', label: t('products.categories.micronutrients', 'Micronutrients') },
    { value: 'bactericides', label: t('products.categories.bactericides', 'Bactericides') },
    { value: 'growth-promoters', label: t('products.categories.growth-promoters', 'Growth Promoters') },
    { value: 'bio-fertilizers', label: t('products.categories.bio-fertilizers', 'Bio-Fertilizers') },
  ];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      form.reset({
        name: product.name,
        category: product.category,
        description: product.description || "",
        imageUrl: product.imageUrl || "",
        suitableCrops: product.suitableCrops,
        packingSizes: product.packingSizes,
        isActive: product.isActive,
        specifications: product.specifications || {},
      });
    } else {
      setEditingProduct(null);
      form.reset({
        name: "",
        category: "",
        description: "",
        imageUrl: "",
        suitableCrops: [],
        packingSizes: [],
        isActive: true,
        specifications: {},
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    form.reset();
    setSpecKey("");
    setSpecValue("");
  };

  const handleSubmit = (data: ProductFormData) => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data });
    } else {
      createProductMutation.mutate(data);
    }
  };

  const handleAddSpecification = () => {
    if (specKey && specValue) {
      const currentSpecs = form.getValues("specifications") || {};
      form.setValue("specifications", {
        ...currentSpecs,
        [specKey]: specValue
      });
      setSpecKey("");
      setSpecValue("");
    }
  };

  const handleRemoveSpecification = (key: string) => {
    const currentSpecs = form.getValues("specifications") || {};
    const newSpecs = { ...currentSpecs };
    delete newSpecs[key];
    form.setValue("specifications", newSpecs);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <Package className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">{t('products.error.loadTitle', 'Failed to Load Products')}</h2>
            <p className="text-muted-foreground">{t('products.error.loadDescription', 'Please check your connection and try again.')}</p>
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
                <Package className="w-8 h-8" />
                {t('products.title', 'Product Manager')}
              </h1>
              <p className="text-muted-foreground mt-1">
                {t('products.subtitle', 'Manage your product catalog and specifications')}
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()} data-testid="add-product-button">
                  <Plus className="w-4 h-4 mr-2" />
                  {t('products.addProduct', 'Add Product')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct 
                      ? t('products.editProduct', 'Edit Product')
                      : t('products.addProduct', 'Add Product')
                    }
                  </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Basic Information */}
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('products.form.name', 'Product Name')} *</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="product-name-input" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('products.form.category', 'Category')} *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="product-category-select">
                                    <SelectValue placeholder={t('products.form.selectCategory', 'Select a category')} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map(category => (
                                    <SelectItem key={category.value} value={category.value}>
                                      {category.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('products.form.description', 'Description')}</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  rows={3} 
                                  data-testid="product-description-input"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('products.form.imageUrl', 'Image URL')}</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="https://..." data-testid="product-image-input" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="isActive"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="product-active-checkbox"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>{t('products.form.isActive', 'Product is active')}</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Arrays and Specifications */}
                      <div className="space-y-4">
                        {/* Suitable Crops */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            {t('products.form.suitableCrops', 'Suitable Crops')} *
                          </label>
                          <div className="space-y-2">
                            <Input
                              placeholder={t('products.form.addCrop', 'Add crop and press Enter')}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const value = e.currentTarget.value.trim();
                                  if (value) {
                                    const current = form.getValues("suitableCrops") || [];
                                    form.setValue("suitableCrops", [...current, value]);
                                    e.currentTarget.value = '';
                                  }
                                }
                              }}
                              data-testid="suitable-crops-input"
                            />
                            <div className="flex flex-wrap gap-2">
                              {form.watch("suitableCrops")?.map((crop, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                  {crop}
                                  <X
                                    className="w-3 h-3 cursor-pointer"
                                    onClick={() => {
                                      const current = form.getValues("suitableCrops") || [];
                                      form.setValue("suitableCrops", current.filter((_, i) => i !== index));
                                    }}
                                  />
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Packing Sizes */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            {t('products.form.packingSizes', 'Packing Sizes')} *
                          </label>
                          <div className="space-y-2">
                            <Input
                              placeholder={t('products.form.addSize', 'Add size and press Enter')}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const value = e.currentTarget.value.trim();
                                  if (value) {
                                    const current = form.getValues("packingSizes") || [];
                                    form.setValue("packingSizes", [...current, value]);
                                    e.currentTarget.value = '';
                                  }
                                }
                              }}
                              data-testid="packing-sizes-input"
                            />
                            <div className="flex flex-wrap gap-2">
                              {form.watch("packingSizes")?.map((size, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                  {size}
                                  <X
                                    className="w-3 h-3 cursor-pointer"
                                    onClick={() => {
                                      const current = form.getValues("packingSizes") || [];
                                      form.setValue("packingSizes", current.filter((_, i) => i !== index));
                                    }}
                                  />
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Specifications */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            {t('products.form.specifications', 'Specifications')}
                          </label>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                placeholder={t('products.form.specKey', 'Key')}
                                value={specKey}
                                onChange={(e) => setSpecKey(e.target.value)}
                                data-testid="spec-key-input"
                              />
                              <Input
                                placeholder={t('products.form.specValue', 'Value')}
                                value={specValue}
                                onChange={(e) => setSpecValue(e.target.value)}
                                data-testid="spec-value-input"
                              />
                              <Button
                                type="button"
                                onClick={handleAddSpecification}
                                disabled={!specKey || !specValue}
                                data-testid="add-spec-button"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {Object.entries(form.watch("specifications") || {}).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between p-2 bg-muted rounded">
                                  <span className="text-sm">
                                    <strong>{key}:</strong> {value}
                                  </span>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleRemoveSpecification(key)}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={handleCloseDialog}>
                        {t('common.cancel', 'Cancel')}
                      </Button>
                      <Button 
                        type="submit"
                        disabled={createProductMutation.isPending || updateProductMutation.isPending}
                        data-testid="product-form-submit"
                      >
                        {(createProductMutation.isPending || updateProductMutation.isPending) ? (
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        {editingProduct ? t('common.update', 'Update') : t('common.create', 'Create')}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t('products.search.placeholder', 'Search products...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="products-search-input"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48" data-testid="products-category-filter">
                <SelectValue placeholder={t('products.filter.category', 'Filter by category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('products.filter.all', 'All Categories')}</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="w-full h-48 bg-muted" />
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded mb-4" />
                  <div className="h-10 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <Card key={product.id} className="card-hover overflow-hidden">
                <div className="relative w-full h-48 overflow-hidden bg-muted">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? (
                        <Eye className="w-3 h-3 mr-1" />
                      ) : (
                        <EyeOff className="w-3 h-3 mr-1" />
                      )}
                      {product.isActive ? t('products.active', 'Active') : t('products.inactive', 'Inactive')}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="capitalize">
                      {t(`products.categories.${product.category}`, product.category)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(product.createdAt)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2" data-testid={`product-name-${product.id}`}>
                    {product.name}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {product.description || t('products.noDescription', 'No description available')}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {product.suitableCrops.slice(0, 2).map((crop, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {crop}
                        </Badge>
                      ))}
                      {product.suitableCrops.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{product.suitableCrops.length - 2}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDialog(product)}
                        data-testid={`edit-product-${product.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        data-testid={`delete-product-${product.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">
              {t('products.empty.title', 'No products found')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t('products.empty.description', 'Try adjusting your search criteria or add new products.')}
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              {t('products.addFirst', 'Add Your First Product')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
