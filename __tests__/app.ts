import request from "supertest";
import App from "../src/server/index";

const app = new App().get("/hello", (request, response) => {
  response.json({
    message: "Hello World!",
  });
});

test("Creates a basic server", async () => {
  const response = await request(app)
    .get("/hello")
    .expect("Content-Type", /application\/json/)
    .expect(200);

  expect(response.body).toStrictEqual({
    message: "Hello World!",
  });
});
