import React, { createContext, useContext, useRef, useState } from 'react';
import { CartItem } from '../types/CartType';
import { CartService } from '../api/CartService';
import { showToast } from '../const/toastConfig';

interface CartProduct {
    id: string;
    price: number;
    productId: string;
    quantity: number;
    userId: string;
    Product: {
        imageUrl: string;
        name: string;
    }
}

interface CartContextType {
  basketRef: React.RefObject<HTMLDivElement>;
  items: CartProduct[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  fetchCartItems: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);


export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const basketRef = useRef<HTMLDivElement>(null);
    const [items, setItems] = useState<CartProduct[]>([]);
  
    const addItem = async (item: Omit<CartItem, 'id'>) => {
      try {
        const newItem = await CartService.addItem(item);
        setItems(prevItems => [...prevItems, newItem]);
        showToast("success", "Товар успешно добавлен в корзину")
      } catch (error) {
        console.error('Error adding item to cart:', error);
        showToast("error", "Ошибка при добавлении товара в корзину")
      }
    };
  
    const removeItem = async (itemId: string) => {
      try {
        await CartService.removeItem(itemId);
        setItems(prevItems => prevItems.filter(item => item.id !== itemId));
        showToast("success", "Товар успешно удалён из корзины")
      } catch (error) {
        console.error('Error removing item from cart:', error);
        showToast("success", "Ошибка при удалении товара из корзины")
      }
    };
  
    const updateItemQuantity = async (itemId: string, quantity: number) => {
      try {
        const updatedItem = await CartService.updateItemQuantity(itemId, quantity);
        setItems(prevItems => prevItems.map(item => (item.id === itemId ? updatedItem : item)));
      } catch (error) {
        console.error('Error updating item quantity in cart:', error);
      }
    };
  
    const clearCart = async () => {
      try {
       // await CartService.clearCart();
        setItems([]);
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    };
  
    const fetchCartItems = async () => {
      try {
        const cartItems = await CartService.fetchCartItems();
        setItems(cartItems);
        showToast("success", "Товары в корзине успешно загружены")
      } catch (error) {
        console.error('Error fetching cart items:', error);
        showToast("success", "Ошибка при загрузке товаров в корзине")
      }
    };
  
    return (
      <CartContext.Provider value={{ basketRef, items, addItem, removeItem, updateItemQuantity, clearCart, fetchCartItems }}>
        {children}
      </CartContext.Provider>
    );
  };

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
