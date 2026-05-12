# Auth API Documentation

> Base URL: `http://localhost:3000`

## Mục lục

- [1. Đăng nhập (Login)](#1-đăng-nhập-login)
- [2. Đăng ký (Register)](#2-đăng-ký-register)
- [3. Làm mới Access Token (Refresh)](#3-làm-mới-access-token-refresh)
- [4. Đăng xuất (Logout)](#4-đăng-xuất-logout)
- [5. Đăng nhập qua Keycloak](#5-đăng-nhập-qua-keycloak)
- [6. Đăng xuất Keycloak](#6-đăng-xuất-keycloak)
- [7. Lấy thông tin người dùng hiện tại (Me)](#7-lấy-thông-tin-người-dùng-hiện-tại-me)
Tạo người dùng mới. Mật khẩu được hash bằng bcrypt (10 rounds) trước khi lưu.

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

## 2. Đăng ký (Register)

Tạo tài khoản mới với role mặc định là `USER`.

| Thuộc tính   | Giá trị                 |
| ------------ | ----------------------- |
| **Endpoint** | `POST /auth/register`   |
| **Auth**     | Không yêu cầu (Public) |
| **Status**   | `201 Created`           |

### Request Body

```json
{
  "email": "newuser@system.com",
  "username": "newuser",
  "password": "User@123",
  "firstName": "John",
  "lastName": "Doe"
}
```

| Trường      | Kiểu     | Bắt buộc | Validation             |
| ----------- | -------- | --------- | ---------------------- |
| `email`     | `string` | ✅        | Phải là email hợp lệ  |
| `username`  | `string` | ✅        | Không được để trống    |
| `password`  | `string` | ✅        | Tối thiểu 6 ký tự     |
| `firstName` | `string` | ❌        |                        |
| `lastName`  | `string` | ❌        |                        |

### Response (201 Created)

```json
{
  "id": "cm1abc...",
  "email": "newuser@system.com",
  "username": "newuser",
  "role": "USER",
  "firstName": "John",
  "lastName": "Doe",
  "picture": null,
  "isActive": true,
  "keycloakId": null,
  "createdAt": "2026-05-11T11:00:00.000Z",
  "updatedAt": "2026-05-11T11:00:00.000Z",
  "deletedAt": null
}
```

> **Lưu ý:** Response không trả về `passwordHash`.

### Lỗi

| Status | Mã lỗi           | Mô tả                                    |
| ------ | ----------------- | ----------------------------------------- |
| `409`  | `error.CONFLICT`  | Email hoặc username đã tồn tại trong hệ thống |

---

## 3. Làm mới Access Token (Refresh)

Sử dụng refresh token để lấy access token mới khi access token hết hạn.

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
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Lỗi

| Status | Mã lỗi                         | Mô tả                                |
| ------ | ------------------------------- | ------------------------------------- |
| `401`  | `error.INVALID_REFRESH_TOKEN`   | Refresh token không hợp lệ hoặc hết hạn |

---

## 4. Đăng xuất (Logout)

Đăng xuất và thu hồi refresh token. Yêu cầu đăng nhập (gửi Bearer token).

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

---

## 5. Đăng nhập qua Keycloak

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

## 6. Đăng xuất Keycloak

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

## 7. Lấy thông tin người dùng hiện tại (Me)

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
- Tất cả các endpoint trả về lỗi validation sẽ có dạng:

```json
{
  "statusCode": 400,
  "message": ["validation.INVALID", "validation.MIN_LENGTH"],
  "error": "Bad Request"
}
```
