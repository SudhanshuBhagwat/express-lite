import { createServer, Server } from "http";
import Request from "../internals/request";
import Response from "../internals/response";
import { StringDecoder } from "string_decoder";
import { parsePath } from "../utils/utils";
import { STATUS_CODE } from "../utils/status";

interface Options {}

type CallbackFn = (request: Request, response: Response) => void;

export default class App {
  #server: Server;
  #handlers: Map<String, CallbackFn>;
  #payload: string;
  #supportedMethods: Map<String, Array<String>>;

  constructor(opts: Options = {}) {
    this.#handlers = new Map<String, CallbackFn>();
    this.#supportedMethods = new Map<String, Array<String>>();

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
      if (request && this.#handlers.has(request.pathname)) {
        const supportedMethods = this.#supportedMethods.get(request.pathname);
        if (!supportedMethods?.includes(request.method)) {
          res.statusCode = STATUS_CODE.METHOD_NOT_ALLOWED;
          res.end();
          return;
        }

        const callbackFn: CallbackFn = this.#handlers.get(request.pathname)!;
        if (callbackFn) {
          callbackFn(request, new Response(res));
        }
      } else if (!this.#handlers.has(request.pathname)) {
        res.statusCode = STATUS_CODE.NOT_FOUND;
        res.end();
      }
    });
  }

  setPayload(buffer: string) {
    this.#payload = buffer;
  }

  get(path: string, callbackFn: CallbackFn) {
    const parsedPath = parsePath(path);
    this.#handlers.set(parsedPath, callbackFn);
    const supportedMethods = this.#supportedMethods.get(parsedPath) || [];
    this.#supportedMethods.set(parsedPath, [...supportedMethods, "GET"]);
    return this;
  }

  post(path: string, callbackFn: CallbackFn) {
    const parsedPath = parsePath(path);
    this.#handlers.set(parsedPath, callbackFn);
    const supportedMethods = this.#supportedMethods.get(parsedPath) || [];
    this.#supportedMethods.set(parsedPath, [...supportedMethods, "POST"]);
    return this;
  }

  put(path: string, callbackFn: CallbackFn) {
    const parsedPath = parsePath(path);
    this.#handlers.set(parsedPath, callbackFn);
    const supportedMethods = this.#supportedMethods.get(parsedPath) || [];
    this.#supportedMethods.set(parsedPath, [...supportedMethods, "PUT"]);
    return this;
  }

  delete(path: string, callbackFn: CallbackFn) {
    const parsedPath = parsePath(path);
    this.#handlers.set(parsedPath, callbackFn);
    const supportedMethods = this.#supportedMethods.get(parsedPath) || [];
    this.#supportedMethods.set(parsedPath, [...supportedMethods, "DELETE"]);
    return this;
  }

  patch(path: string, callbackFn: CallbackFn) {
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
