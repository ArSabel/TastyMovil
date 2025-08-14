import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Producto } from './useServices';

export interface CartItem {
  producto: Producto;
  cantidad: number;
  notas?: string;
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
}

const CART_STORAGE_KEY = '@tasty_movil_cart';
const TAX_RATE = 0.16; // 16% IVA

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar carrito desde AsyncStorage al inicializar
  useEffect(() => {
    loadCart();
  }, []);

  // Guardar carrito en AsyncStorage cuando cambie
  useEffect(() => {
    if (!loading) {
      saveCart();
    }
  }, [cartItems, loading]);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        cartItem => cartItem.producto.id === item.producto.id
      );

      if (existingItemIndex >= 0) {
        // Si el item ya existe, incrementar cantidad
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].cantidad += item.cantidad;
        return updatedItems;
      } else {
        // Si es un nuevo item, agregarlo
        return [...prevItems, item];
      }
    });
  };

  const removeFromCart = (productoId: number) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item.producto.id !== productoId)
    );
  };

  const updateQuantity = (productoId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productoId);
      return;
    }

    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.producto.id === productoId) {
          return { ...item, cantidad: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartSummary = (): CartSummary => {
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + (item.producto.precio * item.cantidad);
    }, 0);

    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    const itemCount = cartItems.reduce((sum, item) => sum + item.cantidad, 0);

    return {
      subtotal,
      tax,
      total,
      itemCount
    };
  };

  const getItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.cantidad, 0);
  };

  const isInCart = (productoId: number) => {
    return cartItems.some(item => item.producto.id === productoId);
  };

  const getItemQuantity = (productoId: number) => {
    const item = cartItems.find(item => item.producto.id === productoId);
    return item ? item.cantidad : 0;
  };

  return {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartSummary,
    getItemCount,
    isInCart,
    getItemQuantity,
  };
};