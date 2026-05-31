# File API Documentation

> Base URL: `http://localhost:3000`

## Mục lục

- [1. Upload Avatar (Cloudinary)](#1-upload-avatar-cloudinary)
- [2. Upload File (Upload)](#2-upload-file-upload)
- [3. Tải file đã upload (Download)](#3-tải-file-đã-upload-download)
- [4. Tạo job xuất Excel (Export)](#4-tạo-job-xuất-excel-export)
- [5. Kiểm tra tiến độ Export (Export Status)](#5-kiểm-tra-tiến-độ-export-export-status)
- [6. Thử lại Export Job (Retry)](#6-thử-lại-export-job-retry)
- [7. Tải file Excel đã xuất (Download Export)](#7-tải-file-excel-đã-xuất-download-export)
- [8. Data Model](#8-data-model)
- [9. Phân quyền (Authorization)](#9-phân-quyền-authorization)

---

## 1. Upload Avatar (Cloudinary)

Upload ảnh đại diện lên Cloudinary. Chỉ chấp nhận file ảnh, kích thước tối đa 5MB.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `POST /files/avatar`               |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | Tất cả role (đã xác thực)         |
| **Status**   | `201 Created`                      |

### Headers

```
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

### Request Body (multipart/form-data)

| Trường | Kiểu   | Bắt buộc | Validation                                    |
| ------ | ------ | --------- | --------------------------------------------- |
| `file` | `File` | ✅        | Kích thước tối đa 5MB, chỉ chấp nhận image      |

### Response (201 Created)

```json
{
  "url": "https://res.cloudinary.com/.../avatar_userId.jpg",
  "publicId": "avatars/userId"
}
```

### Lỗi

| Status | Mã lỗi            | Mô tả                                           |
| ------ | ------------------ | ------------------------------------------------ |
| `400`  | `Bad Request`      | File không hợp lệ (không phải image hoặc quá lớn) |
| `401`  | `Unauthorized`     | Chưa đăng nhập hoặc token hết hạn               |

---

## 2. Upload File (Upload)

Upload một file lên hệ thống. Hỗ trợ các định dạng: PNG, JPEG, JPG, PDF, DOC, DOCX. Kích thước tối đa 10MB.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `POST /files/upload`               |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | Tất cả role (đã xác thực)         |
| **Status**   | `201 Created`                      |

### Headers

```
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

### Request Body (multipart/form-data)

| Trường | Kiểu   | Bắt buộc | Validation                                                    |
| ------ | ------ | --------- | ------------------------------------------------------------- |
| `file` | `File` | ✅        | Kích thước tối đa 10MB, định dạng: `.png`, `.jpeg`, `.jpg`, `.pdf`, `.doc`, `.docx` |

### Response (201 Created)

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "originalName": "document.pdf",
  "storedName": "1715500800000-document.pdf",
  "storedPath": "uploads/1715500800000-document.pdf",
  "mimeType": "application/pdf",
  "size": 204800,
  "uploadedBy": "cmp12xsmx00008pqv88263uth",
  "createdAt": "2026-05-12T08:00:00.000Z"
}
```

### Lỗi

| Status | Mã lỗi            | Mô tả                                           |
| ------ | ------------------ | ------------------------------------------------ |
| `400`  | `Bad Request`      | File không hợp lệ (sai định dạng hoặc quá lớn)  |
| `401`  | `Unauthorized`     | Chưa đăng nhập hoặc token hết hạn               |

---

## 3. Tải file đã upload (Download)

Tải file đã upload theo ID. ADMIN/MANAGER tải được tất cả file. USER chỉ tải được file do chính mình upload.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `GET /files/:id`                   |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | Tất cả role (đã xác thực)         |
| **Status**   | `200 OK` (binary stream)           |

### Headers

```
Authorization: Bearer <accessToken>
```

### Path Parameters

| Tham số | Kiểu     | Bắt buộc | Mô tả              |
| ------- | -------- | --------- | ------------------- |
| `id`    | `string` | ✅        | UUID của file record |

### Response (200 OK)

Response trả về **binary stream** của file kèm theo headers:

```
Content-Type: <mimeType của file>
Content-Disposition: attachment; filename*=UTF-8''<encoded original filename>
```

### Lỗi

| Status | Mã lỗi                    | Mô tả                                         |
| ------ | -------------------------- | ---------------------------------------------- |
| `401`  | `Unauthorized`             | Chưa đăng nhập hoặc token hết hạn             |
| `403`  | `error.FORBIDDEN`          | USER không có quyền tải file của người khác     |
| `404`  | `file.NOT_FOUND`           | Không tìm thấy file record trong database      |
| `404`  | `file.PHYSICAL_NOT_FOUND`  | File vật lý không tồn tại trên server          |

---

## 4. Tạo job xuất Excel (Export)

Tạo một job bất đồng bộ để xuất dữ liệu submission ra file Excel. Job được xử lý qua BullMQ queue.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `POST /files/export`               |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | `ADMIN`, `MANAGER`                 |
| **Status**   | `202 Accepted`                     |

### Headers

```
Authorization: Bearer <accessToken>
```

### Request Body

```json
{
  "formId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "fromDate": "2026-01-01T00:00:00.000Z",
  "toDate": "2026-12-31T23:59:59.000Z"
}
```

| Trường     | Kiểu     | Bắt buộc | Mô tả                                          |
| ---------- | -------- | --------- | ----------------------------------------------- |
| `formId`   | `string` | ❌        | UUID của Form để lọc. Nếu trống sẽ xuất tất cả |
| `fromDate` | `string` | ❌        | Từ ngày (ISO 8601)                              |
| `toDate`   | `string` | ❌        | Đến ngày (ISO 8601)                             |

### Response (202 Accepted)

```json
{
  "id": "job-uuid-123",
  "type": "EXPORT",
  "status": "PENDING",
  "progress": 0,
  "result": null,
  "error": null,
  "createdBy": "cmp12xsmx00008pqv88263uth",
  "createdAt": "2026-05-12T08:00:00.000Z",
  "updatedAt": "2026-05-12T08:00:00.000Z"
}
```

### Lỗi

| Status | Mã lỗi          | Mô tả                                  |
| ------ | ---------------- | --------------------------------------- |
| `401`  | `Unauthorized`   | Chưa đăng nhập hoặc token hết hạn      |
| `403`  | `Forbidden`      | Không có quyền (chỉ ADMIN/MANAGER)     |

---

## 5. Kiểm tra tiến độ Export (Export Status)

Kiểm tra trạng thái và tiến độ của một export job.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `GET /files/export/:jobId`         |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | `ADMIN`, `MANAGER`                 |
| **Status**   | `200 OK`                           |

### Path Parameters

| Tham số | Kiểu     | Bắt buộc | Mô tả         |
| ------- | -------- | --------- | -------------- |
| `jobId` | `string` | ✅        | UUID của job   |

### Response (200 OK)

```json
{
  "id": "job-uuid-123",
  "type": "EXPORT",
  "status": "DONE",
  "progress": 100,
  "result": {
    "filepath": "uploads/exports/export-job-uuid-123.xlsx"
  },
  "error": null,
  "createdBy": "cmp12xsmx00008pqv88263uth",
  "createdAt": "2026-05-12T08:00:00.000Z",
  "updatedAt": "2026-05-12T08:05:00.000Z"
}
```

### Các trạng thái JobStatus

| Trạng thái   | Ý nghĩa                         |
| ------------ | -------------------------------- |
| `PENDING`    | Job đang chờ xử lý              |
| `PROCESSING` | Job đang được xử lý             |
| `DONE`       | Job đã hoàn thành, sẵn sàng tải |
| `FAILED`     | Job thất bại                     |

### Lỗi

| Status | Mã lỗi          | Mô tả                        |
| ------ | ---------------- | ----------------------------- |
| `404`  | `job.NOT_FOUND`  | Không tìm thấy job           |

---

## 6. Thử lại Export Job (Retry)

Thử lại một export job đã thất bại (status = `FAILED`).

| Thuộc tính   | Giá trị                               |
| ------------ | ------------------------------------- |
| **Endpoint** | `POST /files/export/:jobId/retry`     |
| **Auth**     | ✅ Bearer Token (Authorization)       |
| **Roles**    | `ADMIN`, `MANAGER`                    |
| **Status**   | `200 OK`                              |

### Path Parameters

| Tham số | Kiểu     | Bắt buộc | Mô tả         |
| ------- | -------- | --------- | -------------- |
| `jobId` | `string` | ✅        | UUID của job   |

### Response (200 OK)

Trả về job record đã được reset về trạng thái `PENDING`.

```json
{
  "id": "job-uuid-123",
  "type": "EXPORT",
  "status": "PENDING",
  "progress": 0,
  "result": null,
  "error": null,
  "createdBy": "cmp12xsmx00008pqv88263uth",
  "createdAt": "2026-05-12T08:00:00.000Z",
  "updatedAt": "2026-05-12T09:00:00.000Z"
}
```

### Lỗi

| Status | Mã lỗi            | Mô tả                            |
| ------ | ------------------ | --------------------------------- |
| `404`  | `job.NOT_FOUND`    | Không tìm thấy job               |
| `400`  | `job.NOT_FAILED`   | Job không ở trạng thái FAILED     |

---

## 7. Tải file Excel đã xuất (Download Export)

Tải file Excel khi export job đã hoàn thành (status = `DONE`).

| Thuộc tính   | Giá trị                               |
| ------------ | -------------------------------------- |
| **Endpoint** | `GET /files/export/:jobId/download`    |
| **Auth**     | ✅ Bearer Token (Authorization)        |
| **Roles**    | `ADMIN`, `MANAGER`                     |
| **Status**   | `200 OK` (binary stream)               |

### Path Parameters

| Tham số | Kiểu     | Bắt buộc | Mô tả         |
| ------- | -------- | --------- | -------------- |
| `jobId` | `string` | ✅        | UUID của job   |

### Response (200 OK)

Response trả về **binary stream** của file Excel kèm headers:

```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename*=UTF-8''export-<jobId>.xlsx
```

### Lỗi

| Status | Mã lỗi                    | Mô tả                                      |
| ------ | -------------------------- | ------------------------------------------- |
| `404`  | `job.NOT_DONE`             | Job chưa hoàn thành hoặc không tồn tại     |
| `404`  | `file.PHYSICAL_NOT_FOUND`  | File vật lý không tồn tại trên server      |

---

## 8. Data Model

```
┌────────────────────────────────────────────────┐
│                  FileRecord                     │
├────────────────────────────────────────────────┤
│  id           : UUID (PK)                      │
│  originalName : String (Tên file gốc)          │
│  storedName   : String (Tên file lưu trữ)      │
│  storedPath   : String (Đường dẫn lưu trữ)     │
│  mimeType     : String (MIME type)              │
│  size         : Int    (Kích thước byte)        │
│  uploadedBy   : String (FK → User.id)           │
│  createdAt    : DateTime                        │
├────────────────────────────────────────────────┤
│  Relations:                                     │
│  └── user → User                                │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│                  JobRecord                      │
├────────────────────────────────────────────────┤
│  id        : UUID (PK)                         │
│  type      : IMPORT | EXPORT | EMAIL |         │
│              NOTIFICATION                       │
│  status    : PENDING | PROCESSING |            │
│              DONE | FAILED                      │
│  progress  : Int (0-100)                       │
│  result    : JSON? (Kết quả khi hoàn thành)    │
│  error     : String? (Lỗi nếu thất bại)       │
│  createdBy : String (FK → User.id)             │
│  createdAt : DateTime                          │
│  updatedAt : DateTime                          │
├────────────────────────────────────────────────┤
│  Relations:                                    │
│  └── user → User                               │
└────────────────────────────────────────────────┘
```

---

## 9. Phân quyền (Authorization)

| Endpoint                            | ADMIN | MANAGER | USER (Chính chủ) | USER (Khác) |
| ----------------------------------- | ----- | ------- | ---------------- | ----------- |
| `POST /files/avatar`                | ✅    | ✅      | ✅               | ✅          |
| `POST /files/upload`                | ✅    | ✅      | ✅               | ✅          |
| `GET /files/:id`                    | ✅    | ✅      | ✅               | ❌          |
| `POST /files/export`                | ✅    | ✅      | ❌               | ❌          |
| `GET /files/export/:jobId`          | ✅    | ✅      | ❌               | ❌          |
| `POST /files/export/:jobId/retry`   | ✅    | ✅      | ❌               | ❌          |
| `GET /files/export/:jobId/download` | ✅    | ✅      | ❌               | ❌          |

---

## Ghi chú

- Tất cả endpoint yêu cầu **Bearer Token** trong header `Authorization`.
- Upload file sử dụng **multipart/form-data**.
- File được lưu vào thư mục `uploads/` trên server với tên file được hash để tránh trùng lặp.
- Export sử dụng **BullMQ** để xử lý bất đồng bộ, tránh timeout khi dữ liệu lớn.
- File Excel xuất ra được lưu trong thư mục `uploads/exports/`.
- Tên file download hỗ trợ **Unicode** (RFC 5987 encoding).
- USER chỉ có thể tải file do chính mình upload, ADMIN/MANAGER có thể tải tất cả file.
