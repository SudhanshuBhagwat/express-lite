import request from "supertest";
import App from "../src/server/index";

describe("Should pass tests related to the Request module", () => {
  const server = createApp("/hello");
  const agent = request(server);

  test("Should return correct path", async () => {
    const response = await agent.get("/hello-world");
    expect(response.status).toBe(404);
  });
});

function createApp(setting) {
  return new App().get(setting, (request, response) => {
    response.send(request.pathname);
  });
}
