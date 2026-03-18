export interface ProductSizingInput {
  category?: string | null;
  sub_category?: string | null;
  name?: string | null;
  size?: string | null;
}

export const RING_SIZES = ['4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];
export const BRACELET_SIZES = ['7 inch', '7.5 inch', '8 inch', '8.5 inch'];
export const NECKLACE_SIZES = ['18 inch', '20 inch', '22 inch', '24 inch'];

const normalizeProductText = (product: ProductSizingInput) =>
  [product.category, product.sub_category, product.name, product.size]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

export const getSizesForProduct = (product: ProductSizingInput): string[] => {
  const haystack = normalizeProductText(product);

  if (haystack.includes('ring')) return RING_SIZES;
  if (haystack.includes('bracelet') || haystack.includes('bangle')) return BRACELET_SIZES;
  if (haystack.includes('necklace') || haystack.includes('chain') || haystack.includes('pendant')) return NECKLACE_SIZES;

  return [];
};
