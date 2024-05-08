import { select, confirm, input } from '@inquirer/prompts';
import { dungeons } from './src/data/raids';
import { extractByDungeon } from './src/extract/items-by-dungeons';
import { exit } from 'node:process';
import { writeFileSync } from 'node:fs';
import { makeFolder } from './src/core/makeFolder';

(async () => {
  const dungeon = await select({
    message: 'Select dungeon',
    choices: [
      {
        name: 'Les profondeurs de Brassenoire',
        value: 'profondeurs-de-brassenoire'
      },
      {
        name: 'Gnomeregan',
        value: 'gnomeregan'
      },
      {
        name: "Le temple d'Atal'Hakkar",
        value: 'le-temple-datalhakkar'
      },
      {
        name: 'All',
        value: 'all'
      }
    ]
  });

  const picture = await confirm({ message: 'Extract items pictures?' });
  const dirname = await input({ message: 'Folder name extract' });

  const folderName = `${__dirname}/extract/${dirname || dungeon}`;

  await makeFolder(`${__dirname}/extract`);
  await makeFolder(folderName);

  // All dungeons extract
  if (dungeon === 'all') {
    const allItems = [];
    for (const dung of dungeons) {
      const data = await extractByDungeon(dung[0], picture && folderName);
      allItems.push(...data);
      //extract in single array json
    }
    writeFileSync(`${folderName}/data.json`, JSON.stringify(allItems), 'utf8');
  }

  // Single dungeons extract
  else if (dungeons.has(dungeon)) {
    const data = await extractByDungeon(dungeon, picture && folderName);
    writeFileSync(`${folderName}/data.json`, JSON.stringify(data), 'utf8');
  }

  exit();
})();
