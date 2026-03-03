# Movie Monorepo v4 (Fixed)

✅ Fixes included:
- MetaMask SIWE flow fixed (cookies/nonce + better error handling)
- Likes + Watchlist show real movie cards (web + mobile)
- Bigger, richer Movie Details page on web (hero layout + extra TMDB fields)
- Password register/login (no email sending)

## Run
```bash
pnpm install

cp apps/web/.env.example apps/web/.env.local
# set TMDB_API_KEY
pnpm db:migrate
pnpm dev:web
```

Mobile:
```bash
cp apps/mobile/.env.example apps/mobile/.env
# set EXPO_PUBLIC_TMDB_API_KEY and EXPO_PUBLIC_API_BASE_URL
pnpm dev:mobile
```
