import { User } from "@/modules/users/entity/user.entity";
import { Product } from "@/modules/products/entity/product.entity";
import { Category } from "@/modules/categories/entity/category.entity";
import { Brand } from "@/modules/brands/entity/brand.entity";
import { Order } from "@/modules/orders/entity/order.entity";
import { OrderDetail } from "@/modules/orders/entity/order-detail.entity";
import { Cart } from "@/modules/carts/entity/cart.entity";
import { CartItem } from "@/modules/carts/entity/cart-item.entity";
import { Review } from "@/modules/reviews/entity/review.entity";
import { Color } from "@/modules/colors/entity/color.entity";
import { ProductVariant } from "@/modules/product-variants/entity/product-variant";
import { ProductGallery } from "@/modules/product-gallery/entity/product-gallery.entity";
import { ShippingAddress } from "@/modules/shipping-address/entity/shipping-address.entity";
import { Transaction } from "@/modules/transactions/entity/transaction.entity";
import { Voucher } from "@/modules/vouchers/entity/voucher.entity";
import { Blog } from "@/modules/blogs/entity/blog.entity";
import { CancelOrder } from "@/modules/orders/entity/cancel-order.entity";

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
