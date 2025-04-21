import request from "supertest";
import App from "../../src/server/index";

describe("Should pass tests related to the Request module - Content Type", () => {
  const server = createApp();
  const agent = request(server);

  test("Should return correct content type for json", async () => {
    const response = await agent.get("/json").expect(200);
    expect(response.headers["content-type"]).toBe("application/json");
  });

  test("Should return correct content type for html", async () => {
    const response = await agent.get("/html").expect(200);
    expect(response.headers["content-type"]).toBe("text/html");
  });

  test("Should return correct content type for text", async () => {
    const response = await agent.get("/text").expect(200);
    expect(response.headers["content-type"]).toBe("text/plain");
  });
});

function createApp() {
  return new App()
    .get("/json", (request, response) => {
      response.json({
        message: "Hello, world!",
      });
    })
    .get("/html", (request, response) => {
      response.html("<h1>Hello, world!</h1>");
    })
    .get("/text", (request, response) => {
      response.send("Hello, world!");
    });
}
