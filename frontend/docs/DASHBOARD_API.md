# Dashboard API Documentation

> Base URL: `http://localhost:3000`

## Mục lục

- [1. Tổng quan nhanh - toàn hệ thống (Summary)](#1-tổng-quan-nhanh---toàn-hệ-thống-summary)
- [2. Tổng quan nhanh - của tôi (My Summary)](#2-tổng-quan-nhanh---của-tôi-my-summary)
- [3. Phân bổ Submission theo trạng thái (By Status)](#3-phân-bổ-submission-theo-trạng-thái-by-status)
- [4. Số lượng Submission theo ngày (By Day)](#4-số-lượng-submission-theo-ngày-by-day)
- [5. Top Forms được sử dụng nhiều nhất (Top Forms)](#5-top-forms-được-sử-dụng-nhiều-nhất-top-forms)

---

## 1. Tổng quan nhanh - toàn hệ thống (Summary)

Lấy các con số tổng quan toàn hệ thống (tổng submissions, đang chờ, đã duyệt, từ chối).

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `GET /dashboard/summary`           |
| **Auth**     | Bearer Token (Authorization)       |
| **Roles**    | `ADMIN`, `MANAGER`                 |
| **Status**   | `200 OK`                           |

### Response

```json
{
  "total": 150,
  "pending": 12,
  "approved": 120,
  "rejected": 18
}
```

---

## 2. Tổng quan nhanh - của tôi (My Summary)

Lấy thống kê submissions của user hiện tại (chỉ đếm submissions do user đó nộp).

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `GET /dashboard/my-summary`        |
| **Auth**     | Bearer Token (Authorization)       |
| **Roles**    | Tất cả role đã xác thực            |
| **Status**   | `200 OK`                           |

### Response

```json
{
  "total": 8,
  "pending": 2,
  "approved": 5,
  "rejected": 1
}
```

---

## 3. Phân bổ Submission theo trạng thái (By Status)

Lấy thống kê số lượng submission nhóm theo từng trạng thái.

| Thuộc tính   | Giá trị                               |
| ------------ | ------------------------------------- |
| **Endpoint** | `GET /dashboard/submissions-by-status` |
| **Auth**     | Bearer Token (Authorization)          |
| **Roles**    | `ADMIN`, `MANAGER`                    |
| **Status**   | `200 OK`                              |

---

## 4. Số lượng Submission theo ngày (By Day)

Thống kê số lượng submission tạo ra theo từng ngày.

| Thuộc tính   | Giá trị                              |
| ------------ | ------------------------------------ |
| **Endpoint** | `GET /dashboard/submissions-by-day`  |
| **Auth**     | Bearer Token (Authorization)         |
| **Roles**    | `ADMIN`, `MANAGER`                   |
| **Status**   | `200 OK`                             |

### Query Parameters

| Tham số | Kiểu     | Bắt buộc | Mặc định | Mô tả                   |
| ------- | -------- | -------- | -------- | ----------------------- |
| `days`  | `number` | No       | `30`     | Số ngày cần thống kê    |

---

## 5. Top Forms được sử dụng nhiều nhất (Top Forms)

Lấy danh sách các form có số lượt nộp (submission) cao nhất.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `GET /dashboard/top-forms`         |
| **Auth**     | Bearer Token (Authorization)       |
| **Roles**    | `ADMIN`, `MANAGER`                 |
| **Status**   | `200 OK`                           |

### Query Parameters

| Tham số | Kiểu     | Bắt buộc | Mặc định | Mô tả                   |
| ------- | -------- | -------- | -------- | ----------------------- |
| `limit` | `number` | No       | `5`      | Số lượng form trả về    |
