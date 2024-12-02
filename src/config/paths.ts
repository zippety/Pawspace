import { PathUtils } from '../utils/pathUtils';

/**
 * Project path configuration
 * All paths are normalized to use forward slashes consistently
 */
export const paths = {
  // Project structure
  root: PathUtils.normalizePath(process.cwd()),
  src: PathUtils.join('src'),
  public: PathUtils.join('public'),

  // Source directories
  components: PathUtils.join('src', 'components'),
  hooks: PathUtils.join('src', 'hooks'),
  utils: PathUtils.join('src', 'utils'),
  types: PathUtils.join('src', 'types'),
  store: PathUtils.join('src', 'store'),
  assets: PathUtils.join('src', 'assets'),

  // Public assets
  images: PathUtils.join('public', 'images'),
  icons: PathUtils.join('public', 'icons'),

  // Build output
  dist: PathUtils.join('dist'),
  build: PathUtils.join('build'),

  // Config files
  config: PathUtils.join('src', 'config'),

  // Test files
  tests: PathUtils.join('src', '__tests__'),

  // Documentation
  docs: PathUtils.join('docs'),
} as const;

/**
 * Get an absolute path from a relative project path
 * @param relativePath - Path relative to project root
 * @returns Absolute path
 */
export const getAbsolutePath = (relativePath: string): string => {
  return PathUtils.toAbsolute(relativePath);
};

/**
 * Get a path relative to the project root
 * @param absolutePath - Absolute path
 * @returns Path relative to project root
 */
export const getRelativePath = (absolutePath: string): string => {
  return PathUtils.toRelative(absolutePath);
};

/**
 * Join and normalize multiple path segments
 * @param segments - Path segments to join
 * @returns Normalized joined path
 */
export const joinPaths = (...segments: string[]): string => {
  return PathUtils.join(...segments);
};
