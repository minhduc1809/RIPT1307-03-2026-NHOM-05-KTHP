# API Key API Documentation

> Base URL: `http://localhost:3000`

## Mục lục

- [1. Tạo API Key mới (Create)](#1-tạo-api-key-mới-create)
- [2. Danh sách API Key (List)](#2-danh-sách-api-key-list)
- [3. Thu hồi API Key (Revoke)](#3-thu-hồi-api-key-revoke)

---

## 1. Tạo API Key mới (Create)

Tạo một API Key mới để sử dụng cho việc tích hợp hệ thống.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `POST /api-keys`                   |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | Tất cả user đã xác thực            |
| **Status**   | `201 Created`                      |

### Headers

```
Authorization: Bearer <accessToken>
```

### Request Body

```json
{
  "name": "Integration Key",
  "expiresAt": "2026-12-31T23:59:59.000Z"
}
```

| Trường      | Kiểu       | Bắt buộc | Mô tả                                      |
| ----------- | ---------- | -------- | ------------------------------------------ |
| `name`      | `string`   | ✅       | Tên gọi / mô tả của API Key                |
| `expiresAt` | `datetime` | ❌       | Thời điểm hết hạn (nếu không có: vô thời hạn)|

---

## 2. Danh sách API Key (List)

Lấy danh sách các API Key của user hiện tại.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `GET /api-keys`                    |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | Tất cả user đã xác thực            |
| **Status**   | `200 OK`                           |

### Response (200 OK)

Trả về mảng các API Key. Lưu ý: `key` gốc sẽ không được hiển thị đầy đủ, chỉ trả về dạng ẩn một phần.

---

## 3. Thu hồi API Key (Revoke)

Thu hồi (vô hiệu hóa) một API Key.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `PATCH /api-keys/:id/revoke`       |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | Chủ sở hữu API Key                 |
| **Status**   | `200 OK`                           |

### Path Parameters

| Tham số | Kiểu     | Bắt buộc | Mô tả               |
| ------- | -------- | -------- | ------------------- |
| `id`    | `string` | ✅       | UUID của API Key    |
