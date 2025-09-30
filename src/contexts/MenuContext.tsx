/**
 * MenuContext
 * Provides menu data to the application using React Query
 */

import React, { createContext, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { menuApi } from "@/services/api";
import type { MenuItem, MenuCategory } from "@/types/menu";

/**
 * Menu Context type definition
 */
interface MenuContextType {
  menuItems: MenuItem[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  getFilteredItems: (category: MenuCategory | "all") => MenuItem[];
  getPopularItems: () => MenuItem[];
}

/**
 * Create the context with undefined default value
 */
const MenuContext = createContext<MenuContextType | undefined>(undefined);

/**
 * MenuProvider Props
 */
interface MenuProviderProps {
  children: React.ReactNode;
}

/**
 * MenuProvider Component
 * Wraps the application and provides menu data
 */
export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
  // Fetch menu items using React Query
  const {
    data: menuItems = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<MenuItem[], Error>({
    queryKey: ["menuItems"],
    queryFn: menuApi.getAllMenuItems,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
  });

  /**
   * Get filtered items by category
   */
  const getFilteredItems = useMemo(() => {
    return (category: MenuCategory | "all"): MenuItem[] => {
      if (category === "all") {
        return menuItems;
      }
      return menuItems.filter((item) => item.category === category);
    };
  }, [menuItems]);

  /**
   * Get popular items
   */
  const getPopularItems = useMemo(() => {
    return (): MenuItem[] => {
      return menuItems.filter((item) => item.popular);
    };
  }, [menuItems]);

  const value: MenuContextType = {
    menuItems,
    isLoading,
    isError,
    error,
    refetch,
    getFilteredItems,
    getPopularItems,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

/**
 * Custom hook to use MenuContext
 * @throws Error if used outside MenuProvider
 */
export const useMenu = (): MenuContextType => {
  const context = useContext(MenuContext);
  
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  
  return context;
};