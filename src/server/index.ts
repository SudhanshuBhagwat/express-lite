import { createServer, IncomingMessage, Server } from "http";
import Request from "../internals/request";
import Response from "../internals/response";
import { StringDecoder } from "string_decoder";
import { parsePath } from "../utils/utils";
import { STATUS_CODE } from "../utils/status";

type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: () => void,
) => void;

interface Options {}

type CallbackFn<T extends string = string> = (
  request: Request<T>,
  response: Response,
) => void;

export class Router {
  #routers: Map<string, Router>;
  #handlers: Map<string, CallbackFn>;
  #supportedMethods: Map<string, string[]>;
  #middleware: MiddlewareFunction[];

  constructor() {
    this.#routers = new Map<string, Router>();
    this.#handlers = new Map<string, CallbackFn>();
    this.#supportedMethods = new Map<string, string[]>();
    this.#middleware = [];
  }

  setupRouter(req: IncomingMessage, res) {
    const decoder = new StringDecoder("utf-8");
    let buffer: string = "";
    req.on("data", function (data) {
      buffer += decoder.write(data);
    });

    req.on("end", function () {
      buffer += decoder.end();
    });

    const request = new Request(req, buffer);
    const response = new Response(res);

    const routerPrefix = parsePath(request.pathname).split("/")[0];
    const router = this.#routers.get(routerPrefix);
    if (router) {
      router.run(request, response, routerPrefix, this.#middleware);
    } else {
      this.run(request, response);
    }
  }

  run(
    request: Request,
    response: Response,
    routerPrefix?: string,
    middlewares?: MiddlewareFunction[],
  ) {
    if (middlewares) {
      this.#middleware = [...this.#middleware, ...middlewares];
    }

    let middlewareIndex = 0;
    const next = () => {
      if (middlewareIndex < this.#middleware.length) {
        const middleware = this.#middleware[middlewareIndex++];
        middleware(request, response, next);
      } else {
        const route = routerPrefix
          ? parsePath(request.pathname.replace(routerPrefix, ""))
          : request.pathname;
        const handler = this.isPathValid(route);
        if (request && handler) {
          request.setHandler(handler);
          const supportedMethods = this.#supportedMethods.get(handler);
          if (!supportedMethods?.includes(request.method)) {
            return response.status(STATUS_CODE.METHOD_NOT_ALLOWED).end();
          }
          const callbackFn = this.#handlers.get(handler)!;
          if (callbackFn) {
            callbackFn(request as Request<typeof handler>, response);
          }
        } else {
          return response.status(STATUS_CODE.NOT_FOUND).end();
        }
      }
    };
    next();
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

  use(pathOrMiddleware: string | MiddlewareFunction, router?: Router) {
    if (typeof pathOrMiddleware === "string") {
      this.#routers.set(parsePath(pathOrMiddleware), router);
    } else {
      this.#middleware.push(pathOrMiddleware);
    }

    return this;
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
}

export default class App extends Router {
  #server: Server;

  constructor(opts: Options = {}) {
    super();
    this.#server = createServer((req, res) => {
      this.setupRouter(req, res);
    });
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
