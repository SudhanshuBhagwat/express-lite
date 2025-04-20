import request from "supertest";
import App from "../server/index";

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
    console.info("Pathname: ", request.pathname);
    response.send(request.pathname);
  });
}
