import { useEffect, useState, useRef, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search, Upload, X, Image as ImageIcon, CheckSquare, Square, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/hooks/useProducts';
import { useAllPageCategories } from '@/hooks/usePageCategories';
import { resolveImageUrl } from '@/lib/imageUtils';

const CATEGORIES = ['Rings', 'Earrings & Studs', 'Bracelets & Bangles', 'Necklaces', 'Pendants', 'Hip Hop', 'Platinum'];
const MATERIALS = ['Gold', 'Silver', 'Platinum', 'Rose Gold', 'White Gold'];
const METAL_TYPES = ['Yellow Gold', 'White Gold', 'Rose Gold', 'Platinum', 'Silver', 'Mixed Metals'];
const KARAT_OPTIONS = ['10K', '14K', '18K', '22K', '24K'];
const CERTIFICATION_TYPES = ['GIA', 'IGI', 'None'];

// Sub-categories are now fetched dynamically from page_categories table

const RING_SIZES = ['4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];
const BRACELET_SIZES = ['7 inch', '7.5 inch', '8 inch', '8.5 inch'];
const NECKLACE_SIZES = ['18 inch', '20 inch', '22 inch', '24 inch'];

const getSizesForCategory = (category: string): string[] => {
  switch (category) {
    case 'Rings':
      return RING_SIZES;
    case 'Bracelets':
    case 'Bangles':
      return BRACELET_SIZES;
    case 'Necklaces':
    case 'Pendants':
      return NECKLACE_SIZES;
    default:
      return [];
  }
};

const emptyProduct = {
  name: '',
  slug: '',
  description: '',
  short_description: '',
  price: 0,
  original_price: 0,
  category: '',
  sub_category: '',
  material: '',
  metal_type: '',
  karat: '',
  size: '',
  stone: '',
  weight: '',
  images: [] as string[],
  is_featured: false,
  is_bestseller: false,
  stock: 10,
  certification_type: '',
  certification_number: '',
  video_url: '',
};
const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bulkField, setBulkField] = useState('');
  const [bulkValue, setBulkValue] = useState('');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [formData, setFormData] = useState(emptyProduct);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { categories: pageCategories } = useAllPageCategories();

  // Build sub-categories map from dynamic page_categories
  const SUB_CATEGORIES = useMemo(() => {
    const map: Record<string, string[]> = {};
    pageCategories.forEach((cat) => {
      if (!map[cat.category]) map[cat.category] = [];
      if (!map[cat.category].includes(cat.sub_category)) {
        map[cat.category].push(cat.sub_category);
      }
    });
    return map;
  }, [pageCategories]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleOpenDialog = (product?: any) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        short_description: product.short_description || '',
        price: product.price,
        original_price: product.original_price || 0,
        category: product.category,
        sub_category: product.sub_category || '',
        material: product.material || '',
        metal_type: product.metal_type || '',
        karat: product.karat || '',
        size: product.size || '',
        stone: product.stone || '',
        weight: product.weight || '',
        images: product.images?.length ? product.images : [],
        is_featured: product.is_featured || false,
        is_bestseller: product.is_bestseller || false,
        stock: product.stock || 0,
        certification_type: product.certification_type || '',
        certification_number: product.certification_number || '',
        video_url: product.video_url || '',
      });
    } else {
      setEditingProduct(null);
      setFormData(emptyProduct);
    }
    setIsDialogOpen(true);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      toast({ title: 'Upload Error', description: uploadError.message, variant: 'destructive' });
      return null;
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        toast({ title: 'Invalid File', description: 'Only image files are allowed', variant: 'destructive' });
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({ title: 'File Too Large', description: 'Maximum file size is 5MB', variant: 'destructive' });
        continue;
      }

      const url = await uploadImage(file);
      if (url) {
        uploadedUrls.push(url);
      }
    }

    if (uploadedUrls.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
      toast({ title: 'Success', description: `${uploadedUrls.length} image(s) uploaded` });
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const uploadVideo = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(filePath, file, { contentType: file.type, upsert: false });

    if (uploadError) {
      toast({ title: 'Video Upload Error', description: uploadError.message, variant: 'destructive' });
      return null;
    }

    const { data } = supabase.storage.from('videos').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast({ title: 'Invalid File', description: 'Only video files are allowed', variant: 'destructive' });
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast({ title: 'File Too Large', description: 'Maximum video size is 50MB', variant: 'destructive' });
      return;
    }

    setIsVideoUploading(true);
    const videoUrl = await uploadVideo(file);

    if (videoUrl) {
      setFormData(prev => ({ ...prev, video_url: videoUrl }));
      toast({ title: 'Success', description: 'Video uploaded successfully' });
    }

    setIsVideoUploading(false);
    if (videoFileInputRef.current) {
      videoFileInputRef.current.value = '';
    }
  };

  const removeVideo = () => {
    setFormData(prev => ({ ...prev, video_url: '' }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category || !formData.price) {
      toast({ title: 'Validation Error', description: 'Please fill in required fields', variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    const slug = formData.slug || generateSlug(formData.name);
    const productData = {
      ...formData,
      slug,
      images: formData.images.filter(img => img.trim() !== ''),
      video_url: formData.video_url.trim() || null,
    };

    let error;
    if (editingProduct?.id) {
      const { error: updateError } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('products')
        .insert([productData]);
      error = insertError;
    }

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `Product ${editingProduct ? 'updated' : 'created'} successfully` });
      setIsDialogOpen(false);
      fetchProducts();
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Product deleted successfully' });
      fetchProducts();
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const handleBulkEdit = async () => {
    if (!bulkField || !bulkValue || selectedProducts.length === 0) {
      toast({ title: 'Error', description: 'Please select products and fill in field/value', variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    const updateData: Record<string, any> = {};
    
    // Handle different field types
    if (bulkField === 'price' || bulkField === 'original_price' || bulkField === 'stock') {
      updateData[bulkField] = Number(bulkValue);
    } else if (bulkField === 'is_featured' || bulkField === 'is_bestseller') {
      updateData[bulkField] = bulkValue === 'true';
    } else {
      updateData[bulkField] = bulkValue;
    }

    const { error } = await supabase
      .from('products')
      .update(updateData)
      .in('id', selectedProducts);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `${selectedProducts.length} products updated` });
      setIsBulkEditOpen(false);
      setSelectedProducts([]);
      setBulkField('');
      setBulkValue('');
      fetchProducts();
    }
    setIsSaving(false);
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .in('id', selectedProducts);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `${selectedProducts.length} products deleted` });
      setSelectedProducts([]);
      fetchProducts();
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const BULK_EDIT_FIELDS = [
    { value: 'category', label: 'Category' },
    { value: 'sub_category', label: 'Sub-Category' },
    { value: 'material', label: 'Material' },
    { value: 'metal_type', label: 'Metal Type' },
    { value: 'karat', label: 'Karat' },
    { value: 'stone', label: 'Stone' },
    { value: 'price', label: 'Price' },
    { value: 'stock', label: 'Stock' },
    { value: 'is_featured', label: 'Featured' },
    { value: 'is_bestseller', label: 'Bestseller' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground mt-1">Manage your product catalog</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                <DialogDescription>Fill product details, upload images, and optionally upload one showcase video.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Diamond Solitaire Ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug (auto-generated)</Label>
                    <Input
                      id="slug"
                      value={formData.slug || generateSlug(formData.name)}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="diamond-solitaire-ring"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value, sub_category: '' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sub_category">Sub-Category</Label>
                    <Select
                      value={formData.sub_category}
                      onValueChange={(value) => setFormData({ ...formData, sub_category: value })}
                      disabled={!formData.category}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sub-category" />
                      </SelectTrigger>
                      <SelectContent>
                        {(SUB_CATEGORIES[formData.category] || []).map((sub) => (
                          <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Material & Karat Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="material">Material (Manual Entry)</Label>
                    <Input
                      id="material"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      placeholder="e.g., 18K Gold, Sterling Silver"
                      list="material-suggestions"
                    />
                    <datalist id="material-suggestions">
                      {MATERIALS.map((mat) => (
                        <option key={mat} value={mat} />
                      ))}
                    </datalist>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="karat">Karat (KT)</Label>
                    <Input
                      id="karat"
                      value={formData.karat}
                      onChange={(e) => setFormData({ ...formData, karat: e.target.value })}
                      placeholder="e.g., 18K, 22K, 24K"
                      list="karat-suggestions"
                    />
                    <datalist id="karat-suggestions">
                      {KARAT_OPTIONS.map((kt) => (
                        <option key={kt} value={kt} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* Metal Type & Size Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="metal_type">Metal Type</Label>
                    <Input
                      id="metal_type"
                      value={formData.metal_type}
                      onChange={(e) => setFormData({ ...formData, metal_type: e.target.value })}
                      placeholder="e.g., Yellow Gold, White Gold"
                      list="metal-type-suggestions"
                    />
                    <datalist id="metal-type-suggestions">
                      {METAL_TYPES.map((metal) => (
                        <option key={metal} value={metal} />
                      ))}
                    </datalist>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size">Size (Manual Entry)</Label>
                    <Input
                      id="size"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      placeholder="e.g., 2.6, 7 inch, Ring Size 8"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter size manually (e.g., bangle: 2.6, bracelet: 7 inch)
                    </p>
                  </div>
                </div>

                {/* Certification Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="certification_type">Certification</Label>
                    <Select
                      value={formData.certification_type}
                      onValueChange={(value) => setFormData({ ...formData, certification_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select certification" />
                      </SelectTrigger>
                      <SelectContent>
                        {CERTIFICATION_TYPES.map((cert) => (
                          <SelectItem key={cert} value={cert}>{cert}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.certification_type && formData.certification_type !== 'None' && (
                    <div className="space-y-2">
                      <Label htmlFor="certification_number">Certificate Number</Label>
                      <Input
                        id="certification_number"
                        value={formData.certification_number}
                        onChange={(e) => setFormData({ ...formData, certification_number: e.target.value })}
                        placeholder="Enter GIA/IGI certificate number"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="original_price">Original Price ($)</Label>
                    <Input
                      id="original_price"
                      type="number"
                      value={formData.original_price}
                      onChange={(e) => setFormData({ ...formData, original_price: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stone">Stone</Label>
                    <Input
                      id="stone"
                      value={formData.stone}
                      onChange={(e) => setFormData({ ...formData, stone: e.target.value })}
                      placeholder="Diamond, Ruby, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <Input
                      id="weight"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="5.2g"
                    />
                  </div>
                </div>

                {/* Size Selection based on Category */}
                {formData.category && getSizesForCategory(formData.category).length > 0 && (
                  <div className="space-y-2">
                    <Label>Available Sizes ({formData.category})</Label>
                    <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/30">
                      {getSizesForCategory(formData.category).map((size) => (
                        <span key={size} className="px-3 py-1 text-sm bg-primary/10 rounded-full border border-primary/20">
                          {size}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      These sizes will be available for customers to select
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="short_description">Short Description</Label>
                  <Input
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    placeholder="Brief product description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Full Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed product description"
                    rows={3}
                  />
                </div>

                {/* Image Upload Section */}
                <div className="space-y-3">
                  <Label>Product Images</Label>
                  
                  {/* Upload Button */}
                  <div className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex-1"
                    >
                      {isUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Images
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Image Previews */}
                  {formData.images.length > 0 ? (
                    <div className="grid grid-cols-4 gap-3">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative group aspect-square">
                          <img
                            src={img}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                              Main
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground mt-2">
                        No images uploaded. Click "Upload Images" to add product photos.
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Max 5MB per image. First image will be the main product image.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Product Video (Optional)</Label>
                  <input
                    ref={videoFileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => videoFileInputRef.current?.click()}
                    disabled={isVideoUploading}
                    className="w-full"
                  >
                    {isVideoUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary mr-2"></div>
                        Uploading Video...
                      </>
                    ) : (
                      <>
                        <Video className="h-4 w-4 mr-2" />
                        Upload Product Video
                      </>
                    )}
                  </Button>

                  {formData.video_url ? (
                    <div className="space-y-2">
                      <div className="relative rounded-lg border overflow-hidden bg-muted/30">
                        <video
                          src={formData.video_url}
                          controls
                          playsInline
                          preload="metadata"
                          className="w-full h-auto max-h-72 object-contain"
                        />
                        <button
                          type="button"
                          onClick={removeVideo}
                          className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                          aria-label="Remove video"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground break-all">{formData.video_url}</p>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Video className="h-8 w-8 mx-auto text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground mt-2">No product video uploaded yet.</p>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Max 50MB. Supported formats: MP4, MOV, WebM.
                  </p>
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="rounded border-input"
                    />
                    <span className="text-sm">Featured</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_bestseller}
                      onChange={(e) => setFormData({ ...formData, is_bestseller: e.target.checked })}
                      className="rounded border-input"
                    />
                    <span className="text-sm">Bestseller</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving || isUploading || isVideoUploading}>
                    {isSaving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Bulk Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {selectedProducts.length > 0 && (
            <div className="flex gap-2 items-center">
              <span className="text-sm text-muted-foreground">{selectedProducts.length} selected</span>
              <Dialog open={isBulkEditOpen} onOpenChange={setIsBulkEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4 mr-2" />
                    Bulk Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Bulk Edit {selectedProducts.length} Products</DialogTitle>
                    <DialogDescription>Apply one field update to all selected products at once.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Field to Update</Label>
                      <Select value={bulkField} onValueChange={setBulkField}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          {BULK_EDIT_FIELDS.map((field) => (
                            <SelectItem key={field.value} value={field.value}>{field.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>New Value</Label>
                      {bulkField === 'is_featured' || bulkField === 'is_bestseller' ? (
                        <Select value={bulkValue} onValueChange={setBulkValue}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select value" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : bulkField === 'category' ? (
                        <Select value={bulkValue} onValueChange={setBulkValue}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={bulkValue}
                          onChange={(e) => setBulkValue(e.target.value)}
                          placeholder={`Enter new ${bulkField}`}
                        />
                      )}
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsBulkEditOpen(false)}>Cancel</Button>
                      <Button onClick={handleBulkEdit} disabled={isSaving}>
                        {isSaving ? 'Updating...' : 'Update All'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          )}
        </div>

        {/* Products Table */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <button 
                      onClick={toggleSelectAll}
                      className="p-1 hover:bg-muted rounded"
                    >
                      {selectedProducts.length === filteredProducts.length && filteredProducts.length > 0 ? (
                        <CheckSquare className="h-4 w-4 text-primary" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} className={selectedProducts.includes(product.id) ? 'bg-primary/5' : ''}>
                      <TableCell>
                        <button 
                          onClick={() => toggleProductSelection(product.id)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          {selectedProducts.includes(product.id) ? (
                            <CheckSquare className="h-4 w-4 text-primary" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell>
                        <img
                          src={resolveImageUrl(product.images?.[0])}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>${product.price.toLocaleString('en-US')}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {product.is_featured && <Badge variant="secondary">Featured</Badge>}
                          {product.is_bestseller && <Badge>Bestseller</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpenDialog(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
