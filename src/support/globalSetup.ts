import fs from 'fs';
import path from 'path';

export default function globalSetup() {
  const downloadsDir = path.resolve(process.cwd(), 'downloads');
  if (fs.existsSync(downloadsDir)) {
    for (const file of fs.readdirSync(downloadsDir)) {
      if (file === '.gitkeep') continue;
      fs.rmSync(path.join(downloadsDir, file), { force: true });
    }
  }
}
