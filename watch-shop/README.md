# WatchShop — Soatlar do'koni (Next.js + MongoDB)

## 1. O'rnatish

```bash
cd watch-shop
npm install
```

## 2. Muhit o'zgaruvchilari (`.env.local`)

Fayl allaqachon tayyor, lekin production'ga chiqarishdan oldin quyidagilarni
albatta o'zgartiring:

```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.dn2zyps.mongodb.net/watch-shop
ADMIN_USERNAME=admin
ADMIN_PASSWORD=kuchli_parol_qoying
JWT_SECRET=uzun_tasodifiy_maxfiy_satr
```

> **Eslatma:** MongoDB Atlas'da "Network Access" bo'limida serveringiz IP
> manzili (yoki `0.0.0.0/0` — faqat test uchun) ruxsat etilgan bo'lishi kerak,
> aks holda ulanish xatoligi chiqadi.

## 3. Ishga tushirish

```bash
npm run dev
```

Sayt: http://localhost:3000
Admin panel: http://localhost:3000/admin/login (login/parol `.env.local`da)

## 4. Loyiha tuzilishi

```
app/
  page.js                     -> Bosh sahifa (katalog)
  product/[id]/page.js        -> Mahsulot tafsilotlari
  admin/
    login/page.js             -> Admin login
    page.js                   -> Buyurtmalar (dashboard)
    products/page.js          -> Mahsulotlar ro'yxati
    products/new/page.js      -> Yangi mahsulot qo'shish
    products/[id]/edit/page.js-> Mahsulotni tahrirlash
  api/
    products/route.js         -> GET (ro'yxat), POST (yaratish)
    products/[id]/route.js    -> GET, PUT, DELETE
    orders/route.js           -> GET (admin), POST (mijoz)
    orders/[id]/route.js      -> PUT (status), DELETE
    auth/login/route.js       -> Admin login/logout (JWT cookie)
models/
  Product.js                  -> Mongoose sxema
  Order.js                    -> Mongoose sxema
components/                   -> Qayta ishlatiladigan UI qismlari
lib/
  dbConnect.js                -> MongoDB ulanish (cache bilan)
  auth.js                     -> JWT yordamchi funksiyalar
middleware.js                 -> /admin/* sahifalarini himoya qiladi
```

## 5. Rasmlarni saqlash haqida

Hozirgi holatda rasmlar **base64** formatda to'g'ridan-to'g'ri MongoDB
hujjatiga saqlanadi (`ProductForm.jsx` ichidagi `fileToBase64`). Bu eng
oddiy yechim va qo'shimcha xizmat talab qilmaydi, lekin:

- Har bir rasm hujjat hajmini oshiradi (MongoDB hujjat limiti — 16MB).
- Katta trafikli loyiha uchun **Cloudinary**ga o'tish tavsiya etiladi.

### Cloudinary'ga o'tish uchun (ixtiyoriy keyingi qadam)

1. `npm install cloudinary` yoki `next-cloudinary`.
2. `.env.local`ga `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
   `CLOUDINARY_API_SECRET` qo'shing.
3. `ProductForm.jsx`dagi `fileToBase64` chaqiruvi o'rniga faylni
   `/api/upload` (yangi route) orqali Cloudinary'ga yuborib, qaytgan
   `secure_url`ni `images` massiviga qo'shing. Qolgan barcha kod
   (Product modeli, kartochkalar, galereya) o'zgarishsiz ishlayveradi,
   chunki ular shunchaki `images: string[]` bilan ishlaydi (URL ham,
   base64 ham — farqi yo'q).

## 6. Muhim eslatmalar

- **Body hajmi:** Route handler'lar (App Router API) katta base64
  ma'lumotlarni qabul qiladi, lekin Vercel kabi platformalarda serverless
  funksiya so'rov hajmi cheklovi (odatda ~4.5MB) bo'lishi mumkin. Agar
  ko'p/katta rasmlar yuklasangiz, Cloudinary'ga o'tish tavsiya etiladi.
- **middleware.js** JWT tekshiruvi uchun `jsonwebtoken` ishlatadi. Agar
  Next.js Edge Runtime bilan muammo chiqsa, faylga
  `export const runtime = "nodejs";` qatorini qo'shing.
- Admin autentifikatsiyasi oddiy (`.env`dagi login/parol solishtirish)
  qilib qurilgan — production uchun parolni bcrypt bilan hash qilib
  saqlashni tavsiya qilamiz (`bcryptjs` paketi allaqachon package.json'da).

## 7. Vercel'ga joylashtirish

> **Muhim izoh:** Bu loyiha alohida `.html` fayllardan iborat emas — bu
> **Next.js** ilovasi. Sahifalar `app/` papkasidagi `.js`/`.jsx` fayllarda
> yoziladi va Next.js ularni build paytida avtomatik HTML'ga aylantiradi.
> Shuning uchun loyihada tayyor `.html` fayl qidirmang — Vercel ularni
> build jarayonida o'zi generatsiya qiladi.

### Usul A — GitHub orqali (tavsiya etiladi)

1. Loyihani GitHub'ga yuklang:
   ```bash
   cd watch-shop
   git init
   git add .
   git commit -m "Watch shop - birinchi versiya"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```
   (`.env.local` `.gitignore`da bo'lgani uchun GitHub'ga **yuklanmaydi** —
   bu to'g'ri, chunki u maxfiy ma'lumot.)
2. https://vercel.com → **Add New Project** → GitHub repo'ingizni tanlang.
3. Vercel avtomatik "Next.js" frameworkini aniqlaydi, hech narsani
   o'zgartirmasdan davom eting.
4. **Environment Variables** bo'limida quyidagilarni qo'shing (aynan
   `.env.local`dagi kabi, lekin haqiqiy/xavfsiz qiymatlar bilan):
   - `MONGODB_URI`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
5. **Deploy** tugmasini bosing. 1-2 daqiqada sayt tayyor bo'ladi va sizga
   `https://loyiha-nomi.vercel.app` manzili beriladi.

### Usul B — Vercel CLI orqali (GitHub'siz)

```bash
npm install -g vercel
cd watch-shop
vercel login
vercel          # birinchi marta so'raladigan savollarga javob bering
vercel env add MONGODB_URI
vercel env add ADMIN_USERNAME
vercel env add ADMIN_PASSWORD
vercel env add JWT_SECRET
vercel --prod   # asosiy (production) domenga joylash
```

### MongoDB Atlas sozlamasi (deploy'dan oldin tekshiring)

Atlas panelida **Network Access** bo'limiga kirib, `0.0.0.0/0` (barcha IP'lar)
qo'shilganiga ishonch hosil qiling — aks holda Vercel serverlari bazaga
ulana olmaydi (chunki Vercel'ning IP manzili doim o'zgarib turadi).

### Build haqida eslatma

`npm audit` ba'zi Next.js versiyalari bo'yicha ogohlantirish chiqarishi
mumkin — bu asosan Edge/Server Actions kabi bu loyihada ishlatilmagan
funksiyalarga tegishli va amaliy xavf tug'dirmaydi. Loyiha `npm run build`
orqali muvaffaqiyatli tekshirilgan va tayyor.

## 8. Namuna ma'lumot qo'shish

Loyihani ishga tushirgach, `/admin/products/new` orqali birinchi soatni
qo'lda qo'shing — bosh sahifada avtomatik ko'rinadi.
