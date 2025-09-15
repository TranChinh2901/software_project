import { User } from "@/modules/users/entity/user.entity";
// import { Role } from "@/modules/roles/entity/role.entity";
import { Product } from "@/modules/products/entity/product.entity";
import { Category } from "@/modules/categories/entity/category.entity";
import { Brand } from "@/modules/brands/entity/brand.entity";
import { Order } from "@/modules/orders/entity/order.entity";
import { OrderItem } from "@/modules/orders/entity/order-item.entity";
import { CartItem } from "@/modules/carts/entity/cart-item.entity";
import { Review } from "@/modules/reviews/entity/review.entity";

// import entity to use in config-database file
export const entities = [
  User,
  // Role,
  Product,
  Category,
  Brand,
  Order,
  OrderItem,
  CartItem,
  Review
];
