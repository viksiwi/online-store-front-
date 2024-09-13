
import axiosInstance from '../axios.config';
import { CartItem } from '../types/CartType';

export const CartService = {
  addItem: async (item: Omit<CartItem, 'id'>) => {
    const response = await axiosInstance.post('/api/cart/add', item);
    return response.data;
  },

  removeItem: async (itemId: string) => {
    await axiosInstance.delete(`/api/cart/remove/${itemId}`);
  },

  updateItemQuantity: async (itemId: string, quantity: number) => {
    const response = await axiosInstance.put(`/api/cart/update/${itemId}`, { quantity });
    return response.data;
  },

  clearCart: async () => {
    await axiosInstance.post('/api/cart/clear');
  },

  fetchCartItems: async () => {
    const response = await axiosInstance.get('/api/cart');
    return response.data;
  }
};