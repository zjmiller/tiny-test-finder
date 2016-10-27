/* eslint-disable no-constant-condition */

import fs from 'fs';
import path from 'path';

export default function findDirWithPackageJSON() {
  let foundIt = false;
  let curDir = process.cwd();
  let givenUp = false;

  while (true) {
    foundIt = fs.existsSync(path.resolve(curDir, 'package.json'));
    if (foundIt) break;
    if (curDir === '/') {
      givenUp = true;
      break;
    }
    curDir = path.resolve(curDir, '..');
  }

  if (givenUp) return undefined;
  return curDir;
}
