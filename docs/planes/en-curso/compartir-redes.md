# Plan — Req. #27: Compartir productos en redes (frontend)

Sin cambios en el backend: usa `GET /api/hotel/findDetailById/{id}` (público).

## Estado

| Bloque | Estado | Contenido |
|---|---|---|
| A | ✅ 2026-11-04 | `ShareModal` + botón "Compartir" del detalle |
| B | ⏳ | Revisión visual en el navegador |

Detalle de lo hecho → `docs/BITACORA.md`.

---

## Bloque A

- [x] Modal con vista previa (imagen, nombre, ciudad, descripción breve) y enlace al producto
- [x] Mensaje personalizado editable (280 caracteres)
- [x] Facebook, X, WhatsApp, Telegram, Instagram (copiar + abrir) y "Más opciones" (`navigator.share`)
- [x] Copiar enlace con aviso; si el portapapeles falla se selecciona el input
- [x] `npm run build` OK · `npm run lint` = 13

## Bloque B

- [ ] `/hoteles/1` → Compartir: vista previa, mensaje editable, cada red abre su pestaña con el texto/URL
- [ ] Copiar enlace → "¡Copiado!"; Instagram → copia y abre instagram.com
- [ ] Esc, clic afuera y la X cierran
- [ ] 375 px: pantalla completa, grilla de 2 columnas
