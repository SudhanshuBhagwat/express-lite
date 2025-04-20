import { createServer, IncomingMessage, Server } from "http";
import { STATUS_CODE } from "../utils/status";
import Response from "../internals/response";

interface Options {
  port?: number;
}

export default class App {
  #listenPort: number;
  #server: Server;
  #handlers: Map<String, CallbackFn>;

  constructor(opts: Options = {}) {
    this.#listenPort = opts?.port || 8080;
    this.#handlers = new Map<String, CallbackFn>();

    this.#server = createServer((req, res) => {
      if (req.url && this.#handlers.has(req.url)) {
        const callbackFn: CallbackFn = this.#handlers.get(req.url)!;
        if (callbackFn) {
          callbackFn(req, new Response(res));
        }
      }
    });
  }

  get(path: string, callbackFn: CallbackFn) {
    this.#handlers.set(path, callbackFn);
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
}

type CallbackFn = (request: IncomingMessage, response: Response) => void;

export type StatusCode = (typeof STATUS_CODE)[keyof typeof STATUS_CODE];
