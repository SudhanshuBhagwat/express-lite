import App from "./index";

const server = new App();

server
  .get("/hello", (request, response) => {
    response
      .headers({
        foo: "bar",
      })
      .status(200)
      .json({
        message: "Hello World!",
      });
  })
  .get("/hello/:name", (request, response) => {
    response.json({
      message: `Hello from dynamic path ${request.params.name}!`,
    });
  })
  .get("/hello/name", (request, response) => {
    response.json({
      message: `Hello world!`,
    });
  })
  .listen(3000);
