// Navigation links interface
interface NavigationLinks {
  readonly home: string;
  readonly signIn: string;
  readonly logIn: string;
  readonly product: string;
}

// Navigation links constants
export const links: NavigationLinks = {
  home: '/',
  signIn: '/sign-in',
  logIn: '/log-in',
  product: '/product',
} as const;

// Type helper to get all route paths
export type RoutePath = typeof links[keyof typeof links];

// Helper function to build product routes with ID
export const buildProductRoute = (productId: string | number): string => {
  return `${links.product}/${productId}`;
};
