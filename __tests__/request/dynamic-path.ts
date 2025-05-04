import request from "supertest";
import App from "../../src/server/index";

describe("Should pass tests related to the Request module - Path", () => {
  const server = createApp();
  const agent = request(server);

  test("Should return correct path with dynamic path params", async () => {
    await agent.get("/hello/world").expect(200, { name: "world" });
  });

  test("Should return correct path with multiple dynamic path params", async () => {
    await agent.get("/hello/world/foo").expect(200, {
      name: "world",
      foo: "foo",
    });
  });

  test("Should return 404 when dynamic path params are not provided", async () => {
    await agent.get("/hello").expect(404);
  });
});

function createApp() {
  return new App()
    .get("/hello/:name", (request, response) => {
      response.json(request.params);
    })
    .get("/hello/:name/:foo", (request, response) => {
      response.json(request.params);
    });
}
