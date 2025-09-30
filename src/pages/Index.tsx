import { useState, useRef } from "react";
import { Hero } from "@/components/Hero";
import { MenuItem } from "@/components/MenuItem";
import { Cart } from "@/components/Cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { menuItems } from "@/data/menuData";
import type { CartItem, MenuCategory } from "@/types/menu";
import { toast } from "sonner";

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | "all">("all");
  const menuRef = useRef<HTMLDivElement>(null);

  const categories: Array<{ value: MenuCategory | "all"; label: string }> = [
    { value: "all", label: "All" },
    { value: "appetizer", label: "Appetizers" },
    { value: "main", label: "Mains" },
    { value: "dessert", label: "Desserts" },
    { value: "drink", label: "Drinks" },
  ];

  const filteredItems = selectedCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (item: typeof menuItems[0]) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`Added ${item.name} to cart`);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      
      const newQuantity = item.quantity + delta;
      if (newQuantity <= 0) {
        return prev.filter((i) => i.id !== id);
      }
      
      return prev.map((i) =>
        i.id === id ? { ...i, quantity: newQuantity } : i
      );
    });
  };

  const handleRemove = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
    toast.info("Item removed from cart");
  };

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
            onClick={() => setIsCartOpen(true)}
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

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MenuItem key={item.id} item={item} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </section>

      {/* Cart Drawer */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemove}
      />
    </div>
  );
};

export default Index;
