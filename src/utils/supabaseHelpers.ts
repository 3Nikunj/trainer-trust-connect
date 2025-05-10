
/**
 * Helper utilities for working with Supabase
 */

/**
 * Casts a string to a UUID type for Supabase
 */
export const asUUID = (id: string): UUID => id as unknown as UUID;

/**
 * Type guard to check if response has error
 */
export const hasError = (data: any): boolean => {
  return data && typeof data === 'object' && 'error' in data;
};

/**
 * Safely access data from a Supabase response
 */
export const safeDataAccess = <T>(data: T | { error: any }): T | null => {
  if (hasError(data)) {
    return null;
  }
  return data as T;
};

/**
 * Get review categories based on role
 * Companies reviewing trainers use different categories than trainers reviewing companies
 */
export const getReviewCategories = (role: 'company' | 'trainer' | string | null) => {
  if (role === 'company') {
    // Categories for companies reviewing trainers
    return {
      expertise: 0,
      communication: 0,
      professionalism: 0,
      curriculum: 0,
      delivery: 0,
    };
  } else {
    // Categories for trainers reviewing companies
    return {
      communication: 0,
      requirements: 0,
      support: 0,
      professionalism: 0,
      payment: 0,
    };
  }
};

/**
 * Get review category fields to display based on role
 */
export const getReviewCategoryFields = (role: 'company' | 'trainer' | string | null) => {
  if (role === 'company') {
    return ['expertise', 'communication', 'professionalism', 'curriculum', 'delivery'];
  } else {
    return ['communication', 'requirements', 'support', 'professionalism', 'payment'];
  }
};

/**
 * Get category description for display
 */
export const getCategoryDescription = (category: string) => {
  const descriptions: Record<string, string> = {
    expertise: "Knowledge in the subject matter",
    curriculum: "Quality of training materials and content",
    delivery: "Presentation skills and training delivery",
    communication: "Responsiveness and clarity",
    professionalism: "Professional conduct and behavior",
    requirements: "Clarity of expectations",
    support: "Assistance and guidance provided",
    payment: "Timely and fair compensation",
  };
  
  return descriptions[category] || category;
};
