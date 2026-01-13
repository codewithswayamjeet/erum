import { toast } from 'sonner';

// Shopify Configuration (Storefront API)
const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = 's1z5t0-ia.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
// Storefront token is a public token (safe for client-side usage)
const SHOPIFY_STOREFRONT_TOKEN = 'd93834d30304631563f537295cddea2c';

export interface ShopifyImage {
  url: string;
  altText: string | null;
}

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    availableForSale: boolean;
    productType?: string;
    tags?: string[];
    createdAt?: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: ShopifyImage;
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
  };
}

export interface ShopifyCollection {
  node: {
    id: string;
    title: string;
    handle: string;
    description: string;
    image: ShopifyImage | null;
  };
}

export interface ShopifyCollectionByHandle {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: ShopifyImage | null;
  products: {
    edges: ShopifyProduct[];
  };
}

// Storefront API helper function
export async function storefrontApiRequest(
  query: string,
  variables: Record<string, unknown> = {}
) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error('Shopify: Payment required', {
      description:
        'Shopify API access requires an active Shopify billing plan. Visit https://admin.shopify.com to upgrade.',
    });
    return null;
  }

  if (response.status === 401 || response.status === 403) {
    // This usually means the token is wrong OR products/collections aren’t published to the Storefront.
    throw new Error(
      'Shopify storefront access denied. Verify Storefront token and that products are published to the Storefront sales channel.'
    );
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Shopify HTTP error ${response.status}${text ? `: ${text}` : ''}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(
      `Error calling Shopify: ${data.errors
        .map((e: { message: string }) => e.message)
        .join(', ')}`
    );
  }

  return data;
}

const PRODUCT_FIELDS = `
  id
  title
  description
  handle
  availableForSale
  productType
  tags
  createdAt
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  images(first: 5) {
    edges {
      node {
        url
        altText
      }
    }
  }
  variants(first: 20) {
    edges {
      node {
        id
        title
        price {
          amount
          currencyCode
        }
        availableForSale
        selectedOptions {
          name
          value
        }
      }
    }
  }
  options {
    name
    values
  }
`;

// GraphQL Queries
const STOREFRONT_PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          ${PRODUCT_FIELDS}
        }
      }
    }
  }
`;

const STOREFRONT_PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      ${PRODUCT_FIELDS}
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
    }
  }
`;

const STOREFRONT_COLLECTIONS_QUERY = `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

// Note: sortKey values are Shopify enums like: BEST_SELLING, CREATED, PRICE, TITLE, UPDATED_AT
const STOREFRONT_COLLECTION_BY_HANDLE_QUERY = `
  query GetCollectionByHandle($handle: String!, $first: Int!, $sortKey: ProductCollectionSortKeys, $reverse: Boolean) {
    collectionByHandle(handle: $handle) {
      id
      title
      handle
      description
      image {
        url
        altText
      }
      products(first: $first, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
            ${PRODUCT_FIELDS}
          }
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Fetch products from Shopify
export async function fetchShopifyProducts(
  first: number = 20,
  query?: string
): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, { first, query });
  if (!data) return [];
  return data.data.products.edges;
}

// Fetch single product by handle
export async function fetchShopifyProductByHandle(
  handle: string
): Promise<ShopifyProduct['node'] | null> {
  const data = await storefrontApiRequest(STOREFRONT_PRODUCT_BY_HANDLE_QUERY, { handle });
  if (!data) return null;
  return data.data.productByHandle;
}

export async function fetchShopifyCollections(first: number = 20): Promise<ShopifyCollection[]> {
  const data = await storefrontApiRequest(STOREFRONT_COLLECTIONS_QUERY, { first });
  if (!data) return [];
  return data.data.collections.edges;
}

export async function fetchShopifyCollectionByHandle(
  handle: string,
  firstProducts: number = 50,
  sortKey?: 'BEST_SELLING' | 'CREATED' | 'PRICE' | 'TITLE' | 'UPDATED_AT',
  reverse?: boolean
): Promise<ShopifyCollectionByHandle | null> {
  const data = await storefrontApiRequest(STOREFRONT_COLLECTION_BY_HANDLE_QUERY, {
    handle,
    first: firstProducts,
    sortKey: sortKey ?? null,
    reverse: reverse ?? null,
  });
  if (!data) return null;
  return data.data.collectionByHandle;
}

// Create checkout
export interface CartItem {
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  quantity: number;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

export async function createStorefrontCheckout(items: CartItem[]): Promise<string> {
  const lines = items.map((item) => ({
    quantity: item.quantity,
    merchandiseId: item.variantId,
  }));

  const cartData = await storefrontApiRequest(CART_CREATE_MUTATION, { input: { lines } });

  if (!cartData) throw new Error('Failed to create cart');

  if (cartData.data.cartCreate.userErrors.length > 0) {
    throw new Error(
      `Cart creation failed: ${cartData.data.cartCreate.userErrors
        .map((e: { message: string }) => e.message)
        .join(', ')}`
    );
  }

  const cart = cartData.data.cartCreate.cart;
  if (!cart.checkoutUrl) throw new Error('No checkout URL returned from Shopify');

  const url = new URL(cart.checkoutUrl);
  url.searchParams.set('channel', 'online_store');
  return url.toString();
}
