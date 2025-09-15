// Nhóm thông tin (người dùng) và các trường liên quan 

Table users {
  id              int [pk, increment]
  fullname        varchar(100) [not null]
  email           varchar(150) [not null, unique]
  phone_number    varchar(20) [not null, unique]
  address         varchar(255)
  avatar          varchar(255)
  password        varchar(255) [not null]
  gender          enum('male', 'female')
  date_of_birth   date
   role            enum('ADMIN', 'USER') [not null, default: 'USER']
  is_verified     boolean [default: false]
  role_id         int [not null]
  created_at      timestamp [default: `now()`]
  updated_at      timestamp
  is_deleted      boolean [default: false]
}


Table shipping_address {
  id            int [pk, increment]
  user_id       int [not null]
  fullname      varchar(100) [not null]
  phone_number  varchar(20) [not null]
  address       varchar(255) [not null] // Chi tiết địa chỉ
  type_address  enum("Văn phòng", "Nhà riêng") [default: "Nhà riêng"]
  is_default    boolean [default: false]
}

// Thông tin sản phẩm 

Table products {
  id                int [pk, increment]
  name_product      varchar(255) [not null]
  price             decimal(10,2) [not null]
  origin_price      decimal(10, 2)
  small_description varchar(255)
  meta_description  longtext
  status            enum('active', 'inactive', 'out_of_stock') [default: 'active']
  category_id       int [not null]
  brand_id          int
  created_at        timestamp [default: `now()`]
  updated_at        timestamp
  is_deleted        boolean [default: false]
}

// Bảng quản lý các biến thể của sản phẩm (size, màu, số lượng tồn kho)
Table product_variants {
  id          int [pk, increment]
  product_id  int [not null]
  color_id    int
  size        enum("S", "M", "L", "XL")
  price        decimal(10,2) [not null] //Mỗi biến thể khác nhau có giá khác nhau
  // sku         varchar(50) [unique]
  quantity    int [not null, default: 0] // Số lượng có trong kho hangf
}


Table colors {
  id          int [pk, increment]
  name_color  varchar(50) [not null, unique]
}

Table categories {
  id              int [pk, increment]
  name_category   varchar(255) [not null]
  image_category  varchar(255)
  description_category longtext
  is_deleted      boolean [default: false]
}

Table brands {
  id                int [pk, increment]
  name_brand        varchar(255) [not null]
  logo_url          varchar(255)
  description_brand longtext
  is_deleted        boolean [default: false]
}

Table product_gallery {
  id            int [pk, increment]
  image_url     varchar(255) [not null]
  product_id    int [not null]
}

Table reviews {
  id          int [pk, increment]
  user_id     int [not null]
  product_id  int [not null]
  rating      int [not null, note: 'Giá trị từ 1 đến 5']  
  comment     text
  created_at  timestamp [default: `now()`]
}

// Thông tin cart và order

Table carts {
  id        int [pk, increment]
  user_id   int [not null, unique] // 1 user chỉ có 1 cart
  created_at timestamp [default: `now()`]
}

Table cart_items {
  id                  int [pk, increment]
  cart_id             int [not null]
  product_variant_id  int [not null] // Tham chiếu đến biến thể cụ thể (size, màu)
  quantity            int [not null, default: 1]
}

Table orders {
  id                  int [pk, increment]
  user_id             int [not null]
  shipping_address_id int [not null]
  total_amount        decimal(12, 2) [not null]
  note                text
  status              enum("pending", "confirmed", "shipping", "completed", "canceled") [default: "pending"]
  cancel_reason text // Lý do hủy đơn (nếu status là 'canceled')
  payment_method      enum("COD", "Momo", "VNpay") [not null]
  payment_status      enum("unpaid", "paid", "refunded") [default: "unpaid"]
  voucher_id          int
  created_at          timestamp [default: `now()`]
  updated_at          timestamp
}

Table order_details {
  id                  int [pk, increment]
  order_id            int [not null]
  product_variant_id  int [not null] // Tham chiếu đến biến thể cụ thể đã mua
  quantity            int [not null]
  price               decimal(10, 2) [not null] // Lưu lại giá tại thời điểm mua hàng
}
Table cancel_order {
  id                int [pk, increment]        // Khóa chính
  order_id          int [not null]     // Tham chiếu đến đơn hàng
  order_detail_id   int 
  user_id           int [not null, note: 'Ai yêu cầu hủy']
  reason            text                       // Lý do hủy
  quantity          int                        // Số lượng bị hủy (item-level)
  refund_amount     decimal(12,2)              // Số tiền hoàn trả
  status            enum('requested','approved','rejected','refunded') 
  created_at        timestamp                  // thời gian Khi yêu cầu hủy
  processed_at      timestamp                  // thời gian Khi xử lý xong
}


Table transactions {
  id                  int [pk, increment]
  order_id            int [not null]
  transaction_code    varchar(255) // Mã giao dịch từ cổng thanh toán
  amount              decimal(12, 2) [not null]
  payment_method      varchar(50)
  status              varchar(50)
  created_at          timestamp [default: `now()`]
}

// Thông tin vouchers

Table vouchers {
  id                int [pk, increment]
  code              varchar(50) [not null, unique]
  discount_voucher  decimal(5, 2) [not null]
  expiry_date       date [not null]
  status            boolean [default: true] // true: active, false: inactive
  min_order_value   decimal(10, 2)
  max_discount      decimal(10, 2)
  quantity          int [not null, default: 0] // Số lượng voucher có thể sử dụng
}


Table blogs {
  id          int [pk, increment]
  title       varchar(255) [not null]
  content     longtext
  image_blogs varchar(255)
  author_id   int [ref: > users.id] // liên kết tới bảng users
  status      enum('active','inactive') [default: 'active']
}


// User & Role
Ref: "users"."id" < "shipping_address"."user_id"

// Product Catalog
Ref: "categories"."id" < "products"."category_id"
Ref: "brands"."id" < "products"."brand_id"
Ref: "products"."id" < "product_gallery"."product_id"
Ref: "products"."id" < "product_variants"."product_id"
Ref: "colors"."id" < "product_variants"."color_id"
Ref: "users"."id" < "reviews"."user_id"
Ref: "products"."id" < "reviews"."product_id"

// Cart
Ref: "users"."id" < "carts"."user_id"
Ref: "carts"."id" < "cart_items"."cart_id"
Ref: "product_variants"."id" < "cart_items"."product_variant_id"

// Order
Ref: "users"."id" < "orders"."user_id"
Ref: "shipping_address"."id" < "orders"."shipping_address_id"
Ref: "vouchers"."id" < "orders"."voucher_id"
Ref: "orders"."id" < "order_details"."order_id"
Ref: "product_variants"."id" < "order_details"."product_variant_id"
Ref: "orders"."id" < "transactions"."order_id"

Ref: "orders"."id" < "cancel_order"."order_id"

Ref: "order_details"."id" < "cancel_order"."order_detail_id"

Ref: "users"."id" < "cancel_order"."user_id"