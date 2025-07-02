export const CartStorage = {
  CART_KEY: 'shopping_cart',
  USER_CART_PREFIX: 'user_cart_',

  // Save cart to localStorage
  saveCart: (userId, cartData) => {
    try {
      const cartToSave = {
        items: Array.isArray(cartData.items) ? cartData.items : [],
        totalItems: cartData.totalItems || 0,
        subtotal: cartData.subtotal || 0,
        userId: userId,
        lastUpdated: new Date().toISOString()
      };

      const key = userId ? `${CartStorage.USER_CART_PREFIX}${userId}` : CartStorage.CART_KEY;
      localStorage.setItem(key, JSON.stringify(cartToSave));
      console.log('Cart saved to localStorage:', cartToSave);
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  },

  // Load cart from localStorage
  loadCart: (userId) => {
    try {
      const key = userId ? `${CartStorage.USER_CART_PREFIX}${userId}` : CartStorage.CART_KEY;
      const stored = localStorage.getItem(key);
      
      if (stored) {
        const parsedCart = JSON.parse(stored);
        console.log('Cart loaded from localStorage:', parsedCart);
        return {
          items: Array.isArray(parsedCart.items) ? parsedCart.items : [],
          totalItems: parsedCart.totalItems || 0,
          subtotal: parsedCart.subtotal || 0,
          userId: parsedCart.userId || null,
          lastUpdated: parsedCart.lastUpdated || null
        };
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    
    return {
      items: [],
      totalItems: 0,
      subtotal: 0,
      userId: null,
      lastUpdated: null
    };
  },

  // Clear cart from localStorage
  clearCart: (userId) => {
    try {
      const key = userId ? `${CartStorage.USER_CART_PREFIX}${userId}` : CartStorage.CART_KEY;
      localStorage.removeItem(key);
      console.log('Cart cleared from localStorage');
    } catch (error) {
      console.error('Error clearing cart from localStorage:', error);
    }
  },

  // Clear all cart data (useful for logout)
  clearAllCarts: () => {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(CartStorage.USER_CART_PREFIX) || key === CartStorage.CART_KEY) {
          localStorage.removeItem(key);
        }
      });
      console.log('All carts cleared from localStorage');
    } catch (error) {
      console.error('Error clearing all carts from localStorage:', error);
    }
  }
};