# 👟 Shoes Store - E-commerce Platform

<div align="center">

![Project Status](https://img.shields.io/badge/STATUS-PRODUCTION--READY-brightgreen?style=for-the-badge)
![NestJS](https://img.shields.io/badge/backend-NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Database](https://img.shields.io/badge/database-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)

</div>

Dự án website bán giày đa năng, được thiết kế và tối ưu theo tiêu chuẩn thực tế với sự chú trọng đặc biệt vào tính toàn vẹn dữ liệu, bảo mật và hiệu năng cao.

---

## 🏗️ Kiến trúc & Giải pháp (Technical Solutions)

Trong dự án này, mỗi dòng code đều được viết với tư duy xử lý các bài toán lớn trong hệ thống E-commerce thực tế:

### ![ACID](https://img.shields.io/badge/Data-Integrity-blue?style=flat-square&logo=database) 1. Tính toàn vẹn dữ liệu (ACID & Transactions)
- **Problem:** Tránh việc "mất tiền oan" hoặc "bán lố" (Over-selling) khi có tranh chấp dữ liệu.
- **Solution:** Sử dụng TypeORM `QueryRunner` để quản lý Transaction thủ công kết hợp với **Pessimistic Locking** (`pessimistic_write`). Đảm bảo mỗi giao dịch trừ tồn kho đều là nguyên tử (Atomic).

### ![Security](https://img.shields.io/badge/Security-Advanced-red?style=flat-square&logo=securityscorecard) 2. Bảo mật đa tầng (Defense in Depth)
- **Problem:** Lạm dụng API (Injection/Logic Bypass) để đặt hàng các sản phẩm không còn kinh doanh.
- **Solution:** Kết hợp **DTO Validation** và **Business Logic Verification**. Mọi sản phẩm đều được kiểm tra trạng thái hoạt động (`isActive`) tại cả lớp Cart và lớp Transaction của Order.

### ![Performance](https://img.shields.io/badge/Performance-Optimized-orange?style=flat-square&logo=speedtest) 3. Hiệu năng vượt trội (Target 200ms)
- **Problem:** Hệ thống chậm chạp khi dữ liệu lên tới 10.000+ sản phẩm.
- **Solution:** 
  - **Database Indexing:** Đánh chỉ mục thực tế cho các trường hay Filter/Sort.
  - **Enforced Pagination:** Ép buộc phân trang đồng bộ từ Backend đến Frontend để giảm kích thước payload JSON.
  - **Frontend:** Tối ưu TTI (Time to Interactive) bằng rendering phân đoạn.

---

## 🛠 Tech Stack

| Tầng | Công nghệ sử dụng |
| :--- | :--- |
| **Backend** | ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white) |
| **Frontend** | ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) ![Zustand](https://img.shields.io/badge/Zustand-orange?style=flat-square) |
| **Styling** | ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white) ![TypeORM](https://img.shields.io/badge/TypeORM-fe0805?style=flat-square) |

---

## 📂 Cấu trúc thư mục (Folder Structure)

| Thư mục | Chức năng |
| :--- | :--- |
| `backend/src/cart` |  Quản lý logic giỏ hàng & Validation |
| `backend/src/order` |  Xử lý đặt hàng & ACID Transactions |
| `backend/src/product` |  Quản lý sản phẩm & Indexing |
| `frontend/src/store` |  Quản lý Global State với Zustand |

---

## ⚙️ Cài đặt & Chạy dự án

### 1. Yêu cầu hệ thống
- Node.js version 18+
- PostgreSQL/MySQL

### 2. Quick Start
```bash
# Clone repo
git clone <your-repo-url>
cd Shoes_Store

# Chạy Backend (Cần cấu hình .env)
cd backend && npm install && npm run dev

# Chạy Frontend
cd frontend && npm install && npm run dev
```

---

## 📜 Giấy phép
Dự án được phát triển dưới góc độ học tập và chuyên nghiệp hóa Portfolio.

---
**Senior Mentor Note:** Dự án này không chỉ là về tính năng, mà là về cách xây dựng một kiến trúc **Tin cậy** và **Tối ưu**.
