# Kajie Saweria Netlify Webhook

Project ini adalah versi Netlify Functions untuk mengirim trigger Saweria/Rupiah ke Roblox Open Cloud MessagingService.

## Upload ke Netlify

1. Upload semua isi folder ini ke GitHub.
2. Di Netlify, pilih **Add new site > Import an existing project**.
3. Pilih repo GitHub.
4. Build command: `npm run build`.
5. Publish directory: `public`.
6. Functions directory otomatis dari `netlify.toml`: `netlify/functions`.

## Environment Variables

Isi di Netlify > Site configuration > Environment variables:

```env
ROBLOX_API_KEY=isi_api_key_roblox_open_cloud
ROBLOX_UNIVERSE_ID=isi_universe_id_game_kamu
ROBLOX_TOPIC=SaweriaDonation
WEBHOOK_SECRET=secret-webhook-kamu
ADMIN_PIN=pin-admin-kamu
DEFAULT_RECEIVER_NAME=SOUTHEAST EARTH
```

Setelah mengubah variables, lakukan **Clear cache and deploy site**.

## Endpoint

- Website test: `/`
- Manual trigger: `/trigger`
- Saweria webhook: `/api/saweria?secret=WEBHOOK_SECRET`
- Health: `/health`

## Test JSON

```bash
curl -X POST "https://DOMAIN.netlify.app/api/saweria?secret=WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"donorName":"SIKAJIEE","targetName":"SIKAJIEE","amount":50000,"message":"Test Netlify"}'
```
