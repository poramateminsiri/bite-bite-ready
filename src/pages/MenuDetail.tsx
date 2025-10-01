import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMenu } from "@/contexts/MenuContext";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const MenuDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { menuItems, isLoading } = useMenu();
  const { addToCart, cartItemCount, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Find the menu item from context
  const menuItem = menuItems.find((item) => item.id === id);

  const handleAddToCart = () => {
    if (menuItem) {
      // Add items based on quantity
      for (let i = 0; i < quantity; i++) {
        addToCart(menuItem);
      }
      setQuantity(1); // Reset quantity after adding
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 99));
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      appetizer: "Appetizer",
      main: "Main Course",
      dessert: "Dessert",
      drink: "Drink",
    };
    return labels[category] || category;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header Skeleton */}
        <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </header>

        {/* Content Skeleton */}
        <div className="container py-8">
          <Skeleton className="h-6 w-48 mb-8" />
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Item not found
  if (!menuItem) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Menu
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="relative gap-2"
              onClick={openCart}
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-accent">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </header>

        {/* Not Found Content */}
        <div className="container py-16">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertTitle className="text-lg font-semibold">Dish Not Found</AlertTitle>
            <AlertDescription className="mt-2">
              The menu item you're looking for doesn't exist or has been removed.
              <div className="mt-4">
                <Button onClick={() => navigate("/")} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Return to Menu
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Menu
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="relative gap-2"
            onClick={openCart}
          >
            <ShoppingCart className="h-4 w-4" />
            Cart
            {cartItemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-accent">
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container py-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span>Menu</span>
          <span>/</span>
          <span className="text-foreground font-medium">{menuItem.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-8 pb-16">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={menuItem.image}
                alt={menuItem.name}
                className="w-full h-full object-cover"
              />
              {menuItem.popular && (
                <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                  Popular Choice
                </Badge>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3">
                {getCategoryLabel(menuItem.category)}
              </Badge>
              <h1 className="text-4xl font-bold text-foreground mb-3">
                {menuItem.name}
              </h1>
              <p className="text-3xl font-bold text-primary">
                ${menuItem.price.toFixed(2)}
              </p>
            </div>

            <div className="prose prose-gray dark:prose-invert">
              <p className="text-muted-foreground text-lg leading-relaxed">
                {menuItem.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="h-12 w-12 rounded-r-none"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="w-16 text-center font-semibold">
                    {quantity}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={incrementQuantity}
                    disabled={quantity >= 99}
                    className="h-12 w-12 rounded-l-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Total: ${(menuItem.price * quantity).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-3 pt-4">
              <Button
                size="lg"
                className="w-full gap-2"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5" />
                Add {quantity} to Cart - ${(menuItem.price * quantity).toFixed(2)}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Free delivery on orders over $30
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MenuDetail;
