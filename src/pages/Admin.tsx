import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Upload, X, Package, Image as ImageIcon, ShoppingBag, Eye, RefreshCw, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts, Product } from '@/hooks/useProducts';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  original_price: number | null;
  category: string;
  material: string;
  stone: string;
  weight: string;
  is_featured: boolean;
  is_bestseller: boolean;
  stock: number;
  sync_to_shopify: boolean;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  items: Array<{ id: string; name: string; price: number; quantity: number; image: string }>;
  subtotal: number;
  total: number;
  status: string;
  payment_status: string;
  notes: string | null;
  created_at: string;
}

const initialFormData: ProductFormData = {
  name: '',
  slug: '',
  description: '',
  short_description: '',
  price: 0,
  original_price: null,
  category: 'Rings',
  material: '18K Yellow Gold',
  stone: 'Diamond',
  weight: '',
  is_featured: false,
  is_bestseller: false,
  stock: 10,
  sync_to_shopify: false,
};

const categories = ['Rings', 'Necklaces', 'Earrings', 'Bracelets'];
const orderStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const Admin = () => {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const { products, isLoading, refetch } = useProducts();
  const { products: shopifyProducts, isLoading: shopifyLoading } = useShopifyProducts(50);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'shopify'>('products');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (activeTab === 'orders' && isAdmin) {
      fetchOrders();
    }
  }, [activeTab, isAdmin]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setOrders(data.map(order => ({
        ...order,
        items: order.items as unknown as Order['items'],
      })));
    }
    setOrdersLoading(false);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (!error) {
      toast({ title: 'Order Updated', description: `Order status changed to ${status}` });
      fetchOrders();
      setSelectedOrder(null);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (name === 'name') {
        setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploadedUrls: string[] = [];
    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `products/${fileName}`;
      const { error } = await supabase.storage.from('product-images').upload(filePath, file);
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(filePath);
        uploadedUrls.push(publicUrl);
      }
    }
    setImages(prev => [...prev, ...uploadedUrls]);
    setUploading(false);
  };

  const removeImage = (index: number) => setImages(prev => prev.filter((_, i) => i !== index));

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        short_description: product.short_description || '',
        price: Number(product.price),
        original_price: product.original_price ? Number(product.original_price) : null,
        category: product.category,
        material: product.material || '',
        stone: product.stone || '',
        weight: product.weight || '',
        is_featured: product.is_featured || false,
        is_bestseller: product.is_bestseller || false,
        stock: product.stock || 0,
        sync_to_shopify: false,
      });
      setImages(product.images || []);
    } else {
      setEditingProduct(null);
      setFormData(initialFormData);
      setImages([]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData(initialFormData);
    setImages([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { sync_to_shopify, ...productFields } = formData;
    const productData = { ...productFields, images };
    
    try {
      if (editingProduct) {
        const { error } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
        if (error) throw error;
        toast({ title: 'Product Updated', description: 'The product has been updated successfully.' });
      } else {
        const { error } = await supabase.from('products').insert([productData]);
        if (error) throw error;
        toast({ title: 'Product Created', description: 'The product has been created successfully.' });
      }
      
      if (sync_to_shopify) {
        toast({ title: 'Shopify Sync', description: 'Product will be synced to Shopify. Use chat to create Shopify products directly.', variant: 'default' });
      }
      
      closeModal();
      refetch();
    } catch (error: unknown) {
      toast({ title: 'Error', description: error instanceof Error ? error.message : 'Failed to save product', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', product.id);
      if (error) throw error;
      toast({ title: 'Product Deleted', description: 'The product has been deleted successfully.' });
      refetch();
    } catch (error: unknown) {
      toast({ title: 'Error', description: error instanceof Error ? error.message : 'Failed to delete product', variant: 'destructive' });
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <section className="pt-32 pb-20 min-h-screen bg-background">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-secondary w-1/4" />
              <div className="h-64 bg-secondary" />
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!isAdmin) return null;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/10 text-yellow-600',
      confirmed: 'bg-blue-500/10 text-blue-600',
      processing: 'bg-purple-500/10 text-purple-600',
      shipped: 'bg-indigo-500/10 text-indigo-600',
      delivered: 'bg-green-500/10 text-green-600',
      cancelled: 'bg-red-500/10 text-red-600',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-600';
  };

  return (
    <Layout>
      <section className="pt-32 pb-20 bg-background min-h-screen">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-serif text-3xl md:text-4xl mb-2">Admin Panel</h1>
                <p className="text-muted-foreground">Manage your store</p>
              </div>
              {activeTab === 'products' && (
                <button onClick={() => openModal()} className="btn-luxury-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-border overflow-x-auto">
              <button
                onClick={() => setActiveTab('products')}
                className={`pb-4 px-2 font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'products' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Package className="w-4 h-4" /> Products ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`pb-4 px-2 font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'orders' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <ShoppingBag className="w-4 h-4" /> Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('shopify')}
                className={`pb-4 px-2 font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'shopify' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Store className="w-4 h-4" /> Shopify ({shopifyProducts.length})
              </button>
            </div>

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="bg-secondary border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-foreground/5 border-b border-border">
                      <tr>
                        <th className="text-left p-4 font-medium">Product</th>
                        <th className="text-left p-4 font-medium">Category</th>
                        <th className="text-left p-4 font-medium">Price</th>
                        <th className="text-left p-4 font-medium">Stock</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-right p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr><td colSpan={6} className="p-8 text-center">Loading...</td></tr>
                      ) : products.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-muted-foreground">
                            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No products yet. Add your first product.</p>
                          </td>
                        </tr>
                      ) : (
                        products.map((product) => (
                          <tr key={product.id} className="border-b border-border last:border-0 hover:bg-foreground/5">
                            <td className="p-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-background overflow-hidden">
                                  {product.images[0] ? (
                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-6 h-6 text-muted-foreground" /></div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-sm text-muted-foreground">{product.slug}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-muted-foreground">{product.category}</td>
                            <td className="p-4">₹{Number(product.price).toLocaleString('en-IN')}</td>
                            <td className="p-4">{product.stock}</td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                {product.is_featured && <span className="px-2 py-1 bg-primary/10 text-primary text-xs">Featured</span>}
                                {product.is_bestseller && <span className="px-2 py-1 bg-green-500/10 text-green-600 text-xs">Bestseller</span>}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => openModal(product)} className="p-2 hover:bg-foreground/10 transition-colors"><Pencil className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(product)} className="p-2 hover:bg-destructive/10 hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-secondary border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-foreground/5 border-b border-border">
                      <tr>
                        <th className="text-left p-4 font-medium">Order ID</th>
                        <th className="text-left p-4 font-medium">Customer</th>
                        <th className="text-left p-4 font-medium">Items</th>
                        <th className="text-left p-4 font-medium">Total</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Date</th>
                        <th className="text-right p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordersLoading ? (
                        <tr><td colSpan={7} className="p-8 text-center">Loading...</td></tr>
                      ) : orders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-muted-foreground">
                            <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No orders yet.</p>
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order.id} className="border-b border-border last:border-0 hover:bg-foreground/5">
                            <td className="p-4 font-mono text-sm">{order.id.slice(0, 8)}...</td>
                            <td className="p-4">
                              <p className="font-medium">{order.customer_name}</p>
                              <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                            </td>
                            <td className="p-4">{order.items.length} items</td>
                            <td className="p-4 font-medium">₹{Number(order.total).toLocaleString('en-IN')}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 text-xs capitalize ${getStatusColor(order.status)}`}>{order.status}</span>
                            </td>
                            <td className="p-4 text-muted-foreground text-sm">{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                            <td className="p-4">
                              <button onClick={() => setSelectedOrder(order)} className="p-2 hover:bg-foreground/10 transition-colors"><Eye className="w-4 h-4" /></button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Shopify Tab */}
            {activeTab === 'shopify' && (
              <div className="space-y-6">
                <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg">
                  <div className="flex items-start gap-4">
                    <Store className="w-8 h-8 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-serif text-lg mb-2">Shopify Integration Active</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Your store is connected to Shopify. Products added via Shopify are displayed separately from your local database products.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                          Store: s1z5t0-ia.myshopify.com
                        </span>
                        <span className="px-3 py-1 bg-green-500/10 text-green-600 text-sm rounded-full">
                          Connected
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary border border-border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-medium">Shopify Products</h3>
                    <button 
                      onClick={() => window.location.reload()}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" /> Refresh
                    </button>
                  </div>

                  {shopifyLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="aspect-square bg-muted mb-2" />
                          <div className="h-4 bg-muted w-3/4 mb-1" />
                          <div className="h-4 bg-muted w-1/2" />
                        </div>
                      ))}
                    </div>
                  ) : shopifyProducts.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h4 className="font-medium mb-2">No Shopify Products</h4>
                      <p className="text-muted-foreground text-sm mb-4">
                        Your Shopify store doesn't have any products yet.
                      </p>
                      <p className="text-sm text-primary">
                        To add products, use the chat to tell me what products you'd like to create!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {shopifyProducts.map((product) => (
                        <div key={product.node.id} className="bg-background border border-border p-4">
                          <div className="aspect-square bg-muted mb-3 overflow-hidden">
                            {product.node.images.edges[0] ? (
                              <img 
                                src={product.node.images.edges[0].node.url} 
                                alt={product.node.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <h4 className="font-medium truncate">{product.node.title}</h4>
                          <p className="text-primary font-medium">
                            {product.node.priceRange.minVariantPrice.currencyCode} {parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {product.node.handle}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-muted/50 border border-border p-6 rounded-lg">
                  <h4 className="font-medium mb-3">Quick Actions</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Use the chat to manage your Shopify products. Here are some examples:
                  </p>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• "Create a diamond ring product priced at ₹50,000"</li>
                    <li>• "Add a gold necklace with description and images"</li>
                    <li>• "Update the price of [product name]"</li>
                    <li>• "Delete [product name] from Shopify"</li>
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-background border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
              <h2 className="font-serif text-xl">Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-secondary"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Customer Info</h3>
                  <p>{selectedOrder.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customer_email}</p>
                  {selectedOrder.customer_phone && <p className="text-sm text-muted-foreground">{selectedOrder.customer_phone}</p>}
                </div>
                <div>
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.shipping_address}<br />
                    {selectedOrder.shipping_city}, {selectedOrder.shipping_state}<br />
                    {selectedOrder.shipping_pincode}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex gap-4 p-3 bg-secondary">
                      {item.image && <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />}
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-medium">₹{Number(selectedOrder.total).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  {orderStatuses.map(status => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder.id, status)}
                      className={`px-4 py-2 text-sm border capitalize transition-colors ${selectedOrder.status === status ? 'bg-foreground text-background border-foreground' : 'border-border hover:border-foreground'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-background border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
              <h2 className="font-serif text-xl">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-secondary"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">Product Images</label>
                <div className="flex flex-wrap gap-4">
                  {images.map((url, index) => (
                    <div key={index} className="relative w-24 h-24 bg-secondary">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                  <label className="w-24 h-24 border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">{uploading ? 'Uploading...' : 'Upload'}</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                  </label>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Slug *</label>
                  <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} required className="w-full px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Short Description</label>
                <input type="text" name="short_description" value={formData.short_description} onChange={handleInputChange} placeholder="A brief tagline" className="w-full px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none resize-none" />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price (₹) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" className="w-full px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Original Price (₹)</label>
                  <input type="number" name="original_price" value={formData.original_price || ''} onChange={handleInputChange} min="0" className="w-full px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Stock</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} min="0" className="w-full px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none">
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Material</label>
                  <input type="text" name="material" value={formData.material} onChange={handleInputChange} placeholder="e.g., 18K Yellow Gold" className="w-full px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Stone</label>
                  <input type="text" name="stone" value={formData.stone} onChange={handleInputChange} placeholder="e.g., Diamond" className="w-full px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Weight</label>
                  <input type="text" name="weight" value={formData.weight} onChange={handleInputChange} placeholder="e.g., 5.2g" className="w-full px-4 py-3 bg-secondary border border-border focus:border-primary focus:outline-none" />
                </div>
              </div>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleInputChange} className="w-4 h-4" />
                  <span className="text-sm">Featured Product</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="is_bestseller" checked={formData.is_bestseller} onChange={handleInputChange} className="w-4 h-4" />
                  <span className="text-sm">Bestseller</span>
                </label>
              </div>
              
              {/* Shopify Sync Option */}
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="sync_to_shopify" 
                    checked={formData.sync_to_shopify} 
                    onChange={handleInputChange} 
                    className="w-4 h-4 mt-1" 
                  />
                  <div>
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Store className="w-4 h-4 text-primary" />
                      Sync to Shopify
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      To create products in Shopify, use the chat with details like name, price, and description.
                    </p>
                  </div>
                </label>
              </div>
              
              <div className="flex gap-4 pt-4 border-t border-border">
                <button type="button" onClick={closeModal} className="flex-1 px-6 py-3 border border-border hover:bg-secondary transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 btn-luxury-primary disabled:opacity-50">{saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </Layout>
  );
};

export default Admin;
