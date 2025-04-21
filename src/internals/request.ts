import { IncomingMessage } from "http";
import { parse, UrlWithParsedQuery } from "url";

export default class Request {
  #request: IncomingMessage;
  #url: UrlWithParsedQuery;
  #payload: string;

  constructor(request: IncomingMessage, payload: string) {
    this.#request = request;
    this.#url = parse(this.#request.url, true);
    this.#payload = payload;
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
}
