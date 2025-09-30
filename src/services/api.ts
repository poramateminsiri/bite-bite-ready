/**
 * API Service Layer
 * Centralized API configuration and functions for backend communication
 */

import type { MenuItem } from "@/types/menu";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

/**
 * API Response structure from backend
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  error?: string;
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }

    const data = await response.json();

    if (!data.success) {
      throw new ApiError(data.error || "API request failed");
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or parsing errors
    throw new ApiError(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
}

/**
 * Menu API functions
 */
export const menuApi = {
  /**
   * Get all menu items
   */
  getAllMenuItems: async (): Promise<MenuItem[]> => {
    const response = await fetchApi<ApiResponse<MenuItem[]>>("/api/menu");
    return response.data;
  },

  /**
   * Get menu item by ID
   */
  getMenuItemById: async (id: string): Promise<MenuItem> => {
    const response = await fetchApi<ApiResponse<MenuItem>>(`/api/menu/${id}`);
    return response.data;
  },

  /**
   * Get menu items by category
   */
  getMenuItemsByCategory: async (category: string): Promise<MenuItem[]> => {
    const response = await fetchApi<ApiResponse<MenuItem[]>>(
      `/api/menu/category/${category}`
    );
    return response.data;
  },

  /**
   * Get popular menu items
   */
  getPopularItems: async (): Promise<MenuItem[]> => {
    const response = await fetchApi<ApiResponse<MenuItem[]>>(
      "/api/menu/popular"
    );
    return response.data;
  },

  /**
   * Search menu items
   */
  searchMenuItems: async (query: string): Promise<MenuItem[]> => {
    const response = await fetchApi<ApiResponse<MenuItem[]>>(
      `/api/menu/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  },
};

/**
 * Health check
 */
export const healthCheck = async (): Promise<{
  status: string;
  message: string;
  timestamp: string;
}> => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
};