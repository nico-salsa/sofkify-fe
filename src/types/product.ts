//Product (modelo de dominio BASE)
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

//interfaz para recbir la API
export interface ProductDTO extends Omit<Product, 'status'> {
  active: boolean;
}

//interfaz para mostrar el producto
export interface ProductPresentation extends Product {}

// ============================================
// Component Props Types
// ============================================

export type ProductProps = {
  product: ProductPresentation;
};

