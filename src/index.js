import fs from 'fs';
import path from 'path';

function findDirWithPackageJSON() {
  let foundIt = false;
  let curDir = process.cwd();
  let givenUp = false;

  while (!foundIt && !givenUp) {
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

function findTestDirs(dirSearchingIn, posTestDirNames, dontSearch, testDirsSoFar = []) {
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

function getFilePathsFromArrOfDirs(dirs = []) {
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

module.exports = (rawOpts = {}) => {
  const defaultOpts = {
    startingDir: findDirWithPackageJSON(),
    posTestDirNames: ['test', '__test__'],
    dontSearch: ['node_modules'],
  };
  const opts = Object.assign({}, defaultOpts, rawOpts);
  if (opts.startingDir === undefined) return undefined;

  const dirs = findTestDirs(
    opts.startingDir,
    opts.posTestDirNames,
    opts.dontSearch
  );
  return getFilePathsFromArrOfDirs(dirs);
};
