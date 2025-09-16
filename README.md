# Express TypeScript Codebase

Một khung dự án backend sử dụng Express với TypeScript, tích hợp migration.

## Mục lục

- Giới thiệu
- Công nghệ sử dụng
- Cài đặt
- Chạy dự án
- Scripts
- Cấu trúc thư mục
- License

# Fashion E-commerce Backend

Backend API cho website bán quần áo sử dụng Express với TypeScript và TypeORM.

## Giới thiệu

Dự án backend cho website bán quần áo với các tính năng:
- Quản lý sản phẩm (quần áo) với size, màu sắc, chất liệu
- Quản lý thương hiệu (brands) và danh mục
- Hệ thống giỏ hàng và đặt hàng  
- Đánh giá sản phẩm
- Authentication & Authorization
- Phân lớp Controller - Service - Entity rõ ràng

## Công nghệ sử dụng

### Backend:
- **Node.js** - Runtime environment
- **TypeScript** - Strongly typed JavaScript
- **Express.js** - Web framework
- **TypeORM** - Object-Relational Mapping
- **ts-node** - TypeScript execution engine

### Frontend:
- **Next.js** - React framework
- **TypeScript** - Type safety

### Database:
- **MySQL** - Relational database

## Cài đặt

Yêu cầu: Node.js >= 22.16.0, đã cài MySQL

1. Clone dự án:

## git clone https://github.com/TranChinh2901/software_project
## cd software_project

2. Cài dependencies:

npm install

3. Tạo file .env:

cp .env.example .env

Cập nhật thông tin kết nối DB, PORT, JWT,... trong file .env

## Chạy dự án

1. Chạy migration để tạo bảng:

npm run migration:run

2. Chạy ở môi trường phát triển:

npm run dev

3. Tạo bảng mới trong từ Entity dùng migration: (thay tên file, viết liền không dấu, không kí tự đặc biệt)
npm run migration:generate -- src/migrations/tenFile

## Scripts

| Lệnh                                 | Mô tả                                 |
|--------------------------------------|----------------------------------------|
| npm run dev                          | Chạy server với ts-node-dev           |
| npm run migration:run                | Chạy migration tạo bảng DB            |
| npm run migration:generate -- src/migrations/tenFile   | Tạo file migration mới. Thay tên file viết liền không dấu, không kí tự đặc biệt             |

## Cấu trúc thư mục
```bash
src/
  ├── common/                 // Định nghĩa response trả về (gồm error, success)
  ├── config/                 // Cấu hình ứng dụng, DB, load env, load entity dùng cho khởi tạo DB
  ├── constants/             // Định nghĩa hằng số dùng toàn app: error-code, message, status-code,...
  ├── database/               // Khởi tạo kết nối DB từ DB config
  ├── helpers/               // Hàm hỗ trợ
  ├── middlewares/           // Middleware custom
  ├── routes/                // Định nghĩa route
  ├── migrations/             // File migration tạo bảng trong DB
  ├── modules/              // Các module trong dự án: users, auth,...
  ├── utils/                 // Hàm tiện ích
main.ts                   // File chính: chạy app, middleware,...
```

## License

Dự án được cấp phép theo MIT License.

## Tác giả

-Tranchinh2901
