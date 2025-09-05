import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Создаем простые PNG файлы как base64 данные
const createSimpleIcon = (size) => {
  // Это очень простой PNG файл (1x1 пиксель, прозрачный)
  // В реальном проекте лучше использовать библиотеку типа sharp или canvas
  const pngData = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
    0x00, 0x00, 0x00, size, 0x00, 0x00, 0x00, size, // width, height
    0x08, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // bit depth, color type, etc.
    0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, // IEND chunk
    0xAE, 0x42, 0x60, 0x82
  ]);
  
  return pngData;
};

// Создаем папку icons если её нет
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Создаем иконки разных размеров
const sizes = [16, 32, 48, 128];
sizes.forEach(size => {
  const iconData = createSimpleIcon(size);
  const filename = path.join(iconsDir, `icon-${size}.png`);
  fs.writeFileSync(filename, iconData);
  console.log(`Created ${filename}`);
});

console.log('Icons created successfully!');
