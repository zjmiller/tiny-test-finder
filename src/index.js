import findDirWithPackageJSON from './findDirWithPackageJSON';
import findTestDirs from './findTestDirs';
import getFilePathsFromArrOfDirs from './getFilePathsFromArrOfDirs';

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
