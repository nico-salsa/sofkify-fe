//tipaddo general para los productos
export interface Product {
  //interfaz del componente Product
  id: string;
  name: string;
  image: string;  
  price: number;
  description?: string;
  stock?: number;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

//interfaz para mostrar el producto





export type ProductProps = {
  product: Product;
};