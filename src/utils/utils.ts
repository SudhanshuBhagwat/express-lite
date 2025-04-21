import { parse } from "url";

export function parsePath(path: string) {
  const parsedPath = parse(path, true);
  return parsedPath.pathname.replace(/^\/+|\/+$/g, "");
}
