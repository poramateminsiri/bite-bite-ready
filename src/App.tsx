import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MenuProvider } from "@/contexts/MenuContext";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Cart } from "@/components/Cart";
import { useCart } from "@/contexts/CartContext";
import Index from "./pages/Index";
import MenuDetail from "./pages/MenuDetail";
import NotFound from "./pages/NotFound";
import { AdminLogin } from "./pages/admin/AdminLogin";

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
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/menu/:id" element={<MenuDetail />} />
          
          {/* Admin login (public) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected admin routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-2">Coming soon...</p>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          
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
    <AuthProvider>
      <MenuProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </TooltipProvider>
        </CartProvider>
      </MenuProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
