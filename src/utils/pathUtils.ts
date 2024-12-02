import path from 'path';

/**
 * Utility class for handling paths consistently across the project
 */
export class PathUtils {
  private static readonly projectRoot = process.cwd();

  /**
   * Converts a relative path to an absolute path
   * @param relativePath - The relative path to convert
   * @returns The absolute path
   */
  static toAbsolute(relativePath: string): string {
    if (path.isAbsolute(relativePath)) {
      return this.normalizePath(relativePath);
    }
    return this.normalizePath(path.join(this.projectRoot, relativePath));
  }

  /**
   * Converts an absolute path to a path relative to the project root
   * @param absolutePath - The absolute path to convert
   * @returns The relative path
   */
  static toRelative(absolutePath: string): string {
    return this.normalizePath(path.relative(this.projectRoot, absolutePath));
  }

  /**
   * Normalizes a path to use forward slashes consistently
   * @param inputPath - The path to normalize
   * @returns The normalized path
   */
  static normalizePath(inputPath: string): string {
    return inputPath.split(path.sep).join('/');
  }

  /**
   * Joins path segments and normalizes the result
   * @param paths - Path segments to join
   * @returns The joined and normalized path
   */
  static join(...paths: string[]): string {
    return this.normalizePath(path.join(...paths));
  }

  /**
   * Gets the directory name of a path
   * @param inputPath - The input path
   * @returns The directory name
   */
  static dirname(inputPath: string): string {
    return this.normalizePath(path.dirname(inputPath));
  }

  /**
   * Gets the file extension of a path
   * @param inputPath - The input path
   * @returns The file extension
   */
  static getExtension(inputPath: string): string {
    return path.extname(inputPath);
  }

  /**
   * Checks if a path exists and is accessible
   * @param inputPath - The path to check
   * @returns Promise that resolves to true if the path exists and is accessible
   */
  static async exists(inputPath: string): Promise<boolean> {
    try {
      await Deno.stat(inputPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Creates a directory and any necessary parent directories
   * @param dirPath - The directory path to create
   */
  static async ensureDir(dirPath: string): Promise<void> {
    try {
      await Deno.mkdir(dirPath, { recursive: true });
    } catch (error) {
      if (!(error instanceof Deno.errors.AlreadyExists)) {
        throw error;
      }
    }
  }
}

// Export common path constants
export const PATHS = {
  ROOT: PathUtils.normalizePath(process.cwd()),
  SRC: PathUtils.join(process.cwd(), 'src'),
  PUBLIC: PathUtils.join(process.cwd(), 'public'),
  ASSETS: PathUtils.join(process.cwd(), 'src', 'assets'),
  COMPONENTS: PathUtils.join(process.cwd(), 'src', 'components'),
  HOOKS: PathUtils.join(process.cwd(), 'src', 'hooks'),
  UTILS: PathUtils.join(process.cwd(), 'src', 'utils'),
  TYPES: PathUtils.join(process.cwd(), 'src', 'types'),
  STORE: PathUtils.join(process.cwd(), 'src', 'store'),
} as const;
