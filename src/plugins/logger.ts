import Request from "../internals/request";
import Response from "../internals/response";
import { STATUS_CODE } from "../utils/status";

export interface LoggerOptions {
  format?: string;
  enabled?: boolean;
}

export function loggerPlugin(options: LoggerOptions = {}) {
  const format = options.format || ":time :method :path :status :duration";

  return (req: Request, res: Response, next: () => void) => {
    const start = Date.now();

    const originalEnd = res.end;

    res.end = function (chunk?: any, encoding?: any, callback?: any) {
      const duration = Date.now() - start;
      const status = STATUS_CODE.OK;

      const logMessage = format
        .replace(":time", new Date().toISOString())
        .replace(":method", req.method)
        .replace(":path", req.pathname)
        .replace(":status", status.toString())
        .replace(":duration", `${duration}ms`);

      console.log(logMessage);

      return originalEnd.call(this, chunk, encoding, callback);
    };

    next();
  };
}
