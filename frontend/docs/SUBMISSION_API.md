# Submission API Documentation

> Base URL: `http://localhost:3000`

## Mục lục

- [1. Nộp Form mới (Create Submission)](#1-nộp-form-mới-create-submission)
- [2. Lấy danh sách Submission của tôi (Get My Submissions)](#2-lấy-danh-sách-submission-của-tôi-get-my-submissions)
- [3. Lấy tất cả Submission (Admin/Manager)](#3-lấy-tất-cả-submission-adminmanager)
- [4. Lấy chi tiết Submission theo ID (Get Submission Details)](#4-lấy-chi-tiết-submission-theo-id-get-submission-details)
- [5. Thu hồi Submission về trạng thái DRAFT (Recall Submission)](#5-thu-hồi-submission-về-trạng-thái-draft-recall-submission)
- [6. Nộp lại Submission (Resubmit Revision)](#6-nộp-lại-submission-resubmit-revision)
- [7. Lấy danh sách các phiên bản (Revisions)](#7-lấy-danh-sách-các-phiên-bản-revisions)
- [8. Data Model](#8-data-model)
- [9. Phân quyền (Authorization)](#9-phân-quyền-authorization)

---

## 1. Nộp Form mới (Create Submission)

Nộp dữ liệu cho một Form đã được định nghĩa. Hệ thống sẽ tự động kiểm tra tính hợp lệ của dữ liệu (Validation Engine) dựa trên schema của Form. Nếu Form có cấu hình quy trình duyệt (Workflow), hệ thống sẽ tự động kích hoạt quy trình.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `POST /submissions`                |
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
  "formId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "data": {
    "ly_do": "Việc gia đình",
    "so_ngay": 2
  }
}
```

| Trường   | Kiểu     | Bắt buộc | Mô tả                                         |
| -------- | -------- | -------- | --------------------------------------------- |
| `formId` | `string` | ✅       | UUID của Form cần nộp                         |
| `data`   | `object` | ✅       | Dữ liệu nộp form tương ứng với schema của Form|

### Response (201 Created)

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "formId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "data": {
    "ly_do": "Việc gia đình",
    "so_ngay": 2
  },
  "status": "UNDER_REVIEW",
  "submittedBy": "cmp12xsmx00008pqv88263uth",
  "parentSubmissionId": null,
  "revisionNumber": 1,
  "createdAt": "2026-05-12T08:00:00.000Z",
  "updatedAt": "2026-05-12T08:00:00.000Z"
}
```

> **Lưu ý về `status`:**
> - Trở thành `UNDER_REVIEW` nếu Form có định nghĩa Workflow.
> - Trở thành `SUBMITTED` nếu Form không có Workflow đi kèm.

### Lỗi

| Status | Mã lỗi                 | Mô tả                                            |
| ------ | ---------------------- | ------------------------------------------------ |
| `401`  | `Unauthorized`         | Chưa đăng nhập hoặc token hết hạn                |
| `404`  | `form.NOT_FOUND`       | Không tìm thấy Form hoặc Form không hoạt động    |
| `422`  | `validation.INVALID`   | Dữ liệu không hợp lệ theo định nghĩa của Schema  |

---

## 2. Lấy danh sách Submission của tôi (Get My Submissions)

Lấy danh sách các submission do user hiện tại nộp, có hỗ trợ phân trang và lọc.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `GET /submissions`                 |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | Tất cả user đã xác thực            |
| **Status**   | `200 OK`                           |

### Query Parameters

| Tham số  | Kiểu     | Bắt buộc | Mặc định | Mô tả                                      |
| -------- | -------- | -------- | -------- | ------------------------------------------ |
| `page`   | `number` | ❌       | `1`      | Trang hiện tại (bắt đầu từ 1)              |
| `limit`  | `number` | ❌       | `20`     | Số lượng bản ghi trên mỗi trang (max: 100) |
| `status` | `enum`   | ❌       |          | Lọc theo trạng thái của submission         |
| `formId` | `string` | ❌       |          | Lọc theo UUID của Form cụ thể              |

### Response (200 OK)

```json
{
  "items": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "formId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "data": {
        "ly_do": "Việc gia đình",
        "so_ngay": 2
      },
      "status": "UNDER_REVIEW",
      "submittedBy": "cmp12xsmx00008pqv88263uth",
      "parentSubmissionId": null,
      "revisionNumber": 1,
      "createdAt": "2026-05-12T08:00:00.000Z",
      "updatedAt": "2026-05-12T08:00:00.000Z",
      "form": {
        "name": "Đơn xin nghỉ phép"
      }
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

## 3. Lấy tất cả Submission (Admin/Manager)

Lấy toàn bộ danh sách submission trong hệ thống. Chỉ dành cho quyền Quản trị viên hoặc Quản lý.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `GET /submissions/admin`           |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | `ADMIN`, `MANAGER`                 |
| **Status**   | `200 OK`                           |

### Query Parameters

Tương tự như [Get My Submissions](#2-lấy-danh-sách-submission-của-tôi-get-my-submissions).

### Response (200 OK)

```json
{
  "items": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "formId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "data": { ... },
      "status": "UNDER_REVIEW",
      "submittedBy": "cmp12xsmx00008pqv88263uth",
      "parentSubmissionId": null,
      "revisionNumber": 1,
      "createdAt": "2026-05-12T08:00:00.000Z",
      "updatedAt": "2026-05-12T08:00:00.000Z",
      "form": {
        "name": "Đơn xin nghỉ phép"
      },
      "user": {
        "email": "user@example.com",
        "username": "nguyenvana"
      }
    }
  ],
  "meta": {
    "total": 120,
    "page": 1,
    "limit": 20,
    "totalPages": 6
  }
}
```

---

## 4. Lấy chi tiết Submission theo ID (Get Submission Details)

Lấy thông tin chi tiết của một submission, bao gồm cả schema của form và chi tiết lịch sử duyệt (Workflow history).

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `GET /submissions/:id`             |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | Người nộp hoặc `ADMIN`, `MANAGER`  |
| **Status**   | `200 OK`                           |

### Path Parameters

| Tham số | Kiểu     | Bắt buộc | Mô tả               |
| ------- | -------- | -------- | ------------------- |
| `id`    | `string` | ✅       | UUID của submission |

### Response (200 OK)

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "formId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "data": {
    "ly_do": "Việc gia đình",
    "so_ngay": 2
  },
  "status": "UNDER_REVIEW",
  "submittedBy": "cmp12xsmx00008pqv88263uth",
  "parentSubmissionId": null,
  "revisionNumber": 1,
  "createdAt": "2026-05-12T08:00:00.000Z",
  "updatedAt": "2026-05-12T08:00:00.000Z",
  "form": {
    "name": "Đơn xin nghỉ phép",
    "schema": { ... }
  },
  "user": {
    "email": "user@example.com",
    "username": "nguyenvana"
  },
  "workflows": [
    {
      "id": "wf_instance_id_123",
      "definitionId": "wf_def_id_456",
      "submissionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "currentStep": "step_manager_review",
      "status": "ACTIVE",
      "createdAt": "2026-05-12T08:00:00.000Z",
      "updatedAt": "2026-05-12T08:00:00.000Z",
      "histories": [
        {
          "id": "history_id_789",
          "instanceId": "wf_instance_id_123",
          "fromStep": null,
          "toStep": "step_manager_review",
          "action": "SUBMITTED",
          "actorId": "cmp12xsmx00008pqv88263uth",
          "comment": null,
          "createdAt": "2026-05-12T08:00:00.000Z"
        }
      ]
    }
  ]
}
```

### Lỗi

| Status | Mã lỗi                 | Mô tả                                 |
| ------ | ---------------------- | ------------------------------------- |
| `403`  | `error.FORBIDDEN`      | Không có quyền truy cập submission này|
| `404`  | `submission.NOT_FOUND` | Không tìm thấy submission             |

---

## 5. Thu hồi Submission về trạng thái DRAFT (Recall Submission)

Cho phép người nộp thu hồi lại đơn đã nộp để chỉnh sửa khi đơn chưa được xử lý hoàn tất.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `PATCH /submissions/:id/recall`    |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | Người nộp (`submittedBy`)          |
| **Status**   | `200 OK`                           |

### Điều kiện áp dụng

- Chỉ áp dụng khi `status` của submission đang là `DRAFT`, `SUBMITTED`, hoặc `UNDER_REVIEW`.
- Khi thu hồi, các quy trình duyệt (workflow instance) đang `ACTIVE` liên quan đến submission này sẽ bị chuyển sang trạng thái `CANCELLED`.
- Trạng thái của submission sẽ trở về `DRAFT`.

### Response (200 OK)

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "formId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "data": { ... },
  "status": "DRAFT",
  "submittedBy": "cmp12xsmx00008pqv88263uth",
  "parentSubmissionId": null,
  "revisionNumber": 1,
  "createdAt": "2026-05-12T08:00:00.000Z",
  "updatedAt": "2026-05-12T08:30:00.000Z"
}
```

### Lỗi

| Status | Mã lỗi                 | Mô tả                                             |
| ------ | ---------------------- | ------------------------------------------------- |
| `403`  | `workflow.NOT_ALLOWED` | Trạng thái hiện tại không cho phép thu hồi đơn    |
| `404`  | `submission.NOT_FOUND` | Không tìm thấy submission                         |

---

## 6. Nộp lại Submission (Resubmit Revision)

Tạo một phiên bản mới (revision) từ một submission đã bị từ chối (`REJECTED`), bị hủy (`CANCELLED`), hoặc được trả lại để sửa (`RETURNED`).

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `POST /submissions/:id/resubmit`   |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | Người nộp (`submittedBy`)          |
| **Status**   | `201 Created`                      |

### Request Body (Optional)

```json
{
  "data": {
    "ly_do": "Việc gia đình (đã cập nhật giải trình rõ ràng hơn)",
    "so_ngay": 2
  }
}
```

> **Lưu ý:** Nếu không gửi object `data` mới, hệ thống sẽ tự động sử dụng lại dữ liệu của phiên bản submission gốc.

### Cơ chế hoạt động

1. Kiểm tra trạng thái của submission cũ phải thuộc `REJECTED`, `CANCELLED`, hoặc `RETURNED`.
2. Đóng các workflow instance đang `ACTIVE` của submission cũ (chuyển sang `COMPLETED`).
3. Tạo một bản ghi Submission mới, với `revisionNumber` tăng lên 1, và liên kết `parentSubmissionId` trỏ về ID của submission cũ.
4. Kích hoạt Workflow mới cho phiên bản submission vừa tạo.

### Response (201 Created)

```json
{
  "id": "b2c3d4e5-f6a7-8901-bcde-f01234567890",
  "formId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "data": {
    "ly_do": "Việc gia đình (đã cập nhật giải trình rõ ràng hơn)",
    "so_ngay": 2
  },
  "status": "UNDER_REVIEW",
  "submittedBy": "cmp12xsmx00008pqv88263uth",
  "parentSubmissionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "revisionNumber": 2,
  "createdAt": "2026-05-12T09:00:00.000Z",
  "updatedAt": "2026-05-12T09:00:00.000Z"
}
```

### Lỗi

| Status | Mã lỗi                       | Mô tả                                          |
| ------ | ---------------------------- | ---------------------------------------------- |
| `400`  | `submission.CANNOT_RESUBMIT` | Trạng thái đơn cũ không hỗ trợ nộp lại         |
| `403`  | `error.FORBIDDEN`            | Không có quyền nộp lại đơn của user khác       |
| `422`  | `validation.INVALID`         | Dữ liệu nộp lại không hợp lệ theo Schema       |

---

## 7. Lấy danh sách các phiên bản (Revisions)

Lấy toàn bộ cây lịch sử các phiên bản của một submission (từ phiên bản gốc đầu tiên cho đến các lần nộp lại tiếp theo).

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `GET /submissions/:id/revisions`   |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | Người nộp hoặc `ADMIN`, `MANAGER`  |
| **Status**   | `200 OK`                           |

### Response (200 OK)

Trả về mảng các submission được sắp xếp theo `revisionNumber` tăng dần.

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "formId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "data": { ... },
    "status": "RETURNED",
    "submittedBy": "cmp12xsmx00008pqv88263uth",
    "parentSubmissionId": null,
    "revisionNumber": 1,
    "createdAt": "2026-05-12T08:00:00.000Z",
    "updatedAt": "2026-05-12T08:45:00.000Z",
    "workflows": [
      {
        "currentStep": "step_manager_review",
        "status": "COMPLETED"
      }
    ]
  },
  {
    "id": "b2c3d4e5-f6a7-8901-bcde-f01234567890",
    "formId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "data": { ... },
    "status": "UNDER_REVIEW",
    "submittedBy": "cmp12xsmx00008pqv88263uth",
    "parentSubmissionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "revisionNumber": 2,
    "createdAt": "2026-05-12T09:00:00.000Z",
    "updatedAt": "2026-05-12T09:00:00.000Z",
    "workflows": [
      {
        "currentStep": "step_manager_review",
        "status": "ACTIVE"
      }
    ]
  }
]
```

---

## 8. Data Model

```
┌────────────────────────────────────────────────────────────────┐
│                           Submission                           │
├────────────────────────────────────────────────────────────────┤
│  id                 : UUID (PK)                                │
│  formId             : String           (FK → Form.id)          │
│  data               : JSON             (Dữ liệu thực tế nộp)   │
│  status             : SubmissionStatus (default: DRAFT)        │
│  submittedBy        : String           (FK → User.id)          │
│  parentSubmissionId : String?          (FK → Submission.id)    │
│  revisionNumber     : Int              (default: 1)            │
│  createdAt          : DateTime                                 │
│  updatedAt          : DateTime                                 │
├────────────────────────────────────────────────────────────────┤
│  Relations:                                                    │
│  ├── form             → Form                                   │
│  ├── user             → User                                   │
│  ├── workflows        → WorkflowInstance[]                     │
│  ├── parentSubmission → Submission? (Phiên bản liền trước)     │
│  └── childSubmissions → Submission[] (Các phiên bản nộp lại)   │
└────────────────────────────────────────────────────────────────┘
```

### Các trạng thái SubmissionStatus

| Trạng thái     | Ý nghĩa                                                  |
| -------------- | -------------------------------------------------------- |
| `DRAFT`        | Đơn nháp hoặc đơn đã được người nộp thu hồi (`recall`)   |
| `SUBMITTED`    | Đơn đã nộp thành công (dành cho form không có workflow)  |
| `UNDER_REVIEW` | Đơn đang trong quá trình các cấp phê duyệt               |
| `APPROVED`     | Đơn đã được phê duyệt cuối cùng                          |
| `REJECTED`     | Đơn bị từ chối phê duyệt                                 |
| `CANCELLED`    | Đơn bị hủy bỏ                                            |
| `RETURNED`     | Đơn bị trả lại cho người nộp để chỉnh sửa/nộp lại        |

---

## 9. Phân quyền (Authorization)

| Endpoint                           | ADMIN | MANAGER | USER (Chính chủ) | USER (Khác) |
| ---------------------------------- | ----- | ------- | ---------------- | ----------- |
| `POST /submissions`                | ✅    | ✅      | ✅               | ✅          |
| `GET /submissions`                 | ✅    | ✅      | ✅               | ✅          |
| `GET /submissions/admin`           | ✅    | ✅      | ❌               | ❌          |
| `GET /submissions/:id`             | ✅    | ✅      | ✅               | ❌          |
| `PATCH /submissions/:id/recall`    | ❌    | ❌      | ✅               | ❌          |
| `POST /submissions/:id/resubmit`   | ❌    | ❌      | ✅               | ❌          |
| `GET /submissions/:id/revisions`   | ✅    | ✅      | ✅               | ❌          |
