import { useState, useRef } from "react";
import { Hero } from "@/components/Hero";
import { MenuItem } from "@/components/MenuItem";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Loader2, AlertCircle } from "lucide-react";
import { useMenu } from "@/contexts/MenuContext";
import { useCart } from "@/contexts/CartContext";
import type { MenuCategory } from "@/types/menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Index = () => {
  // Use context hooks
  const { menuItems, isLoading, isError, error } = useMenu();
  const {
    addToCart,
    cartItemCount,
    openCart,
  } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | "all">("all");
  const menuRef = useRef<HTMLDivElement>(null);

  const categories: Array<{ value: MenuCategory | "all"; label: string }> = [
    { value: "all", label: "All" },
    { value: "appetizer", label: "Appetizers" },
    { value: "main", label: "Mains" },
    { value: "dessert", label: "Desserts" },
    { value: "drink", label: "Drinks" },
  ];

  // Filter items by category
  const filteredItems = selectedCategory === "all"
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent"></div>
            <span className="font-bold text-xl text-foreground">FoodHub</span>
          </div>
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

      {/* Hero Section */}
      <Hero onOrderNow={scrollToMenu} />

      {/* Menu Section */}
      <section ref={menuRef} className="container py-12 md:py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Our Menu
          </h2>
          <p className="text-muted-foreground">
            Explore our delicious selection of chef-crafted dishes
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.value)}
              className="transition-all"
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading menu...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error?.message || "Failed to load menu items. Please try again later."}
            </AlertDescription>
          </Alert>
        )}

        {/* Menu Grid */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <MenuItem key={item.id} item={item} onAddToCart={addToCart} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No items found in this category.</p>
              </div>
            )}
          </div>
        )}
      </section>

    </div>
  );
};

export default Index;
