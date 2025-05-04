import { IncomingMessage } from "http";
import { parse, UrlWithParsedQuery } from "url";

type ExtractRouteParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractRouteParams<Rest>]: string }
    : T extends `${string}:${infer Param}`
      ? { [K in Param]: string }
      : {};

export default class Request<T extends string = string> {
  #request: IncomingMessage;
  #url: UrlWithParsedQuery;
  #payload: string;
  #handler: string;
  #params: ExtractRouteParams<T>;

  constructor(request: IncomingMessage, payload: string) {
    this.#request = request;
    this.#url = parse(this.#request.url, true);
    this.#payload = payload;
    this.#params = {} as ExtractRouteParams<T>;
  }

  public setHandler(handler: T) {
    this.#handler = handler;
    const handlerParts = handler.split("/");
    const pathParts = this.pathname.split("/");
    for (let i = 0; i < handlerParts.length; i++) {
      if (handlerParts[i].startsWith(":")) {
        const paramName = handlerParts[i].split(":")[1];
        (this.#params as any)[paramName] = pathParts[i];
      }
    }
  }

  get handler() {
    return this.#handler;
  }

  get payload() {
    return this.#payload;
  }

  get headers() {
    return this.#request.headers;
  }

  get contentType() {
    return this.#request.headers["content-type"];
  }

  hasHeader(header: string) {
    return this.#request.headers[header] !== undefined;
  }

  getHeader(header: string) {
    return this.#request.headers[header];
  }

  get pathname() {
    return this.#url.pathname.replace(/^\/+|\/+$/g, "");
  }

  get query() {
    return this.#url.query;
  }

  get hostname() {
    return this.#url.hostname;
  }

  get method() {
    return this.#request.method;
  }

  get params() {
    return this.#params;
  }
}
