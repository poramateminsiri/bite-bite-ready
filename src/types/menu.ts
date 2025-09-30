export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  popular?: boolean;
}

export type MenuCategory = 'appetizer' | 'main' | 'dessert' | 'drink';

export interface CartItem extends MenuItem {
  quantity: number;
}
