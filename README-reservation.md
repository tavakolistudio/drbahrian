# سیستم رزرو نوبت — دکتر مریم بهریان

## معماری کلی

```
/reserve          → فرم رزرو عمومی (4 مرحله)
/reserve/success  → تأیید ثبت درخواست
/reserve/unavailable → وقت پر شده
/admin            → داشبورد (نیاز به لاگین)
/admin/login      → ورود ادمین
/admin/appointments        → لیست همه نوبت‌ها
/admin/appointments/pending → نوبت‌های منتظر بررسی
/admin/appointments/[id]   → جزئیات + تأیید/رد
/admin/calendar   → نمای تقویم
/admin/availability → مدیریت وقت‌های خالی
/admin/settings   → تنظیمات سیستم
```

**API routes:**
```
POST /api/reserve              → ثبت درخواست (عمومی، rate-limited)
GET  /api/slots                → وقت‌های خالی (عمومی)
POST /api/admin/auth/login     → ورود ادمین
POST /api/admin/auth/logout    → خروج
GET/PATCH /api/admin/appointments      → لیست + فیلتر
GET/PATCH /api/admin/appointments/[id] → جزئیات + اقدام
GET/POST  /api/admin/slots             → مدیریت وقت‌ها
PATCH/DELETE /api/admin/slots/[id]     → آپدیت وقت
GET/PATCH /api/admin/settings          → تنظیمات
GET /api/admin/export                  → CSV export
```

---

## پیش‌نیازها

- Node.js 18+
- PostgreSQL (پیشنهاد: Supabase یا Neon.tech برای رایگان)
- npm یا pnpm

---

## نصب و راه‌اندازی

### 1. کلون و نصب وابستگی‌ها

```bash
npm install
```

### 2. تنظیم متغیرهای محیطی

فایل `.env.local` بسازید (از `.env.example` کپی کنید):

```bash
cp .env.example .env.local
```

سپس مقادیر زیر را پر کنید:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"

# یک رشته تصادفی طولانی (حداقل 32 کاراکتر)
ADMIN_JWT_SECRET="your-super-secret-key-minimum-32-chars"

# مدت اعتبار توکن ادمین (روز)
ADMIN_TOKEN_EXPIRY_DAYS=7

# آدرس سایت
NEXT_PUBLIC_APP_URL="https://drbahrian.vercel.app"
```

### 3. ایجاد جداول پایگاه داده

```bash
npm run db:generate   # تولید Prisma Client
npm run db:push       # ایجاد جداول (برای محیط dev)
```

برای production:
```bash
npm run db:migrate    # اجرای migration‌های Prisma
```

### 4. ایجاد حساب ادمین

```bash
ADMIN_EMAIL="doctor@example.com" \
ADMIN_PASSWORD="YourStrongPassword123" \
ADMIN_NAME="دکتر مریم بهریان" \
npm run db:seed
```

یا روی Windows:
```powershell
$env:ADMIN_EMAIL="doctor@example.com"
$env:ADMIN_PASSWORD="YourStrongPassword123"
$env:ADMIN_NAME="دکتر مریم بهریان"
npm run db:seed
```

### 5. اجرای سرور توسعه

```bash
npm run dev
```

---

## استقرار روی Vercel

### متغیرهای محیطی Vercel

در Vercel → Project → Settings → Environment Variables اضافه کنید:

| نام | توضیح |
|-----|-------|
| `DATABASE_URL` | رشته اتصال PostgreSQL |
| `ADMIN_JWT_SECRET` | کلید رمزنگاری JWT |
| `ADMIN_TOKEN_EXPIRY_DAYS` | مدت اعتبار توکن (پیش‌فرض: 7) |
| `NEXT_PUBLIC_APP_URL` | آدرس کامل سایت |

### پس از استقرار

```bash
# ایجاد جداول
npx prisma migrate deploy

# ایجاد ادمین (یک‌بار)
ADMIN_EMAIL="..." ADMIN_PASSWORD="..." ADMIN_NAME="..." npm run db:seed
```

---

## گردش کار سیستم

### مراجع (کلاینت)
1. `/reserve` → انتخاب نوع جلسه (آنلاین/حضوری)
2. → انتخاب کشور و منطقه زمانی
3. → انتخاب تاریخ و ساعت (وقت‌های خالی از DB)
4. → پر کردن فرم اطلاعات تماس
5. → ثبت درخواست → Slot به PENDING تبدیل می‌شود
6. → صفحه موفقیت یا عدم دسترسی (در صورت race condition)

### دکتر (ادمین)
1. `/admin/login` → ورود با ایمیل و رمز
2. `/admin/appointments/pending` → مشاهده درخواست‌های جدید
3. → تأیید: Slot → CONFIRMED، درخواست → CONFIRMED
4. → رد: Slot → AVAILABLE (برای رزرو مجدد)، درخواست → REJECTED
5. `/admin/availability` → اضافه کردن وقت‌های خالی جدید
6. `/admin/settings` → تنظیم مدت جلسه، مهلت تأیید و غیره

---

## وضعیت‌های Slot

```
AVAILABLE → PENDING → CONFIRMED  (تأیید شده)
                  ↘ AVAILABLE    (رد شده → وقت آزاد می‌شود)
AVAILABLE → LOCKED               (قفل شده توسط ادمین)
CONFIRMED → AVAILABLE            (لغو شده)
```

---

## امنیت

- JWT در HttpOnly cookie (غیرقابل دسترسی از JavaScript)
- Rate limiting: 3 درخواست در 10 دقیقه از هر IP
- Prisma transaction برای جلوگیری از رزرو دوگانه (race condition)
- هیچ‌وقت یادداشت ادمین یا اطلاعات مراجعین دیگر در API عمومی قرار نمی‌گیرد
- اعتبارسنجی Zod در هر endpoint

---

## متغیرهای محیطی مورد نیاز برای seed

```
ADMIN_EMAIL      - ایمیل حساب ادمین
ADMIN_PASSWORD   - رمز عبور (حداقل 6 کاراکتر)
ADMIN_NAME       - نام نمایشی
```

---

## توسعه محلی با Supabase

1. حساب رایگان در [supabase.com](https://supabase.com) بسازید
2. پروژه جدید → Settings → Database → Connection string (Transaction mode)
3. رشته را در `DATABASE_URL` قرار دهید
4. `npm run db:push` برای ایجاد جداول
