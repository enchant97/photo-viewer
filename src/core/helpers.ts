import { to_b64 } from "./base64";

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

export function combineRootPath(rootPath: string, filename: string) {
  return rootPath + "/" + filename;
}
