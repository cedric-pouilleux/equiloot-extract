import { chromium } from 'playwright';
import { downloadPictures } from '../core/downloadPicture';
import { extractItemsData } from '../core/extractGeatItem';
import { exit } from 'process';
import { dungeons } from '../data/raids';
import { writeFileSync } from 'node:fs';
import { makeFolder } from '../core/makeFolder';

type ExtractOption = {
  withPicture?: boolean;
  dir: string;
  root: string;
};

export async function extractByDungeon(key: string, option: ExtractOption) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(dungeons.get(key));
  await page.locator('#onetrust-accept-btn-handler').click();
  await page.locator('#onetrust-banner-sdk').isHidden();
  await page.waitForSelector('.listview-mode-default');

  const folderName = `${option.root}/${option.dir}`;

  await makeFolder(`${option.root}/extract`);
  await makeFolder(folderName);
  const data = await extractItemsData(page);
  option.withPicture && (await downloadPictures(data, folderName));
  writeFileSync(`${folderName}/data.json`, JSON.stringify(data), 'utf8');

  exit();
}
