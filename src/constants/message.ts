export const SuccessMessages = {
  USER: {
    USER_CREATED: "User created successfully",
    USER_UPDATED: "User updated successfully",
    USER_DELETED: "User deleted successfully",
    USER_GET: "User data fetched successfully",
  },

  BRAND: {
    BRAND_CREATED: "Brand created successfully",
    BRAND_UPDATED: "Brand updated successfully",
    BRAND_DELETED: "Brand deleted successfully",
    BRAND_GET: "Brand data fetched successfully",
  },

  CATEGORY: {
    CATEGORY_CREATED: "Category created successfully",
    CATEGORY_UPDATED: "Category updated successfully",
    CATEGORY_DELETED: "Category deleted successfully",
    CATEGORY_GET: "Category data fetched successfully",
  },

  PRODUCT: {
    PRODUCT_CREATED: "Product created successfully",
    PRODUCT_UPDATED: "Product updated successfully",
    PRODUCT_DELETED: "Product deleted successfully",
    PRODUCT_GET: "Product data fetched successfully",
  },

  ORDER: {
    ORDER_CREATED: "Order placed successfully",
    ORDER_UPDATED: "Order updated successfully",
    ORDER_DELETED: "Order cancelled successfully",
    ORDER_GET: "Order data fetched successfully",
  },

  CART: {
    ITEM_ADDED: "Item added to cart successfully",
    ITEM_REMOVED: "Item removed from cart successfully",
    CART_CLEARED: "Cart cleared successfully",
  },

  AUTH: {
    LOGIN_SUCCESS: "Logged in successfully",
    LOGOUT_SUCCESS: "Logged out successfully",
    REGISTER_SUCCESS: "Registered successfully",
  },
} as const;

export const ErrorMessages = {
  USER_NOT_FOUND: "User not found",
  INVALID_ID: "Invalid ID",
  EMAIL_ALREADY_EXISTS: "Email already exists",
  INVALID_CREDENTIALS: "Invalid email or password",
  UNAUTHORIZED: "You are not authorized",
  VALIDATION_FAILED: "Validation failed",
  SERVER_ERROR: "Something went wrong",

  // Product errors
  PRODUCT_NOT_FOUND: "Product not found",
  PRODUCT_OUT_OF_STOCK: "Product is out of stock",
  INSUFFICIENT_STOCK: "Insufficient stock quantity",

  // Category errors
  CATEGORY_NOT_FOUND: "Category not found",
  CATEGORY_ALREADY_EXISTS: "Category already exists",

  // Brand errors
  BRAND_NOT_FOUND: "Brand not found",
  BRAND_ALREADY_EXISTS: "Brand already exists",

  // Order errors
  ORDER_NOT_FOUND: "Order not found",
  ORDER_CANNOT_BE_CANCELLED: "Order cannot be cancelled",

  // Cart errors
  CART_ITEM_NOT_FOUND: "Cart item not found",
  CART_IS_EMPTY: "Cart is empty",

  // Payment errors
  PAYMENT_FAILED: "Payment failed",
  INVALID_PAYMENT_METHOD: "Invalid payment method",
} as const;
