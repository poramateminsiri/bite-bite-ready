import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MenuProvider } from "@/contexts/MenuContext";
import { CartProvider } from "@/contexts/CartContext";
import { Cart } from "@/components/Cart";
import { useCart } from "@/contexts/CartContext";
import Index from "./pages/Index";
import MenuDetail from "./pages/MenuDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    isCartOpen,
    closeCart,
  } = useCart();

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/menu/:id" element={<MenuDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

      {/* Global Cart - Available on all pages */}
      <Cart
        isOpen={isCartOpen}
        onClose={closeCart}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onClearCart={clearCart}
      />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MenuProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </CartProvider>
    </MenuProvider>
  </QueryClientProvider>
);

export default App;
