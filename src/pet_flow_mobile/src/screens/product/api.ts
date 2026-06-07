import { authRequest } from '../../services/http';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

export const productService = {
  getAll(): Promise<Product[]> {
    return authRequest<Product[]>('/product', {
      method: 'GET',
    });
  },

  create(payload: Partial<Product>): Promise<Product> {
    return authRequest<Product>('/product', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(id: string, payload: Partial<Product>): Promise<Product> {
    return authRequest<Product>(`/product/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  delete(id: string): Promise<void> {
    return authRequest<void>(`/product/${id}`, {
      method: 'DELETE',
    });
  },
};
