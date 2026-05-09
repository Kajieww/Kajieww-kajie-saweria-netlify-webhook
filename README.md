# Kajie Saweria Netlify Webhook FINAL

Versi final untuk Netlify Functions + Roblox Open Cloud Messaging API v2.

## Struktur root GitHub yang benar

Pastikan file/folder ini langsung berada di root repo:

```text
public/
netlify/
netlify.toml
package.json
README.md
.env.example
.gitignore
```

Jangan upload ZIP-nya. Upload isi hasil extract.

## Netlify Environment Variables

Isi di Netlify > Project configuration > Environment variables:

```env
ROBLOX_API_KEY=api_key_roblox_open_cloud_baru
ROBLOX_UNIVERSE_ID=10136898839
ROBLOX_TOPIC=SaweriaDonation
WEBHOOK_SECRET=saweria_webhook_KJw82Qx19Lm77PqA6z
ADMIN_PIN=123456
DEFAULT_RECEIVER_NAME=SOUTHEAST EARTH
```

Setelah ubah variable, lakukan:

```text
Deploys > Trigger deploy > Clear cache and deploy project
```

## Endpoint

```text
Website test: /
Manual trigger: /trigger
Saweria webhook: /api/saweria?secret=WEBHOOK_SECRET
Health: /health
```

## Tanda kode baru sudah aktif

Saat trigger berhasil, response harus memuat:

```json
"endpoint": "cloud-v2-publishMessage",
"topic": "SaweriaDonation",
"universeId": "10136898839"
```

Kalau marker itu tidak muncul, Netlify masih menjalankan kode lama atau repo/site yang diubah salah.

## Test Roblox

1. Pastikan receiver Roblox sudah ada dan subscribe `SaweriaDonation`.
2. File > Publish to Roblox.
3. Buka live/private server, bukan hanya Studio Play Solo.
4. Trigger dari Netlify.
5. F9 > Server harus muncul `MESSAGE RECEIVED`.
