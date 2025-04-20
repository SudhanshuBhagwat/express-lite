import App from "./src/server";

const server = new App();

server
  .get("/hello", (request, response) => {
    response.json({
      message: "Hello World!",
    });
  })
  .listen();
