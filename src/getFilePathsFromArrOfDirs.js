import fs from 'fs';
import path from 'path';

export default function getFilePathsFromArrOfDirs(dirs = []) {
  const filePaths = [];
  dirs.forEach((dir) => {
    const filenames = fs.readdirSync(dir);
    filenames.forEach((name) => {
      const filePath = path.resolve(dir, name);
      if (fs.statSync(filePath).isFile()) {
        filePaths.push(filePath);
      }
    });
  });
  return filePaths;
}
