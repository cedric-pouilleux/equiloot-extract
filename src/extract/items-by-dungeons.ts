import { chromium } from 'playwright';
import { downloadPictures } from '../core/downloadPicture';
import { extractItemsData } from '../core/extractGeatItem';
import { dungeons } from '../data/raids';
import { makeFolder } from '../core/makeFolder';

type ExtractOption = {
  withPicture?: boolean;
  dir: string;
  root: string;
};

export async function extractByDungeon(key: string, pictureFolder?: string) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(dungeons.get(key));
  await page.locator('#onetrust-accept-btn-handler').click();
  await page.locator('#onetrust-banner-sdk').isHidden();
  await page.waitForSelector('.listview-mode-default');

  // old picture folder
  // const folderName = `${option.root}/${option.dir}`;

  //use folder name as fn prop
  const data = await extractItemsData(page);
  pictureFolder && (await downloadPictures(data, pictureFolder));

  return data;
}
