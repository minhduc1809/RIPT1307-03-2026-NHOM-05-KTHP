# Forgot Password (OTP Flow) — UI Redesign Spec

Tài liệu mô tả đầy đủ luồng **Quên mật khẩu bằng mã OTP** để redesign UI.
Trang hiện tại: `src/pages/user/ForgotPassword/index.tsx` + `index.less` (route: `/user/forgot-password`).

## Tech constraints

| Hạng mục | Giá trị |
|---|---|
| Framework | React **17** (không dùng concurrent features / `createRoot`) |
| UI library | Ant Design **4** (không có `Input.OTP` — phải tự dựng ô nhập OTP) |
| Styling | CSS Modules qua `.less` (`styles from './index.less'`) |
| Routing | UmiJS 3 convention routing (`history`, `Link` từ `umi`) |
| Code style | Prettier: tabs, single quotes, 120 chars, semicolons |
| State | `useState` cục bộ trong page — không cần DVA/model |

## User flow — 4 bước trên CÙNG MỘT trang (wizard)

```
┌─────────────┐      ┌─────────────┐      ┌──────────────────┐      ┌─────────────┐
│ 1. EMAIL    │ ───▶ │ 2. OTP      │ ───▶ │ 3. PASSWORD      │ ───▶ │ 4. SUCCESS  │
│ nhập email  │      │ nhập 6 số   │      │ mật khẩu mới ×2  │      │ về đăng nhập│
└─────────────┘      └─────────────┘      └──────────────────┘      └─────────────┘
       ▲                   │ "Đổi email khác"
       └───────────────────┘ "Gửi lại mã" (ở lại bước 2)
```

State machine trong code: `type Step = 'email' | 'otp' | 'password' | 'success'`.

---

## Bước 1 — EMAIL

| Element | Chi tiết |
|---|---|
| Icon | `MailOutlined` trong vòng tròn gradient |
| Heading | "Quên mật khẩu?" |
| Subtext | "Nhập địa chỉ email của bạn và chúng tôi sẽ gửi mã xác thực (OTP) gồm 6 chữ số." |
| Input | email — placeholder "Nhập email của bạn", prefix `MailOutlined`, autoFocus |
| Validation | required ("Vui lòng nhập email!"), định dạng email ("Email không hợp lệ!") |
| CTA | "Gửi mã xác thực" (block, loading khi submit) |
| Link phụ | "← Quay lại Đăng nhập" → `/user/login` |

**Hành vi:** gọi `forgotPassword(email)`. Backend LUÔN trả 200 (chống user enumeration)
→ luôn chuyển sang bước 2, kể cả email không tồn tại. Riêng lỗi **429** thì hiện
warning "Bạn đã gửi quá nhiều yêu cầu..." và Ở LẠI bước 1.

## Bước 2 — OTP

| Element | Chi tiết |
|---|---|
| Icon | `SafetyOutlined` |
| Heading | "Nhập mã xác thực" |
| Subtext | "Chúng tôi đã gửi mã OTP gồm 6 chữ số tới **{email}**. Mã có hiệu lực trong **10 phút**." |
| Input | 6 chữ số — hiện tại là 1 ô `Input` (maxLength 6, căn giữa, letter-spacing 12, font 24). **Redesign gợi ý: 6 ô riêng biệt** (tự dựng — AntD 4 không có sẵn) |
| Input attrs | `inputMode="numeric"`, `autoComplete="one-time-code"` (mobile tự điền từ SMS/mail), autoFocus |
| Validation | required ("Vui lòng nhập mã OTP!"), pattern `^\d{6}$` ("Mã OTP gồm đúng 6 chữ số!") |
| CTA | "Xác nhận mã" |
| Link phụ | "Gửi lại mã" (gọi lại `forgotPassword(email)`, toast "Đã gửi lại mã OTP...") · "Đổi email khác" (→ bước 1) |

**Hành vi:** gọi `verifyResetOtp(email, otp)`:
- Thành công → lưu `resetToken` (từ `res.data.data.resetToken`) → bước 3
- 400 → "Mã OTP không đúng hoặc đã hết hạn. Vui lòng kiểm tra lại." (Ở LẠI bước 2)
- 429 → "Bạn đã thử quá nhiều lần. Vui lòng đợi một chút rồi thử lại."

**Gợi ý redesign:** đếm ngược 10:00 hết hạn OTP; disable "Gửi lại mã" trong ~60s
sau mỗi lần gửi (chống spam, khớp throttle backend 5 req/phút).

## Bước 3 — PASSWORD

| Element | Chi tiết |
|---|---|
| Icon | `LockOutlined` |
| Heading | "Đặt lại mật khẩu" |
| Subtext | "Mã xác thực hợp lệ. Nhập mật khẩu mới cho tài khoản của bạn (ít nhất 8 ký tự)." |
| Input 1 | `Input.Password` "Mật khẩu mới" — required, min 8 ("Mật khẩu phải có ít nhất 8 ký tự!"), autoFocus |
| Input 2 | `Input.Password` "Xác nhận mật khẩu" — required, validator khớp Input 1 ("Mật khẩu xác nhận không khớp!") |
| CTA | "Đặt lại mật khẩu" |

**Hành vi:** gọi `resetPassword(resetToken, newPassword)`:
- Thành công → bước 4
- 400/401 (token hết hạn 15 phút) → toast "Phiên đặt lại mật khẩu đã hết hạn. Vui lòng thực hiện lại từ đầu." → QUAY VỀ bước 1
- 429 → "Bạn đã thao tác quá nhanh..."

**Gợi ý redesign:** thanh đo độ mạnh mật khẩu (password strength meter).

## Bước 4 — SUCCESS

| Element | Chi tiết |
|---|---|
| Icon | `CheckCircleOutlined` xanh lá (#22c55e), animation popIn |
| Heading | "Đặt lại mật khẩu thành công!" |
| Subtext | "Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập bằng mật khẩu mới." |
| CTA | "Đăng nhập ngay" → `history.push('/user/login')` |

---

## API contract (đã có sẵn trong `src/services/base/authApi.ts`)

Mọi response bọc trong envelope: `{ success, statusCode, message, data }`.

### 1. `forgotPassword(email)` — POST `/auth/forgot-password`
```jsonc
// body
{ "email": "user@example.com" }
// 200 luôn luôn (kể cả email không tồn tại — chống dò tài khoản)
{ "success": true, "data": { "success": true, "message": "auth.FORGOT_PASSWORD_SENT" } }
```

### 2. `verifyResetOtp(email, otp)` — POST `/auth/verify-reset-otp`
```jsonc
// body
{ "email": "user@example.com", "otp": "123456" }
// 200 — OTP đúng, trả token dùng 1 lần (hiệu lực 15 phút)
{ "success": true, "data": { "success": true, "resetToken": "64-hex-chars..." } }
// 400 — sai hoặc hết hạn
{ "message": "Mã OTP không hợp lệ hoặc đã hết hạn." }
```

### 3. `resetPassword(resetToken, newPassword)` — POST `/auth/reset-password`
```jsonc
// body
{ "token": "<resetToken từ bước 2>", "newPassword": "NewPassword@123" }
// 200
{ "success": true, "data": { "success": true, "message": "auth.PASSWORD_RESET_SUCCESS" } }
// 400 — token hết hạn / đã dùng
```

### Ràng buộc backend cần thể hiện trên UI
- OTP: **6 chữ số**, hiệu lực **10 phút**, dùng **1 lần** (verify xong là vô hiệu)
- `resetToken`: hiệu lực **15 phút** sau khi verify OTP
- Throttle: **5 request/phút/endpoint** → mọi bước phải xử lý 429
- Đặt mật khẩu thành công sẽ revoke toàn bộ phiên đăng nhập cũ

---

## Design hiện tại (tham khảo / giữ consistency với trang Login)

- **Nền:** gradient động `#0f172a → #334155 → #6366f1 → #3b82f6` (animation 15s)
- **Card:** glassmorphism — `rgba(255,255,255,0.92)` + `backdrop-filter: blur(24px)`, radius 24px, max-width 480px, shadow `0 30px 60px rgba(0,0,0,0.2)`
- **Icon circle:** 72px, gradient `#6366f1 → #3b82f6`
- **Input:** radius 8, nền `#f8f9fa`, focus border `var(--primary-color)`
- **Button:** height 50, radius 8, hover nhấc lên `translateY(-2px)`
- **Màu chữ:** heading `#1a1a1a`, body `#64748b`, muted `#94a3b8`, success `#22c55e`
- **Primary color** từ env: `APP_CONFIG_PRIMARY_COLOR=#CC0D00` (CSS var `--primary-color`)
- **Responsive:** mobile ≤480px — padding card 36/20, radius 16
- **Animations:** card slideUp 0.5s, success popIn (cubic-bezier bounce), fadeIn giữa các bước

### CSS classes hiện có (`index.less`)
`container`, `content`, `card`, `iconWrapper`, `iconCircle`, `mainIcon`, `header`,
`form`, `customInput`, `prefixIcon`, `submitBtn`, `backLink`, `successContainer`,
`successIconWrapper`, `successIcon`, `successDescription`, `successNote`, `footerContainer`

## Ý tưởng redesign (tùy chọn)

1. **Steps indicator** trên đầu card (AntD `<Steps size="small">`: Email → OTP → Mật khẩu)
2. **6 ô OTP riêng biệt** auto-focus ô kế tiếp, hỗ trợ paste cả mã
3. **Đồng hồ đếm ngược** hết hạn OTP + cooldown 60s cho nút "Gửi lại mã"
4. **Password strength meter** ở bước 3
5. **Transition trượt ngang** giữa các bước thay vì thay nội dung tức thời
6. Giữ glassmorphism + gradient để đồng bộ trang Login/ResetPassword hiện có
