import type { NavigationLinks } from "./types";

// Navigation links constants
export const links: NavigationLinks = {
  signIn: '/sign-in',
  logIn: '/log-in',
  product: '/product',
  cart: '/cart', // Nueva ruta agregada
} as const;

// Type helper to get all route paths
export type RoutePath = typeof links[keyof typeof links];

// Helper function to build product routes with ID
export const buildProductRoute = (productId: string | number): string => {
  return `${links.product}/${productId}`;
};