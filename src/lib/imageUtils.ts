// Map of local forevermark assets - these need to be imported as ES modules
const forevermarkImages: Record<string, string> = {};

// Dynamically import all forevermark images
const forevermarkModules = import.meta.glob('/src/assets/forevermark/*.jpg', { eager: true, as: 'url' });
for (const path in forevermarkModules) {
  const filename = path.split('/').pop() || '';
  forevermarkImages[filename] = forevermarkModules[path];
}

// General assets mapping
const assetModules = import.meta.glob('/src/assets/*.jpg', { eager: true, as: 'url' });
const assetImages: Record<string, string> = {};
for (const path in assetModules) {
  const filename = path.split('/').pop() || '';
  assetImages[filename] = assetModules[path];
}

// Shopify assets mapping
const shopifyModules = import.meta.glob('/src/assets/shopify/*.jpg', { eager: true, as: 'url' });
const shopifyImages: Record<string, string> = {};
for (const path in shopifyModules) {
  const filename = path.split('/').pop() || '';
  shopifyImages[filename] = shopifyModules[path];
}

/**
 * Resolves an image path to a valid URL that can be used in img src
 * Handles:
 * - Full URLs (https://...) - returned as-is
 * - Local asset paths (/src/assets/...) - converted to bundled URLs
 * - Relative paths - returned as-is
 */
export function resolveImageUrl(imagePath: string | undefined | null): string {
  if (!imagePath) {
    return '/placeholder.svg';
  }

  // If it's already a full URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it's a data URL, return as-is
  if (imagePath.startsWith('data:')) {
    return imagePath;
  }

  // Handle /src/assets/forevermark/ paths
  if (imagePath.includes('/src/assets/forevermark/')) {
    const filename = imagePath.split('/').pop() || '';
    if (forevermarkImages[filename]) {
      return forevermarkImages[filename];
    }
  }

  // Handle /src/assets/shopify/ paths
  if (imagePath.includes('/src/assets/shopify/')) {
    const filename = imagePath.split('/').pop() || '';
    if (shopifyImages[filename]) {
      return shopifyImages[filename];
    }
  }

  // Handle /src/assets/ paths (general)
  if (imagePath.includes('/src/assets/')) {
    const filename = imagePath.split('/').pop() || '';
    if (assetImages[filename]) {
      return assetImages[filename];
    }
  }

  // If it starts with / it's likely a public path
  if (imagePath.startsWith('/')) {
    return imagePath;
  }

  // Return as-is for any other case
  return imagePath;
}

/**
 * Resolves an array of image paths to valid URLs
 */
export function resolveImageUrls(images: string[] | undefined | null): string[] {
  if (!images || images.length === 0) {
    return [];
  }
  return images.map(resolveImageUrl);
}
