import App, { loggerPlugin, staticPlugin } from "express-lite";

const server = new App();

server
  .use(loggerPlugin())
  .use(staticPlugin({ path: "public" }))
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
