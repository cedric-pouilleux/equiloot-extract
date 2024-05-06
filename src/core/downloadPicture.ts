import { Item } from './extractGeatItem';
var download = require('image-downloader');

export async function downloadPictures(
  items: Item[],
  folder: string
): Promise<void> {
  console.log('Start download pictures...');
  let count = 0;
  for (const item of items) {
    console.log(`Adding picture (${count + 1}/${items.length}) ...`);
    const image = await download.image({
      url: item.pictureUrl,
      dest: `${folder}/${item.picture}`,
      timeout: 5 * 60 * 1000
    });
    console.log(`Picture ${image.filename} download with success!`);
    count++;
  }
}
