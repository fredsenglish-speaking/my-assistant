# My Assistant (Vercel)

Şəxsi AI köməkçi: gündəlik cədvəl, büdcə, sağlamlıq və kalori paneli, aktivlik, şəxsi inkişaf, tıxac analitikası. Bütün cavablar Azərbaycan dilindədir.

## Vercel-də yayımlamaq
1. vercel.com → Add New → Project → bu repozitoriyanı seçin → Framework: Other → Deploy.
2. Project → Settings → Environment Variables: `ANTHROPIC_API_KEY` = console.anthropic.com-dan alınan açar. Sonra Redeploy.
3. İstəyə görə `ANTHROPIC_MODEL` (default: `claude-haiku-5-5`).

## Qeydlər
- Profil, cədvəl, kalori və aktivlik qeydləri hər istifadəçinin öz telefonunda saxlanılır.
- AI sorğuları `api/ask.js` vasitəsilə gedir, API açarı serverdə qalır.
- iPhone: Safari → Paylaş → "Ana ekrana əlavə et" — ikon avtomatik My Assistant loqosu olur.
