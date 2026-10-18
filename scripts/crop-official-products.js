const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const sourceImage = 'C:/Users/NB LAPTOP/.gemini/antigravity/brain/e76c2bd3-79b6-46e9-8c27-15ec830eb40c/.user_uploaded/media_1792308989462_0eb2a910.jpg';
const outputDir = path.join(__dirname, '../public/products');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const productsToCrop = [
  {
    name: 'red-chili-powder',
    rect: { left: 16, top: 160, width: 84, height: 154 }
  },
  {
    name: 'turmeric-powder',
    rect: { left: 182, top: 160, width: 84, height: 154 }
  },
  {
    name: 'special-garam-masala',
    rect: { left: 518, top: 160, width: 84, height: 154 }
  },
  {
    name: 'california-almonds',
    rect: { left: 694, top: 160, width: 84, height: 154 }
  },
  {
    name: 'royal-pistachios',
    rect: { left: 844, top: 160, width: 84, height: 154 }
  },
  {
    name: 'mixed-dry-fruits',
    rect: { left: 844, top: 160, width: 84, height: 154 }
  },
  {
    name: 'ajwa-dates',
    rect: { left: 14, top: 395, width: 142, height: 170 }
  },
  {
    name: 'sidr-honey',
    rect: { left: 254, top: 395, width: 90, height: 170 }
  },
  {
    name: 'desi-cow-ghee',
    rect: { left: 448, top: 395, width: 100, height: 170 }
  },
  {
    name: 'masoor-dal',
    rect: { left: 654, top: 395, width: 92, height: 170 }
  },
  {
    name: 'basmati-rice',
    rect: { left: 818, top: 395, width: 96, height: 170 }
  },
  {
    name: 'green-tea',
    rect: { left: 20, top: 640, width: 82, height: 145 }
  },
  {
    name: 'mustard-oil',
    rect: { left: 184, top: 640, width: 88, height: 145 }
  },
  {
    name: 'ramadan-gift-box',
    rect: { left: 350, top: 635, width: 140, height: 165 }
  },
  {
    name: 'eid-hamper',
    rect: { left: 490, top: 635, width: 85, height: 165 }
  },
  {
    name: 'family-combo-pack',
    rect: { left: 675, top: 635, width: 170, height: 165 }
  }
];

async function run() {
  console.log('Extracting official packaging packshots with sharp...');
  for (const item of productsToCrop) {
    const destJpg = path.join(outputDir, `${item.name}.jpg`);
    const destWebp = path.join(outputDir, `${item.name}.webp`);

    await sharp(sourceImage)
      .extract(item.rect)
      .resize(500, 500, {
        fit: 'contain',
        background: { r: 250, g: 246, b: 236, alpha: 1 }
      })
      .sharpen()
      .jpeg({ quality: 90 })
      .toFile(destJpg);

    await sharp(sourceImage)
      .extract(item.rect)
      .resize(500, 500, {
        fit: 'contain',
        background: { r: 250, g: 246, b: 236, alpha: 1 }
      })
      .sharpen()
      .webp({ quality: 85 })
      .toFile(destWebp);

    console.log(`Saved official product packshot: ${item.name}`);
  }
  console.log('ALL OFFICIAL PRODUCT PACKSHOTS CREATED SUCCESSFULLY!');
}

run().catch(console.error);
