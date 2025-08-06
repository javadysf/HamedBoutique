import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
  color?: string;
  size?: string;
  uniqueId?: string;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const uniqueId = action.payload.uniqueId || `${action.payload.id}-${action.payload.color || 'default'}-${action.payload.size || 'default'}`;
      const existingItem = state.items.find(item => item.uniqueId === uniqueId);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1, uniqueId });
      }
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.uniqueId !== action.payload);
    },
    
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.uniqueId === id);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.uniqueId !== id);
        } else {
          item.quantity = quantity;
        }
      }
    },
    
    clearCart: (state) => {
      state.items = [];
    },
    
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// Actions
export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCartItems,
  setLoading,
  setError,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartLoading = (state: { cart: CartState }) => state.cart.loading;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;

// Memoized selectors for better performance
export const selectTotalItems = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => total + item.quantity, 0)
);

export const selectTotalPrice = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => total + (item.price * item.quantity), 0)
);

export const selectCartItemCount = createSelector(
  [selectCartItems],
  (items) => items.length
);

export const selectCartItemById = createSelector(
  [selectCartItems, (_state: any, id: number) => id],
  (items, id) => items.find(item => item.id === id)
);

export const selectIsItemInCart = createSelector(
  [selectCartItems, (_state: any, id: number) => id],
  (items, id) => items.some(item => item.id === id)
);

export default cartSlice.reducer; 