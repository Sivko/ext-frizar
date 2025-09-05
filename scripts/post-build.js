import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Перемещаем popup.html в корень dist после сборки
const distDir = path.join(__dirname, '..', 'dist');
const popupSource = path.join(distDir, 'src', 'popup', 'popup.html');
const popupTarget = path.join(distDir, 'popup.html');

if (fs.existsSync(popupSource)) {
  fs.copyFileSync(popupSource, popupTarget);
  fs.rmSync(path.join(distDir, 'src'), { recursive: true, force: true });
  console.log('✅ popup.html moved to dist root');
} else {
  console.log('❌ popup.html not found in expected location');
}
