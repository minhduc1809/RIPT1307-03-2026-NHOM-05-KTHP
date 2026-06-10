# Smart Admin Platform — SaaS Multi-tenant System

Nền tảng SaaS quản lý **biểu mẫu động** (dynamic forms), **quy trình phê duyệt** (approval workflows) và **theo dõi đơn nộp** (submission tracking) dành cho doanh nghiệp hỗ trợ cấu trúc đa tenant (Multi-tenant).

🚀 **Đường dẫn Deploy:** [https://smart-admin-platform.netlify.app/](https://smart-admin-platform.netlify.app/)

---

## 📌 Giới thiệu dự án

Hệ thống được thiết kế theo mô hình tách biệt Backend và Frontend:
- **[Backend](./backend)**: Xây dựng trên **NestJS 11** · **TypeScript 5.7** · **PostgreSQL (Prisma)** · **Redis (BullMQ)** · **Socket.io** · **Keycloak SSO**.
- **[Frontend](./frontend)**: Xây dựng trên **React 17** · **UmiJS 3** · **Ant Design 4** · **TypeScript** · **Socket.io** · **Keycloak SSO**.

---

## ⚡ Các tính năng chính của hệ thống

| Module | Phía Backend | Phía Frontend |
|--------|--------------|---------------|
| **Authentication & SSO** | JWT + Keycloak SSO, Token Rotation với Token Family, tự thu hồi khi phát hiện refresh token tái sử dụng, tra cứu token O(1) qua `jti`. | Axios interceptor tự động gia hạn JWT (Silent Token Refresh), xếp hàng các request trong lúc làm mới token giúp phiên làm việc liên tục. |
| **Form Builder & Engine** | Biểu mẫu động theo JSON Schema. ValidationEngine kiểm tra regex/min/max/minLength/afterField, chống ReDoS bằng `safe-regex2`. | Thiết kế kéo thả (`react-beautiful-dnd`), 4 loại trường (text/number/date/select), validate client-side và ánh xạ lỗi server tới từng trường. Hỗ trợ 5 bộ theme giao diện. |
| **Submission Vòng đời đơn nộp** | Trạng thái: DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED/REJECTED/RETURNED/CANCELLED. Chuỗi phiên bản nộp lại (revision chain), recall/withdraw. | Modal điền đơn 2 bước: chọn biểu mẫu → render form tự động từ JSON Schema. Danh sách đơn nộp cá nhân (`MySubmissions`) lọc theo 7 trạng thái cùng thanh thống kê. |
| **Workflow Engine & FSM** | FSM config-driven: duyệt tuần tự, duyệt song song (PARALLEL_JOIN), bỏ phiếu (VOTING), chạy trong Prisma Transaction chống race condition. SLA & tự động leo thang. | Thiết kế quy trình kéo thả/hỗn hợp (Workflow Builder), cấu hình vai trò, SLA, yêu cầu bình luận. Sơ đồ SVG (`WorkflowTree`) hỗ trợ 4 layout engine, zoom/pan, auto-fit. |
| **Ủy quyền & Phân quyền** | Ủy quyền phê duyệt (Delegation) chi tiết theo phạm vi (form/workflow/thời gian) dùng cơ chế "acting-as". | Quản lý ủy quyền phía giao diện. Phân quyền truy cập route (`src/access.ts`) thông qua UmiJS access plugin. |
| **Hàng đợi & Tác vụ nền** | Quét vi phạm SLA định kỳ (30 phút/lần), dọn token hết hạn, nhắc nhở duyệt đơn quá 24h. Hàng đợi export Excel sử dụng BullMQ. | Nút tải báo cáo/xuất Excel (`ExportJobButton`) kèm thông báo realtime tình trạng job. |
| **Realtime & Notifications** | Socket.io gateway tích hợp Redis adapter cho thông báo realtime đa server, đếm thông báo chưa đọc, đánh dấu đã đọc. | Chuông thông báo realtime (`NotificationBell`), badge cập nhật tự động qua Socket.io. |
| **Dashboard & Audit Log** | API thống kê dữ liệu: SLA metrics, xu hướng đơn nộp, top biểu mẫu. Ghi nhật ký audit log bất biến (CREATE/UPDATE/DELETE/APPROVE/REJECT). | Dashboard đồ thị biểu diễn xu hướng theo ngày, thống kê SLA và tỷ lệ tuân thủ quy trình. |

---

## 🛠️ Kiến trúc bảo mật & Phân quyền

### Backend Security
Mọi request đều đi qua chuỗi 3 guard toàn cục theo thứ tự:
```
JwtAuthGuard  →  KeycloakSyncGuard  →  RolesGuard
(xác thực JWT)   (đồng bộ user SSO)    (kiểm tra @Roles)
```
- **Multi-tenancy**: Mọi truy vấn database qua Prisma được lọc và scope tự động theo `tenantId` thông qua `ClsModule` (request-scoped context).
- **Rate limiting**: Giới hạn 60 request/phút toàn hệ thống, 30 request/phút cho các route login/refresh.

### Frontend Authorization
Khai báo phân quyền tại `frontend/src/access.ts` và áp dụng qua UmiJS access plugin:

| Quyền hạn | Vai trò phù hợp | Route áp dụng |
|-----------|-----------------|---------------|
| `canAdmin` | `ADMIN` | Quản lý người dùng hệ thống |
| `canManage` | `ADMIN`, `MANAGER` | `/dashboard`, `/forms/*` (Thiết kế form) |
| `canApprove` | `ADMIN`, `MANAGER`, `HR` | `/workflows/*`, `/delegations`, `/submissions/pending` |
| **Đã đăng nhập** | Mọi vai trò | `/submissions/mine`, `/profile`, `/notifications` |

---

## 📂 Cấu trúc thư mục của toàn bộ dự án

```
Smart-admin-platform/
├── backend/                  # Mã nguồn NestJS API Server
│   ├── prisma/               # Quản lý Database Schema & Seed Data
│   ├── src/
│   │   ├── common/           # Decorators, guards, filters, interceptors dùng chung
│   │   └── modules/          # Các module tính năng (auth, user, form, workflow, delegation, notification, realtime...)
│   └── README.md             # Hướng dẫn chi tiết setup backend
│
├── frontend/                 # Mã nguồn React / UmiJS Web App
│   ├── config/               # Cấu hình routes, proxy, defaultSettings
│   ├── docs/                 # Tài liệu chi tiết của từng API module
│   ├── src/
│   │   ├── components/       # Các component UI (FormBuilder, WorkflowTree, NotificationBell...)
│   │   ├── pages/            # Các trang giao diện (Dashboard, Forms, Workflows, Submissions...)
│   │   ├── services/         # Gọi API tích hợp backend
│   │   └── utils/            # Axios instance, helpers...
│   └── README.md             # Hướng dẫn chi tiết setup frontend
│
└── README.md                 # Tài liệu này (Tổng quan dự án)
```

---

## ⚙️ Hướng dẫn cài đặt và vận hành nhanh

### Yêu cầu môi trường chung
- **Node.js**: Phiên bản 16 - 20 (Khuyến nghị Node.js ≥ 20 cho backend và Node.js ≥ 16 cho frontend)
- **PostgreSQL**: Phiên bản ≥ 14
- **Redis**: Phiên bản ≥ 7

---

### Khởi chạy nhanh bằng Docker (Khuyên dùng)

Nếu bạn đã cài đặt Docker và Docker Compose, bạn có thể chạy toàn bộ hệ thống bao gồm Database, Redis, Keycloak SSO và Backend chỉ bằng 1 lệnh duy nhất:

```bash
cd backend
docker compose up -d
```
Stack đầy đủ gồm:
- **Backend**: port `3000`
- **PostgreSQL 16**: port `5432`
- **Redis 7**: port `6800`
- **Keycloak SSO**: port `8080` (auto-import realm)
- **PgAdmin**: port `5050`

---

### Cài đặt và vận hành bằng tay (Manual)

#### 1. Setup Backend

Di chuyển vào thư mục backend:
```bash
cd backend
```

Cài đặt dependencies:
```bash
npm install
```

Cấu hình môi trường `.env`:
Copy file `.env.example` thành `.env` và cập nhật thông số kết nối Database, Redis:
```bash
cp .env.example .env
```

Khởi tạo database và seed dữ liệu demo:
```bash
npx prisma migrate dev       # Tạo bảng
npx prisma generate          # Sinh client Prisma
npx prisma db seed           # Tạo tài khoản admin mặc định (admin@example.com / 123456)
```
Để seed dữ liệu giả lập doanh nghiệp đầy đủ (150 nhân sự, 8 biểu mẫu, 7 quy trình, ~180 đơn nộp):
```bash
npx ts-node prisma/seed-company-data.ts
```
*(Lưu ý: Mật khẩu mặc định của tất cả các tài khoản demo là `Test@12345`)*

Chạy Backend ở chế độ development:
```bash
npm run start:dev
```
- Swagger API Docs sẽ chạy tại: **http://localhost:3000/api**

---

#### 2. Setup Frontend

Di chuyển vào thư mục frontend:
```bash
cd frontend
```

Cài đặt dependencies:
```bash
npm install
# hoặc dùng yarn
```

Cấu hình môi trường `.env`:
Tạo file `.env` tại thư mục `frontend/` và khai báo:
```env
APP_CONFIG_IP_ROOT=http://localhost:3000
```

Chạy Frontend ở chế độ development:
```bash
npm run dev
```
- Mở trình duyệt truy cập: **http://localhost:8000**
- Sử dụng tài khoản demo (ví dụ: `admin@techvision.vn` / `Test@12345`) để đăng nhập và trải nghiệm.

---

## 🧪 Các tập lệnh kiểm thử (Testing)

### Backend
```bash
cd backend
npm run test          # Chạy unit tests
npm run test:cov      # Xem độ bao phủ code (coverage)
npm run test:e2e      # Chạy kiểm thử tích hợp (cần kết nối db)
```

### Frontend
```bash
cd frontend
npm run test              # Chạy test runner UmiJS
npm run test:component   # Test các component trong src/components/
```

---

## 📚 Tài liệu bổ sung
Tài liệu hướng dẫn chi tiết về đặc tả API các module (Auth, Form, Workflow, Submission, Realtime, File, v.v...) được đặt tại thư mục [frontend/docs](./frontend/docs/). Bạn có thể đọc trực tiếp các file này để hiểu rõ hơn về luồng tích hợp của hệ thống.
