# Dashboard API Documentation

> Base URL: `http://localhost:3000`

## Mục lục

- [1. Tổng quan nhanh (Summary)](#1-tổng-quan-nhanh-summary)
- [2. Phân bổ Submission theo trạng thái (By Status)](#2-phân-bổ-submission-theo-trạng-thái-by-status)
- [3. Số lượng Submission theo ngày (By Day)](#3-số-lượng-submission-theo-ngày-by-day)
- [4. Top Forms được sử dụng nhiều nhất (Top Forms)](#4-top-forms-được-sử-dụng-nhiều-nhất-top-forms)

---

## 1. Tổng quan nhanh (Summary)

Lấy các con số tổng quan (số lượng form, submission, user, v.v.).

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `GET /dashboard/summary`           |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | `ADMIN`                            |
| **Status**   | `200 OK`                           |

---

## 2. Phân bổ Submission theo trạng thái (By Status)

Lấy thống kê số lượng submission nhóm theo từng trạng thái.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `GET /dashboard/submissions-by-status`|
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | `ADMIN`                            |
| **Status**   | `200 OK`                           |

---

## 3. Số lượng Submission theo ngày (By Day)

Thống kê số lượng submission tạo ra theo từng ngày.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `GET /dashboard/submissions-by-day`|
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | `ADMIN`                            |
| **Status**   | `200 OK`                           |

### Query Parameters

| Tham số | Kiểu     | Bắt buộc | Mặc định | Mô tả                   |
| ------- | -------- | -------- | -------- | ----------------------- |
| `days`  | `number` | ❌       | `30`     | Số ngày cần thống kê    |

---

## 4. Top Forms được sử dụng nhiều nhất (Top Forms)

Lấy danh sách các form có số lượt nộp (submission) cao nhất.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `GET /dashboard/top-forms`         |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | `ADMIN`                            |
| **Status**   | `200 OK`                           |

### Query Parameters

| Tham số | Kiểu     | Bắt buộc | Mặc định | Mô tả                   |
| ------- | -------- | -------- | -------- | ----------------------- |
| `limit` | `number` | ❌       | `5`      | Số lượng form trả về    |
