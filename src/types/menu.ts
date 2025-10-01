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

export interface OrderCustomer {
  name: string;
  phone?: string;
  address?: string;
}

export interface OrderItemData {
  menu_item_id: string;
  menu_item_name: string;
  quantity: number;
  price: number;
}

export interface OrderSubmission {
  customer_name: string;
  customer_phone?: string;
  customer_address?: string;
  items: OrderItemData[];
  notes?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string | null;
  customer_address: string | null;
  total_price: number;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items: Array<{
    id: string;
    order_id: string;
    menu_item_id: string;
    menu_item_name: string;
    quantity: number;
    price: number;
  }>;
}
