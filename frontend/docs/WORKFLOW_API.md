# Workflow API Documentation

> Base URL: `http://localhost:3000`

## Mục lục

- [1. Tạo Workflow Definition (Create)](#1-tạo-workflow-definition-create)
- [2. Danh sách Workflow Definitions (List)](#2-danh-sách-workflow-definitions-list)
- [3. Chi tiết Workflow Definition (Get One)](#3-chi-tiết-workflow-definition-get-one)
- [4. Cập nhật Workflow Definition (Update)](#4-cập-nhật-workflow-definition-update)
- [5. Xóa Workflow Definition (Delete)](#5-xóa-workflow-definition-delete)
- [6. Thực thi Action (Execute Action)](#6-thực-thi-action-execute-action)
- [7. Danh sách chờ duyệt (Pending)](#7-danh-sách-chờ-duyệt-pending)
- [8. Lịch sử Workflow (History)](#8-lịch-sử-workflow-history)
- [9. Các Action khả dụng (Available Actions)](#9-các-action-khả-dụng-available-actions)
- [10. Workflow Config Schema](#10-workflow-config-schema)
- [11. Event System](#11-event-system)

---

## 1. Tạo Workflow Definition (Create)

Tạo một workflow definition mới. Config sẽ được validate trước khi lưu.

| Thuộc tính   | Giá trị                         |
| ------------ | ------------------------------- |
| **Endpoint** | `POST /workflows/definitions`   |
| **Auth**     | ✅ Bearer Token (Authorization) |
| **Roles**    | `ADMIN`, `MANAGER`              |
| **Status**   | `201 Created`                   |

### Headers

```
Authorization: Bearer <accessToken>
```

### Request Body

```json
{
	"name": "Leave Request Workflow",
	"formId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
	"config": {
		"states": ["pending_manager", "pending_hr", "approved", "rejected"],
		"initialState": "pending_manager",
		"finalStates": ["approved", "rejected"],
		"transitions": [
			{
				"from": "pending_manager",
				"to": "pending_hr",
				"action": "approve",
				"roles": ["MANAGER"]
			},
			{
				"from": "pending_hr",
				"to": "approved",
				"action": "approve",
				"roles": ["ADMIN"]
			},
			{
				"from": "*",
				"to": "rejected",
				"action": "reject",
				"roles": ["MANAGER", "ADMIN"],
				"conditions": { "requireComment": true }
			}
		]
	}
}
```

| Trường   | Kiểu     | Bắt buộc | Validation                        |
| -------- | -------- | -------- | --------------------------------- |
| `name`   | `string` | ✅       | Không được để trống               |
| `formId` | `string` | ❌       | Phải là UUID hợp lệ nếu có        |
| `config` | `object` | ✅       | Phải là object, validate cấu trúc |

### Response (201 Created)

```json
{
  "id": "d1e2f3a4-b5c6-7890-abcd-ef1234567890",
  "name": "Leave Request Workflow",
  "formId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "config": {...},
  "createdBy": "cmp12xsmx00008pqv88263uth",
  "createdAt": "2026-05-12T08:00:00.000Z",
  "updatedAt": "2026-05-12T08:00:00.000Z"
}
```

### Lỗi

| Status | Mã lỗi         | Mô tả                                              |
| ------ | -------------- | -------------------------------------------------- |
| `400`  | `Bad Request`  | Config không hợp lệ (thiếu states, transitions...) |
| `401`  | `Unauthorized` | Chưa đăng nhập hoặc token hết hạn                  |
| `403`  | `Forbidden`    | Không có quyền (chỉ ADMIN/MANAGER)                 |

---

## 2. Danh sách Workflow Definitions (List)

Lấy danh sách tất cả workflow definitions có phân trang.

| Thuộc tính   | Giá trị                         |
| ------------ | ------------------------------- |
| **Endpoint** | `GET /workflows/definitions`    |
| **Auth**     | ✅ Bearer Token (Authorization) |
| **Roles**    | `ADMIN`, `MANAGER`              |
| **Status**   | `200 OK`                        |

### Query Parameters

| Tham số | Kiểu     | Bắt buộc | Mặc định | Mô tả                   |
| ------- | -------- | -------- | -------- | ----------------------- |
| `page`  | `number` | ❌       | `1`      | Số trang (bắt đầu từ 1) |
| `limit` | `number` | ❌       | `20`     | Số item mỗi trang       |

### Response (200 OK)

```json
{
  "items": [
    {
      "id": "d1e2f3a4-b5c6-7890-abcd-ef1234567890",
      "name": "Leave Request Workflow",
      "formId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "config": { ... },
      "createdBy": "cmp12xsmx00008pqv88263uth",
      "createdAt": "2026-05-12T08:00:00.000Z",
      "updatedAt": "2026-05-12T08:00:00.000Z",
      "form": {
        "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "name": "Leave Request Form"
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

## 3. Chi tiết Workflow Definition (Get One)

Lấy chi tiết một workflow definition theo ID.

| Thuộc tính   | Giá trị                          |
| ------------ | -------------------------------- |
| **Endpoint** | `GET /workflows/definitions/:id` |
| **Auth**     | ✅ Bearer Token (Authorization)  |
| **Roles**    | `ADMIN`, `MANAGER`               |
| **Status**   | `200 OK`                         |

### Path Parameters

| Tham số | Kiểu     | Bắt buộc | Mô tả                        |
| ------- | -------- | -------- | ---------------------------- |
| `id`    | `string` | ✅       | UUID của workflow definition |

### Response (200 OK)

```json
{
  "id": "d1e2f3a4-b5c6-7890-abcd-ef1234567890",
  "name": "Leave Request Workflow",
  "formId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "config": {
    "states": ["pending_manager", "pending_hr", "approved", "rejected"],
    "initialState": "pending_manager",
    "finalStates": ["approved", "rejected"],
    "transitions": [...]
  },
  "createdBy": "cmp12xsmx00008pqv88263uth",
  "createdAt": "2026-05-12T08:00:00.000Z",
  "updatedAt": "2026-05-12T08:00:00.000Z",
  "form": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "name": "Leave Request Form"
  }
}
```

### Lỗi

| Status | Mã lỗi                        | Mô tả                              |
| ------ | ----------------------------- | ---------------------------------- |
| `404`  | `workflow.INSTANCE_NOT_FOUND` | Không tìm thấy workflow definition |

---

## 4. Cập nhật Workflow Definition (Update)

Cập nhật workflow definition. Tất cả trường đều optional (partial update).

| Thuộc tính   | Giá trị                          |
| ------------ | -------------------------------- |
| **Endpoint** | `PUT /workflows/definitions/:id` |
| **Auth**     | ✅ Bearer Token (Authorization)  |
| **Roles**    | `ADMIN`, `MANAGER`               |
| **Status**   | `200 OK`                         |

### Request Body

```json
{
  "name": "Updated Workflow Name",
  "formId": "new-form-uuid",
  "config": { ... }
}
```

| Trường   | Kiểu     | Bắt buộc | Mô tả                                    |
| -------- | -------- | -------- | ---------------------------------------- |
| `name`   | `string` | ❌       | Tên workflow                             |
| `formId` | `string` | ❌       | UUID form liên kết                       |
| `config` | `object` | ❌       | Config mới (sẽ được validate lại nếu có) |

### Lỗi

| Status | Mã lỗi                        | Mô tả                              |
| ------ | ----------------------------- | ---------------------------------- |
| `400`  | `Bad Request`                 | Config không hợp lệ                |
| `404`  | `workflow.INSTANCE_NOT_FOUND` | Không tìm thấy workflow definition |

---

## 5. Xóa Workflow Definition (Delete)

Xóa vĩnh viễn workflow definition. Không thể xóa nếu còn workflow instance đang `ACTIVE`.

| Thuộc tính   | Giá trị                             |
| ------------ | ----------------------------------- |
| **Endpoint** | `DELETE /workflows/definitions/:id` |
| **Auth**     | ✅ Bearer Token (Authorization)     |
| **Roles**    | `ADMIN`                             |
| **Status**   | `200 OK`                            |

### Lỗi

| Status | Mã lỗi                        | Mô tả                              |
| ------ | ----------------------------- | ---------------------------------- |
| `404`  | `workflow.INSTANCE_NOT_FOUND` | Không tìm thấy workflow definition |
| `409`  | `error.CONFLICT`              | Còn workflow instance đang ACTIVE  |

---

## 6. Thực thi Action (Execute Action)

Thực thi một action trên submission (approve, reject, cancel, return_for_edit, resubmit).

| Thuộc tính   | Giá trị                                |
| ------------ | -------------------------------------- |
| **Endpoint** | `POST /workflows/action`               |
| **Auth**     | ✅ Bearer Token (Authorization)        |
| **Roles**    | Tất cả role (kiểm tra theo transition) |
| **Status**   | `201 Created`                          |

### Request Body

```json
{
	"submissionId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
	"action": "approve",
	"comment": "Looks good, approved.",
	"data": {}
}
```

| Trường         | Kiểu     | Bắt buộc | Mô tả                                      |
| -------------- | -------- | -------- | ------------------------------------------ |
| `submissionId` | `string` | ✅       | UUID của submission                        |
| `action`       | `string` | ✅       | Action cần thực thi                        |
| `comment`      | `string` | ❌       | Ghi chú (bắt buộc nếu transition yêu cầu)  |
| `data`         | `object` | ❌       | Dữ liệu form mới (chỉ dùng với `resubmit`) |

### Các Action thường dùng

| Action            | Mô tả                                 |
| ----------------- | ------------------------------------- |
| `approve`         | Phê duyệt, chuyển sang bước tiếp theo |
| `reject`          | Từ chối submission                    |
| `cancel`          | Hủy submission                        |
| `return_for_edit` | Trả lại để chỉnh sửa                  |
| `resubmit`        | Gửi lại bản sửa đổi                   |

### Response — Action thường (200 OK)

```json
{
	"instanceId": "abc123-...",
	"previousState": "pending_manager",
	"currentState": "pending_hr",
	"action": "approve",
	"isCompleted": false,
	"submissionId": "f47ac10b-..."
}
```

### Response — Resubmit (200 OK)

```json
{
	"originalSubmissionId": "f47ac10b-...",
	"newSubmissionId": "g58bd21c-...",
	"action": "resubmit",
	"revisionNumber": 2
}
```

### Lỗi

| Status | Mã lỗi                        | Mô tả                                     |
| ------ | ----------------------------- | ----------------------------------------- |
| `400`  | `workflow.INVALID_TRANSITION` | Transition không hợp lệ từ state hiện tại |
| `400`  | `workflow.COMMENT_REQUIRED`   | Transition yêu cầu comment nhưng thiếu    |
| `403`  | `workflow.NOT_ALLOWED`        | Role không có quyền thực hiện action      |
| `404`  | `workflow.INSTANCE_NOT_FOUND` | Không tìm thấy workflow instance ACTIVE   |
| `404`  | `submission.NOT_FOUND`        | Không tìm thấy submission (resubmit)      |

---

## 7. Danh sách chờ duyệt (Pending)

Lấy danh sách submission đang chờ user hiện tại duyệt, dựa trên role của user và cấu hình transitions trong workflow.

| Thuộc tính   | Giá trị                         |
| ------------ | ------------------------------- |
| **Endpoint** | `GET /workflows/pending`        |
| **Auth**     | ✅ Bearer Token (Authorization) |
| **Roles**    | Tất cả role (đã xác thực)       |
| **Status**   | `200 OK`                        |

### Headers

```
Authorization: Bearer <accessToken>
```

### Query Parameters

| Tham số | Kiểu     | Bắt buộc | Mặc định | Mô tả                   |
| ------- | -------- | -------- | -------- | ----------------------- |
| `page`  | `number` | ❌       | `1`      | Số trang (bắt đầu từ 1) |
| `limit` | `number` | ❌       | `20`     | Số item mỗi trang       |

### Response (200 OK)

```json
{
  "items": [
    {
      "id": "instance-uuid-123",
      "definitionId": "def-uuid-456",
      "submissionId": "sub-uuid-789",
      "currentStep": "pending_manager",
      "status": "ACTIVE",
      "createdAt": "2026-05-12T08:00:00.000Z",
      "updatedAt": "2026-05-12T08:00:00.000Z",
      "submission": {
        "id": "sub-uuid-789",
        "data": { ... },
        "status": "UNDER_REVIEW",
        "user": {
          "email": "user@example.com",
          "username": "nguyenvana"
        }
      }
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

## 8. Lịch sử Workflow (History)

Lấy lịch sử các bước đã thực hiện trên workflow của một submission.

| Thuộc tính   | Giá trị                                            |
| ------------ | -------------------------------------------------- |
| **Endpoint** | `GET /workflows/submissions/:submissionId/history` |
| **Auth**     | ✅ Bearer Token (Authorization)                    |
| **Roles**    | Tất cả role (đã xác thực)                          |
| **Status**   | `200 OK`                                           |

### Path Parameters

| Tham số        | Kiểu     | Bắt buộc | Mô tả               |
| -------------- | -------- | -------- | ------------------- |
| `submissionId` | `string` | ✅       | UUID của submission |

### Query Parameters

| Tham số            | Kiểu     | Bắt buộc | Mặc định | Mô tả                                  |
| ------------------ | -------- | -------- | -------- | -------------------------------------- |
| `includeRevisions` | `string` | ❌       | `false`  | `"true"` để lấy toàn bộ revision chain |

### Response — Không có revision (200 OK)

```json
{
	"instanceId": "abc123-...",
	"currentStep": "pending_hr",
	"status": "ACTIVE",
	"workflowName": "Leave Request Workflow",
	"history": [
		{
			"id": "h1...",
			"instanceId": "abc123-...",
			"fromStep": null,
			"toStep": "pending_manager",
			"action": "SUBMIT",
			"actorId": "user1-...",
			"comment": null,
			"createdAt": "2026-05-12T08:00:00.000Z"
		},
		{
			"id": "h2...",
			"instanceId": "abc123-...",
			"fromStep": "pending_manager",
			"toStep": "pending_hr",
			"action": "approve",
			"actorId": "manager1-...",
			"actor": {
				"id": "manager1-...",
				"email": "manager@example.com",
				"name": "Nguyen Van A"
			},
			"comment": "Approved by manager",
			"createdAt": "2026-05-12T09:00:00.000Z"
		}
	]
}
```

### Response — Có revision chain (200 OK)

```json
{
  "revisionChain": ["sub-root-id", "sub-rev2-id", "sub-rev3-id"],
  "revisions": [
    {
      "submissionId": "sub-root-id",
      "revisionNumber": 1,
      "instanceId": "inst-1",
      "currentStep": "rejected",
      "status": "COMPLETED",
      "workflowName": "Leave Request Workflow",
      "history": [...]
    },
    {
      "submissionId": "sub-rev2-id",
      "revisionNumber": 2,
      "instanceId": "inst-2",
      "currentStep": "pending_hr",
      "status": "ACTIVE",
      "workflowName": "Leave Request Workflow",
      "history": [...]
    }
  ]
}
```

---

## 9. Các Action khả dụng (Available Actions)

Lấy danh sách action mà user hiện tại có thể thực hiện trên submission.

| Thuộc tính   | Giá trị                                                      |
| ------------ | ------------------------------------------------------------ |
| **Endpoint** | `GET /workflows/submissions/:submissionId/available-actions` |
| **Auth**     | ✅ Bearer Token (Authorization)                              |
| **Roles**    | Tất cả role (đã xác thực)                                    |
| **Status**   | `200 OK`                                                     |

### Response (200 OK)

```json
{
	"currentState": "pending_manager",
	"actions": [
		{
			"action": "approve",
			"targetState": "pending_hr",
			"requiresComment": false
		},
		{
			"action": "reject",
			"targetState": "rejected",
			"requiresComment": true
		}
	]
}
```

> **Lưu ý:** Nếu không tìm thấy workflow instance, trả về `{ "actions": [] }`.

---

## 10. Workflow Config Schema

### Cấu trúc WorkflowConfig

```json
{
	"states": ["pending_manager", "pending_hr", "approved", "rejected"],
	"initialState": "pending_manager",
	"finalStates": ["approved", "rejected"],
	"transitions": [
		{
			"from": "pending_manager",
			"to": "pending_hr",
			"action": "approve",
			"roles": ["MANAGER"],
			"conditions": { "requireComment": false }
		}
	]
}
```

| Trường         | Kiểu       | Bắt buộc | Mô tả                                       |
| -------------- | ---------- | -------- | ------------------------------------------- |
| `states`       | `string[]` | ✅       | Danh sách tất cả trạng thái                 |
| `initialState` | `string`   | ✅       | Trạng thái khởi tạo (phải nằm trong states) |
| `finalStates`  | `string[]` | ✅       | Trạng thái kết thúc (phải nằm trong states) |
| `transitions`  | `array`    | ✅       | Danh sách chuyển trạng thái                 |

### Cấu trúc Transition

| Trường       | Kiểu                     | Bắt buộc | Mô tả                               |
| ------------ | ------------------------ | -------- | ----------------------------------- |
| `from`       | `string` hoặc `string[]` | ✅       | State nguồn (`"*"` = tất cả states) |
| `to`         | `string`                 | ✅       | State đích (phải nằm trong states)  |
| `action`     | `string`                 | ✅       | Tên action                          |
| `roles`      | `string[]`               | ❌       | Roles được phép (trống = tất cả)    |
| `conditions` | `object`                 | ❌       | Điều kiện bổ sung                   |

### Validation Rules cho Config

| Rule                                         | Mô tả                               |
| -------------------------------------------- | ----------------------------------- |
| `states` phải có ít nhất 1 phần tử           | Danh sách states không được rỗng    |
| `initialState` phải nằm trong `states`       | State khởi tạo phải hợp lệ          |
| `finalStates` phải có ít nhất 1 phần tử      | Phải có state kết thúc              |
| Mỗi `finalState` phải nằm trong `states`     | State kết thúc phải hợp lệ          |
| `transitions` phải có ít nhất 1 phần tử      | Phải có ít nhất 1 chuyển trạng thái |
| `from` phải nằm trong `states` hoặc là `"*"` | State nguồn phải hợp lệ             |
| `to` phải nằm trong `states`                 | State đích phải hợp lệ              |
| Mỗi transition phải có `action`              | Action không được để trống          |

### Mapping State → Submission Status

| State chứa keyword   | SubmissionStatus |
| -------------------- | ---------------- |
| `cancel`             | `CANCELLED`      |
| `return`             | `RETURNED`       |
| `reject` (final)     | `REJECTED`       |
| Các final state khác | `APPROVED`       |
| Các state khác       | `UNDER_REVIEW`   |

---

## 11. Event System

Workflow module phát ra các event để tạo notification tự động.

### `workflow.state.changed`

Phát ra khi workflow chuyển trạng thái. Tạo notification `INFO` cho người gửi submission (nếu khác actor).

```json
{
	"submissionId": "...",
	"instanceId": "...",
	"fromState": "pending_manager",
	"toState": "pending_hr",
	"action": "approve",
	"actorId": "..."
}
```

### `workflow.completed`

Phát ra khi workflow đạt `finalState`. Tạo notification cho người gửi submission.

| Final State keyword | Notification Type | Title                        |
| ------------------- | ----------------- | ---------------------------- |
| `reject`            | `WARNING`         | Submission Rejected          |
| `cancel`            | `INFO`            | Submission Cancelled         |
| `return`            | `WARNING`         | Submission Returned for Edit |
| Khác                | `SUCCESS`         | Workflow Completed           |

### `workflow.resubmitted`

Phát ra khi tạo revision mới qua action `resubmit`. Tạo notification `INFO` cho actor.

---

## Data Model

```
┌──────────────────────────────────┐
│      WorkflowDefinition          │
├──────────────────────────────────┤
│ id        : UUID (PK)           │
│ name      : String              │
│ config    : JSON                │
│ formId    : String? (FK → Form) │
│ createdBy : String (FK → User)  │
│ createdAt : DateTime            │
│ updatedAt : DateTime            │
├──────────────────────────────────┤
│ Relations:                      │
│ ├── form      → Form?           │
│ ├── user      → User            │
│ └── instances → Instance[]      │
└──────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────┐
│       WorkflowInstance           │
├──────────────────────────────────┤
│ id           : UUID (PK)        │
│ definitionId : String (FK)      │
│ submissionId : String (FK)      │
│ currentStep  : String           │
│ status       : ACTIVE |         │
│                COMPLETED |      │
│                CANCELLED        │
│ createdAt    : DateTime         │
│ updatedAt    : DateTime         │
├──────────────────────────────────┤
│ Relations:                      │
│ ├── definition → Definition     │
│ ├── submission → Submission     │
│ └── histories  → History[]      │
└──────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────┐
│       WorkflowHistory            │
├──────────────────────────────────┤
│ id         : UUID (PK)          │
│ instanceId : String (FK)        │
│ fromStep   : String?            │
│ toStep     : String             │
│ action     : String             │
│ actorId    : String             │
│ comment    : String?            │
│ createdAt  : DateTime           │
└──────────────────────────────────┘
```

---

## Phân quyền (Authorization)

| Endpoint                                           | ADMIN | MANAGER | HR | USER |
| -------------------------------------------------- | ----- | ------- | -- | ---- |
| `POST /workflows/definitions`                      | ✅    | ✅      | ❌ | ❌   |
| `GET /workflows/definitions`                       | ✅    | ✅      | ❌ | ❌   |
| `GET /workflows/definitions/:id`                   | ✅    | ✅      | ❌ | ❌   |
| `PUT /workflows/definitions/:id`                   | ✅    | ✅      | ❌ | ❌   |
| `DELETE /workflows/definitions/:id`                | ✅    | ❌      | ❌ | ❌   |
| `POST /workflows/action`                           | ✅    | ✅      | ✅ | ✅   |
| `GET /workflows/pending`                           | ✅    | ✅      | ✅ | ✅   |
| `GET /workflows/submissions/:id/history`           | ✅    | ✅      | ✅ | ✅   |
| `GET /workflows/submissions/:id/available-actions` | ✅    | ✅      | ✅ | ✅   |

> **Lưu ý:** Endpoint `POST /workflows/action` kiểm tra quyền dựa trên `roles` trong transition config, không chỉ role-level guard.

---

## Ví dụ luồng hoàn chỉnh

```
User gửi Submission (POST /submissions)
    │
    ▼  Tự động tạo WorkflowInstance (initialState: "pending_manager")
    │
Manager approve (POST /workflows/action { action: "approve" })
    │  State: pending_manager → pending_hr
    │  Notification: INFO → User
    │
    ▼
Admin approve (POST /workflows/action { action: "approve" })
    │  State: pending_hr → approved (finalState)
    │  Status: COMPLETED
    │  Notification: SUCCESS → User
    │
    ▼  Submission status → APPROVED
```

```
Luồng Reject + Resubmit:

Manager reject (POST /workflows/action { action: "reject", comment: "..." })
    │  State: pending_manager → rejected (finalState)
    │  Notification: WARNING → User
    │
    ▼
User resubmit (POST /workflows/action { action: "resubmit", data: {...} })
    │  Tạo Submission mới (revisionNumber: 2)
    │  Tạo WorkflowInstance mới (initialState: "pending_manager")
    │  Notification: INFO → User
    │
    ▼  Tiếp tục luồng phê duyệt...
```

---

## Ghi chú

- Tất cả endpoint yêu cầu **Bearer Token** trong header `Authorization`.
- Workflow Definition sử dụng **Hard Delete** (xóa vĩnh viễn, không phải soft delete).
- Không thể xóa definition nếu còn instance đang **ACTIVE**.
- Khi `resubmit`, submission gốc được giữ nguyên, tạo submission mới với `parentSubmissionId` liên kết.
- **Event system** tự động gửi notification qua `EventEmitter2`.
- Tất cả các endpoint trả về lỗi validation sẽ có dạng:

```json
{
	"statusCode": 400,
	"message": ["validation error messages"],
	"error": "Bad Request"
}
```
