import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '..', 'public');

const logoSvg = readFileSync(resolve(publicDir, 'logo-v2.svg'));

// Generate apple-touch-icon (180x180)
await sharp(logoSvg)
  .resize(180, 180)
  .png()
  .toFile(resolve(publicDir, 'apple-touch-icon-v2.png'));

// Generate icon-192 for manifest
await sharp(logoSvg)
  .resize(192, 192)
  .png()
  .toFile(resolve(publicDir, 'icon-192-v2.png'));

// Generate icon-512 for manifest
await sharp(logoSvg)
  .resize(512, 512)
  .png()
  .toFile(resolve(publicDir, 'icon-512-v2.png'));

// Generate og-image (1200x630) with logo centered
const ogWidth = 1200;
const ogHeight = 630;
const logoSize = 200;

const ogBackground = Buffer.from(
  `<svg width="${ogWidth}" height="${ogHeight}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${ogWidth}" height="${ogHeight}" fill="#0A0A0A"/>
    <text x="${ogWidth/2}" y="${ogHeight/2 + 80}" text-anchor="middle" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="48" font-weight="bold">BestRandom</text>
    <text x="${ogWidth/2}" y="${ogHeight/2 + 130}" text-anchor="middle" fill="#666666" font-family="system-ui, -apple-system, sans-serif" font-size="24">Fast, Seeded &amp; Shareable Random Generators</text>
  </svg>`
);

const logoResized = await sharp(logoSvg).resize(logoSize, logoSize).png().toBuffer();

await sharp(ogBackground)
  .composite([{
    input: logoResized,
    top: Math.round(ogHeight/2 - logoSize - 20),
    left: Math.round(ogWidth/2 - logoSize/2),
  }])
  .png()
  .toFile(resolve(publicDir, 'og-image-v2.png'));

console.log('All icons generated successfully!');
console.log('  - apple-touch-icon-v2.png (180x180)');
console.log('  - icon-192-v2.png (192x192)');
console.log('  - icon-512-v2.png (512x512)');
console.log('  - og-image-v2.png (1200x630)');
