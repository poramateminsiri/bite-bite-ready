import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import type { MenuItem as MenuItemType } from "@/types/menu";

interface MenuItemProps {
  item: MenuItemType;
  onAddToCart: (item: MenuItemType) => void;
}

export const MenuItem = ({ item, onAddToCart }: MenuItemProps) => {
  return (
    <Card className="overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-hover)] border-border/50">
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {item.popular && (
          <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
            Popular
          </Badge>
        )}
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground">{item.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {item.description}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            ${item.price.toFixed(2)}
          </span>
          <Button
            size="sm"
            onClick={() => onAddToCart(item)}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
};
