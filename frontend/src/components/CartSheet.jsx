import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../hooks/use-toast";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Separator } from "../ui/Separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/Sheet";
import { Textarea } from "../ui/Textarea";

const colors = {
  accent: "#F2C94C",
  destructive: "#D93025",
  mutedForeground: "#8C8C8C",
  primaryDark: "#0A1A3F",
  border: "#d8d8e1",
};

export default function CartSheet() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  // ------------------ CART CONTEXT ------------------
  const {
    items: cartItems,
    removeFromCart,
    updateQuantity,
    total,
    itemCount,
  } = useCart();

  // ------------------ HANDLERS ------------------
  const handleQuantityChange = (item, quantity) => {
    if (quantity < 1) return;
    updateQuantity(item.menu_id, quantity, item.specialInstructions);
  };

  const handleInstructionsChange = (item, text) => {
    updateQuantity(item.menu_id, item.quantity, text);
  };

  const handleRemove = (item) => {
    removeFromCart(item.menu_id);
    addToast({ description: "Item removed." });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {/* CART BUTTON */}
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="relative"
          style={{ borderColor: colors.border }}
        >
          <ShoppingCart
            className="h-5 w-5"
            style={{ color: colors.primaryDark }}
          />
          {itemCount > 0 && (
            <Badge
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center"
              style={{
                backgroundColor: colors.accent,
                color: colors.primaryDark,
              }}
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      {/* CART SIDEBAR */}
      <SheetContent
        className="w-full sm:max-w-lg overflow-y-auto p-0"
        side="right"
      >
        <SheetHeader>
          <SheetTitle style={{ color: colors.primaryDark }}>
            Your Cart ({itemCount} items)
          </SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
            <ShoppingCart
              className="h-16 w-16 mb-4"
              style={{ color: colors.mutedForeground }}
            />
            <p
              className="text-lg font-medium mb-1"
              style={{ color: colors.mutedForeground }}
            >
              Your cart is empty
            </p>
            <p className="text-sm" style={{ color: colors.mutedForeground }}>
              Add some delicious Filipino dishes!
            </p>
          </div>
        ) : (
          <>
            {/* CART LIST */}
            <div className="space-y-4 my-6 px-4">
              {cartItems.map((item) => (
                <div
                  key={item.menu_id}
                  className="rounded-lg p-4 space-y-3"
                  style={{ border: `1px solid ${colors.border}` }}
                >
                  {/* ITEM HEADER */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4
                        className="font-semibold"
                        style={{ color: colors.primaryDark }}
                      >
                        {item.name}
                      </h4>
                      <p
                        className="text-sm"
                        style={{ color: colors.mutedForeground }}
                      >
                        {item.category || ""}
                      </p>
                      <p
                        className="text-lg font-bold mt-1"
                        style={{ color: colors.accent }}
                      >
                        ₱{item.price}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(item)}
                    >
                      <Trash2
                        className="h-4 w-4"
                        style={{ color: colors.destructive }}
                      />
                    </Button>
                  </div>

                  {/* QUANTITY CONTROLS */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        handleQuantityChange(item, item.quantity - 1)
                      }
                    >
                      <Minus
                        className="h-4 w-4"
                        style={{ color: colors.primaryDark }}
                      />
                    </Button>
                    <Input
                      type="number"
                      className="w-16 text-center"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item,
                          Math.max(1, parseInt(e.target.value) || 1)
                        )
                      }
                      style={{
                        borderColor: colors.border,
                        color: colors.primaryDark,
                      }}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        handleQuantityChange(item, item.quantity + 1)
                      }
                    >
                      <Plus
                        className="h-4 w-4"
                        style={{ color: colors.primaryDark }}
                      />
                    </Button>
                    <span
                      className="ml-auto font-semibold"
                      style={{ color: colors.primaryDark }}
                    >
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* SPECIAL INSTRUCTIONS */}
                  <Textarea
                    rows={2}
                    placeholder="Special instructions (optional)"
                    value={item.specialInstructions}
                    onChange={(e) =>
                      handleInstructionsChange(item, e.target.value)
                    }
                    className="text-sm"
                    style={{
                      borderColor: colors.border,
                      color: colors.primaryDark,
                    }}
                  />
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* TOTALS + CHECKOUT */}
            <div className="space-y-4 px-4 mb-6">
              <div
                className="flex justify-between text-lg font-semibold"
                style={{ color: colors.primaryDark }}
              >
                <span>Subtotal:</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
              <div
                className="flex justify-between text-sm"
                style={{ color: colors.mutedForeground }}
              >
                <span>Delivery Fee:</span>
                <span>Calculated at checkout</span>
              </div>
              <Separator />
              <div
                className="flex justify-between text-xl font-bold"
                style={{ color: colors.primaryDark }}
              >
                <span>Total:</span>
                <span style={{ color: colors.accent }}>
                  ₱{total.toFixed(2)}
                </span>
              </div>

              <Button
                className="w-full py-3 text-lg"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.primaryDark,
                }}
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
