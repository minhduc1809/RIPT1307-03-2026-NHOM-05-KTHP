# User API Documentation

> Base URL: `http://localhost:3000`

## Mục lục

- [1. Lấy Profile hiện tại (Get Me)](#1-lấy-profile-hiện-tại-get-me)
- [2. Cập nhật Profile (Update Me)](#2-cập-nhật-profile-update-me)
- [3. Tạo người dùng mới (Create)](#3-tạo-người-dùng-mới-create)
- [4. Danh sách người dùng — Query Params (List)](#4-danh-sách-người-dùng--query-params-list)
- [5. Danh sách người dùng — Body (Page)](#5-danh-sách-người-dùng--body-page)
- [6. Chi tiết người dùng (Get One)](#6-chi-tiết-người-dùng-get-one)
- [7. Cập nhật người dùng (Update)](#7-cập-nhật-người-dùng-update)
- [8. Xóa người dùng (Delete)](#8-xóa-người-dùng-delete)
- [9. Gán vai trò (Assign Role)](#9-gán-vai-trò-assign-role)
- [10. Danh sách vai trò (List Roles)](#10-danh-sách-vai-trò-list-roles)
- [11. Danh sách quyền (List Permissions)](#11-danh-sách-quyền-list-permissions)

---

## 1. Lấy Profile hiện tại (Get Me)

Lấy thông tin profile của người dùng đang đăng nhập.

| Thuộc tính   | Giá trị                         |
| ------------ | -------------------------------- |
| **Endpoint** | `GET /users/me`                  |
| **Auth**     | ✅ Bearer Token (Authorization)  |
| **Roles**    | Tất cả role (đã xác thực)       |
| **Status**   | `200 OK`                         |

### Headers

```
Authorization: Bearer <accessToken>
```

### Response (200 OK)

```json
{
  "id": "cmp12xsmx00008pqv88263uth",
  "email": "admin@example.com",
  "username": "admin",
  "role": "ADMIN",
  "firstName": "Admin",
  "lastName": "User",
  "picture": null,
  "isActive": true,
  "createdAt": "2026-05-12T08:00:00.000Z",
  "updatedAt": "2026-05-12T08:00:00.000Z"
}
```

### Lỗi

| Status | Mã lỗi           | Mô tả                             |
| ------ | ----------------- | ---------------------------------- |
| `401`  | `Unauthorized`    | Chưa đăng nhập hoặc token hết hạn |
| `404`  | `user.NOT_FOUND`  | Không tìm thấy user hoặc đã bị xóa |

---

## 2. Cập nhật Profile (Update Me)

Cập nhật thông tin profile cá nhân. Chỉ cho phép sửa `firstName`, `lastName`, `picture`.

| Thuộc tính   | Giá trị                         |
| ------------ | -------------------------------- |
| **Endpoint** | `PUT /users/me`                  |
| **Auth**     | ✅ Bearer Token (Authorization)  |
| **Roles**    | Tất cả role (đã xác thực)       |
| **Status**   | `200 OK`                         |

### Request Body

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "picture": "https://example.com/avatar.png"
}
```

| Trường      | Kiểu     | Bắt buộc | Mô tả         |
| ----------- | -------- | --------- | -------------- |
| `firstName` | `string` | ❌        | Tên            |
| `lastName`  | `string` | ❌        | Họ             |
| `picture`   | `string` | ❌        | URL ảnh đại diện |

### Response (200 OK)

```json
{
  "id": "cmp12xsmx00008pqv88263uth",
  "email": "admin@example.com",
  "username": "admin",
  "role": "ADMIN",
  "firstName": "John",
  "lastName": "Doe",
  "picture": "https://example.com/avatar.png",
  "isActive": true,
  "createdAt": "2026-05-12T08:00:00.000Z",
  "updatedAt": "2026-05-12T09:00:00.000Z"
}
```

---

## 3. Tạo người dùng mới (Create)

Tạo người dùng mới. Mật khẩu được hash bằng bcrypt (10 rounds) trước khi lưu.

| Thuộc tính   | Giá trị                         |
| ------------ | -------------------------------- |
| **Endpoint** | `POST /users`                    |
| **Auth**     | ✅ Bearer Token (Authorization)  |
| **Roles**    | `ADMIN`                          |
| **Status**   | `201 Created`                    |

### Request Body

```json
{
  "email": "john.doe@example.com",
  "username": "johndoe123",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER"
}
```

| Trường      | Kiểu     | Bắt buộc | Validation                              |
| ----------- | -------- | --------- | --------------------------------------- |
| `email`     | `string` | ✅        | Phải là email hợp lệ                   |
| `username`  | `string` | ✅        | Tối thiểu 3 ký tự                      |
| `password`  | `string` | ✅        | Tối thiểu 8 ký tự                      |
| `firstName` | `string` | ❌        |                                         |
| `lastName`  | `string` | ❌        |                                         |
| `role`      | `enum`   | ❌        | `ADMIN`, `MANAGER`, `USER` (mặc định: `USER`) |

### Response (201 Created)

```json
{
  "id": "cm1abc...",
  "email": "john.doe@example.com",
  "username": "johndoe123",
  "role": "USER",
  "firstName": "John",
  "lastName": "Doe",
  "isActive": true,
  "createdAt": "2026-05-12T08:00:00.000Z"
}
```

> **Lưu ý:** Response không trả về `passwordHash`.

### Lỗi

| Status | Mã lỗi                  | Mô tả                                      |
| ------ | ------------------------ | ------------------------------------------- |
| `403`  | `Forbidden`              | Không có quyền (chỉ ADMIN)                 |
| `409`  | `user.USERNAME_EXISTS`   | Email hoặc username đã tồn tại trong hệ thống |

---

## 4. Danh sách người dùng — Query Params (List)

Lấy danh sách người dùng với bộ lọc qua query parameters.

| Thuộc tính   | Giá trị                         |
| ------------ | -------------------------------- |
| **Endpoint** | `GET /users`                     |
| **Auth**     | ✅ Bearer Token (Authorization)  |
| **Roles**    | `ADMIN`                          |
| **Status**   | `200 OK`                         |

### Query Parameters

| Tham số  | Kiểu     | Bắt buộc | Mặc định          | Mô tả                                                |
| -------- | -------- | --------- | ------------------ | ----------------------------------------------------- |
| `search` | `string` | ❌        |                    | Tìm theo email, username, firstName, lastName (insensitive) |
| `role`   | `enum`   | ❌        |                    | Lọc theo role: `ADMIN`, `MANAGER`, `USER`             |
| `status` | `string` | ❌        |                    | `active`/`true`/`1` hoặc `inactive`/`false`/`0`      |
| `page`   | `number` | ❌        | `1`                | Số trang                                              |
| `limit`  | `number` | ❌        | `10`               | Số item mỗi trang                                    |
| `sort`   | `string` | ❌        | `createdAt:desc`   | Sắp xếp: `field:asc|desc`                            |

**Sort fields cho phép:** `createdAt`, `email`, `username`, `firstName`, `lastName`, `role`, `isActive`

### Response (200 OK)

```json
{
  "items": [
    {
      "id": "cmp12xsmx00008pqv88263uth",
      "email": "admin@example.com",
      "username": "admin",
      "role": "ADMIN",
      "firstName": "Admin",
      "lastName": "User",
      "isActive": true,
      "createdAt": "2026-05-12T08:00:00.000Z"
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "lastPage": 5
  }
}
```

---

## 5. Danh sách người dùng — Body (Page)

Lấy danh sách người dùng theo định dạng phân trang FE (POST body).

| Thuộc tính   | Giá trị                         |
| ------------ | -------------------------------- |
| **Endpoint** | `POST /users/page`               |
| **Auth**     | ✅ Bearer Token (Authorization)  |
| **Roles**    | `ADMIN`, `MANAGER`               |
| **Status**   | `200 OK`                         |

### Request Body

```json
{
  "page": 1,
  "limit": 10,
  "condition": { "isActive": true },
  "filters": [
    { "field": "role", "operator": "equals", "value": "ADMIN" }
  ],
  "sort": { "createdAt": "desc" }
}
```

| Trường      | Kiểu                     | Bắt buộc | Mặc định                  | Mô tả                              |
| ----------- | ------------------------- | --------- | ------------------------- | ----------------------------------- |
| `page`      | `number`                  | ❌        | `1`                       | Số trang (bắt đầu từ 1)            |
| `limit`     | `number`                  | ❌        | `10`                      | Số item mỗi trang                  |
| `condition` | `object`                  | ❌        | `{}`                      | Điều kiện where cơ bản             |
| `filters`   | `array`                   | ❌        | `[]`                      | Danh sách bộ lọc nâng cao          |
| `sort`      | `object`/`string`/`array` | ❌        | `{ "createdAt": "desc" }` | Sắp xếp                            |

### Response (200 OK)

```json
{
  "result": [
    {
      "id": "cmp12xsmx00008pqv88263uth",
      "email": "admin@example.com",
      "username": "admin",
      "role": "ADMIN",
      "firstName": "Admin",
      "lastName": "User",
      "isActive": true,
      "createdAt": "2026-05-12T08:00:00.000Z"
    }
  ],
  "total": 50
}
```

---

## 6. Chi tiết người dùng (Get One)

Lấy thông tin chi tiết của một người dùng theo ID.

| Thuộc tính   | Giá trị                         |
| ------------ | -------------------------------- |
| **Endpoint** | `GET /users/:id`                 |
| **Auth**     | ✅ Bearer Token (Authorization)  |
| **Roles**    | `ADMIN`, `MANAGER`               |
| **Status**   | `200 OK`                         |

### Path Parameters

| Tham số | Kiểu     | Bắt buộc | Mô tả         |
| ------- | -------- | --------- | -------------- |
| `id`    | `string` | ✅        | CUID của user  |

### Response (200 OK)

```json
{
  "id": "cmp12xsmx00008pqv88263uth",
  "email": "admin@example.com",
  "username": "admin",
  "role": "ADMIN",
  "firstName": "Admin",
  "lastName": "User",
  "picture": null,
  "isActive": true,
  "createdAt": "2026-05-12T08:00:00.000Z",
  "updatedAt": "2026-05-12T08:00:00.000Z"
}
```

### Lỗi

| Status | Mã lỗi           | Mô tả                              |
| ------ | ----------------- | ----------------------------------- |
| `404`  | `user.NOT_FOUND`  | Không tìm thấy user hoặc đã bị xóa |

---

## 7. Cập nhật người dùng (Update)

Cập nhật thông tin người dùng bởi Admin. Có thể thay đổi email, role, picture...

| Thuộc tính   | Giá trị                         |
| ------------ | -------------------------------- |
| **Endpoint** | `PATCH /users/:id`               |
| **Auth**     | ✅ Bearer Token (Authorization)  |
| **Roles**    | `ADMIN`                          |
| **Status**   | `200 OK`                         |

### Request Body

```json
{
  "email": "newemail@example.com",
  "firstName": "Updated",
  "lastName": "Name",
  "role": "MANAGER",
  "picture": "https://example.com/new-avatar.png"
}
```

| Trường      | Kiểu     | Bắt buộc | Validation                          |
| ----------- | -------- | --------- | ----------------------------------- |
| `email`     | `string` | ❌        | Phải là email hợp lệ               |
| `firstName` | `string` | ❌        |                                     |
| `lastName`  | `string` | ❌        |                                     |
| `role`      | `enum`   | ❌        | `ADMIN`, `MANAGER`, `USER`          |
| `picture`   | `string` | ❌        |                                     |

### Lỗi

| Status | Mã lỗi           | Mô tả                              |
| ------ | ----------------- | ----------------------------------- |
| `400`  | `Bad Request`     | Email không hợp lệ                 |
| `404`  | `user.NOT_FOUND`  | Không tìm thấy user hoặc đã bị xóa |

---

## 8. Xóa người dùng (Delete)

Xóa mềm người dùng (đánh dấu `deletedAt`).

| Thuộc tính   | Giá trị                         |
| ------------ | -------------------------------- |
| **Endpoint** | `DELETE /users/:id`              |
| **Auth**     | ✅ Bearer Token (Authorization)  |
| **Roles**    | `ADMIN`                          |
| **Status**   | `200 OK`                         |

### Path Parameters

| Tham số | Kiểu     | Bắt buộc | Mô tả         |
| ------- | -------- | --------- | -------------- |
| `id`    | `string` | ✅        | CUID của user  |

### Lỗi

| Status | Mã lỗi           | Mô tả                              |
| ------ | ----------------- | ----------------------------------- |
| `404`  | `user.NOT_FOUND`  | Không tìm thấy user hoặc đã bị xóa |

---

## 9. Gán vai trò (Assign Role)

Gán vai trò mới cho người dùng.

| Thuộc tính   | Giá trị                         |
| ------------ | -------------------------------- |
| **Endpoint** | `PUT /users/:id/roles`           |
| **Auth**     | ✅ Bearer Token (Authorization)  |
| **Roles**    | `ADMIN`                          |
| **Status**   | `200 OK`                         |

### Request Body

```json
{
  "role": "MANAGER"
}
```

| Trường | Kiểu   | Bắt buộc | Validation                 |
| ------ | ------ | --------- | -------------------------- |
| `role` | `enum` | ✅        | `ADMIN`, `MANAGER`, `USER` |

### Response (200 OK)

```json
{
  "id": "cmp12xsmx00008pqv88263uth",
  "email": "admin@example.com",
  "username": "admin",
  "role": "MANAGER",
  "firstName": "Admin",
  "lastName": "User",
  "isActive": true,
  "createdAt": "2026-05-12T08:00:00.000Z"
}
```

### Lỗi

| Status | Mã lỗi           | Mô tả                              |
| ------ | ----------------- | ----------------------------------- |
| `404`  | `user.NOT_FOUND`  | Không tìm thấy user hoặc đã bị xóa |

---

## 10. Danh sách vai trò (List Roles)

Lấy danh sách tất cả vai trò trong hệ thống.

| Thuộc tính   | Giá trị                         |
| ------------ | -------------------------------- |
| **Endpoint** | `GET /roles`                     |
| **Auth**     | ✅ Bearer Token (Authorization)  |
| **Roles**    | `ADMIN`                          |
| **Status**   | `200 OK`                         |

### Response (200 OK)

```json
["ADMIN", "MANAGER", "USER"]
```

---

## 11. Danh sách quyền (List Permissions)

Lấy danh sách tất cả quyền trong hệ thống.

| Thuộc tính   | Giá trị                         |
| ------------ | -------------------------------- |
| **Endpoint** | `GET /permissions`               |
| **Auth**     | ✅ Bearer Token (Authorization)  |
| **Roles**    | `ADMIN`                          |
| **Status**   | `200 OK`                         |

### Response (200 OK)

```json
["roles.read", "roles.write", "users.role.assign"]
```

---

## Data Model

```
┌────────────────────────────────────────────┐
│                   User                     │
├────────────────────────────────────────────┤
│ id           : CUID (PK)                  │
│ email        : String (unique)            │
│ username     : String (unique)            │
│ passwordHash : String?                    │
│ role         : ADMIN | MANAGER | USER     │
│ firstName    : String?                    │
│ lastName     : String?                    │
│ picture      : String?                    │
│ isActive     : Boolean (default: true)    │
│ keycloakId   : String? (unique)           │
│ createdAt    : DateTime                   │
│ updatedAt    : DateTime                   │
│ deletedAt    : DateTime? (soft delete)    │
├────────────────────────────────────────────┤
│ Relations:                                │
│ ├── refreshTokens → RefreshToken[]        │
│ ├── forms         → Form[]               │
│ ├── submissions   → Submission[]          │
│ ├── workflowDefs  → WorkflowDefinition[]  │
│ ├── notifications → Notification[]        │
│ ├── jobRecords    → JobRecord[]           │
│ └── fileRecords   → FileRecord[]          │
└────────────────────────────────────────────┘
```

---

## Phân quyền (Authorization)

| Endpoint              | ADMIN | MANAGER | USER |
| --------------------- | ----- | ------- | ---- |
| `GET /users/me`       | ✅    | ✅      | ✅   |
| `PUT /users/me`       | ✅    | ✅      | ✅   |
| `POST /users`         | ✅    | ❌      | ❌   |
| `GET /users`          | ✅    | ❌      | ❌   |
| `POST /users/page`    | ✅    | ✅      | ❌   |
| `GET /users/:id`      | ✅    | ✅      | ❌   |
| `PATCH /users/:id`    | ✅    | ❌      | ❌   |
| `DELETE /users/:id`   | ✅    | ❌      | ❌   |
| `PUT /users/:id/roles`| ✅    | ❌      | ❌   |
| `GET /roles`          | ✅    | ❌      | ❌   |
| `GET /permissions`    | ✅    | ❌      | ❌   |

---

## Ghi chú

- Tất cả endpoint yêu cầu **Bearer Token** trong header `Authorization`.
- User sử dụng **Soft Delete**: trường `deletedAt` được set thay vì xóa khỏi database.
- Mật khẩu được **hash bằng bcrypt** (10 rounds) trước khi lưu.
- Response **không bao giờ** trả về `passwordHash`.
- Endpoint `GET /users/me` và `PUT /users/me` cho phép tất cả user đã xác thực.
- Endpoint `PUT /users/me` chỉ cho phép sửa `firstName`, `lastName`, `picture` — không thể tự đổi `role` hoặc `email`.
- Tìm kiếm (`search`) là **case-insensitive** và tìm trên 4 trường: `email`, `username`, `firstName`, `lastName`.
- Tất cả các endpoint trả về lỗi validation sẽ có dạng:

```json
{
  "statusCode": 400,
  "message": ["validation error messages"],
  "error": "Bad Request"
}
```
