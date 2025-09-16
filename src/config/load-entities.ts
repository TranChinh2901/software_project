import { User } from "@/modules/users/entity/user.entity";
import { Product } from "@/modules/products/entity/product.entity";
import { Category } from "@/modules/categories/entity/category.entity";
import { Brand } from "@/modules/brands/entity/brand.entity";
import { Order } from "@/modules/orders/entity/order.entity";
import { OrderDetail } from "@/modules/orders/entity/order-item.entity";
import { Cart } from "@/modules/carts/entity/cart.entity";
import { CartItem } from "@/modules/carts/entity/cart-item.entity";
import { Review } from "@/modules/reviews/entity/review.entity";
import { Color } from "@/modules/colors/entity/color.entity";
import { ProductVariant } from "@/modules/product-variants/entity/product-variant";
import { ProductGallery } from "@/modules/product-gallery/entity/product-gallery.entity";
import { ShippingAddress } from "@/modules/shipping-address/entity/shipping-address.entity";
import { CancelOrder } from "@/modules/cancel-order/entity/cancel-order.entity";
import { Transaction } from "@/modules/transactions/entity/transaction.entity";
import { Voucher } from "@/modules/vouchers/entity/voucher.entity";
import { Blog } from "@/modules/blogs/entity/blog.entity";

// import entity to use in config-database file
export const entities = [
  User,
  Product,
  Category,
  Brand,
  Order,
  OrderDetail,
  Cart,
  CartItem,
  Review,
  Color,
  ProductVariant,
  ProductGallery,
  ShippingAddress,
  CancelOrder,
  Transaction,
  Voucher,
  Blog
];
