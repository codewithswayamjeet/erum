import { useState, useRef } from 'react';
import { Plus, Trash2, Edit2, Image, GripVertical, Save } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAllPageCategories, PageCategory } from '@/hooks/usePageCategories';
import { supabase } from '@/integrations/supabase/client';

const MAIN_CATEGORIES = ['Rings', 'Earrings & Studs', 'Bracelets & Bangles', 'Necklaces', 'Pendants', 'Hip Hop', 'Platinum'];

const AdminPageControls = () => {
  const { categories, isLoading, addCategory, updateCategory, deleteCategory, refetch } = useAllPageCategories();
  const { toast } = useToast();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<PageCategory | null>(null);
  
  const [formData, setFormData] = useState({
    category: '',
    sub_category: '',
    thumbnail_url: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `category-${Date.now()}.${fileExt}`;
      const filePath = `categories/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, thumbnail_url: data.publicUrl });
      toast({ title: 'Image uploaded successfully' });
    } catch (error: any) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!formData.category || !formData.sub_category) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    try {
      await addCategory(formData.category, formData.sub_category, formData.thumbnail_url || undefined);
      toast({ title: 'Sub-category added successfully' });
      setIsAddOpen(false);
      setFormData({ category: '', sub_category: '', thumbnail_url: '' });
    } catch (error: any) {
      toast({ title: 'Failed to add category', description: error.message, variant: 'destructive' });
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory) return;

    try {
      await updateCategory(selectedCategory.id, {
        sub_category: formData.sub_category,
        thumbnail_url: formData.thumbnail_url || null,
      });
      toast({ title: 'Sub-category updated successfully' });
      setIsEditOpen(false);
      setSelectedCategory(null);
    } catch (error: any) {
      toast({ title: 'Failed to update category', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteConfirmId) return;

    const success = await deleteCategory(deleteConfirmId);
    if (success) {
      toast({ title: 'Sub-category deleted successfully' });
    } else {
      toast({ title: 'Failed to delete category', variant: 'destructive' });
    }
    setDeleteConfirmId(null);
  };

  const handleToggleActive = async (cat: PageCategory) => {
    await updateCategory(cat.id, { is_active: !cat.is_active });
  };

  const openEditDialog = (cat: PageCategory) => {
    setSelectedCategory(cat);
    setFormData({
      category: cat.category,
      sub_category: cat.sub_category,
      thumbnail_url: cat.thumbnail_url || '',
    });
    setIsEditOpen(true);
  };

  // Group categories by main category
  const groupedCategories = categories.reduce((acc, cat) => {
    if (!acc[cat.category]) acc[cat.category] = [];
    acc[cat.category].push(cat);
    return acc;
  }, {} as Record<string, PageCategory[]>);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif mb-2">Page Controls</h1>
            <p className="text-muted-foreground">
              Manage categories and sub-categories displayed on your collection pages
            </p>
          </div>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Sub-Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Sub-Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Main Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(val) => setFormData({ ...formData, category: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {MAIN_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Sub-Category Name *</Label>
                  <Input
                    value={formData.sub_category}
                    onChange={(e) => setFormData({ ...formData, sub_category: e.target.value })}
                    placeholder="e.g., Tennis Bracelets"
                  />
                </div>

                <div>
                  <Label>Thumbnail Image</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.thumbnail_url}
                      onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                      placeholder="Image URL or upload"
                      className="flex-1"
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <Image className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.thumbnail_url && (
                    <img 
                      src={formData.thumbnail_url} 
                      alt="Preview" 
                      className="mt-2 w-32 h-32 object-cover rounded border"
                    />
                  )}
                </div>

                <Button onClick={handleAddCategory} className="w-full gap-2">
                  <Save className="w-4 h-4" />
                  Add Sub-Category
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="space-y-8">
            {MAIN_CATEGORIES.map((mainCat) => {
              const subCats = groupedCategories[mainCat] || [];
              return (
                <div key={mainCat} className="bg-card border rounded-lg overflow-hidden">
                  <div className="bg-muted px-6 py-4 border-b">
                    <h2 className="font-serif text-xl">{mainCat}</h2>
                    <p className="text-sm text-muted-foreground">
                      {subCats.length} sub-categories
                    </p>
                  </div>

                  {subCats.length === 0 ? (
                    <div className="px-6 py-8 text-center text-muted-foreground">
                      No sub-categories yet. Click "Add Sub-Category" to create one.
                    </div>
                  ) : (
                    <div className="divide-y">
                      {subCats.map((cat) => (
                        <div 
                          key={cat.id} 
                          className="flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors"
                        >
                          <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                          
                          {cat.thumbnail_url ? (
                            <img 
                              src={cat.thumbnail_url} 
                              alt={cat.sub_category}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                              <Image className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}

                          <div className="flex-1">
                            <h3 className="font-medium">{cat.sub_category}</h3>
                            <p className="text-sm text-muted-foreground">
                              Order: {cat.display_order}
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`active-${cat.id}`} className="text-sm">
                                Active
                              </Label>
                              <Switch
                                id={`active-${cat.id}`}
                                checked={cat.is_active}
                                onCheckedChange={() => handleToggleActive(cat)}
                              />
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(cat)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => setDeleteConfirmId(cat.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Sub-Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Main Category</Label>
                <Input value={formData.category} disabled />
              </div>

              <div>
                <Label>Sub-Category Name *</Label>
                <Input
                  value={formData.sub_category}
                  onChange={(e) => setFormData({ ...formData, sub_category: e.target.value })}
                />
              </div>

              <div>
                <Label>Thumbnail Image</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                    placeholder="Image URL"
                    className="flex-1"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Image className="w-4 h-4" />
                  </Button>
                </div>
                {formData.thumbnail_url && (
                  <img 
                    src={formData.thumbnail_url} 
                    alt="Preview" 
                    className="mt-2 w-32 h-32 object-cover rounded border"
                  />
                )}
              </div>

              <Button onClick={handleEditCategory} className="w-full gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Sub-Category?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Products in this sub-category will not be affected.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteCategory} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AdminPageControls;
