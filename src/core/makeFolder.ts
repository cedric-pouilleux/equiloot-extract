import fs from 'node:fs';

export async function makeFolder(dir: string) {
  console.log(`Making ${dir} folder`);
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  } catch (err) {
    console.error(err);
  }
}
