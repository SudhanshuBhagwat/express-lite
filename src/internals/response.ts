import { OutgoingHttpHeaders, ServerResponse } from "http";
import { STATUS_CODE, StatusCode } from "../utils/status";

type Header = OutgoingHttpHeaders | Record<string, string>;
export type CookieOptions = {
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: string;
};

export default class Response {
  #localHeaders: Header;
  #status: StatusCode = STATUS_CODE.OK;
  #response: ServerResponse;

  constructor(response: ServerResponse) {
    this.#response = response;
  }

  headers(headerValues: Header) {
    this.#localHeaders = headerValues;
    return this;
  }

  addCookie(name: string, value: string, options: CookieOptions) {
    let cookie = `${name}=${value}`;
    if (options.maxAge) {
      cookie += `; Max-Age=${options.maxAge}`;
    }
    if (options.path) {
      cookie += `; Path=${options.path}`;
    }
    if (options.domain) {
      cookie += `; Domain=${options.domain}`;
    }
    if (options.secure) {
      cookie += `; Secure`;
    }
    if (options.httpOnly) {
      cookie += `; HttpOnly`;
    }
    if (options.sameSite) {
      cookie += `; SameSite=${options.sameSite}`;
    }
    this.#localHeaders["set-cookie"] = [
      ...this.#localHeaders["set-cookie"],
      cookie,
    ];
    return this;
  }

  status(statusCode: StatusCode) {
    this.#status = statusCode;
    return this;
  }

  html(value: string) {
    this.#response.writeHead(
      this.#status,
      getHeaders({ "Content-Type": "text/html" }, this.#localHeaders),
    );
    this.#response.write(value);
    this.end();
  }

  send(value: string) {
    this.#response.writeHead(
      this.#status,
      getHeaders({ "Content-Type": "text/plain" }, this.#localHeaders),
    );
    this.#response.write(value);
    this.end();
  }

  json(value: Object) {
    this.#response.writeHead(
      this.#status,
      getHeaders({ "Content-Type": "application/json" }, this.#localHeaders),
    );
    this.#response.write(JSON.stringify(value));
    this.end();
  }

  end() {
    this.#response.end();
  }
}

function getHeaders(
  headers: Header,
  otherHeaders: OutgoingHttpHeaders,
): Header {
  return { ...headers, ...otherHeaders };
}
