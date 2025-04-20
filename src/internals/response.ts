import { OutgoingHttpHeaders, ServerResponse } from "http";
import { STATUS_CODE, StatusCode } from "../utils/status";

type Header = OutgoingHttpHeaders | Record<string, string>;

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

  status(statusCode: StatusCode) {
    this.#status = statusCode;
    return this;
  }

  send(value: String) {
    this.#response.writeHead(
      this.#status,
      getHeaders(this.#localHeaders, { "Content-Type": "plain/text" }),
    );
    this.#response.end(value);
  }

  json(value: Object) {
    this.#response.writeHead(
      this.#status,
      getHeaders(this.#localHeaders, { "Content-Type": "application/json" }),
    );
    this.#response.end(JSON.stringify(value));
  }
}

function getHeaders(
  headers: Header,
  otherHeaders: OutgoingHttpHeaders,
): Header {
  return { ...headers, ...otherHeaders };
}
