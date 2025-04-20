import request from "supertest";
import App from "../../server/index";

describe("Should pass tests related to the Request module", () => {
  const server = createApp("/hello");
  const agent = request(server);

  test("Should return correct path", async () => {
    await agent.get("/hello").expect(200, "hello");
  });

  test("Should omit leading / character", async () => {
    await agent.get("/hello").expect(200, "hello");
  });

  test("Should omit trailing / character", async () => {
    await agent.get("/hello").expect(200, "hello");
  });

  test("Should return only the parsed path", async () => {
    await agent.get("/hello?foo=bar&bar=baz").expect(200, "hello");
  });
});

function createApp(setting) {
  return new App().get(setting, (request, response) => {
    response.send(request.pathname);
  });
}
