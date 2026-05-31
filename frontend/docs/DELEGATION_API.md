# Delegation API Documentation

> Base URL: `http://localhost:3000`

## Mục lục

- [1. Tạo ủy quyền (Create)](#1-tạo-ủy-quyền-create)
- [2. Danh sách ủy quyền (List)](#2-danh-sách-ủy-quyền-list)
- [3. Chi tiết ủy quyền (Get by ID)](#3-chi-tiết-ủy-quyền-get-by-id)
- [4. Cập nhật ủy quyền (Update)](#4-cập-nhật-ủy-quyền-update)
- [5. Xóa ủy quyền (Delete)](#5-xóa-ủy-quyền-delete)

---

## 1. Tạo ủy quyền (Create)

Tạo một ủy quyền mới. ADMIN/MANAGER có thể tạo cho bất kỳ ai; USER chỉ được tạo cho chính mình (fromUserId = userId).

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `POST /delegations`                |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | Tất cả role đã xác thực            |
| **Status**   | `201 Created`                      |

### Request Body

```json
{
  "fromUserId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "toUserId": "e39da12b-58cc-4372-a567-0e02b2c3d479",
  "startDate": "2026-05-30T15:00:00.000Z",
  "endDate": "2026-06-30T15:00:00.000Z",
  "isActive": true,
  "formIds": [],
  "workflowDefinitionIds": []
}
```

| Trường                  | Kiểu       | Bắt buộc | Mô tả                                                       |
| ----------------------- | ---------- | -------- | ------------------------------------------------------------ |
| `fromUserId`            | `string`   | ✅       | UUID người ủy quyền                                         |
| `toUserId`              | `string`   | ✅       | UUID người được ủy quyền                                    |
| `startDate`             | `string`   | ✅       | ISO 8601 — Ngày bắt đầu ủy quyền                           |
| `endDate`               | `string`   | ✅       | ISO 8601 — Ngày kết thúc ủy quyền                           |
| `isActive`              | `boolean`  | ❌       | Trạng thái kích hoạt (mặc định `true`)                      |
| `formIds`               | `string[]` | ❌       | Giới hạn theo form IDs. Mảng rỗng = tất cả form             |
| `workflowDefinitionIds` | `string[]` | ❌       | Giới hạn theo workflow definition IDs. Mảng rỗng = tất cả   |

### Response (201 Created)

```json
{
  "id": "clxyz123...",
  "tenantId": "01b62aa1-27c1-4e40-8af3-da7b2046c164",
  "fromUserId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "toUserId": "e39da12b-58cc-4372-a567-0e02b2c3d479",
  "startDate": "2026-05-30T15:00:00.000Z",
  "endDate": "2026-06-30T15:00:00.000Z",
  "isActive": true,
  "formIds": [],
  "workflowDefinitionIds": [],
  "createdAt": "2026-05-31T03:00:00.000Z",
  "updatedAt": "2026-05-31T03:00:00.000Z"
}
```

### Lỗi

| Status | Mã lỗi                                    | Mô tả                                          |
| ------ | ------------------------------------------ | ----------------------------------------------- |
| `403`  | `delegation.NOT_ALLOWED`                   | USER không có quyền tạo ủy quyền cho người khác |
| `404`  | `delegation.USER_NOT_FOUND`                | fromUserId hoặc toUserId không tồn tại          |
| `400`  | `delegation.TENANT_MISMATCH`               | Hai user thuộc tenant khác nhau                  |
| `400`  | `delegation.INVALID_FORM_IDS`              | Một hoặc nhiều formId không hợp lệ              |
| `400`  | `delegation.INVALID_WORKFLOW_DEFINITION_IDS` | Một hoặc nhiều workflowDefinitionId không hợp lệ |

---

## 2. Danh sách ủy quyền (List)

Lấy danh sách ủy quyền có phân trang. ADMIN/MANAGER thấy tất cả; USER chỉ thấy ủy quyền liên quan đến mình.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `GET /delegations`                 |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | Tất cả role đã xác thực            |
| **Status**   | `200 OK`                           |

### Query Parameters

| Tham số | Kiểu     | Bắt buộc | Mặc định | Mô tả              |
| ------- | -------- | -------- | -------- | ------------------- |
| `page`  | `number` | ❌       | `1`      | Trang hiện tại      |
| `limit` | `number` | ❌       | `20`     | Số bản ghi mỗi trang |

### Response (200 OK)

```json
{
  "items": [
    {
      "id": "clxyz123...",
      "tenantId": "01b62aa1-...",
      "fromUserId": "f47ac10b-...",
      "toUserId": "e39da12b-...",
      "startDate": "2026-05-30T15:00:00.000Z",
      "endDate": "2026-06-30T15:00:00.000Z",
      "isActive": true,
      "formIds": [],
      "workflowDefinitionIds": [],
      "createdAt": "2026-05-31T03:00:00.000Z",
      "updatedAt": "2026-05-31T03:00:00.000Z",
      "fromUser": {
        "id": "f47ac10b-...",
        "email": "manager@example.com",
        "username": "manager",
        "role": "MANAGER"
      },
      "toUser": {
        "id": "e39da12b-...",
        "email": "staff@example.com",
        "username": "staff",
        "role": "USER"
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

## 3. Chi tiết ủy quyền (Get by ID)

Lấy chi tiết một ủy quyền theo ID. ADMIN/MANAGER thấy tất cả; USER chỉ thấy ủy quyền liên quan đến mình.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `GET /delegations/:id`             |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | Tất cả role đã xác thực            |
| **Status**   | `200 OK`                           |

### Lỗi

| Status | Mã lỗi                   | Mô tả                              |
| ------ | ------------------------- | ----------------------------------- |
| `404`  | `delegation.NOT_FOUND`    | Ủy quyền không tồn tại             |
| `403`  | `error.FORBIDDEN`         | Không có quyền xem ủy quyền này    |

---

## 4. Cập nhật ủy quyền (Update)

Cập nhật một ủy quyền. ADMIN/MANAGER cập nhật bất kỳ; USER chỉ cập nhật ủy quyền do mình tạo.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `PUT /delegations/:id`             |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | Tất cả role đã xác thực            |
| **Status**   | `200 OK`                           |

### Request Body

Tất cả trường đều optional (Partial of CreateDelegationDto):

```json
{
  "toUserId": "new-user-uuid",
  "startDate": "2026-06-01T00:00:00.000Z",
  "endDate": "2026-07-01T00:00:00.000Z",
  "isActive": false,
  "formIds": ["form-id-1", "form-id-2"],
  "workflowDefinitionIds": ["wf-def-id-1"]
}
```

### Lỗi

| Status | Mã lỗi                    | Mô tả                              |
| ------ | -------------------------- | ----------------------------------- |
| `404`  | `delegation.NOT_FOUND`     | Ủy quyền không tồn tại             |
| `403`  | `delegation.NOT_ALLOWED`   | Không có quyền cập nhật ủy quyền   |

---

## 5. Xóa ủy quyền (Delete)

Xóa một ủy quyền. ADMIN/MANAGER xóa bất kỳ; USER chỉ xóa ủy quyền do mình tạo.

| Thuộc tính   | Giá trị                            |
| ------------ | ---------------------------------- |
| **Endpoint** | `DELETE /delegations/:id`          |
| **Auth**     | ✅ Bearer Token (Authorization)    |
| **Roles**    | Tất cả role đã xác thực            |
| **Status**   | `200 OK`                           |

### Lỗi

| Status | Mã lỗi                    | Mô tả                              |
| ------ | -------------------------- | ----------------------------------- |
| `404`  | `delegation.NOT_FOUND`     | Ủy quyền không tồn tại             |
| `403`  | `delegation.NOT_ALLOWED`   | Không có quyền xóa ủy quyền        |

---

## Ghi chú

- **Phạm vi ủy quyền (Scoping):** `formIds` và `workflowDefinitionIds` cho phép giới hạn ủy quyền cho các form/workflow cụ thể. Nếu để mảng rỗng `[]`, ủy quyền áp dụng cho tất cả.
- **Validation:** Hệ thống kiểm tra `formIds` và `workflowDefinitionIds` tồn tại trong cùng tenant trước khi tạo delegation.
- **Multi-tenant:** Hai user phải thuộc cùng một tenant mới được tạo ủy quyền.
