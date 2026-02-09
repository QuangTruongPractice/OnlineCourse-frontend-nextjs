# Frontend - Courses Online Web

Ứng dụng Frontend xây dựng bằng Next.js (App Router) cho nền tảng khóa học trực tuyến.

## Sản phẩm dùng để làm gì?
- Cung cấp nền tảng học trực tuyến với các khóa học đa dạng
- Cho phép học viên đăng ký/ thanh toán/ học và theo dõi tiến độ
- Cho phép giảng viên tạo khóa học, quản lý nội dung và diễn đàn thảo luận

## Các giao diện chính
- Trang chủ: `src/app/page.tsx` (Hero, Featured Courses)
- Đăng nhập/ Đăng ký: `src/app/(guest)/auth/signin`, `src/app/(guest)/auth/register`
- Tìm kiếm khóa học: `src/app/course/search`
- Chi tiết khóa học: `src/app/course/[id]/page.tsx`
- Học tập (Learn): `src/app/course/[id]/learn`
- Thanh toán: `src/app/course/[id]/payment`
- Tiến độ học: `src/app/course/[id]/progress`
- Diễn đàn khóa học: `src/app/course/[id]/forum`
- Khóa học của tôi: `src/app/my-courses`
- Trang người dùng/ hồ sơ: `src/app/user`, `src/app/user/profile`, `src/app/user/update-profile`

## Kết nối Backend
- Cấu hình base URL qua biến môi trường `NEXT_PUBLIC_BACKEND_URL`
- API client: `src/utils/api.ts` (axios)
- Endpoint cấp token OAuth2: `/o/token/`

## Cài đặt & Chạy (local)
1) Cài dependencies:
```bash
npm install
# hoặc
pnpm install
```
2) Tạo file `.env.local` ở thư mục gốc FE với nội dung ví dụ:
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret
```
3) Chạy dev server:
```bash
npm run dev
# hoặc
pnpm dev
```
4) Mở `http://localhost:3000`

## Ghi chú
- Đăng nhập sử dụng OAuth2 Password (lấy token từ BE `/o/token/`, FE sẽ gọi qua `endpoints.token`).
- Cần khởi chạy BE trước và set đúng `NEXT_PUBLIC_BACKEND_URL` để FE hoạt động.
