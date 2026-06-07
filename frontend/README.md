# Smart Admin Platform — Frontend

Web app cho nền tảng SaaS đa tenant quản lý **biểu mẫu động**, **quy trình phê duyệt** và **theo dõi đơn nộp**.

Xây dựng với **React 17** · **UmiJS 3** · **Ant Design 4** · **TypeScript** · **Socket.io** · **Keycloak SSO**.

> ⚠️ Dự án dùng React 17 — không sử dụng `createRoot` hay các tính năng concurrent của React 18.

---

## Tính năng chính

| Tính năng | Mô tả |
|-----------|-------|
| **FormBuilder** | Trình thiết kế biểu mẫu kéo thả (`react-beautiful-dnd`), 4 loại trường (text/number/date/select), rule validate (regex, min/max, afterField), 5 bộ theme |
| **SubmitFormModal** | Modal 2 bước: chọn biểu mẫu → render form tự động từ JSON Schema, validate client-side, ánh xạ lỗi server tới từng trường |
| **Workflow Builder** | Thiết kế quy trình hỗn hợp: tuần tự / song song / bỏ phiếu, cấu hình vai trò, SLA, yêu cầu bình luận |
| **WorkflowTree** | Sơ đồ quy trình SVG với 4 layout engine, đường nối Bezier, zoom/pan, auto-fit |
| **MySubmissions** | Danh sách đơn nộp cá nhân, lọc theo 7 trạng thái, thanh thống kê |
| **PendingApprovals** | Hàng đợi phê duyệt 2 chế độ Kanban/List, hành động nhanh, chọn hàng loạt, hỗ trợ ủy quyền |
| **Submission Detail** | Chi tiết đơn + WorkflowTimeline (lịch sử duyệt), hành động: approve/reject/return/vote/recall/withdraw/resubmit |
| **Delegations** | Quản lý ủy quyền phê duyệt theo phạm vi form/workflow/thời gian |
| **NotificationBell** | Chuông thông báo realtime (Socket.io), badge chưa đọc, đánh dấu đã đọc |
| **Dashboard** | Thống kê tổng quan, biểu đồ xu hướng theo ngày, top biểu mẫu |
| **Silent Token Refresh** | Axios interceptor tự gia hạn JWT, hàng đợi request trong lúc refresh — phiên không bao giờ gián đoạn |

## Phân quyền

Khai báo tại `src/access.ts`, áp dụng qua UmiJS access plugin:

| Quyền | Vai trò | Route áp dụng |
|-------|---------|----------------|
| `canAdmin` | ADMIN | Quản lý người dùng |
| `canManage` | ADMIN, MANAGER | `/dashboard`, `/forms/*` |
| `canApprove` | ADMIN, MANAGER, HR | `/workflows/*`, `/delegations`, `/submissions/pending` |
| Đã đăng nhập | Mọi vai trò | `/submissions/mine`, `/profile`, `/notifications` |

## Cấu trúc thư mục

```
├── config/              # Cấu hình UmiJS: routes.ts, proxy.ts, defaultSettings.ts
├── docs/                # Tài liệu API từng module (AUTH, FORM, WORKFLOW, ...)
├── mock/                # Mock data phát triển không cần backend
└── src/
    ├── access.ts        # Phân quyền (canAdmin / canManage / canApprove)
    ├── app.tsx          # Khởi tạo app: initialState, layout, request
    ├── components/      # NotificationBell, SubmitFormModal, WorkflowTree,
    │                    #   ExportJobButton, Table, Upload, Chart, ...
    ├── hooks/           # useAuthActions, useCheckAccess, useInitModel, ...
    ├── locales/         # i18n: vi-VN, en-US
    ├── models/          # DVA models (code legacy); code mới dùng hooks
    ├── pages/           # Dashboard, Forms/Builder, Workflows/Builder,
    │                    #   Submissions (Mine/Pending/Detail), Delegations, Profile
    ├── services/        # API theo module + socket.ts (Socket.io client)
    ├── styles/          # LESS toàn cục
    └── utils/           # axios.ts (Silent Token Refresh), workflowLabels.ts, ...
```

Path alias: `@/` → `src/`, `@@/` → `src/.umi/`.

## Yêu cầu môi trường

- Node.js ≥ 16
- Backend đang chạy tại `http://localhost:3000` (xem `backend/README.md`)

## Cài đặt & Chạy

### 1. Cài dependencies

```bash
npm install
# hoặc
yarn
```

### 2. Cấu hình môi trường

Tạo file `.env` (hoặc dùng biến môi trường) với các biến chính:

| Biến | Mô tả | Mặc định |
|------|-------|----------|
| `APP_CONFIG_IP_ROOT` | URL API backend | `http://localhost:3000` |
| `APP_CONFIG_KEYCLOAK_AUTHORITY` | URL realm Keycloak (SSO) | — |
| `APP_CONFIG_ONE_SIGNAL_ID` | App ID push notification | — |

Dev mặc định đã proxy về backend qua `config/proxy.ts`.

### 3. Chạy dev server

```bash
npm run dev          # = start:dev (MOCK=none, REACT_APP_ENV=dev)
```

Mở **http://localhost:8000** — đăng nhập bằng tài khoản seed của backend
(ví dụ `admin@techvision.vn` / `Test@12345` nếu đã chạy seed demo).

### 4. Build production

```bash
npm run build        # Output → ./dist
npm run analyze      # Phân tích bundle size
```

## Scripts hữu ích khác

```bash
npm run lint         # ESLint + Stylelint + Prettier (kiểm tra)
npm run lint:fix     # Tự động sửa lỗi lint
npm run tsc          # Type-check không emit
npm run test         # UmiJS test runner
npm run test:component   # Test riêng src/components
npm run openapi      # Sinh lại API types từ Swagger spec của backend
```

## Quy ước code

- **Prettier**: tabs, single quotes, trailing commas, 120 ký tự/dòng, có semicolons
- **ESLint**: preset `@umijs/fabric` · **Stylelint** cho file `.less`
- **Commitlint + Husky**: commit message theo conventional commits
- Trang mới đặt trong `src/pages/` — UmiJS tự sinh route theo cấu trúc thư mục, khai báo quyền trong `config/routes.ts`
- Gọi API qua service trong `src/services/<Module>/`, dùng axios client chung `src/utils/axios.ts` (đã có sẵn auth header + refresh token)

## Tài liệu API

Xem thư mục `docs/`: `AUTH_API.md`, `FORM_API.md`, `SUBMISSION_API.md`, `WORKFLOW_API.md`, `DASHBOARD_API.md`, `NOTIFICATION_API.md`, `REALTIME_API.md`, `FILE_API.md`, `USER_API.md`, `API_KEY_API.md`.
