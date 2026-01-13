import { useEffect, useMemo, useState } from 'react';
import { fetchShopifyCollections, fetchShopifyCollectionByHandle, ShopifyCollection, ShopifyCollectionByHandle } from '@/lib/shopify';

export const useShopifyCollections = (first: number = 20) => {
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchShopifyCollections(first);
        setCollections(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load collections');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [first]);

  return { collections, isLoading, error };
};

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'best-selling' | 'title-asc' | 'title-desc';

export const useShopifyCollection = (
  handle: string,
  firstProducts: number = 50,
  sort: SortOption = 'featured'
) => {
  const [collection, setCollection] = useState<ShopifyCollectionByHandle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sortArgs = useMemo(() => {
    switch (sort) {
      case 'price-asc':
        return { sortKey: 'PRICE' as const, reverse: false };
      case 'price-desc':
        return { sortKey: 'PRICE' as const, reverse: true };
      case 'newest':
        return { sortKey: 'CREATED' as const, reverse: true };
      case 'best-selling':
        return { sortKey: 'BEST_SELLING' as const, reverse: false };
      case 'title-asc':
        return { sortKey: 'TITLE' as const, reverse: false };
      case 'title-desc':
        return { sortKey: 'TITLE' as const, reverse: true };
      default:
        return { sortKey: undefined, reverse: undefined };
    }
  }, [sort]);

  useEffect(() => {
    const load = async () => {
      if (!handle) return;
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchShopifyCollectionByHandle(handle, firstProducts, sortArgs.sortKey, sortArgs.reverse);
        setCollection(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load collection');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [handle, firstProducts, sortArgs.sortKey, sortArgs.reverse]);

  return { collection, isLoading, error };
};
