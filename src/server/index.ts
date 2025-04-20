import { createServer, IncomingMessage, Server, ServerResponse } from "http";

interface Options {
  port?: number;
}

export const STATUS_CODE = {
  SUCCESS: 200,
} as const;

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
          callbackFn(req, response(res));
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

export interface Response {
  headers: (headerValues: Object) => Response;
  status: (statusCode: number) => Response;
  send: (value: String) => void;
  json: (value: Object) => void;
}

function response(res: ServerResponse<IncomingMessage>): Response {
  const headers = new Map<String, String>();
  let status: number = STATUS_CODE.SUCCESS;
  return {
    headers: function (headerValues: Object) {
      Object.entries(headerValues).forEach(([key, value]) => {
        headers.set(key, value);
      });
      return this;
    },
    status: (statusCode: number) => {
      status = statusCode;
      return this;
    },
    send: function (value: String) {
      res.writeHead(status, { "Content-Type": "plain/text" });
      res.end(value);
    },
    json: function (value: Object) {
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(value));
    },
  };
}
