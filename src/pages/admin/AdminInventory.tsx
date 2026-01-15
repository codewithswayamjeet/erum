import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Search, Package, AlertTriangle, CheckCircle, RefreshCw, Edit2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  images: string[];
}

const AdminInventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newStock, setNewStock] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('id, name, category, stock, price, images')
      .order('stock', { ascending: true });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  };

  const updateStock = async () => {
    if (!editingProduct) return;

    const { error } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', editingProduct.id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Stock updated successfully' });
      setIsDialogOpen(false);
      fetchProducts();
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setNewStock(product.stock);
    setIsDialogOpen(true);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-500/10 text-red-600' };
    if (stock < 5) return { label: 'Low Stock', color: 'bg-amber-500/10 text-amber-600' };
    return { label: 'In Stock', color: 'bg-green-500/10 text-green-600' };
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalProducts: products.length,
    outOfStock: products.filter(p => p.stock === 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock < 5).length,
    inStock: products.filter(p => p.stock >= 5).length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
            <p className="text-muted-foreground mt-1">Manage product stock levels</p>
          </div>
          <Button variant="outline" onClick={fetchProducts}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
              <Package className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>
          <Card className={stats.outOfStock > 0 ? 'border-red-500/50' : ''}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Out of Stock</CardTitle>
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
            </CardContent>
          </Card>
          <Card className={stats.lowStock > 0 ? 'border-amber-500/50' : ''}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock</CardTitle>
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{stats.lowStock}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Stock</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.inStock}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
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
                  <TableHead>Product</TableHead>
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
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => {
                    const status = getStockStatus(product.stock);
                    return (
                      <TableRow key={product.id} className={product.stock === 0 ? 'bg-red-500/5' : product.stock < 5 ? 'bg-amber-500/5' : ''}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {product.images?.[0] ? (
                              <img 
                                src={product.images[0]} 
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                                <Package className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell>${product.price.toLocaleString('en-US')}</TableCell>
                        <TableCell>
                          <span className={`font-semibold ${product.stock === 0 ? 'text-red-600' : product.stock < 5 ? 'text-amber-600' : ''}`}>
                            {product.stock}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={status.color}>{status.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(product)}
                          >
                            <Edit2 className="h-4 w-4 mr-1" />
                            Update Stock
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Edit Stock Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Stock</DialogTitle>
            </DialogHeader>
            {editingProduct && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {editingProduct.images?.[0] && (
                    <img 
                      src={editingProduct.images[0]} 
                      alt={editingProduct.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{editingProduct.name}</h3>
                    <p className="text-sm text-muted-foreground">Current stock: {editingProduct.stock}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">New Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={updateStock}>
                    Update Stock
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminInventory;
