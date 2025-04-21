import request from "supertest";
import App from "../../src/server/index";

describe("Should pass tests related to the Request module - Methods", () => {
  const server = createApp("/hello");
  const agent = request(server);

  test("Should return 200 when the method is supported", async () => {
    await agent.get("/hello").expect(200);
  });

  test("Should return the correct method", async () => {
    await agent.post("/hello").expect(200, "POST");
  });

  test("Should return the correct method", async () => {
    await agent.put("/hello").expect(200, "PUT");
  });

  test("Should return the correct method", async () => {
    await agent.patch("/hello").expect(200, "PATCH");
  });

  test("Should return the correct method", async () => {
    await agent.delete("/hello").expect(200, "DELETE");
  });

  test("Should return 405 when the method is not supported", async () => {
    await agent.options("/hello").expect(405);
  });
});

function createApp(setting) {
  return new App()
    .get(setting, (request, response) => {
      response.send(request.method!);
    })
    .post(setting, (request, response) => {
      response.send(request.method!);
    })
    .put(setting, (request, response) => {
      response.send(request.method!);
    })
    .delete(setting, (request, response) => {
      response.send(request.method!);
    })
    .patch(setting, (request, response) => {
      response.send(request.method!);
    });
}
