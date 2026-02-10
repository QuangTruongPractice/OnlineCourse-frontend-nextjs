# Courses Online - Frontend (Next.js)

Giao diện người dùng hiện đại và hiệu năng cao cho hệ thống học trực tuyến, được xây dựng bằng Next.js 15 và thiết kế theo phong cách tối giản, chuyên nghiệp.

## 🛠️ Công nghệ sử dụng

- **Framework:** Next.js 15 (App Router)
- **Library:** React 18
- **Styling:** Tailwind CSS & Lucide Icons
- **UI Components:** Radix UI / Shadcn UI
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Authentication:** NextAuth.js
- **Animations:** Framer Motion
- **Icons:** Lucide React

## 🚀 Tính năng chính

- **Trang chủ:** Hero section bắt mắt và danh sách khóa học nổi bật.
- **Tìm kiếm:** Tìm kiếm khóa học linh hoạt theo từ khóa và danh mục.
- **Học tập (Learning):** Giao diện video player chuyên nghiệp, danh sách bài học và tài liệu đi kèm.
- **Diễn đàn (Forum):** Thảo luận trực tiếp trong từng khóa học, hỗ trợ trả lời bình luận (Reply).
- **Thanh toán:** Tối ưu hóa quy trình thanh toán qua cổng Momo.
- **Cá nhân hóa:** Quản lý hồ sơ, ảnh đại diện và theo dõi tiến độ học tập (Progress bar).

## 🔗 Demo
- **URL:** [https://online-course-frontend-nextjs-yrj4.vercel.app/](https://online-course-frontend-nextjs-yrj4.vercel.app/)

## ⚙️ Hướng dẫn cài đặt (Local)

1.  **Cài đặt dependencies:**
    ```bash
    npm install
    # hoặc
    pnpm install
    ```

2.  **Cấu hình biến môi trường (`.env.local`):**
    Tạo file `.env.local` tại thư mục gốc:
    ```env
    NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=your_random_secret
    ```

3.  **Khởi động Development Server:**
    ```bash
    npm run dev
    ```

4.  **Kiểm tra:**
    Mở trình duyệt tại địa chỉ `http://localhost:3000`.

## 🧪 Chạy Tests
Dự án tích hợp Jest và React Testing Library để đảm bảo tính ổn định:
```bash
npm test
```

## 📝 Ghi chú
- Đảm bảo Backend đã được khởi động và cấu hình đúng `NEXT_PUBLIC_BACKEND_URL` để dữ liệu được hiển thị chính xác.
- Hệ thống sử dụng OAuth2 để xác thực người dùng qua Backend.
