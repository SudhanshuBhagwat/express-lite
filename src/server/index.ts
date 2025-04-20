import { createServer, Server } from "http";
import Request from "../internals/request";
import Response from "../internals/response";
import { StringDecoder } from "string_decoder";
import { parse } from "url";

interface Options {
  port?: number;
}

type CallbackFn = (request: Request, response: Response) => void;

export default class App {
  #listenPort: number;
  #server: Server;
  #handlers: Map<String, CallbackFn>;
  #payload: string;

  constructor(opts: Options = {}) {
    this.#listenPort = opts?.port || 8080;
    this.#handlers = new Map<String, CallbackFn>();

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
        const callbackFn: CallbackFn = this.#handlers.get(request.pathname)!;
        if (callbackFn) {
          callbackFn(request, new Response(res));
        }
      } else if (!this.#handlers.has(request.pathname)) {
        res.statusCode = 404;
        res.end();
      }
    });
  }

  setPayload(buffer: string) {
    this.#payload = buffer;
  }

  get(path: string, callbackFn: CallbackFn) {
    const parsedPath = parse(path, true);
    this.#handlers.set(
      parsedPath.pathname.replace(/^\/+|\/+$/g, ""),
      callbackFn,
    );
    return this;
  }

  address() {
    return this.#server.address();
  }

  listen() {
    return this.#server.listen(this.#listenPort, () => {
      console.log(`Listening on PORT: ${this.#listenPort}`);
    });
  }

  close(callbackFn) {
    this.#server.close(callbackFn);
  }
}
