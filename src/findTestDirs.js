import fs from 'fs';
import path from 'path';

export default function findTestDirs(
  dirSearchingIn,
  posTestDirNames,
  dontSearch,
  testDirsSoFar = []
) {
  const filenames = fs.readdirSync(dirSearchingIn);

  const dirNames = filenames.filter((name) => {
    const absPath = path.resolve(dirSearchingIn, name);
    const isDir = fs.statSync(absPath).isDirectory();
    return isDir;
  });

  const testDirNames = dirNames.filter((dirName) => {
    const hasTestName = posTestDirNames.indexOf(dirName) > -1;
    return hasTestName;
  });

  const testDirAbsPaths = testDirNames.map(dirName =>
    path.resolve(dirSearchingIn, dirName)
  );

  testDirsSoFar.push(...testDirAbsPaths);

  // recursively search through sub-directories
  const searchableDirNames = dirNames.filter(dirName =>
    dontSearch.indexOf(dirName) === -1
  );
  searchableDirNames.forEach((dirName) => {
    const dirPath = path.resolve(dirSearchingIn, dirName);
    findTestDirs(dirPath, posTestDirNames, dontSearch, testDirsSoFar);
  });

  return testDirsSoFar;
}
