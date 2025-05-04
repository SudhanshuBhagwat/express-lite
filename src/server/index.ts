import { createServer, request, Server } from "http";
import Request from "../internals/request";
import Response from "../internals/response";
import { StringDecoder } from "string_decoder";
import { parsePath } from "../utils/utils";
import { STATUS_CODE } from "../utils/status";

interface Options {}

type CallbackFn<T extends string = string> = (
  request: Request<T>,
  response: Response,
) => void;

export default class App {
  #server: Server;
  #handlers: Map<string, CallbackFn>;
  #payload: string;
  #supportedMethods: Map<string, string[]>;

  constructor(opts: Options = {}) {
    this.#handlers = new Map<string, CallbackFn>();
    this.#supportedMethods = new Map<string, string[]>();

    this.#server = createServer((req, res) => {
      const decoder = new StringDecoder("utf-8");
      let buffer: string;
      req.on("data", function (data) {
        buffer += decoder.write(data);
      });

      req.on("end", function () {
        buffer += decoder.end();
      });

      const request = new Request(req, this.#payload);
      const handler = this.isPathValid(request.pathname);
      if (request && handler) {
        request.setHandler(handler);
        const supportedMethods = this.#supportedMethods.get(handler);
        if (!supportedMethods?.includes(request.method)) {
          res.statusCode = STATUS_CODE.METHOD_NOT_ALLOWED;
          res.end();
          return;
        }

        const callbackFn = this.#handlers.get(handler)!;
        if (callbackFn) {
          callbackFn(request as Request<typeof handler>, new Response(res));
        }
      } else {
        res.statusCode = STATUS_CODE.NOT_FOUND;
        res.end();
      }
    });
  }

  isPathValid(path: string): string | undefined {
    for (const key of this.#handlers.keys()) {
      const handlerPath = key.split("/");
      const pathParts = path.split("/");

      if (handlerPath.length === pathParts.length) {
        for (let i = 0; i < handlerPath.length; i++) {
          if (handlerPath[i] === pathParts[i]) {
            return key;
          }
        }
      }
    }
    return undefined;
  }

  setPayload(buffer: string) {
    this.#payload = buffer;
  }

  get<T extends string>(path: T, callbackFn: CallbackFn<T>) {
    const parsedPath = parsePath(path);
    this.#handlers.set(parsedPath, callbackFn);
    const supportedMethods = this.#supportedMethods.get(parsedPath) || [];
    this.#supportedMethods.set(parsedPath, [...supportedMethods, "GET"]);
    return this;
  }

  post<T extends string>(path: T, callbackFn: CallbackFn<T>) {
    const parsedPath = parsePath(path);
    this.#handlers.set(parsedPath, callbackFn);
    const supportedMethods = this.#supportedMethods.get(parsedPath) || [];
    this.#supportedMethods.set(parsedPath, [...supportedMethods, "POST"]);
    return this;
  }

  put<T extends string>(path: T, callbackFn: CallbackFn<T>) {
    const parsedPath = parsePath(path);
    this.#handlers.set(parsedPath, callbackFn);
    const supportedMethods = this.#supportedMethods.get(parsedPath) || [];
    this.#supportedMethods.set(parsedPath, [...supportedMethods, "PUT"]);
    return this;
  }

  delete<T extends string>(path: T, callbackFn: CallbackFn<T>) {
    const parsedPath = parsePath(path);
    this.#handlers.set(parsedPath, callbackFn);
    const supportedMethods = this.#supportedMethods.get(parsedPath) || [];
    this.#supportedMethods.set(parsedPath, [...supportedMethods, "DELETE"]);
    return this;
  }

  patch<T extends string>(path: T, callbackFn: CallbackFn<T>) {
    const parsedPath = parsePath(path);
    this.#handlers.set(parsedPath, callbackFn);
    const supportedMethods = this.#supportedMethods.get(parsedPath) || [];
    this.#supportedMethods.set(parsedPath, [...supportedMethods, "PATCH"]);
    return this;
  }

  address() {
    return this.#server.address();
  }

  listen(port: number) {
    return this.#server.listen(port, () => {
      console.log(`Listening on PORT: ${port}`);
    });
  }

  close(callbackFn) {
    this.#server.close(callbackFn);
  }
}
