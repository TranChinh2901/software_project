# Hệ thống quản lý sản phẩm (Products Management)

## 📋 Tổng quan

Hệ thống quản lý sản phẩm hoàn chỉnh với các tính năng CRUD đầy đủ, bao gồm:
- Thêm mới sản phẩm với upload hình ảnh
- Chỉnh sửa thông tin sản phẩm
- Xóa sản phẩm (soft delete)
- Xem chi tiết sản phẩm
- Tìm kiếm và lọc sản phẩm
- Phân trang
- Thống kê tổng quan

## 🎯 Tính năng đã hoàn thành

### Frontend (Next.js + TypeScript)

#### 1. Components

**`Products.tsx`** - Component chính
- Hiển thị danh sách sản phẩm dạng bảng
- Thống kê tổng quan (tổng sản phẩm, đang bán, sắp hết hàng, hết hàng)
- Tìm kiếm theo tên, mô tả
- Lọc theo trạng thái, danh mục, thương hiệu
- Phân trang
- Các thao tác: Xem chi tiết, Chỉnh sửa, Xóa

**`ProductModal.tsx`** - Modal thêm/sửa sản phẩm
- Form nhập đầy đủ thông tin sản phẩm
- Upload và preview hình ảnh
- Validation form
- Hỗ trợ cả thêm mới và chỉnh sửa
- Giới hạn kích thước file upload (5MB)

**`ProductDetailModal.tsx`** - Modal xem chi tiết
- Hiển thị đầy đủ thông tin sản phẩm
- Hình ảnh lớn
- Các badge trạng thái
- Thông tin danh mục, thương hiệu
- Thời gian tạo và cập nhật

#### 2. API Integration

```typescript
// lib/api/index.ts
export const productApi = {
  getAll: (params?: Record<string, unknown>) => apiClient.get('/products', { params }),
  getById: (id: number) => apiClient.get(`/products/${id}`),
  create: (data: FormData) => apiClient.post('/products', data),
  update: (id: number, data: FormData) => apiClient.put(`/products/${id}`, data),
  delete: (id: number) => apiClient.delete(`/products/${id}`),
};
```

#### 3. Styling

- `Products.module.css` - Style cho danh sách sản phẩm
- `ProductModal.module.css` - Style cho modal thêm/sửa
- `ProductDetailModal.module.css` - Style cho modal chi tiết

### Backend (Express + TypeORM + TypeScript)

#### 1. Entity

```typescript
// product.entity.ts
@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  name_product: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  origin_price?: number;

  @Column({ length: 255, nullable: true })
  small_description?: string;

  @Column("longtext", { nullable: true })
  meta_description?: string;

  @Column({ nullable: true })
  image_product?: string;

  @Column({ type: "enum", enum: ProductType, default: ProductType.ACTIVE })
  status: ProductType;

  @Column({ type: "int", nullable: true })
  stock_quantity?: number;

  @Column({ type: "int", nullable: true })
  discount?: number;

  @Column({ type: "boolean", default: false })
  is_on_sale: boolean;

  @ManyToOne(() => Category)
  @JoinColumn({ name: "category_id" })
  category: Category;

  @ManyToOne(() => Brand)
  @JoinColumn({ name: "brand_id" })
  brand?: Brand;

  @Column({ type: "boolean", default: false })
  is_deleted: boolean;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}
```

#### 2. Service (product.service.ts)

**Các method đã implement:**

- `createProduct(productData: CreateProductDto)` - Tạo sản phẩm mới
- `getAllProducts(query?: QueryProductDto)` - Lấy danh sách với filter, sort, pagination
- `getProductById(id: number)` - Lấy chi tiết sản phẩm
- `updateProduct(id: number, updateData: UpdateProductDto)` - Cập nhật sản phẩm
- `deleteProduct(id: number)` - Xóa sản phẩm (soft delete)
- `getFeaturedProducts()` - Lấy sản phẩm nổi bật
- `getBestSellers()` - Lấy sản phẩm bán chạy
- `getFlashSaleProducts()` - Lấy sản phẩm flash sale
- `getProductsByCategory(categoryId: number)` - Lấy sản phẩm theo danh mục
- `getRelatedProducts(productId: number, limit: number)` - Lấy sản phẩm liên quan

#### 3. Controller (product.controller.ts)

**Các endpoint:**

- `POST /products` - Tạo sản phẩm mới (requireAuth)
- `GET /products` - Lấy danh sách sản phẩm
- `GET /products/featured` - Lấy sản phẩm nổi bật
- `GET /products/best-sellers` - Lấy sản phẩm bán chạy
- `GET /products/flash-sale` - Lấy sản phẩm flash sale
- `GET /products/category/:category_id` - Lấy sản phẩm theo danh mục
- `GET /products/:id` - Lấy chi tiết sản phẩm
- `GET /products/:id/related` - Lấy sản phẩm liên quan
- `PUT /products/:id` - Cập nhật sản phẩm (requireAuth)
- `DELETE /products/:id` - Xóa sản phẩm (requireAuth)

#### 4. Routes (routes/products/index.ts)

```typescript
router.post("/", requireAuth(), uploadProductImage.single("image_product"), productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/featured", productController.getFeaturedProducts);
router.get("/best-sellers", productController.getBestSellers);
router.get("/flash-sale", productController.getFlashSaleProducts);
router.get("/category/:category_id", productController.getProductsByCategory);
router.get("/:id/related", productController.getRelatedProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", requireAuth(), uploadProductImage.single("image_product"), productController.updateProduct);
router.delete("/:id", requireAuth(), productController.deleteProduct);
```

## 📊 Query Parameters cho GET /products

```typescript
interface QueryProductDto {
  search?: string;           // Tìm kiếm theo tên, mô tả
  category_id?: number;      // Lọc theo danh mục
  brand_id?: number;         // Lọc theo thương hiệu
  min_price?: number;        // Giá tối thiểu
  max_price?: number;        // Giá tối đa
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
  page?: number;             // Trang hiện tại
  limit?: number;            // Số item mỗi trang
  featured?: boolean;        // Lọc sản phẩm nổi bật
  status?: string;           // Lọc theo trạng thái
  is_on_sale?: boolean;      // Lọc sản phẩm đang sale
}
```

## 🔒 Authentication

Các endpoint sau yêu cầu authentication:
- `POST /products` - Tạo sản phẩm
- `PUT /products/:id` - Cập nhật sản phẩm
- `DELETE /products/:id` - Xóa sản phẩm

Sử dụng middleware `requireAuth()` để xác thực JWT token.

## 📸 Upload hình ảnh

- Middleware: `uploadProductImage.single("image_product")`
- Sử dụng Cloudinary để lưu trữ
- Frontend gửi file qua FormData
- Giới hạn kích thước: 5MB
- Định dạng hỗ trợ: PNG, JPG, JPEG

## 🎨 UI/UX Features

### 1. Stats Cards
Hiển thị thống kê nhanh:
- Tổng số sản phẩm
- Số sản phẩm đang bán
- Số sản phẩm sắp hết hàng (< 10)
- Số sản phẩm hết hàng

### 2. Filter & Search
- Tìm kiếm realtime
- Lọc theo trạng thái (Đang bán / Ngừng bán)
- Lọc theo danh mục
- Lọc theo thương hiệu

### 3. Product Table
Hiển thị các thông tin:
- ID sản phẩm
- Hình ảnh & tên sản phẩm
- Giá bán (có badge giảm giá nếu có)
- Danh mục (badge màu tím)
- Thương hiệu (badge màu xanh)
- Tồn kho (badge màu xanh/vàng/đỏ)
- Trạng thái (Đang bán / Ngừng bán)
- Ngày tạo
- Các thao tác (Xem / Sửa / Xóa)

### 4. Responsive Design
- Mobile-friendly
- Adaptive grid layout
- Touch-friendly buttons

## 🚀 Cách sử dụng

### Frontend

1. **Xem danh sách sản phẩm:**
   - Truy cập `/admin/products`
   - Tự động load danh sách sản phẩm

2. **Thêm sản phẩm mới:**
   - Click nút "Thêm sản phẩm"
   - Điền thông tin và upload ảnh
   - Click "Thêm mới"

3. **Chỉnh sửa sản phẩm:**
   - Click icon Edit (✏️)
   - Cập nhật thông tin cần thiết
   - Click "Cập nhật"

4. **Xem chi tiết:**
   - Click icon View (👁️)
   - Xem đầy đủ thông tin sản phẩm

5. **Xóa sản phẩm:**
   - Click icon Delete (🗑️)
   - Xác nhận xóa

### Backend API Testing

#### Tạo sản phẩm mới
```http
POST /api/products
Content-Type: multipart/form-data
Authorization: Bearer <token>

{
  "name_product": "Laptop Dell XPS 15",
  "price": "25000000",
  "origin_price": "30000000",
  "small_description": "Laptop cao cấp cho dân chuyên nghiệp",
  "meta_description": "Mô tả chi tiết...",
  "status": "active",
  "stock_quantity": "50",
  "discount": "17",
  "category_id": "1",
  "brand_id": "2",
  "image_product": <file>
}
```

#### Lấy danh sách sản phẩm
```http
GET /api/products?page=1&limit=10&status=active&category_id=1
```

#### Cập nhật sản phẩm
```http
PUT /api/products/1
Content-Type: multipart/form-data
Authorization: Bearer <token>

{
  "price": "24000000",
  "stock_quantity": "45"
}
```

#### Xóa sản phẩm
```http
DELETE /api/products/1
Authorization: Bearer <token>
```

## 🔧 Cấu trúc file

```
software_project/
├── src/
│   ├── modules/
│   │   └── products/
│   │       ├── entity/
│   │       │   └── product.entity.ts
│   │       ├── dto/
│   │       │   ├── product.dto.ts
│   │       │   └── query-product.dto.ts
│   │       ├── enum/
│   │       │   └── product.enum.ts
│   │       ├── schema/
│   │       ├── product.controller.ts
│   │       ├── product.service.ts
│   │       └── product.mapper.ts
│   └── routes/
│       └── products/
│           └── index.ts

software_project_fe/
├── src/
│   ├── components/
│   │   └── admin/
│   │       └── products/
│   │           ├── Products.tsx
│   │           ├── ProductModal.tsx
│   │           └── ProductDetailModal.tsx
│   ├── styles/
│   │   └── admin/
│   │       ├── Products.module.css
│   │       ├── ProductModal.module.css
│   │       └── ProductDetailModal.module.css
│   ├── types/
│   │   ├── product/
│   │   ├── category/
│   │   └── brand/
│   ├── enums/
│   │   └── product/
│   └── lib/
│       └── api/
│           └── index.ts
```

## ✅ Checklist tính năng

- [x] CRUD đầy đủ (Create, Read, Update, Delete)
- [x] Upload hình ảnh
- [x] Tìm kiếm sản phẩm
- [x] Lọc theo trạng thái, danh mục, thương hiệu
- [x] Phân trang
- [x] Soft delete
- [x] Validation form
- [x] Error handling
- [x] Loading states
- [x] Success/Error notifications
- [x] Responsive design
- [x] Authentication & Authorization
- [x] Thống kê tổng quan
- [x] Modal chi tiết sản phẩm
- [x] Preview hình ảnh khi upload
- [x] Badge trạng thái (stock, status, discount)

## 🎯 Các cải tiến có thể thêm

1. **Export/Import Excel**
2. **Bulk actions** (xóa nhiều, cập nhật nhiều)
3. **Product variants** (màu sắc, kích thước)
4. **Image gallery** (nhiều ảnh cho 1 sản phẩm)
5. **SEO fields** (meta title, meta keywords)
6. **Product reviews integration**
7. **Stock alerts** (cảnh báo khi sắp hết hàng)
8. **Price history**
9. **Duplicate product**
10. **Advanced filters** (price range slider, multiple categories)

## 📝 Notes

- Tất cả giá tiền được format theo VNĐ
- Ngày tháng hiển thị theo định dạng Việt Nam
- Soft delete: sản phẩm không bị xóa khỏi DB, chỉ set `is_deleted = true`
- Upload ảnh tự động resize và optimize bởi Cloudinary
- Form validation chặt chẽ cả frontend và backend

---

**Phát triển bởi:** Tran Viet Chinh
**Ngày cập nhật:** 28/11/2025
