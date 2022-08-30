import { to_b64 } from "./base64";

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

export function createResourceURI(path: string, skipPathEncode: boolean = false, size: number | null = null) {
  let encodedPath;
  switch (skipPathEncode) {
    case true:
      encodedPath = path;
      break;
    case false:
      encodedPath = to_b64(path);
      break;
  }
  let url = "reqimg://" + location.hostname + "/" + encodedPath;
  if (size) { url = url + "?s=" + size.toString() }
  return url;
}
