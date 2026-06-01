# Auth API Documentation

> Base URL: `http://localhost:3000`

## Mục lục

- [1. Đăng nhập (Login)](#1-đăng-nhập-login)
- [2. Làm mới Access Token (Refresh)](#2-làm-mới-access-token-refresh)
- [3. Đăng xuất (Logout)](#3-đăng-xuất-logout)
- [4. Đăng nhập qua Keycloak](#4-đăng-nhập-qua-keycloak)
- [5. Đăng xuất Keycloak](#5-đăng-xuất-keycloak)
- [6. Lấy thông tin người dùng hiện tại (Me)](#6-lấy-thông-tin-người-dùng-hiện-tại-me)

---

## 1. Đăng nhập (Login)

Đăng nhập bằng email và password, nhận về access token, refresh token và thông tin user.

| Thuộc tính   | Giá trị                 |
| ------------ | ----------------------- |
| **Endpoint** | `POST /auth/login`      |
| **Auth**     | Không yêu cầu (Public) |
| **Status**   | `200 OK`                |

### Request Body

```json
{
  "email": "admin@example.com",
  "password": "User@123"
}
```

| Trường     | Kiểu     | Bắt buộc | Validation             |
| ---------- | -------- | --------- | ---------------------- |
| `email`    | `string` | ✅        | Phải là email hợp lệ  |
| `password` | `string` | ✅        | Tối thiểu 6 ký tự     |

### Response (200 OK)

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "cmp12xsmx00008pqv88263uth",
    "email": "admin@example.com",
    "username": "admin",
    "role": "ADMIN",
    "firstName": "Admin",
    "lastName": "User",
    "picture": null,
    "isActive": true,
    "keycloakId": null,
    "createdAt": "2026-05-11T10:00:00.000Z",
    "updatedAt": "2026-05-11T10:00:00.000Z",
    "deletedAt": null
  }
}
```

### Lỗi

| Status | Mã lỗi                    | Mô tả                                      |
| ------ | -------------------------- | ------------------------------------------- |
| `401`  | `error.INVALID_CREDENTIALS` | Email/password sai hoặc tài khoản bị vô hiệu |

---

## 2. Làm mới Access Token (Refresh)

Sử dụng refresh token để lấy access token mới khi access token hết hạn. Backend thực hiện **token rotation với token family** — refresh token cũ bị đánh dấu revoked (không xóa) và trả về refresh token mới trong cùng family.

| Thuộc tính   | Giá trị                 |
| ------------ | ----------------------- |
| **Endpoint** | `POST /auth/refresh`    |
| **Auth**     | Không yêu cầu (Public) |
| **Status**   | `200 OK`                |

### Request Body

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

| Trường         | Kiểu     | Bắt buộc | Mô tả                          |
| -------------- | -------- | --------- | ------------------------------- |
| `refreshToken` | `string` | ✅        | Refresh token nhận từ khi login |

### Response (200 OK)

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

> **Token Rotation (Token Family):** Mỗi lần refresh, token cũ bị đánh dấu `isRevoked = true` (giữ lại để phát hiện token reuse) và token mới được tạo trong cùng `tokenFamily`. Client **phải lưu lại** `refreshToken` mới từ response.

> **Token Reuse Detection:** Nếu client gửi lại một refresh token đã bị revoked, backend sẽ xóa **toàn bộ token family** liên quan, buộc user phải đăng nhập lại. Đây là biện pháp bảo mật chống token bị đánh cắp.

### Lỗi

| Status | Mã lỗi                         | Mô tả                                           |
| ------ | ------------------------------- | ------------------------------------------------ |
| `401`  | `error.INVALID_REFRESH_TOKEN`   | Refresh token không hợp lệ hoặc hết hạn         |
| `401`  | `error.TOKEN_REUSE_DETECTED`    | Phát hiện token reuse — toàn bộ family bị thu hồi |

---

## 3. Đăng xuất (Logout)

Đăng xuất và thu hồi **toàn bộ token family** liên quan đến refresh token. Yêu cầu đăng nhập (gửi Bearer token).

| Thuộc tính   | Giá trị                            |
| ------------ | ----------------------------------- |
| **Endpoint** | `POST /auth/logout`                |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Status**   | `200 OK`                            |

### Headers

```
Authorization: Bearer <accessToken>
```

### Request Body

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

| Trường         | Kiểu     | Bắt buộc | Mô tả                          |
| -------------- | -------- | --------- | ------------------------------- |
| `refreshToken` | `string` | ✅        | Refresh token cần thu hồi      |

### Response (200 OK)

```json
{
  "success": true
}

```

> **Family-based Revocation:** Khi logout, backend xóa tất cả refresh token thuộc cùng `tokenFamily`, đảm bảo không token nào trong chuỗi rotation còn hợp lệ.

---

## 4. Đăng nhập qua Keycloak

Đăng nhập thông qua Keycloak SSO (proxy mode).

| Thuộc tính   | Giá trị                         |
| ------------ | -------------------------------- |
| **Endpoint** | `POST /auth/keycloak/login`     |
| **Auth**     | Không yêu cầu (Public)         |
| **Status**   | `200 OK`                         |

### Request Body

```json
{
  "email": "user@system.com",
  "password": "User@123"
}
```

| Trường     | Kiểu     | Bắt buộc | Validation             |
| ---------- | -------- | --------- | ---------------------- |
| `email`    | `string` | ✅        | Phải là email hợp lệ  |
| `password` | `string` | ✅        | Tối thiểu 6 ký tự     |

### Response (200 OK)

```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 300,
  "tokenType": "Bearer"
}
```

### Lỗi

| Status | Mã lỗi                    | Mô tả                      |
| ------ | -------------------------- | --------------------------- |
| `401`  | `error.INVALID_CREDENTIALS` | Thông tin đăng nhập Keycloak sai |

---

## 5. Đăng xuất Keycloak

Đăng xuất khỏi phiên Keycloak.

| Thuộc tính   | Giá trị                          |
| ------------ | --------------------------------- |
| **Endpoint** | `POST /auth/keycloak/logout`     |
| **Auth**     | ✅ Bearer Token (Authorization)  |
| **Status**   | `200 OK`                          |

### Headers

```
Authorization: Bearer <accessToken>
```

### Request Body

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Response (200 OK)

```json
{
  "success": true
}
```

---

## 6. Lấy thông tin người dùng hiện tại (Me)

Lấy thông tin profile của người dùng đang đăng nhập.

| Thuộc tính   | Giá trị                          |
| ------------ | --------------------------------- |
| **Endpoint** | `GET /auth/me`                   |
| **Auth**     | ✅ Bearer Token (Authorization)  |
| **Status**   | `200 OK`                          |

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
  "createdAt": "2026-05-11T10:00:00.000Z"
}
```

---

## Luồng xác thực (Authentication Flow)

```
┌─────────────┐      POST /auth/login       ┌─────────────┐
│   Client    │ ──────────────────────────── │   Server    │
│             │ { email, password }          │             │
│             │ ◄──────────────────────────  │             │
│             │ { accessToken,               │             │
│             │   refreshToken, user }       │             │
└─────────────┘                              └─────────────┘
       │
       │  Lưu accessToken & refreshToken vào localStorage
       │
       ▼
┌─────────────┐    GET /auth/me              ┌─────────────┐
│   Client    │ ──────────────────────────── │   Server    │
│             │ Authorization: Bearer <AT>   │             │
│             │ ◄──────────────────────────  │             │
│             │ { user profile }             │             │
└─────────────┘                              └─────────────┘
       │
       │  Khi accessToken hết hạn (mặc định 15 phút)
       │
       ▼
┌─────────────┐    POST /auth/refresh        ┌─────────────┐
│   Client    │ ──────────────────────────── │   Server    │
│             │ { refreshToken }             │             │
│             │ ◄──────────────────────────  │             │
│             │ { accessToken (mới) }        │             │
└─────────────┘                              └─────────────┘
       │
       │  Khi logout
       │
       ▼
┌─────────────┐    POST /auth/logout         ┌─────────────┐
│   Client    │ ──────────────────────────── │   Server    │
│             │ Authorization: Bearer <AT>   │             │
│             │ { refreshToken }             │             │
│             │ ◄──────────────────────────  │             │
│             │ { success: true }            │             │
└─────────────┘                              └─────────────┘
```

## Ghi chú

- **Access Token** hết hạn sau **15 phút** (cấu hình qua `JWT_ACCESS_EXPIRATION`).
- **Refresh Token** hết hạn sau **7 ngày** (cấu hình qua `JWT_REFRESH_EXPIRATION`).
- Refresh token được **hash bằng bcrypt** trước khi lưu vào database.
- Mật khẩu người dùng được **hash bằng bcrypt** (10 rounds).
- **Token Family:** Mỗi phiên đăng nhập tạo một `tokenFamily` (UUID). Tất cả refresh token sinh ra từ chuỗi rotation đều thuộc cùng family.
- **Token Reuse Detection:** Nếu một refresh token đã bị revoked được sử dụng lại, toàn bộ family bị xóa — bảo vệ chống token bị đánh cắp.
- **Cron Cleanup:** Hệ thống tự động dọn dẹp refresh token hết hạn lúc **02:00 hàng ngày** (Asia/Ho_Chi_Minh).
- Tất cả các endpoint trả về lỗi validation sẽ có dạng:

```json
{
  "statusCode": 400,
  "message": ["validation.INVALID", "validation.MIN_LENGTH"],
  "error": "Bad Request"
}
```
