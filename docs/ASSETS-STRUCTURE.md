# 📁 Struktura Assets — Obrazy

## Nowa organizacja (od 2026-03-22)

Obrazy produktów zostały reorganizowane z płaskiej struktury na hierarchiczną, siedząc w oddzielnych folderach dla każdego produktu.

### Przed
```
public/assets/images/
├── alto1.webp
├── alto1-600w.webp
├── alto1-750w.webp
├── alto2.webp
├── alto2-600w.webp
├── alto2-750w.webp
```

### Teraz
```
public/assets/images/
└── products/
    ├── alto/
    │   ├── alto1.webp
    │   ├── alto1-600w.webp
    │   ├── alto1-750w.webp
    │   ├── alto2.webp
    │   ├── alto2-600w.webp
    │   └── alto2-750w.webp
    ├── bergen/
    ├── domo/
    ├── fiore/
    ├── lumo/
    ├── milo/
    ├── porto/
    ├── runo/
    ├── sento/
    ├── tika/
    ├── tolo/
    ├── vena/
    └── svgs/
        ├── living-1.svg
        ├── living-2.svg
        ├── dining-1.svg
        └── ...
```

## Korzyści

✅ **Lepsze skalowanie** — łatwo dodawać nowe warianty dla każdego produktu
✅ **Łatwiejsze utrzymanie** — plik produktu w jednym miejscu
✅ **Jasna hierarchia** — produkt → jego warianty
✅ **Przygotowanie na przyszłość** — folder `svgs/` na grafiki kategorii

## Zaktualizowane pliki

- ✅ `scripts/convert-images.js` — nowe ścieżki outputu
- ✅ `public/data/products.json` — zaktualizowane linki dla 12 produktów
- ✅ struktury folderów tworzone automatycznie

## Generowanie obrazów

Skrypt `convert-images.js` automatycznie:
- Konwertuje JPG/PNG → WebP
- Generuje warianty responsive'owe (-750w, -600w)
- Organizuje w `products/{basename}/`
- Aktualizuje `products.json` nowymi ścieżkami

```bash
node scripts/convert-images.js
```
