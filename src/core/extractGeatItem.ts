import type { ElementHandle, Page } from 'playwright';

export type Item = {
  picture: string;
  pictureUrl: string;
  title: string;
  link: string;
  slot: string;
  gearType: string;
  source: string;
  dungeon: string;
  wowId: number;
};

/**
 * Extract gear item from selector
 */
export async function extractGearItem(
  rows: ElementHandle<SVGElement | HTMLElement>[]
): Promise<Item[]> {
  const items: Item[] = [];
  // Extract items list from table

  for (const row of rows) {
    const item = {} as Item;

    //Extract picture item url
    const pictureElements = await row.$('ins');
    if (pictureElements) {
      const rawUrl = await pictureElements.getAttribute('style');
      if (rawUrl) {
        const mySubString = rawUrl.substring(
          rawUrl.indexOf('"') + 1,
          rawUrl.lastIndexOf('"')
        );
        item.picture = /[^/]*$/.exec(mySubString)[0];
        item.pictureUrl = mySubString;
      }
    }

    //Extract item id
    const idItem = await row.$('.iconmedium a');
    const id = await idItem.getAttribute('href');
    item.wowId = +id.substring(id.indexOf('=') + 1, id.lastIndexOf('/'));

    //Extract title and wow head link item
    const titleRaw = await row.$('.listview-cleartext');
    if (titleRaw) {
      item.link = (await titleRaw.getAttribute('href')) || '';
      item.title = (await titleRaw.textContent()) || '';
    }

    //Extract slot item
    const slotRaw = await row.$('td:nth-child(9)');
    if (slotRaw) {
      item.slot = (await slotRaw.textContent()) || '';
    }

    //Extract gearType item
    const gearTypeRaw = await row.$('td:last-child');
    if (gearTypeRaw) {
      item.gearType = (await gearTypeRaw.textContent()) || '';
    }

    //Extract source item
    const elem = await row.$('td:nth-child(10)');
    const sourceElem = await elem.$('> a');
    if (sourceElem) {
      item.source = await sourceElem.textContent();
    }
    const dungeonElem = await elem.$('> div a');
    if (dungeonElem) {
      item.dungeon = await dungeonElem.textContent();
    }

    console.log(`${item.title} (${item.wowId}) successfull extract`);

    items.push(item);
  }

  return items;
}

export async function extractItemsData(page: Page): Promise<Item[]> {
  console.log('Start items extraction ...');
  async function extractRow(): Promise<Item[]> {
    const elements = await page.$$('.listview-mode-default .listview-row');
    console.log(`${elements.length} elements extracted...`);
    return extractGearItem(elements);
  }
  const items = [];
  const nextCTA = page.locator('.listview-band-bottom a', {
    hasText: 'Suiv. ›'
  });
  items.push(...(await extractRow()));
  do {
    await nextCTA.click();
    items.push(...(await extractRow()));
  } while ((await nextCTA.getAttribute('data-active')) === 'yes');
  return items;
}
