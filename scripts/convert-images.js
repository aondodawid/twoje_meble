#!/usr/bin/env node

/**
 * images:convert
 * Konwertuje JPG'a na WebP, generuje warianty responsive'owe
 * i aktualizuje products.json
 *
 * Użycie:
 *   node scripts/convert-images.js
 *
 * Wymaga:
 *   npm install sharp
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const IMAGES_DIR = path.join(__dirname, "../public/assets/images/products");
const PRODUCTS_FILE = path.join(__dirname, "../public/data/products.json");

// Mapowanie JPG → ID produktu i opisy
const IMAGE_MAPPINGS = {
  bergen: {
    productId: "komoda-bergen",
    alts: [
      "Komoda Bergen w drewnianym wybarwieniu",
      "Komoda Bergen widok z boku",
      "Komoda Bergen detale rączek",
    ],
  },
  lumo: {
    productId: "witryna-lumo",
    alts: [
      "Witryna Lumo z oświetleniem LED",
      "Witryna Lumo widok frontalny",
      "Witryna Lumo zamknięte drzwi",
    ],
  },
  alto: {
    productId: "stol-alto",
    alts: [
      "Stół Alto w jadalni",
      "Stół Alto widok z góry",
      "Stół Alto wysunięta blacha",
    ],
  },
  fiore: {
    productId: "krzeslo-fiore",
    alts: [
      "Krzesło Fiore przy stole",
      "Krzesło Fiore profil",
      "Krzesło Fiore szczegół siedziska",
    ],
  },
  sento: {
    productId: "szafka-sento",
    alts: [
      "Szafka Sento w salonie",
      "Szafka Sento zboczne półki",
      "Szafka Sento otwarte drzwi",
    ],
  },
  tolo: {
    productId: "regal-tolo",
    alts: [
      "Regał Tolo z książkami",
      "Regał Tolo konstrukcja drewniana",
      "Regał Tolo aranżacja wnętrza",
    ],
  },
  porto: {
    productId: "lawa-porto",
    alts: [
      "Ława Porto w salonie",
      "Ława Porto widok z góry",
      "Ława Porto przy sofie",
    ],
  },
  vena: {
    productId: "sofa-vena",
    alts: [
      "Sofa Vena z poduszkami",
      "Sofa Vena szeroki kadr",
      "Sofa Vena detale tkaniny",
    ],
  },
  milo: {
    productId: "fotel-milo",
    alts: [
      "Fotel Milo w kącie pokoju",
      "Fotel Milo widok z boku",
      "Fotel Milo struktura drewniana",
    ],
  },
  domo: {
    productId: "stol-domo",
    alts: [
      "Stół Domo minimalistyczny",
      "Stół Domo blat biały",
      "Stół Domo nogi metalowe",
    ],
  },
  runo: {
    productId: "komoda-runo",
    alts: [
      "Komoda Runo nowoczesna",
      "Komoda Runo uchwyty drewniane",
      "Komoda Runo szuflady",
    ],
  },
  tika: {
    productId: "krzeslo-tika",
    alts: [
      "Krzesło Tika nowoczesne",
      "Krzesło Tika profil",
      "Krzesło Tika detale siedziska",
    ],
  },
};

async function convertImage(imagePath) {
  // Usuń rozszerzenie (.jpg, .png, itp.)
  let filename = path.basename(imagePath).replace(/\.[^.]+$/, "");
  const basename = filename.replace(/[0-9]+$/, ""); // np. "alto1" → "alto"

  if (!IMAGE_MAPPINGS[basename]) {
    console.warn(`⚠️  Pominięto ${filename} — nieznany produkt`);
    return null;
  }

  const mapping = IMAGE_MAPPINGS[basename];
  const number = filename.match(/(\d)$/)?.[1] || "1";

  console.log(`📸 Konwertowanie: ${filename} → WebP warianty...`);

  try {
    // Zmiana rozmiaru dla wariantów
    const variants = [
      { suffix: "", width: null }, // Full size
      { suffix: "-750w", width: 750 },
      { suffix: "-600w", width: 600 },
    ];

    for (const variant of variants) {
      let pipeline = sharp(imagePath);

      if (variant.width) {
        pipeline = pipeline.resize(variant.width, variant.width, {
          fit: "cover",
          position: "center",
        });
      }

      const outPath = path.join(
        IMAGES_DIR,
        basename,
        `${basename}${number}${variant.suffix}.webp`,
      );

      await pipeline.webp({ quality: 80 }).toFile(outPath);
      console.log(`  ✅ ${path.basename(outPath)}`);
    }

    return {
      basename,
      number: parseInt(number),
      productId: mapping.productId,
      alt: mapping.alts[parseInt(number) - 1] || `Zdjęcie ${number}`,
    };
  } catch (err) {
    console.error(`❌ Błąd przy ${filename}:`, err.message);
    return null;
  }
}

async function updateProducts(imageData) {
  console.log("\n📝 Aktualizowanie products.json...\n");

  const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf8"));

  // Grupuj dane po ID produktu
  const imagesByProduct = {};
  for (const img of imageData) {
    if (!imagesByProduct[img.productId]) {
      imagesByProduct[img.productId] = [];
    }
    imagesByProduct[img.productId].push(img);
  }

  // Aktualizuj każdy produkt
  for (const product of products) {
    if (!imagesByProduct[product.id]) continue;

    const images = imagesByProduct[product.id].sort(
      (a, b) => a.number - b.number,
    );
    console.log(`  📦 ${product.name}`);

    // Ustaw primaryImage (pierwsze zdjęcie)
    const primary = images[0];
    product.primaryImage = {
      src: `/assets/images/products/${primary.basename}/${primary.basename}${primary.number}.webp`,
      alt: primary.alt,
    };

    // Ustaw hoverImage (drugie zdjęcie, jeśli istnieje)
    if (images[1]) {
      const hover = images[1];
      product.hoverImage = {
        src: `/assets/images/products/${hover.basename}/${hover.basename}${hover.number}.webp`,
        alt: hover.alt,
      };
    }

    // Ustaw galleryImages (wszystkie - zdjęcie 1, 2, 3)
    product.galleryImages = images.map((img) => ({
      src: `/assets/images/products/${img.basename}/${img.basename}${img.number}.webp`,
      alt: img.alt,
    }));

    console.log(
      `    - primaryImage: ${primary.basename}${primary.number}.webp`,
    );
    if (images[1]) {
      console.log(
        `    - hoverImage: ${images[1].basename}${images[1].number}.webp`,
      );
    }
    console.log(`    - galeria: ${images.length} zdjęcia`);
  }

  // Zapis
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2) + "\n");
  console.log("\n✅ products.json zaktualizowany");
}

async function main() {
  console.log("🖼️  Konwersja JPG/PNG na WebP + aktualizacja products.json\n");

  // Znajdź wszystkie JPG i PNG pliki
  const imageFiles = fs
    .readdirSync(IMAGES_DIR)
    .filter((f) => f.endsWith(".jpg") || f.endsWith(".png"))
    .map((f) => path.join(IMAGES_DIR, f));

  if (imageFiles.length === 0) {
    console.log(`❌ Nie znaleziono JPG lub PNG w ${IMAGES_DIR}`);
    console.log(
      "📋 Pobierz zdjęcia z Unsplash wg instrukcji w IMAGES-GUIDE.md",
    );
    process.exit(1);
  }

  console.log(`Znaleziono ${imageFiles.length} plików JPG/PNG\n`);

  // Konwertuj każdy plik
  const imageData = [];
  for (const imagePath of imageFiles) {
    const data = await convertImage(imagePath);
    if (data) imageData.push(data);
  }

  if (imageData.length === 0) {
    console.error("❌ Konwersja nie powiodła się");
    process.exit(1);
  }

  // Aktualizuj JSON
  await updateProducts(imageData);

  console.log("\n🎉 Gotowe!");
  console.log("   Pliki WebP wygenerowane w public/assets/images/products/");
  console.log("   Plik zaktualizowany: public/data/products.json");
  console.log("\n💡 Następnie uruchom: npm run build && npm run serve:prod");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
