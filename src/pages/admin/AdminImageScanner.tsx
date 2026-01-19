import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ScanSearch, ImageOff, CheckCircle, AlertTriangle, Upload, RefreshCw } from 'lucide-react';

interface ProductImage {
  productId: string;
  productName: string;
  imageUrl: string;
  imageIndex: number;
  status: 'pending' | 'valid' | 'broken';
}

const PLACEHOLDER_IMAGE = '/placeholder.svg';

const AdminImageScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [brokenCount, setBrokenCount] = useState(0);
  const [validCount, setValidCount] = useState(0);
  const [isFixing, setIsFixing] = useState(false);
  const { toast } = useToast();

  const checkImageUrl = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // Skip local paths that start with /src/ or are relative
      if (url.startsWith('/src/') || url.startsWith('/placeholder') || url.startsWith('data:')) {
        resolve(true);
        return;
      }
      
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
      
      // Timeout after 5 seconds
      setTimeout(() => resolve(false), 5000);
    });
  };

  const scanProducts = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setImages([]);
    setBrokenCount(0);
    setValidCount(0);

    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('id, name, images');

      if (error) throw error;

      const allImages: ProductImage[] = [];
      
      products?.forEach((product) => {
        if (product.images && product.images.length > 0) {
          product.images.forEach((img: string, index: number) => {
            allImages.push({
              productId: product.id,
              productName: product.name,
              imageUrl: img,
              imageIndex: index,
              status: 'pending',
            });
          });
        }
      });

      setImages(allImages);

      // Check each image
      let broken = 0;
      let valid = 0;
      
      for (let i = 0; i < allImages.length; i++) {
        const img = allImages[i];
        const isValid = await checkImageUrl(img.imageUrl);
        
        setImages((prev) =>
          prev.map((p, idx) =>
            idx === i ? { ...p, status: isValid ? 'valid' : 'broken' } : p
          )
        );

        if (isValid) {
          valid++;
          setValidCount(valid);
        } else {
          broken++;
          setBrokenCount(broken);
        }

        setScanProgress(((i + 1) / allImages.length) * 100);
      }

      toast({
        title: 'Scan Complete',
        description: `Found ${broken} broken images out of ${allImages.length} total.`,
      });
    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: 'Scan Error',
        description: 'Failed to scan products.',
        variant: 'destructive',
      });
    } finally {
      setIsScanning(false);
    }
  };

  const fixBrokenImages = async () => {
    setIsFixing(true);
    const brokenImages = images.filter((img) => img.status === 'broken');
    
    // Group by product
    const productUpdates: Record<string, { id: string; images: string[] }> = {};
    
    for (const img of brokenImages) {
      if (!productUpdates[img.productId]) {
        const { data } = await supabase
          .from('products')
          .select('images')
          .eq('id', img.productId)
          .single();
        
        productUpdates[img.productId] = {
          id: img.productId,
          images: data?.images || [],
        };
      }
      
      // Replace broken image with placeholder
      productUpdates[img.productId].images[img.imageIndex] = PLACEHOLDER_IMAGE;
    }

    // Update all products
    let fixedCount = 0;
    for (const productId in productUpdates) {
      const { error } = await supabase
        .from('products')
        .update({ images: productUpdates[productId].images })
        .eq('id', productId);

      if (!error) {
        fixedCount++;
      }
    }

    toast({
      title: 'Images Fixed',
      description: `Replaced ${brokenImages.length} broken images with placeholder in ${fixedCount} products.`,
    });

    // Re-scan
    await scanProducts();
    setIsFixing(false);
  };

  const brokenImages = images.filter((img) => img.status === 'broken');

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Image Scanner</h1>
            <p className="text-muted-foreground mt-1">
              Scan products for broken images and fix them automatically
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={scanProducts} disabled={isScanning}>
              {isScanning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <ScanSearch className="h-4 w-4 mr-2" />
                  Scan All Products
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{images.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Valid Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{validCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <ImageOff className="h-4 w-4 text-destructive" />
                Broken Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">{brokenCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress */}
        {isScanning && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Scanning images...</span>
                  <span>{Math.round(scanProgress)}%</span>
                </div>
                <Progress value={scanProgress} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Broken Images List */}
        {brokenImages.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Broken Images ({brokenImages.length})
              </CardTitle>
              <Button onClick={fixBrokenImages} disabled={isFixing} variant="destructive">
                {isFixing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Fixing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Replace All with Placeholder
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {brokenImages.map((img, index) => (
                  <div
                    key={`${img.productId}-${img.imageIndex}`}
                    className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-destructive/10 rounded flex items-center justify-center">
                      <ImageOff className="h-6 w-6 text-destructive" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{img.productName}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        Image {img.imageIndex + 1}: {img.imageUrl}
                      </p>
                    </div>
                    <Badge variant="destructive">Broken</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success State */}
        {!isScanning && images.length > 0 && brokenImages.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">All Images are Valid!</h3>
              <p className="text-muted-foreground">
                All {images.length} product images loaded successfully.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isScanning && images.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <ScanSearch className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Scan Results</h3>
              <p className="text-muted-foreground">
                Click "Scan All Products" to check for broken images.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminImageScanner;
