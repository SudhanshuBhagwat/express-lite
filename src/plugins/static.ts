import * as fs from "fs";
import * as path from "path";
import { STATUS_CODE } from "../utils/status";
import Request from "../internals/request";
import Response from "../internals/response";

export interface StaticOptions {
  path: string;
  prefix?: string;
}

export function staticPlugin(options: StaticOptions) {
  const staticPath = path.resolve(process.cwd(), options.path);
  const prefix = options.prefix || "";

  return (req: Request, res: Response, next: () => void) => {
    if (req.method !== "GET") {
      return next();
    }

    let filePath = req.pathname;
    if (prefix && filePath.startsWith(prefix)) {
      filePath = filePath.slice(prefix.length);
    }

    const fullPath = path.join(staticPath, filePath);

    fs.access(fullPath, fs.constants.F_OK, (err) => {
      if (err) {
        return next();
      }

      fs.stat(fullPath, (err, stats) => {
        if (err || !stats.isFile()) {
          return next();
        }

        const ext = path.extname(fullPath);
        const contentType = getContentType(ext);

        fs.readFile(fullPath, (err, data) => {
          if (err) {
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).end();
            return;
          }

          res
            .headers({
              "Content-Type": contentType,
              "Content-Length": stats.size.toString(),
            })
            .status(STATUS_CODE.OK)
            .send(data.toString());
        });
      });
    });
  };
}

function getContentType(ext: string): string {
  const contentTypes: { [key: string]: string } = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
  };

  return contentTypes[ext.toLowerCase()] || "application/octet-stream";
}
