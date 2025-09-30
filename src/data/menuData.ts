import type { MenuItem } from "@/types/menu";
import springRolls from "@/assets/spring-rolls.jpg";
import mushroomSoup from "@/assets/mushroom-soup.jpg";
import grilledSalmon from "@/assets/grilled-salmon.jpg";
import wagyuBurger from "@/assets/wagyu-burger.jpg";
import margheritaPizza from "@/assets/margherita-pizza.jpg";
import greenCurry from "@/assets/green-curry.jpg";
import lavaCake from "@/assets/lava-cake.jpg";
import tiramisu from "@/assets/tiramisu.jpg";
import mangoSmoothie from "@/assets/mango-smoothie.jpg";
import matchaLatte from "@/assets/matcha-latte.jpg";

export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Crispy Spring Rolls",
    description: "Hand-rolled spring rolls with fresh vegetables and sweet chili sauce",
    price: 8.99,
    category: "appetizer",
    image: springRolls,
    popular: true,
  },
  {
    id: "2",
    name: "Truffle Mushroom Soup",
    description: "Creamy wild mushroom soup with truffle oil and herbs",
    price: 9.99,
    category: "appetizer",
    image: mushroomSoup,
  },
  {
    id: "3",
    name: "Grilled Salmon",
    description: "Atlantic salmon with lemon butter sauce, asparagus, and roasted potatoes",
    price: 24.99,
    category: "main",
    image: grilledSalmon,
    popular: true,
  },
  {
    id: "4",
    name: "Wagyu Beef Burger",
    description: "Premium wagyu patty with aged cheddar, caramelized onions, and truffle aioli",
    price: 18.99,
    category: "main",
    image: wagyuBurger,
    popular: true,
  },
  {
    id: "5",
    name: "Margherita Pizza",
    description: "Classic Italian pizza with fresh mozzarella, basil, and San Marzano tomatoes",
    price: 16.99,
    category: "main",
    image: margheritaPizza,
  },
  {
    id: "6",
    name: "Thai Green Curry",
    description: "Aromatic green curry with chicken, bamboo shoots, and jasmine rice",
    price: 15.99,
    category: "main",
    image: greenCurry,
  },
  {
    id: "7",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten center, vanilla ice cream",
    price: 8.99,
    category: "dessert",
    image: lavaCake,
    popular: true,
  },
  {
    id: "8",
    name: "Tiramisu",
    description: "Classic Italian dessert with espresso-soaked ladyfingers and mascarpone",
    price: 7.99,
    category: "dessert",
    image: tiramisu,
  },
  {
    id: "9",
    name: "Fresh Mango Smoothie",
    description: "Blended mango with coconut milk and a hint of lime",
    price: 6.99,
    category: "drink",
    image: mangoSmoothie,
  },
  {
    id: "10",
    name: "Iced Matcha Latte",
    description: "Premium matcha green tea with oat milk and honey",
    price: 5.99,
    category: "drink",
    image: matchaLatte,
  },
];
