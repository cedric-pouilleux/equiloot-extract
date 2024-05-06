import { select, confirm, input } from '@inquirer/prompts';
import { dungeons } from './src/data/raids';
import { extractByDungeon } from './src/extract/items-by-dungeons';

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
      }
    ]
  });

  const picture = await confirm({ message: 'Extract items pictures?' });
  const dirname = await input({ message: 'Folder name extract' });

  if (dungeons.has(dungeon)) {
    await extractByDungeon(dungeon, {
      withPicture: picture,
      root: __dirname,
      dir: `extract/${dirname || dungeon}`
    });
  }
})();
