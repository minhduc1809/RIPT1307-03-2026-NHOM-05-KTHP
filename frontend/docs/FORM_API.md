# Form API Documentation

> Base URL: `http://localhost:3000`

## Mục lục

- [1. Tạo Form mới (Create)](#1-tạo-form-mới-create)
- [2. Danh sách Form có phân trang (Page)](#2-danh-sách-form-có-phân-trang-page)
- [3. Lấy tất cả Form đang hoạt động (Find All)](#3-lấy-tất-cả-form-đang-hoạt-động-find-all)
- [4. Lấy chi tiết Form theo ID (Find One)](#4-lấy-chi-tiết-form-theo-id-find-one)
- [5. Cập nhật Form (Update)](#5-cập-nhật-form-update)
- [6. Xóa Form (Soft Delete)](#6-xóa-form-soft-delete)
- [7. Schema & Validation Engine](#7-schema--validation-engine)

---

## 1. Tạo Form mới (Create)

Tạo một form mới. Chỉ cho phép role `ADMIN` hoặc `MANAGER`.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `POST /forms`                      |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | `ADMIN`, `MANAGER`                 |
| **Status**   | `201 Created`                      |

### Headers

```
Authorization: Bearer <accessToken>
```

### Request Body

```json
{
  "name": "Survey 2024",
  "description": "Annual employee survey",
  "schema": {
    "formId": "form_xin_nghi_phep",
    "fields": [
      {
        "key": "ly_do",
        "label": "Lý do xin nghỉ",
        "type": "text",
        "rules": { "required": true, "minLength": 10, "maxLength": 500 }
      },
      {
        "key": "so_ngay",
        "label": "Số ngày xin nghỉ",
        "type": "number",
        "rules": { "required": true, "min": 1, "max": 30 }
      }
    ]
  },
  "settings": { "allowAnonymous": false, "theme": "default" }
}
```

| Trường        | Kiểu     | Bắt buộc | Validation                      |
| ------------- | -------- | --------- | ------------------------------- |
| `name`        | `string` | ✅        | Không được để trống             |
| `description` | `string` | ❌        |                                 |
| `schema`      | `object` | ✅        | Phải là object, không để trống  |
| `settings`    | `object` | ❌        | Phải là object nếu có           |

### Response (201 Created)

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Survey 2024",
  "description": "Annual employee survey",
  "schema": {
    "formId": "form_xin_nghi_phep",
    "fields": [...]
  },
  "settings": { "allowAnonymous": false, "theme": "default" },
  "isActive": true,
  "createdBy": "cmp12xsmx00008pqv88263uth",
  "createdAt": "2026-05-12T08:00:00.000Z",
  "updatedAt": "2026-05-12T08:00:00.000Z",
  "deletedAt": null
}
```

### Lỗi

| Status | Mã lỗi               | Mô tả                                  |
| ------ | --------------------- | --------------------------------------- |
| `400`  | `Bad Request`         | Dữ liệu không hợp lệ (thiếu trường bắt buộc) |
| `401`  | `Unauthorized`        | Chưa đăng nhập hoặc token hết hạn      |
| `403`  | `Forbidden`           | Không có quyền (chỉ ADMIN/MANAGER)     |

---

## 2. Danh sách Form có phân trang (Page)

Lấy danh sách form có phân trang, hỗ trợ lọc và sắp xếp. Chỉ cho phép role `ADMIN` hoặc `MANAGER`.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `POST /forms/page`                 |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | `ADMIN`, `MANAGER`                 |
| **Status**   | `200 OK`                           |

### Headers

```
Authorization: Bearer <accessToken>
```

### Request Body

```json
{
  "page": 1,
  "limit": 10,
  "condition": {
    "isActive": true
  },
  "filters": [
    { "field": "name", "operator": "contains", "value": "Survey" }
  ],
  "sort": { "createdAt": "desc" }
}
```

| Trường      | Kiểu     | Bắt buộc | Mặc định | Mô tả                            |
| ----------- | -------- | --------- | -------- | --------------------------------- |
| `page`      | `number` | ❌        | `1`      | Số trang (bắt đầu từ 1)          |
| `limit`     | `number` | ❌        | `10`     | Số item mỗi trang                |
| `condition` | `object` | ❌        | `{}`     | Điều kiện where cơ bản           |
| `filters`   | `array`  | ❌        | `[]`     | Danh sách bộ lọc nâng cao        |
| `sort`      | `object` hoặc `string` | ❌ | `{ "createdAt": "desc" }` | Sắp xếp (object hoặc chuỗi `"field:order"`) |

### Response (200 OK)

```json
{
  "result": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Survey 2024",
      "description": "Annual employee survey",
      "schema": { ... },
      "settings": { ... },
      "isActive": true,
      "createdBy": "cmp12xsmx00008pqv88263uth",
      "createdAt": "2026-05-12T08:00:00.000Z",
      "updatedAt": "2026-05-12T08:00:00.000Z",
      "deletedAt": null
    }
  ],
  "total": 25
}
```

| Trường   | Kiểu    | Mô tả                           |
| -------- | ------- | -------------------------------- |
| `result` | `array` | Danh sách form trong trang hiện tại |
| `total`  | `number`| Tổng số form thỏa điều kiện     |

### Lỗi

| Status | Mã lỗi               | Mô tả                                  |
| ------ | --------------------- | --------------------------------------- |
| `401`  | `Unauthorized`        | Chưa đăng nhập hoặc token hết hạn      |
| `403`  | `Forbidden`           | Không có quyền (chỉ ADMIN/MANAGER)     |

---

## 3. Lấy tất cả Form đang hoạt động (Find All)

Lấy danh sách tất cả form đang hoạt động (`isActive = true`, chưa bị xóa). Mở cho mọi role đã xác thực.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `GET /forms/many`                  |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | Tất cả role (đã xác thực)         |
| **Status**   | `200 OK`                           |

### Headers

```
Authorization: Bearer <accessToken>
```

### Response (200 OK)

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Survey 2024",
    "description": "Annual employee survey",
    "schema": { ... },
    "settings": { ... },
    "isActive": true,
    "createdBy": "cmp12xsmx00008pqv88263uth",
    "createdAt": "2026-05-12T08:00:00.000Z",
    "updatedAt": "2026-05-12T08:00:00.000Z",
    "deletedAt": null
  }
]
```

> **Lưu ý:** Kết quả được sắp xếp theo `createdAt` giảm dần (mới nhất trước).

---

## 4. Lấy chi tiết Form theo ID (Find One)

Lấy thông tin chi tiết của một form theo ID. Mở cho mọi role đã xác thực.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `GET /forms/:id`                   |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | Tất cả role (đã xác thực)         |
| **Status**   | `200 OK`                           |

### Headers

```
Authorization: Bearer <accessToken>
```

### Path Parameters

| Tham số | Kiểu     | Bắt buộc | Mô tả      |
| ------- | -------- | --------- | ----------- |
| `id`    | `string` | ✅        | UUID của form |

### Response (200 OK)

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Survey 2024",
  "description": "Annual employee survey",
  "schema": {
    "formId": "form_xin_nghi_phep",
    "fields": [
      {
        "key": "ly_do",
        "label": "Lý do xin nghỉ",
        "type": "text",
        "rules": { "required": true, "minLength": 10, "maxLength": 500 }
      },
      {
        "key": "so_ngay",
        "label": "Số ngày xin nghỉ",
        "type": "number",
        "rules": { "required": true, "min": 1, "max": 30 }
      }
    ]
  },
  "settings": { "allowAnonymous": false, "theme": "default" },
  "isActive": true,
  "createdBy": "cmp12xsmx00008pqv88263uth",
  "createdAt": "2026-05-12T08:00:00.000Z",
  "updatedAt": "2026-05-12T08:00:00.000Z",
  "deletedAt": null
}
```

### Lỗi

| Status | Mã lỗi            | Mô tả                                |
| ------ | ------------------ | ------------------------------------- |
| `401`  | `Unauthorized`     | Chưa đăng nhập hoặc token hết hạn    |
| `404`  | `form.NOT_FOUND`   | Không tìm thấy form hoặc đã bị xóa  |

---

## 5. Cập nhật Form (Update)

Cập nhật thông tin form. Chỉ cho phép role `ADMIN` hoặc `MANAGER`. Tất cả các trường đều là optional (partial update).

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `PUT /forms/:id`                   |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | `ADMIN`, `MANAGER`                 |
| **Status**   | `200 OK`                           |

### Headers

```
Authorization: Bearer <accessToken>
```

### Path Parameters

| Tham số | Kiểu     | Bắt buộc | Mô tả      |
| ------- | -------- | --------- | ----------- |
| `id`    | `string` | ✅        | UUID của form |

### Request Body

```json
{
  "name": "Survey 2024 - Updated",
  "description": "Updated description",
  "schema": {
    "formId": "form_xin_nghi_phep",
    "fields": [
      {
        "key": "ly_do",
        "label": "Lý do xin nghỉ (cập nhật)",
        "type": "text",
        "rules": { "required": true, "minLength": 5, "maxLength": 1000 }
      }
    ]
  },
  "settings": { "allowAnonymous": true, "theme": "dark" }
}
```

| Trường        | Kiểu     | Bắt buộc | Mô tả                          |
| ------------- | -------- | --------- | ------------------------------- |
| `name`        | `string` | ❌        | Tên form                       |
| `description` | `string` | ❌        | Mô tả form                     |
| `schema`      | `object` | ❌        | Schema định nghĩa các trường   |
| `settings`    | `object` | ❌        | Cấu hình form                  |

> **Lưu ý:** Chỉ cần gửi các trường muốn cập nhật (Partial Update).

### Response (200 OK)

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Survey 2024 - Updated",
  "description": "Updated description",
  "schema": { ... },
  "settings": { "allowAnonymous": true, "theme": "dark" },
  "isActive": true,
  "createdBy": "cmp12xsmx00008pqv88263uth",
  "createdAt": "2026-05-12T08:00:00.000Z",
  "updatedAt": "2026-05-12T09:30:00.000Z",
  "deletedAt": null
}
```

### Lỗi

| Status | Mã lỗi            | Mô tả                                |
| ------ | ------------------ | ------------------------------------- |
| `400`  | `Bad Request`      | Dữ liệu không hợp lệ                |
| `401`  | `Unauthorized`     | Chưa đăng nhập hoặc token hết hạn    |
| `403`  | `Forbidden`        | Không có quyền (chỉ ADMIN/MANAGER)   |
| `404`  | `form.NOT_FOUND`   | Không tìm thấy form hoặc đã bị xóa  |

---

## 6. Xóa Form (Soft Delete)

Xóa mềm một form (đánh dấu `deletedAt`). Chỉ cho phép role `ADMIN`.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `DELETE /forms/:id`                |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | `ADMIN`                            |
| **Status**   | `200 OK`                           |

### Headers

```
Authorization: Bearer <accessToken>
```

### Path Parameters

| Tham số | Kiểu     | Bắt buộc | Mô tả      |
| ------- | -------- | --------- | ----------- |
| `id`    | `string` | ✅        | UUID của form |

### Response (200 OK)

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Survey 2024",
  "description": "Annual employee survey",
  "schema": { ... },
  "settings": { ... },
  "isActive": true,
  "createdBy": "cmp12xsmx00008pqv88263uth",
  "createdAt": "2026-05-12T08:00:00.000Z",
  "updatedAt": "2026-05-12T10:00:00.000Z",
  "deletedAt": "2026-05-12T10:00:00.000Z"
}
```

### Lỗi

| Status | Mã lỗi            | Mô tả                                |
| ------ | ------------------ | ------------------------------------- |
| `401`  | `Unauthorized`     | Chưa đăng nhập hoặc token hết hạn    |
| `403`  | `Forbidden`        | Không có quyền (chỉ ADMIN)           |
| `404`  | `form.NOT_FOUND`   | Không tìm thấy form hoặc đã bị xóa  |

---

## 7. Schema & Validation Engine

Form sử dụng Validation Engine để kiểm tra dữ liệu submission dựa trên schema đã định nghĩa.

### Cấu trúc Schema

```json
{
  "formId": "form_xin_nghi_phep",
  "fields": [
    {
      "key": "ten_field",
      "label": "Nhãn hiển thị",
      "type": "text | number | date",
      "rules": {
        "required": true,
        "minLength": 10,
        "maxLength": 500,
        "min": 1,
        "max": 100,
        "regex": "^[a-zA-Z]+$",
        "afterField": "start_date",
        "maxSizeMb": 5,
        "allowedTypes": ["image/png", "image/jpeg"]
      }
    }
  ]
}
```

### Các loại Field Type

| Type     | Mô tả             | Validation áp dụng                          |
| -------- | ------------------ | ------------------------------------------- |
| `text`   | Chuỗi văn bản     | `minLength`, `maxLength`, `regex`           |
| `number` | Số                 | `min`, `max`                                |
| `date`   | Ngày tháng         | Kiểm tra định dạng date hợp lệ             |

### Các Validation Rules

| Rule           | Type       | Mô tả                                              |
| -------------- | ---------- | --------------------------------------------------- |
| `required`     | `boolean`  | Bắt buộc nhập                                      |
| `minLength`    | `number`   | Độ dài tối thiểu (áp dụng cho `text`)              |
| `maxLength`    | `number`   | Độ dài tối đa (áp dụng cho `text`)                 |
| `min`          | `number`   | Giá trị tối thiểu (áp dụng cho `number`)           |
| `max`          | `number`   | Giá trị tối đa (áp dụng cho `number`)              |
| `regex`        | `string`   | Biểu thức chính quy (áp dụng cho `text`)           |
| `afterField`   | `string`   | Ngày phải sau trường tham chiếu (cross-field)       |
| `maxSizeMb`    | `number`   | Kích thước tối đa file (MB)                        |
| `allowedTypes` | `string[]` | Danh sách MIME type cho phép                        |

### Mã lỗi Validation (i18n keys)

| i18n Key                        | Mô tả                                   |
| ------------------------------- | ---------------------------------------- |
| `validation.required`           | Trường bắt buộc nhưng để trống          |
| `validation.min_length`         | Chuỗi ngắn hơn `minLength`             |
| `validation.max_length`         | Chuỗi dài hơn `maxLength`              |
| `validation.min_value`          | Số nhỏ hơn `min`                        |
| `validation.max_value`          | Số lớn hơn `max`                        |
| `validation.pattern`            | Không khớp regex                        |
| `validation.type_number`        | Giá trị không phải số hợp lệ           |
| `validation.type_date`          | Giá trị không phải ngày hợp lệ         |
| `validation.date_after_field`   | Ngày không sau trường tham chiếu        |

### Ví dụ lỗi Validation

```json
{
  "errors": [
    {
      "field": "ly_do",
      "i18nKey": "validation.required"
    },
    {
      "field": "so_ngay",
      "i18nKey": "validation.min_value",
      "params": { "min": 1 }
    },
    {
      "field": "end_date",
      "i18nKey": "validation.date_after_field",
      "params": { "refField": "start_date" }
    }
  ]
}
```

---

## Data Model

```
┌────────────────────────────────────────────────┐
│                     Form                       │
├────────────────────────────────────────────────┤
│  id          : UUID (PK)                       │
│  name        : String                          │
│  description : String?                         │
│  schema      : JSON     (Form fields schema)   │
│  settings    : JSON     (Form configurations)  │
│  isActive    : Boolean  (default: true)        │
│  createdBy   : String   (FK → User.id)         │
│  createdAt   : DateTime                        │
│  updatedAt   : DateTime                        │
│  deletedAt   : DateTime? (soft delete)         │
├────────────────────────────────────────────────┤
│  Relations:                                    │
│  ├── user          → User                      │
│  ├── submissions   → Submission[]              │
│  └── workflowDefs  → WorkflowDefinition[]      │
└────────────────────────────────────────────────┘
```

---

## Phân quyền (Authorization)

| Endpoint             | ADMIN | MANAGER | USER |
| -------------------- | ----- | ------- | ---- |
| `POST /forms`        | ✅    | ✅      | ❌   |
| `POST /forms/page`   | ✅    | ✅      | ❌   |
| `GET /forms/many`    | ✅    | ✅      | ✅   |
| `GET /forms/:id`     | ✅    | ✅      | ✅   |
| `PUT /forms/:id`     | ✅    | ✅      | ❌   |
| `DELETE /forms/:id`  | ✅    | ❌      | ❌   |

---

## Ghi chú

- Tất cả endpoint yêu cầu **Bearer Token** trong header `Authorization`.
- Form sử dụng **Soft Delete**: trường `deletedAt` được set thay vì xóa khỏi database.
- `schema` lưu dưới dạng **JSON** trong database, cho phép định nghĩa form linh hoạt.
- `settings` lưu các cấu hình bổ sung cho form:
  - `allowAnonymous` (`boolean`): Cho phép gửi ẩn danh (không cần đăng nhập).
  - `theme` (`string`): Giao diện hiển thị form. Giá trị hợp lệ: `"default"`, `"dark"`, `"mint"`, `"sunset"`, `"violet"`.
- Validation Engine hỗ trợ **cross-field validation** (ví dụ: ngày kết thúc phải sau ngày bắt đầu).
- Tất cả các endpoint trả về lỗi validation sẽ có dạng:

```json
{
  "statusCode": 400,
  "message": ["validation error messages"],
  "error": "Bad Request"
}
```
