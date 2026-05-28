# Realtime API Documentation

> Base URL: `ws://localhost:3000`

## Mục lục

- [1. Kết nối (Connection)](#1-kết-nối-connection)
- [2. Events Server Gửi Tới Client](#2-events-server-gửi-tới-client)

---

## 1. Kết nối (Connection)

Module sử dụng **Socket.IO** để quản lý các kết nối thời gian thực. Client cần truyền token xác thực khi kết nối.

| Thuộc tính    | Giá trị                                      |
| ------------- | -------------------------------------------- |
| **Namespace** | `/` (Mặc định)                               |
| **Auth**      | Yêu cầu JWT Token qua `auth` hoặc `headers`  |
| **Roles**     | Tất cả user đã xác thực                      |

### Cách truyền Token

**Cách 1: Truyền qua `auth.token`** (Khuyến nghị cho Socket.IO client)

```javascript
const socket = io('ws://localhost:3000', {
  auth: {
    token: '<accessToken>'
  }
});
```

**Cách 2: Truyền qua `headers`**

```javascript
const socket = io('ws://localhost:3000', {
  extraHeaders: {
    Authorization: 'Bearer <accessToken>'
  }
});
```

### Xử lý kết nối

- Khi kết nối thành công, Server sẽ tự động join user vào một **Room** có tên chính là `userId`. Việc này cho phép Server gửi thông báo riêng biệt đến từng người dùng cụ thể.
- Server phát event `connected` chứa `userId`.

---

## 2. Events Server Gửi Tới Client

Client cần lắng nghe (`socket.on()`) các sự kiện từ server.

### `connected`

Phát ngay sau khi kết nối và xác thực thành công.

- **Payload**:
  ```json
  {
    "userId": "uuid-cua-user",
    "status": "OK"
  }
  ```

### Các sự kiện khác (ví dụ: Notification)

Tùy thuộc vào các module khác (Notification, Workflow), server có thể gửi các sự kiện thông qua hàm `sendToUser` của Gateway.

Ví dụ, lắng nghe thông báo mới:

```javascript
socket.on('notification.new', (payload) => {
  console.log('Bạn có thông báo mới:', payload);
});
```
