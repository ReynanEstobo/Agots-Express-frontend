import { createContext, useContext, useEffect, useState } from "react";
import {
  addCartItem as apiAddCartItem,
  clearCartItems as apiClearCart,
  removeCartItem as apiRemoveCartItem,
  updateCartItem as apiUpdateCartItem,
  fetchCartItems,
} from "../api/CartAPI";
import { useToast } from "../hooks/use-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { addToast } = useToast();
  const userId = sessionStorage.getItem("user_id");

  const [items, setItems] = useState([]);
  const [animateCount, setAnimateCount] = useState(false);
  const [animateIcon, setAnimateIcon] = useState(false);

  const triggerAnimations = () => {
    setAnimateCount(true);
    setTimeout(() => setAnimateCount(false), 300);
    setAnimateIcon(true);
    setTimeout(() => setAnimateIcon(false), 300);
  };

  // ------------------- LOAD CART FROM BACKEND -------------------
  const loadCart = async () => {
    if (!userId) return;
    try {
      const data = await fetchCartItems(userId);
      setItems(
        data.map((i) => ({
          ...i,
          specialInstructions: i.special_instructions || "",
        }))
      );
    } catch (err) {
      console.error("Failed to load cart:", err);
      addToast({ description: "Failed to load cart." });
    }
  };

  useEffect(() => {
    loadCart();
  }, [userId]);

  // ------------------- ADD TO CART -------------------
  const addToCart = async (item, quantity = 1) => {
    if (!userId) return;
    try {
      const existing = items.find(
        (i) => i.menu_id === item.id || i.menu_id === item.menu_id
      );

      if (existing) {
        await apiUpdateCartItem({
          user_id: userId,
          menu_id: existing.menu_id,
          quantity: existing.quantity + quantity,
          specialInstructions: existing.specialInstructions || "",
        });
        addToast({
          title: "Updated cart",
          description: `${item.name} quantity updated`,
          playSound: true,
        });
      } else {
        await apiAddCartItem({
          user_id: userId,
          menu_id: item.id,
          quantity,
        });
        addToast({
          title: "Added to cart",
          description: `${item.name} added to your cart`,
          playSound: true,
        });
      }

      triggerAnimations();
      loadCart(); // refresh
    } catch (err) {
      console.error(err);
      addToast({ description: "Failed to add/update cart." });
    }
  };

  // ------------------- UPDATE QUANTITY / SPECIAL INSTRUCTIONS -------------------
  const updateQuantity = async (menu_id, quantity, specialInstructions) => {
    if (!userId) return;
    try {
      await apiUpdateCartItem({
        user_id: userId,
        menu_id,
        quantity,
        specialInstructions,
      });
      loadCart();
    } catch (err) {
      console.error(err);
      addToast({ description: "Failed to update cart item." });
    }
  };

  // ------------------- REMOVE ITEM -------------------
  const removeFromCart = async (menu_id) => {
    if (!userId) return;
    try {
      await apiRemoveCartItem(userId, menu_id);
      loadCart();
      addToast({
        title: "Removed from cart",
        description: "Item removed from your cart",
        playSound: false,
      });
    } catch (err) {
      console.error(err);
      addToast({ description: "Failed to remove item." });
    }
  };

  // ------------------- CLEAR CART -------------------
  const clearCart = async () => {
    if (!userId) return;
    try {
      await apiClearCart(userId);
      setItems([]);
      addToast({ title: "Cart cleared", description: "All items removed" });
    } catch (err) {
      console.error(err);
      addToast({ description: "Failed to clear cart." });
    }
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        animateCount,
        animateIcon,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
