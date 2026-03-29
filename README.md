# 👟 Shoes Store - E-commerce Platform

<div align="center">

![Project Status](https://img.shields.io/badge/STATUS-DEVELOPMENT-orange?style=for-the-badge)
![NestJS](https://img.shields.io/badge/backend-NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Database](https://img.shields.io/badge/database-MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

</div>

**Shoes Store** là một dự án E-commerce thực tế, được xây dựng với mục tiêu chuẩn hóa quy trình phát triển và vận hành một hệ thống bán hàng hiện đại. Không chỉ dừng lại ở các chức năng CRUD cơ bản, dự án tập trung giải quyết các bài toán về tính toàn vẹn dữ liệu, bảo mật đa tầng và trải nghiệm người dùng tối ưu.

---

## 🚀 Giải pháp Kỹ thuật (Technical Solutions)

Dự án được thiết kế dựa trên tư duy xử lý các vấn đề thường gặp trong môi trường Production:

### 🛡️ 1. Bảo mật & Xác thực (Security & Auth)
- **Cơ chế xác thực:** Kết hợp **JWT (JSON Web Token)** cho các phiên làm việc thông thường và **Google OAuth 2.0** để đơn giản hóa quá trình đăng nhập cho người dùng.
- **Phân quyền (RBAC):** Sử dụng **Guard & Decorator** trong NestJS để kiểm soát truy cập theo vai trò (User/Admin).
- **Validation:** Đảm bảo dữ liệu sạch ngay từ cổng vào với **DTO (Data Transfer Object)** và `class-validator`, ngăn chặn các lỗi Logic Bypass.

### 💾 2. Toàn vẹn dữ liệu (Data Integrity)
- **Transaction Flow:** Mọi hoạt động đặt hàng đều được bao bọc bởi **Database Transactions**. Đảm bảo tính nguyên tử (Atomicity) - hoặc là hoàn tất toàn bộ (Trừ kho, tạo đơn) hoặc là không gì cả.
- **Concurrency Control:** Sử dụng cơ chế khóa hợp lý để tránh tình trạng **Over-selling** (bán quá số lượng tồn kho) khi có nhiều người dùng cùng đặt hàng một lúc.

### ⚡ 3. Tối ưu Hiệu năng (Performance)
- **Database Indexing:** Các trường thường xuyên tìm kiếm (Search) hoặc lọc (Filter) được đánh Index để giảm thời gian phản hồi của Query.
- **Media Management:** Tích hợp **Cloudinary API** để xử lý và tối ưu hóa hình ảnh, giảm tải cho Server và tăng tốc độ tải trang phía Frontend.
- **Smart Pagination:** Áp dụng phân trang đồng bộ từ Database đến API, giúp hệ thống hoạt động ổn định kể cả khi lượng sản phẩm tăng lên.

---

## ✨ Tính năng Cốt lõi (Core Features)

- **🛒 Luồng mua sắm:** Giỏ hàng thông minh (Persist State), quy trình Checkout an toàn và theo dõi trạng thái đơn hàng.
- **🔍 Tìm kiếm & Lọc:** Hệ thống lọc sản phẩm linh hoạt theo Danh mục, Khoảng giá và các thuộc tính khác.
- **👤 Quản lý người dùng:** Thông tin cá nhân, lịch sử đơn hàng và bảo mật tài khoản.
- **📦 Inventory Management:** Hệ thống quản lý kho hàng tự động cập nhật sau mỗi giao dịch thành công.
- **📧 Email Service:** Gửi thông báo xác nhận và thông tin quan trọng qua hệ thống Mailer tích hợp.

---

## 🛠️ Tech Stack

| Thành phần | Công nghệ |
| :--- | :--- |
| **Backend** | ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white) ![TypeORM](https://img.shields.io/badge/TypeORM-fe0805?style=flat-square) ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white) |
| **Frontend** | ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) ![Zustand](https://img.shields.io/badge/Zustand-orange?style=flat-square) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) |
| **Infrastructure** | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black) |

---

## ⚙️ Cài đặt & Khởi chạy

### Cách 1: Sử dụng Docker (Khuyên dùng)
Dự án đã được cấu hình sẵn môi trường container hóa, bạn chỉ cần một lệnh duy nhất:
```bash
docker-compose up --build
```

### Cách 2: Chạy thủ công
1. **Backend:**
   ```bash
   cd backend && npm install
   npm run dev
   ```
2. **Frontend:**
   ```bash
   cd frontend && npm install
   npm run dev
   ```

---

## 📜 Ghi chú từ Mentor
Dự án này tập trung vào việc áp dụng các **Best Practices** trong lập trình. Mỗi module đều được tách biệt rõ ràng (Modular Architecture), dễ dàng mở rộng và bảo trì trong tương lai.

