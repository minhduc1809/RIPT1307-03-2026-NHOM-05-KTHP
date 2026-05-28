# Notification API Documentation

> Base URL: `http://localhost:3000`

## Mục lục

- [1. Danh sách thông báo của tôi (Get Mine)](#1-danh-sách-thông-báo-của-tôi-get-mine)
- [2. Đếm số thông báo chưa đọc (Unread Count)](#2-đếm-số-thông-báo-chưa-đọc-unread-count)
- [3. Đánh dấu đã đọc (Mark As Read)](#3-đánh-dấu-đã-đọc-mark-as-read)
- [4. Đánh dấu tất cả đã đọc (Mark All As Read)](#4-đánh-dấu-tất-cả-đã-đọc-mark-all-as-read)

---

## 1. Danh sách thông báo của tôi (Get Mine)

Lấy danh sách thông báo của user hiện tại, có phân trang và tùy chọn lọc theo trạng thái đọc.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `GET /notifications`               |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | Tất cả user đã xác thực            |
| **Status**   | `200 OK`                           |

### Query Parameters

| Tham số | Kiểu     | Bắt buộc | Mặc định | Mô tả                                  |
| ------- | -------- | -------- | -------- | -------------------------------------- |
| `page`  | `number` | ❌       | `1`      | Trang hiện tại                         |
| `limit` | `number` | ❌       | `20`     | Số lượng trên một trang                |
| `read`  | `string` | ❌       |          | Lọc `true`/`1` (đã đọc), `false` (chưa)|

---

## 2. Đếm số thông báo chưa đọc (Unread Count)

Trả về số lượng thông báo chưa đọc của user.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `GET /notifications/unread-count`  |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | Tất cả user đã xác thực            |
| **Status**   | `200 OK`                           |

---

## 3. Đánh dấu đã đọc (Mark As Read)

Đánh dấu một thông báo cụ thể là đã đọc.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `PATCH /notifications/:id/read`    |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | Chủ sở hữu của thông báo           |
| **Status**   | `200 OK`                           |

### Path Parameters

| Tham số | Kiểu     | Bắt buộc | Mô tả                 |
| ------- | -------- | -------- | --------------------- |
| `id`    | `string` | ✅       | UUID của thông báo    |

---

## 4. Đánh dấu tất cả đã đọc (Mark All As Read)

Đánh dấu toàn bộ thông báo chưa đọc của user thành đã đọc.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `PATCH /notifications/read-all`    |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | Tất cả user đã xác thực            |
| **Status**   | `200 OK`                           |
