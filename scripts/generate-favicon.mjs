import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const root = process.cwd();
const srcPng = path.join(root, 'public', 'avb-favicon.png');
const outIco = path.join(root, 'app', 'favicon.ico');

async function run() {
  if (!fs.existsSync(srcPng)) {
    console.error('Source image not found:', srcPng);
    console.error('Please place your PNG at public/avb-favicon.png and re-run.');
    process.exit(1);
  }
  try {
    // Generate a 32x32 PNG variant
    const tmp32 = path.join(root, 'public', 'avb-favicon-32.png');
    await sharp(srcPng).resize(32, 32, { fit: 'cover' }).png().toFile(tmp32);
    // Create multi-size ICO from original and 32x32
    const icoBuffer = await pngToIco([srcPng, tmp32]);
    fs.writeFileSync(outIco, icoBuffer);
    console.log('Generated favicon:', outIco);
  } catch (err) {
    console.error('Failed to generate favicon:', err);
    process.exit(1);
  }
}

run();
