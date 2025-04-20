import App from "express-lite";

const server = new App();

server
  .get("/hello", (request, response) => {
    response.json({
      message: "Hello World!",
    });
  })
  .listen();
