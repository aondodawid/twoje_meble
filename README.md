# Twoje Meble — Zadanie rekrutacyjne

Widok listy produktów ze szczegółami produktu w modalu. Zadanie testowe na stanowisko Front-end Developer.

**[→ Live demo](https://twoje-meble.pages.dev)**

---

## Zadanie

> Przygotuj widok listy produktów ze szczegółami produktu w modalu.

Wymagania:

- 16 produktów, 4 w rzędzie na desktopie
- Najechanie na zdjęcie pokazuje drugie zdjęcie produktu
- Karta produktu: nazwa, cena, zdjęcie
- Kliknięcie karty otwiera modal z wybranym produktem
- Modal: kod produktu (SKU), czas realizacji, galeria z min. 3 zdjęciami
- WCAG (dostępność)
- RWD (responsywność)
- Bez back-endu

---

## Stack

| Warstwa           | Technologia                      |
| ----------------- | -------------------------------- |
| Framework UI      | Vue 2.7                          |
| Style             | Tailwind CSS 3                   |
| Testy jednostkowe | Jest + Vue Test Utils            |
| Testy e2e / a11y  | Playwright + axe-core            |
| Wydajność         | Lighthouse CI                    |
| Cache / PWA       | Workbox (stale-while-revalidate) |
| Deploy            | Cloudflare Pages                 |

---

## Uruchomienie

```bash
npm install
npm run serve        # dev server → http://localhost:8080
```

Produkcyjny podgląd (z service workerem):

```bash
npm run serve:prod   # build + statyczny serwer → http://localhost:4173
```

---

## Testy

```bash
# Jednostkowe (Jest)
npm run test:unit

# E2e — layout, modal, hover, cache (Playwright)
npm run test:e2e

# Dostępność — axe-core (Playwright)
npm run test:a11y

# Matryca przeglądarek — Chromium, Firefox, WebKit
npm run test:browsers

# Lighthouse CI (wymaga buildu)
npm run test:lighthouse

# Wszystko naraz
npm run test:quality
```

---

## Decyzje projektowe

### Vue 2 zamiast Vue 3

Celowy wybór — zadanie nie wymaga Composition API ani dodatkowych możliwości Vue 3. Vue 2.7 daje pełną stabilność i należy do stack w firmie.

### Dane statyczne (JSON)

Produkty ładowane z `/data/products.json` — zgodnie z wymaganiem „bez back-endu". Plik walidowany przy starcie przez `validateProducts.js` (kontrakt: 16 produktów, min. 3 zdjęcia w galerii, unikalne SKU).

### Hover tylko na urządzeniach wskazujących

Zamiana zdjęcia na hover działa wyłącznie gdy `(hover: hover) and (pointer: fine)` — nie odpala się na ekranach dotykowych, gdzie hover jest emulowany i powoduje UX antipattern.

### Dostępność (WCAG AA)

- Modal: `role="dialog"`, `aria-modal`, `aria-labelledby`, focus trap (Tab / Shift+Tab), Escape zamyka i przywraca focus na element otwierający
- Slider: `aria-live="polite"` na liczniku slajdów, pełne `aria-label` na przyciskach
- Karty: `aria-haspopup="dialog"` na przycisku, opisowy `aria-label`

### Optymalizacja obrazów

- WebP + `srcset` (600w, 750w, full)
- `loading="lazy"` dla kart poniżej foldu
- `fetchpriority="high"` + `loading="eager"` dla pierwszych 4 kart (above the fold)

### Service Worker (Workbox)

Strategia stale-while-revalidate dla `products.json` i statycznych assetów — aplikacja działa offline po pierwszym załadowaniu.

---

## Uwaga o obrazach produktów

Projekt zawiera **4 produkty z prawdziwymi zdjęciami WebP** (Sofa Modena, Narożnik Sora, Fotel Lino, Ława Riva) i **12 produktów z placeholder'ami SVG** (living-_.svg, dining-_.svg).

Jest to celowe — w rzeczywistym projekcie zdjęcia pochodzą z backendowego CMS. W zadaniu demonstruję:

- ✅ Poprawną strukturę danych (`primaryImage`, `hoverImage`, `galleryImages`)
- ✅ Optymalizację obrazów (WebP, srcset, lazy loading)
- ✅ Działanie hover preview na WebP
- ✅ Responsywną galerię w modalu

**Aby zastąpić SVG prawdziwymi zdjęciami:**

1. Pobierz darmowe zdjęcia mebli z [Unsplash](https://unsplash.com/s/photos/furniture) lub [Pexels](https://www.pexels.com/search/furniture/)
2. Konwertuj na WebP: `cwebp input.jpg -o output.webp`
3. Wygeneruj warianty: `cwebp input.webp -resize 750 0 -o input-750w.webp`
4. Zaktualizuj `public/data/products.json`

Struktura danych jest gotowa — zmiana obrazów to tylko edycja ścieżek w JSON.

---

## Struktura projektu

```
src/
  components/
    ProductCard.vue      # karta produktu z hover swap
    ProductGrid.vue      # responsywna siatka (1/2/4 kolumny)
    ProductModal.vue     # modal z focus trapem
    ProductSlider.vue    # galeria z gestami touch
    states/
      LoadingState.vue
      ErrorState.vue
  views/
    ProductListView.vue  # orkiestracja: fetch, stan, modal
  utils/
    validateProducts.js  # walidacja kontraktu danych
    productSelectors.js  # czyste funkcje pomocnicze
public/
  data/products.json     # 16 produktów (dane statyczne)
tests/
  unit/                  # Jest
  e2e/                   # Playwright
  a11y/                  # axe-core
  browsers/              # matryca przeglądarek
```

---

## Wyniki Lighthouse

Ostatni pomiar (`npm run test:lighthouse`):

| Kategoria      | Wynik |
| -------------- | ----- |
| Performance    | 100   |
| Accessibility  | 100   |
| Best Practices | 100   |
| SEO            | 100   |
