export const SUPPORTED_IMG_EXTENSIONS = [
  ".jpg", ".jpeg", ".png",
]

export function isSupportedExtension(path: string) {
  path = path.toLowerCase();
  for (let ext of SUPPORTED_IMG_EXTENSIONS) {
    if (path.endsWith(ext)) return true;
  }
  return false;
};
