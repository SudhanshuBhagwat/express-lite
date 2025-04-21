import request from "supertest";
import App from "../../src/server/index";

describe("Should pass tests related to the Request module - Query", () => {
  const server = createApp("/hello");
  const agent = request(server);

  test("Should return correct query param", async () => {
    await agent.get("/hello?foo=bar").expect(200, `{"foo":"bar"}`);
  });

  test("Should return correct query params", async () => {
    await agent
      .get("/hello?foo=bar&bar=baz")
      .expect(200, `{"foo":"bar","bar":"baz"}`);
  });
});

function createApp(setting) {
  return new App().get(setting, (request, response) => {
    response.json(request.query);
  });
}
